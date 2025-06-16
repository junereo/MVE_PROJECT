'use client'

import { useSessionCheck } from "@/hooks/useSessionCheck";
import Link from "next/link";

const Survey = () => {
    useSessionCheck(); // 클라이언트 훅 호출

    return (
        <div className="w-full h-[800px] bg-red-300 flex flex-col ali">
            <div>
                <div>
                    <label>
                        <button>
                            +
                        </button>
                    </label>
                </div>
                <div>
                    <button>+ 질문 추가하기</button>
                </div>
                <div>
                    <div>
                        <div>질문 1</div>
                        <button>옵션 선택 햄버거 버튼</button>
                        <div>
                            <div>서술형</div>
                            <input placeholder="서술형 답안입니다."></input>
                        </div>
                    </div>
                    <div>
                        <div>질문 2</div>
                        <button>옵션 선택 햄버거 버튼</button>
                        <div>
                            <div>객관형</div>
                            <div>
                                <input type="radio" name="multipleChoice" placeholder="객관형 질문을 입력해주세요"></input>
                                <input type="radio" name="multipleChoice" placeholder="객관형 질문을 입력해주세요"></input>
                                <input type="radio" name="multipleChoice" placeholder="객관형 질문을 입력해주세요"></input>
                                <input type="radio" name="multipleChoice" placeholder="객관형 질문을 입력해주세요"></input>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>리워드</h1>
                        <input placeholder="총 리워드 총량"></input>
                    </div>
                    <div>
                        <h1>일반 유저 설문 완료 리워드</h1>
                        <input placeholder="총 리워드 총량"></input>
                    </div>
                    <div>
                        <h1>일반 유저 설문 완료 리워드</h1>
                        <input placeholder="총 리워드 총량"></input>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    )

}

export default Survey