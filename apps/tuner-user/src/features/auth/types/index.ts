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
  nickname: string;
  phone_number: string;
}

// 회원가입 데이터 에러
export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;

export interface MypageInfo {
  user: {
    nickname: string;
    role: string;
  };
}
/*
    SignupFormData : 회원가입 폼 데이터의 타입 정의
     => {
          email: string;
          password: string;
          confirmPassword: string;
          nickname: string;
          phoneNumber: string;
        }
    SignupFormErrors : 회원가입 폼 데이터의 에러 메시지 타입 정의
     => {
          email?: string;
          password?: string;
          confirmPassword?: string;
          nickname?: string;
          phoneNumber?: string;
        }
    Partial<Record<keyof T, V>> : 객체 T의 키들에 대해 값 V를 가지는 객체를 정의

    keyof T	: 객체 T의 키들만 추출
     => "email" | "password" | "confirmPassword" | "nickname" | "phoneNumber"

    Record<K, V> : 키 K에 대해 값 V를 가지는 객체
     =>  {
           email: string;
           password: string;
           confirmPassword: string;
           nickname: string;
           phoneNumber: string;
         }

    Partial<T> : 객체 T의 모든 속성을 옵셔널(Optional)로 바꿈
     => {
          email?: string;
          password?: string;
          confirmPassword?: string;
          nickname?: string;
          phoneNumber?: string;
        }
*/
