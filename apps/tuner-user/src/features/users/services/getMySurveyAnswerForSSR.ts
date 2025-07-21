import axios from "@/lib/network/axios";

export const getMySurveyAnswerForSSR = async ({ token }: { token: string }) => {
  const res = await axios.get("/survey/s", {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: token,
    },
  });

  return res.data;
};
