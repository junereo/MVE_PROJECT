import { LoginFormData, LoginFormErrors } from "../types";

// 로그인 입력값 유효성 검사
export const validateLoginField = (
  field: keyof LoginFormData,
  value: string
): string => {
  switch (field) {
    case "email":
      return /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
        value
      )
        ? ""
        : "유효하지 않은 이메일입니다.";
    case "password":
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(value)
        ? ""
        : "유효하지 않은 비밀번호입니다.";
  }
};

// LoginFormData 각 필드별 유효성 검사를 수행하고 에러 메시지가 있는 필드만 errors 객체에 담아 반환함
export const allLoginFields = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {}; // 에러 메세지 담을 빈 객체 생성

  // 각 필드에 대해 유효성 검사 수행
  (Object.keys(formData) as (keyof LoginFormData)[]).forEach((field) => {
    const error = validateLoginField(field, formData[field]); // 각 필드에 대해 유효성 검사 수행
    if (error) errors[field] = error; // 에러 있는 경우 errors 객체에 추가
  });
  return errors;
};
