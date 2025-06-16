export interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    phone_number: string;
    wallet_address?: string;
    level: string;
    badge_issued_at?: Date;
}

export interface UpdateUserProfileDto {
    nickname?: string;
    phone_number?: string;
    wallet_address?: string;
} 