import axios from "@/lib/network/axios";
import { cookies } from "next/headers";

export const getMySurveyAnswerForSSR = async () => {
  const cookie = cookies().toString();

  const res = await axios.get("/survey/s", {
    headers: {
      Cookie: cookie,
    },
  });

  return res.data;
};
