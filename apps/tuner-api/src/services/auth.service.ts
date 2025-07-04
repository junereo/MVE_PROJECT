import { PrismaClient, OAuthProvider } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/auth.utils';
import type { Request, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { mapRoleEnum } from '../utils/auth.utils';
import { signToken } from '../utils/jwt';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';
dotenv.config();

const prisma = new PrismaClient();

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
};
// 이메일 회원가입
// export const emailRegister = async (data: any) => {
//     const exist = await prisma.user.findUnique({ where: { email: data.email } });
//     if (exist) throw new Error("이미 가입된 이메일입니다.");

//     const roleEnum = mapRoleEnum(Number(data.role) || 3);

//     const newUser = await prisma.user.create({
//         data: {
//             email: data.email,
//             password: data.password,
//             nickname: data.nickname,
//             phone_number: data.phone_number,
//             role: roleEnum,
//         },
//     });

//     const token = signToken({ userId: newUser.id, role: newUser.role });

//     return {
//         token,
//         user: { id: newUser.id, nickname: newUser.nickname, role: newUser.role },
//         cookieOptions: defaultCookieOptions,
//     };
// };

// // 이메일 로그인 
// export const emaillogin = async (email: string, password: string) => {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) throw new Error("가입되지 않은 이메일입니다.");

//     const isValid = password === user.password;
//     if (!isValid) throw new Error("비밀번호가 일치하지 않습니다.");

//     const token = signToken({ userId: user.id, role: user.role });

//     return {
//         token,
//         user: { id: user.id, nickname: user.nickname, role: user.role },
//         cookieOptions: defaultCookieOptions,
//     };
// };

// 이메일 회원가입
export const emailRegister = async (data: any) => {
    const exist = await prisma.user.findUnique({ where: { email: data.email } });
    if (exist) throw new Error("이미 가입된 이메일입니다.");

    const hashedPassword = await hashPassword(data.password);

    const roleEnum = mapRoleEnum(
        data.role !== undefined ? Number(data.role) : 3
    );

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            nickname: data.nickname,
            phone_number: data.phone_number,
            role: roleEnum,
        },
    });

    const token = signToken({ userId: newUser.id, role: newUser.role });

    return {
        token,
        user: { id: newUser.id, nickname: newUser.nickname, role: newUser.role },
        cookieOptions: defaultCookieOptions,
    };
};

// 이메일 로그인
export const emaillogin = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("가입되지 않은 이메일입니다.");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new Error("비밀번호가 일치하지 않습니다.");

    const token = signToken({ userId: user.id, role: user.role });

    return {
        token,
        user: { id: user.id, nickname: user.nickname, role: user.role },
        cookieOptions: defaultCookieOptions,
    };
};

// 관리자 회원가입
export const adminRegister = async (data: any) => {
    const isAdmin = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (isAdmin) throw new Error("이미 등록된 관리자입니다.");

    const hashedPassword = await hashPassword(data.password);

    // const role = data.role === 0 ? 'superadmin' : 'admin';

    const roleNum = data.role !== undefined ? Number(data.role) : 1; // 기본 admin
    const roleEnum = mapRoleEnum(roleNum); // 무조건 enum string!

    console.log(" data.role:", data.role);   // 원본
    console.log(" roleNum:", roleNum);       // Number 변환
    console.log(" roleEnum:", roleEnum);     // enum string: 'superadmin' or 'admin'

    const newAdmin = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            nickname: data.name,
            phone_number: data.phone_number,
            role: roleEnum,
        },
    });

    const token = signToken({ userId: newAdmin.id, role: newAdmin.role });

    return {
        token,
        user: { id: newAdmin.id, nickname: newAdmin.nickname, role: newAdmin.role },
        cookieOptions: defaultCookieOptions,
    };
};

// 관리자 로그인
export const adminLogin = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("존재하지 않는 관리자입니다.");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new Error("비밀번호가 일치하지 않습니다.");

    if (user.role !== "admin" && user.role !== "superadmin") {
        throw new Error("권한이 없습니다. 관리자만 로그인할 수 있습니다.");
    }

    const token = signToken({ userId: user.id, role: user.role });

    return {
        token,
        user: { id: user.id, nickname: user.nickname, role: user.role },
        cookieOptions: defaultCookieOptions,
    };
};

// 관리자 회원가입 
// export const adminRegister = async (data: any) => {
//     const isAdmin = await prisma.user.findUnique({ where: { email: data.email } });
//     if (isAdmin) throw new Error("이미 등록된 관리자입니다.");

//     const role = data.role === 0 ? 'superadmin' : 'admin';

//     const newAdmin = await prisma.user.create({
//         data: {
//             email: data.email,
//             password: data.password,
//             nickname: data.name,
//             phone_number: data.phone_number,
//             role: role,
//         },
//     });

