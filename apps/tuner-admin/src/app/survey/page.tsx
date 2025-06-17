'use client';

import { useSessionCheck } from '@/hooks/useSessionCheck';
import YoutubeBtn from '../components/ui/Youtube';
import YoutuveVideo from './components/youtubeVideo';
const Survey = () => {
    useSessionCheck(); // 클라이언트 훅 호출

    return (
        <div className="w-[1200px] bg-white flex flex-col items-end justify-center">
            <div className="min-w-[800px]">
                <div>
                    <label className="flex items-end justify-end">
                        <YoutubeBtn type="button">
                            유튜브 영상 찾으러 가기
                        </YoutubeBtn>
                    </label>
                    <YoutuveVideo />
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
                                <input
                                    type="radio"
                                    name="multipleChoice"
                                    placeholder="객관형 질문을 입력해주세요"
                                ></input>
                                <input
                                    type="radio"
                                    name="multipleChoice"
                                    placeholder="객관형 질문을 입력해주세요"
                                ></input>
                                <input
                                    type="radio"
                                    name="multipleChoice"
                                    placeholder="객관형 질문을 입력해주세요"
                                ></input>
                                <input
                                    type="radio"
                                    name="multipleChoice"
                                    placeholder="객관형 질문을 입력해주세요"
                                ></input>
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
    );
};

export default Survey;
