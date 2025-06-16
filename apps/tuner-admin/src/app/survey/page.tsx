'use client'

import YoutubeSearch from "../components/youtude";
import { useSessionCheck } from "@/hooks/useSessionCheck";

const Survey = () => {
    useSessionCheck(); // 클라이언트 훅 호출

    return (

        <YoutubeSearch />
    )

}

export default Survey