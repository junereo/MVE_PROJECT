// 로그인
export interface LoginFormData {
    email: string;
    password: string;
}

// 로그인 데이터 에러
export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// 회원가입
export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone_number: string;
    role: string | number;

}
// 회원가입 데이터 에러
export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;
