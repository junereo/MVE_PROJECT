import { PrismaClient, User, OAuthProvider } from '@prisma/client';
import type { Request, CookieOptions } from 'express';
import { RegisterList } from "../types/auth.types";
import { AdminRequest } from '../types/admin.types';
import { signToken } from '../utils/jwt';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,// 7일
};

type LoginUser = {
    id: number;
    nickname: string;
};

type OAuthCallbackResult =
    | {
        token: string;
        redirectUrl: string;
        user: LoginUser;
        cookieOptions: CookieOptions;
    }
    | {
        error: string;
        detail?: string;
    };

// 이메일 
export const emailRegister = async (data: RegisterList) => {
    const isUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (isUser) throw new Error("이미 가입된 이메일입니다.");

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            nickname: data.nickname,
            phone_number: data.phone_number,

        }
    });
    return {
        id: newUser.id,
        email: newUser.email,
        phone_number: newUser.phone_number,
        nickname: newUser.nickname,
        level: newUser.level,
        wallet_address: newUser.wallet_address,
        balance: newUser.balance,
        badge_issued_at: newUser.badge_issued_at,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
    };
};

export const emaillogin = async (email: string, password: string): Promise<OAuthCallbackResult> => {


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("가입되지 않은 이메일입니다. -서버");
    }
    const isValid = (password === user.password);
    // const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.-서버");
    }

    // STEP 2: JWT 발급
    const token = signToken({ userId: user.id });

    const loginUser: LoginUser = {
        id: user.id,
        nickname: user.nickname
    };

    return {
        token,
        user: loginUser,
        redirectUrl: process.env.CLIENT_IP || 'http://localhost:3000',
        cookieOptions: defaultCookieOptions,
    };
};

// 카카오
export const oauthCallbackService = async (
    req: Request,
): Promise<OAuthCallbackResult> => {
    const { provider } = req.params;
    const rawCode = req.query.code as string | string[] | undefined;
    const code =
        typeof rawCode === 'string'
            ? rawCode
            : Array.isArray(rawCode)
                ? rawCode[0]
                : '';

    if (!code || typeof provider !== 'string') {
        throw new Error('Missing or invalid code or provider');
    }

    const profile = await fetchKakaoProfile(code);

    if (!profile) {
        throw new Error(`${provider} 계정 프로필 가져오기 실패`);
    }

    const safeEmail = profile.email ?? `noemail_${profile.id}@${provider}.com`;

    let user: User;

    // STEP 1: 사용자 및 계정 등록 (DB 트랜잭션)
    try {
        user = await prisma.$transaction(async (tx) => {
            const existingAccount = await tx.user_OAuth.findFirst({
                where: {
                    provider: OAuthProvider.kakao,
                    provider_id: profile.id,

                },
                include: { user: true },
            });

            const resolvedUser = existingAccount?.user ?? await tx.user.upsert({
                where: {
                    email: safeEmail
                },
                update: {},
                create: {
                    nickname: profile.nickname,
                    email: safeEmail,
                    password: '',
                    phone_number: '',
                },
            });

            if (!existingAccount) {
                await tx.user_OAuth.create({
                    data: {
                        provider: OAuthProvider.kakao,
                        provider_id: profile.id,
                        email: safeEmail,
                        profile_image: profile.picture,
                        nickname: profile.nickname,
                        user: {
                            connect: { id: resolvedUser.id },
                        },
                    },
                });
            }

            return resolvedUser;
        });
    } catch (err) {
        console.error('DB 트랜잭션 오류 발생:', err);
        return {
            error: 'OAuth 처리 중 오류 발생',
            detail: err instanceof Error ? err.message : String(err),
        };
    }

    // STEP 2: JWT 발급
    const token = signToken({ userId: user.id });

    return {
        token,
        user,
        redirectUrl: process.env.CLIENT_IP || 'http://localhost:3000',
        cookieOptions: defaultCookieOptions,
    };
};

export const fetchKakaoProfile = async (code: string) => {
    const { data: tokenRes } = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_API_KEY!,
                redirectUrl: process.env.KAKAO_REDIRECT_URI!,
                code,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        },
    );

    const { data: profileRes } = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
            headers: {
                Authorization: `Bearer ${tokenRes.access_token}`,
            },
        },
    );

    return {
        id: String(profileRes.id),
        email: profileRes.kakao_account?.email,
        nickname: profileRes.properties?.nickname,
        picture: profileRes.properties?.profile_image,
    };
};

export const getUserService = async (req: AdminRequest) => {
    const decodedUser = (req as any).user;
    const user = await prisma.user.findUnique({
        where: { id: decodedUser.userId },
        select: {
            id: true,
            nickname: true,
        },
    });

    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user;
};

// 구글
export const googleCallbackService = async (req: Request) => {
    const { code } = req.body;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

    // token 요청
    const tokenRe = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    const { access_token } = tokenRe.data;

    // 유저 정보 가져오기 
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const { id: provider_id, email, name } = userInfo.data;

    // 기존 유저 확인
    let oauth = await prisma.user_OAuth.findFirst({
        where: {
            provider: OAuthProvider.google,
            provider_id,
        },
        include: { user: true },
    });

    // 없으면 새 유저 생성
    if (!oauth) {
        const newUser = await prisma.user.create({
            data: {
                email,
                nickname: name,
                password: '',
                phone_number: '',
                wallet_address: '',
                simple_password: '',
                level: 'Regular',
                oauths: {
                    create: [
                        {
                            provider: OAuthProvider.google,
                            provider_id,
                            nickname: name || email.split('@')[0],
                            email,
                        },
                    ],
                }
            }
        });
        // 만들어진 유저 다시 조회
        oauth = await prisma.user_OAuth.findUnique({
            where: { provider_id },
            include: { user: true },
        });
    }

    const token = signToken({ userId: oauth!.user.id });

    return {
        token,
        redirectUrl: process.env.CLIENT_IP || 'http://localhost:3000',
        cookieOptions: defaultCookieOptions,

    }

}

