import { SurveyCreatePayload } from "@/types";

import axiosClient from "@/lib/network/axios";

// 로그인 요청
export const pushLogin = async (formData: any) => {
  const res = await axiosClient.post("/admin/login", formData);
  return res.data;
};
// 로그아웃 요청
export const LogOut = async () => {
  const res = await axiosClient.post("/admin/logout");
  return res.data;
};
// dashbord
export const dashboard = async () => {
  await axiosClient.get("/admin/dashbord");
};

// 리워드 요청 user 리스트
export const rewardList = async () => {
  await axiosClient.get("/reward");
};
// 리워드 지급 요청
export const withdrawReward = async () => {
  await axiosClient.post("/reward");
};

// 발급된 nft 리스트 조회
export const nftList = async () => {
  await axiosClient.get("/nftCheck");
};

// 발급된 설문 리스트
export const surveyList = async () => {
  await axiosClient.get("/survey");
};

// 새로운 설문 만들기
export const surveyCreate = async (serverPayload: SurveyCreatePayload) => {
  await axiosClient.post("/survey/create", serverPayload);
};

// 모든 유저 조회 list
export const userList = async () => {
  await axiosClient.get("/users");
};

// 유저 상세 내용 확인 page
// export const userView = async () => {
//     await axiosClient.get(`/users${id}`);
// }

// 설문 템플릿 조회list page
export const serveyTemplate = async () => {
  await axiosClient.get("/template");
};

// 설문 템플릿 생성 page
export const createTemplate = async () => {
  await axiosClient.post("/template/create");
};

// 설문 템플릿 상세 조회
export const templateView = async () => {
  await axiosClient.post("/template/id");
};

// 설문 템플릿 수정
export const templatePut = async () => {
  await axiosClient.put("/template/id");
};
