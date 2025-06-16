import { PrismaClient, UserLevel, User, User_OAuth } from '@prisma/client';
import type { Request, CookieOptions } from 'express';
import { RegisterList, LoginResponse } from "../types/auth.types";
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/auth.utils';
import { signToken, verifyToken } from '../utils/jwt';
import axios from 'axios';

const prisma = new PrismaClient();

export const emailRegister = async (data: RegisterList) => {
    const isUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (isUser) throw new Error("이미 가입된 이메일입니다.");

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
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

export const emaillogin = async (email: string, password: string): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("가입되지 않은 이메일입니다.");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
    }

    const token = jwt.sign(
        {
            userId: user.id,
            nickname: user.nickname
        },
        jwtSecret!,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: {
            id: user.id,
            nickname: user.nickname,
        }
    };
};

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
};

type OAuthCallbackResult =
    | {
        token: string;
        redirectUrl: string;
        cookieOptions: CookieOptions;
    }
    | {
        error: string;
        detail?: string;
    };

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

    // 🔸 STEP 1: 사용자 및 계정 등록 (DB 트랜잭션)
    try {
        user = await prisma.$transaction(async (tx) => {
            const existingAccount = await tx.user_OAuth.findUnique({
                where: {
                    provider,
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
                        provider,
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

    // 🔸 STEP 2: JWT 발급
    const token = signToken({ userId: user.id });

    return {
        token,
        redirectUrl: process.env.CLIENT_REDIRECT_URL || 'http://localhost:5173',
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
                redirect_uri: process.env.KAKAO_REDIRECT_URI!,
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