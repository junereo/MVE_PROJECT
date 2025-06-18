export interface RegisterList {
    email: string;
    password: string;
    name: string;
    phone_number: string;
    role: number;
}


export interface AdminDashboard {
    total_users: number;
    active_users: number;
    total_surveys: number;
    recent_activities: Activity[];
}

export interface Activity {
    id: number;
    type: string;
    description: string;
    created_at: Date;
    user_id: number;
}

export interface UserManagementData {
    users: UserData[];
    total: number;
    page: number;
    limit: number;
}

export interface UserData {
    id: number;
    email: string;
    nickname: string;
    level: string;
    created_at: Date;
    last_login: Date;
} 