//     const token = signToken({ userId: newAdmin.id, role: newAdmin.role });

//     return {
//         token,
//         user: { id: newAdmin.id, nickname: newAdmin.nickname, role: newAdmin.role },
//         cookieOptions: defaultCookieOptions,
//     };
// };
// // 관리자 로그인
// export const adminLogin = async (email: string, password: string) => {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) throw new Error("존재하지 않는 관리자입니다.");

//     const isValid = password === user.password;
//     if (!isValid) throw new Error("비밀번호가 일치하지 않습니다.");

//     if (user.role !== 'admin' && user.role !== 'superadmin') {
//         throw new Error("권한이 없습니다. 관리자만 로그인할 수 있습니다.");
//     }

//     const token = signToken({ userId: user.id, role: user.role });

//     return {
//         token,
//         user: { id: user.id, nickname: user.nickname, role: user.role },
//         cookieOptions: defaultCookieOptions,
//     };
// };

// 카카오
export const oauthCallbackService = async (req: Request) => {
    const { provider } = req.params;
    const code = req.query.code as string;
    // const roleEnum = mapRoleEnum(Number(req.query.role) || 3);
    const roleEnum = mapRoleEnum(
        req.query.role !== undefined ? Number(req.query.role) : 3
    );


    const profile = await fetchKakaoProfile(code);
    const safeEmail = profile.email ?? `noemail_${profile.id}@${provider}.com`;

    const user = await prisma.$transaction(async (tx) => {
        const existingOauth = await tx.user_Oauth.findUnique({
            where: { provider_id: profile.id },
            include: { user: true },
        });
        if (existingOauth) return existingOauth.user;

        const existingUser = await tx.user.findUnique({
            where: { email: safeEmail },
        });

        const resolvedUser =
            existingUser ??
            (await tx.user.create({
                data: {
                    email: safeEmail,
                    password: "",
                    nickname: profile.nickname,
                    phone_number: "",
                    role: roleEnum,
                },
            }));

        await tx.user_Oauth.create({
            data: {
                provider: OAuthProvider.kakao,
                provider_id: profile.id,
                nickname: profile.nickname,
                email: safeEmail,
                profile_image: profile.picture,
                userId: resolvedUser.id,
            },
        });

        return resolvedUser;
    });

    const token = signToken({ userId: user.id, role: user.role });

    return {
        token,
        user: { id: user.id, nickname: user.nickname, role: user.role },
        redirectUrl: process.env.CLIENT_USER_IP || "http://localhost:3000",
        cookieOptions: defaultCookieOptions,
    };
};

export const fetchKakaoProfile = async (code: string) => {
    const { data: tokenRes } = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        null,
        {
            params: {
                grant_type: "authorization_code",
                client_id: process.env.KAKAO_API_KEY!,
                redirect_uri: process.env.KAKAO_REDIRECT_URI!,
                code,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        }
    );

    const { data: profileRes } = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        { headers: { Authorization: `Bearer ${tokenRes.access_token}` } }
    );

    return {
        id: String(profileRes.id),
        email: profileRes.kakao_account?.email,
        nickname: profileRes.properties?.nickname,
        picture: profileRes.properties?.profile_image,
    };
};

// 구글
export const googleCallbackService = async ({
    code,
    role,
}: {
    code: string;
    role?: string;
}) => {
    const roleEnum = mapRoleEnum(
        role !== undefined ? Number(role) : 3
    );

    console.log("=== GOOGLE CALLBACK SERVICE ===");
    console.log("code:", code);

    const payload = qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
    });

    console.log("TOKEN PAYLOAD:", payload);

    const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        payload,
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
    );

    const { access_token } = tokenRes.data;

    const { data: userInfo } = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
            headers: { Authorization: `Bearer ${access_token}` },
        }
    );

    const { id: provider_id, email, name } = userInfo;

    const user = await prisma.$transaction(async (tx) => {
        const existingOauth = await tx.user_Oauth.findUnique({
            where: { provider_id },
            include: { user: true },
        });
        if (existingOauth) return existingOauth.user;

        const existingUser = await tx.user.findUnique({ where: { email } });

        const resolvedUser =
            existingUser ??
            (await tx.user.create({
                data: {
                    email,
                    password: "",
                    nickname: name,
                    phone_number: "",
                    role: roleEnum,
                },
            }));

        await tx.user_Oauth.create({
            data: {
                provider: OAuthProvider.google,
                provider_id: String(provider_id),
                nickname: name,
                email,
                userId: resolvedUser.id,
            },
        });

        return resolvedUser;
    });

    const token = signToken({ userId: user.id, role: user.role });

    return {
        token,
        user: { id: user.id, nickname: user.nickname, role: user.role },
        redirectUrl: "https://tunemate.store",
        cookieOptions: defaultCookieOptions,
    };
};
