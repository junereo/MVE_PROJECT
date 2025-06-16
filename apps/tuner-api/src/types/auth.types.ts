export interface RegisterList {
    email: string;
    password: string;
    nickname: string;
    phone_number: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        nickname: string;
    };
}

