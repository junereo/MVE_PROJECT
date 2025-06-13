export const mockSignup = async (data: {
  email: string;
  password: string;
  nickname: string;
  phoneNumber: string;
}) => {
  console.log("mockSignup called with data: ", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { status: 201, data: { message: "회원가입 성공" } };
};
