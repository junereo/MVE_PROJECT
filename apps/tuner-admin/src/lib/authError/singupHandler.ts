import { SignupFormData, SignupFormErrors } from "@/types";

// 회원가입 입력값 유효성 검사
export const validateSignupField = (
  field: keyof SignupFormData,
  value: string,
  formData: SignupFormData
): string => {
  switch (field) {
    case "email":
      return /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
        value
      )
        ? ""
        : "유효한 이메일 주소를 입력해주세요.";
    case "password":
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(value)
        ? ""
        : "비밀번호는 8자 이상 문자, 숫자를 포함해주세요.";
    case "confirmPassword":
      return value === formData.password ? "" : "비밀번호가 일치하지 않습니다.";
    case "nickname":
      return value.length > 1
        ? ""
        : "닉네임은 2자 이상 8자 이하로 입력해주세요.";
    case "phone_number":
      return /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(value)
        ? ""
        : "유효한 휴대전화번호를 입력해주세요.";
    default:
      return "";
  }
};

// SignupFormData 각 필드별 유효성 검사를 수행하고 에러 메시지가 있는 필드만 errors 객체에 담아 반환함
export const allSignupFields = (formData: SignupFormData): SignupFormErrors => {
  const errors: SignupFormErrors = {}; // 에러 메세지 담을 빈 객체 생성

  // 'email' | 'password'... 순서대로 각 필드에 대해 유효성 검사 수행
  (Object.keys(formData) as (keyof SignupFormData)[]).forEach((field) => {
    const error = validateSignupField(
      field,
      formData[field] as string,
      formData
    ); // 각 필드에 대해 유효성 검사 수행
    if (error) errors[field] = error; // 에러 있는 경우 errors 객체에 추가
  });
  return errors;
};
