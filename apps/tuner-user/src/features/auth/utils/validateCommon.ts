// validateCommon.ts

export const validateEmail = (email: string): string =>
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
    email
  )
    ? ""
    : "유효한 이메일 주소를 입력해주세요.";

export const validatePassword = (password: string): string =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
    ? ""
    : "비밀번호는 8자 이상 문자, 숫자를 포함해주세요.";

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string =>
  confirmPassword === password ? "" : "비밀번호가 일치하지 않습니다.";

export const validatePhoneNumber = (phone: string): string =>
  /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(phone)
    ? ""
    : "유효한 휴대전화번호를 입력해주세요.";
