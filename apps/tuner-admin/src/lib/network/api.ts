import axiosClient from "@/lib/network/axios";

// 관리자 dashboard 조회 page
export const dashboard = async () => {
    const response = await axiosClient.get("/admin/dashbord");
    return response.data;
};

// 관리자 reward 조회 page
export const rewardList = async () => {
    const response = await axiosClient.get("/reward");
    return response.data;
};

// 관리자 reward 조회 page
// 출금 요청
export const withdrawReward = async () => {
    const response = await axiosClient.post("/reward");
    return response.data;
};


