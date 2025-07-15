import {
    SurveyCreatePayload,
    SurveyQuestionPayload,
    LoginFormData,
} from '@/types';

import axiosClient from '@/lib/network/axios';

// 로그인 요청
export const pushLogin = async (formData: LoginFormData) => {
    const res = await axiosClient.post('/auth/login', formData);
    return res.data;
};
// 로그아웃 요청
export const LogOut = async () => {
    const res = await axiosClient.post('/auth/logout');
    return res.data;
};
// dashbord
export const dashboard = async () => {
    await axiosClient.get('/admin/dashbord');
};

// 리워드 요청 user 리스트
export const rewardList = async () => {
    await axiosClient.get('/reward');
};
// 리워드 지급 요청
export const withdrawReward = async () => {
    await axiosClient.post('/reward');
};

// 발급된 nft 리스트 조회
export const nftList = async () => {
    await axiosClient.get('/nftCheck');
};

// 발급된 설문 리스트
export const surveyList = async () => {
    const res = await axiosClient.get('/survey/s/0');
    console.log('설문 리스트:', res.data);

    return res.data;
};
// 설문 상세페이지
export const surveyView = async (id: number | string) => {
    const res = await axiosClient.get(`/survey/s/${id}`);

    return res.data;
};
// 설문 참여자 리스트
export const participantList = async () => {
    const res = await axiosClient.get(`/survey/p`);
    return res.data;
};

// 새로운 설문 만들기
export const surveyCreate = async (serverPayload: SurveyCreatePayload) => {
    await axiosClient.post('/survey', serverPayload);
};
//  설문 수정
export const surveyPut = async (
    serverPayload: SurveyCreatePayload,
    id: number,
) => {
    await axiosClient.put(`/survey/${id}`, serverPayload);
};
// 모든 유저 조회 list
export const userList = async () => {
    const res = await axiosClient.get('/user');
    return res;
};

export const userme = async () => {
    await axiosClient.get('/users/me');
};

// 유저 상세 내용 확인 page
// export const userView = async () => {
//     await axiosClient.get(`/users${id}`);
// }

// 설문 템플릿 조회list page
export const serveyTemplate = async () => {
    await axiosClient.get('/template');
};

// 설문 템플릿 생성 page
export const createTemplate = async (formData: SurveyQuestionPayload) => {
    await axiosClient.post('/survey/q', formData);
};

//템플릿 불러오기
export const fetchTemplates = async (id: number | string) => {
    const response = await axiosClient.get(`/survey/q/${id}`);
    return response.data;
};

// 설문 템플릿 수정
export const templatePut = async () => {
    await axiosClient.put('/survey/q/id');
};

// fixedQuestions 템플릿 불러오기 (서버에서)
export const fetchFixedQuestions = async (
    questionnaireId: number | string = 2,
) => {
    const response = await axiosClient.get(`/survey/q/${questionnaireId}`);
    return response.data;
};
