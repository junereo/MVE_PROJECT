'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSurveyStore } from '@/store/useSurveyCreateStore';
import Dropdown from '../../../components/ui/DropDown';
import { surveyView, userReward } from '@/lib/network/api';
import Image from 'next/image';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { useSessionStore } from '@/store/useAuthmeStore';
const SurveyStep1 = () => {
    useSessionCheck();
    const { user } = useSessionStore();

    const genreOptions = [
        '발라드',
        '힙합',
        '댄스',
        '재즈',
        '클래식',
        'EDM',
        '국악',
        '스윙',
        '락',
    ];

    const { step1, setStep1, resetSurvey } = useSurveyStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const videoId = searchParams.get('videoId');
    const title = searchParams.get('title');
    const thumbnail = searchParams.get('thumbnail');
    const channelTitle = searchParams.get('channelTitle');
    const [rewardInput, setRewardInput] = useState({
        reward_amount: '',
        reward: '',
        expertReward: '',
    });
    const [tokenBalance, setTokenBalance] = useState<number | null>(null);

    useEffect(() => {
        const url = new URL(window.location.href);
        const isFromSearch = url.searchParams.get('fromSearch') === 'true';

        const setup = async () => {
            if (id) {
                // 설문 수정
                try {
                    const { data } = await surveyView(id);
                    // console.log(data);

                    setStep1({
                        youtubeVideoId: data.music_id,
                        youtubeTitle: data.music_title,
                        youtubeThumbnail: data.music_thumbnail,
                        channelTitle: data.artist,
                        url: data.music_uri,
                        title: data.music_title,
                        artist: data.artist,
                        survey_title: data.survey_title,
                        isReleased: data.is_released,
                        releaseDate: data.release_date,
                        genre: data.genre,
                        start_at: data.start_at.split('T')[0],
                        end_at: data.end_at.split('T')[0],
                        surveyType: data.type,
                        reward_amount: data.reward_amount,
                        reward: data.reward,
                        expertReward: data.expert_reward,
                        surveyId: data.id.toString(),
                        thumbnail_uri: data.thumbnail_uri ?? '', // 사용자가 업로드한 썸네일 수정시 받아오기
                        surveyQuestionsRaw: data.survey_question, // 사용자가 업로드한 설문정보 step2 에서 이걸로 설문을 데이터를 수정
                    });
                    setRewardInput({
                        reward_amount: data.reward_amount
                            ? (data.reward_amount / 1000).toString()
                            : '',
                        reward: data.reward
                            ? (data.reward / 1000).toString()
                            : '',
                        expertReward: data.expert_reward
                            ? (data.expert_reward / 1000).toString()
                            : '',
                    });
                } catch (err) {
                    console.error('❌ 수정 설문 불러오기 실패:', err);
                }
            } else if (videoId && title && thumbnail && isFromSearch) {
                setStep1({
                    youtubeVideoId: videoId,
                    youtubeTitle: title,
                    youtubeThumbnail: thumbnail,
                    channelTitle: channelTitle ?? '',
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    title,
                    artist: channelTitle || '',
                });
            }
        };

        setup();
    }, [id, videoId, title, thumbnail, channelTitle, setStep1]);

    // 리워드 조회
    useEffect(() => {
        const fetchUserToken = async () => {
            if (!user?.id) return;
            try {
                const { data } = await userReward(user.id);
                setTokenBalance(data.token);
                // console.log(' 유저 토큰 잔액:', data.token);
            } catch (error) {
                console.error(' 유저 토큰 조회 실패:', error);
            }
        };

        fetchUserToken();
    }, [user?.id]);

    const handleInputChange = useCallback(
        (field: keyof typeof step1, value: string | number | boolean) => {
            // console.log('💡 변경 필드:', field, value);
            if (value !== undefined) {
                setStep1({ [field]: value });
            }
        },
        [setStep1],
    );

    const setSurveyPeriod = useCallback(
        (days: number) => {
            const today = new Date();
            const start = today.toISOString().slice(0, 10);
            const end = new Date(today.getTime() + days * 86400000)
                .toISOString()
                .slice(0, 10);
            handleInputChange('start_at', start);
            handleInputChange('end_at', end);
        },
        [handleInputChange],
    );

    useEffect(() => {
        if (!step1.start_at && !step1.end_at) {
            setSurveyPeriod(7);
        }
    }, [step1.start_at, step1.end_at, setSurveyPeriod]);
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        const url = new URL(window.location.href);
        const params = url.searchParams;

        const isFromSearch = params.get('fromSearch') === 'true';

        if (isFromSearch) {
            // console.log(' 유지: search에서 옴');
            params.delete('fromSearch');
            window.history.replaceState({}, '', url.toString());
            return; // 여기서 끝냄
        }

        // console.log(' 리셋 수행: fromSearch 없음');
        resetSurvey();
    }, [resetSurvey]);

    return (
        <div>
            <div className="w-full font-bold text-black text-2xl py-3">
                설문 만들기 Step1
            </div>
            <div className="p-6">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        <div className="p-8 w-full rounded-2xl bg-white shadow space-y-8">
                            {/* 유튜브 등록 버튼 */}
                            <button
                                onClick={() => router.push('/survey/search')}
                                className="bg-blue-500 text-white p-2 rounded w-full"
                            >
                                유튜브 영상 등록
                            </button>

                            {/* 썸네일 + 입력 영역 */}
                            <div className="flex flex-col md:flex-row gap-6 mt-4">
                                <div className="flex-1">
                                    <label className="font-bold text-lg pb-2 block">
                                        설문 제목
                                    </label>
                                    <input
                                        value={step1.survey_title || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'survey_title',
                                                e.target.value.slice(0, 30),
                                            )
                                        }
                                        placeholder="설문 제목을 입력해주세요 (30자 이내)"
                                        className="border p-2 w-full"
                                    />

                                    <label className="font-bold text-lg pb-2 mt-4 block">
                                        곡 제목
                                    </label>
                                    <input
                                        value={step1.title || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="border p-2 w-full"
                                        // disabled={!step1.youtubeVideoId}
                                    />

                                    <label className="font-bold text-lg pb-2 mt-4 block">
                                        아티스트
                                    </label>
                                    <input
                                        value={step1.artist || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'artist',
                                                e.target.value,
                                            )
                                        }
                                        className="border p-2 w-full"
                                        // disabled={!step1.youtubeVideoId}
                                    />
                                </div>

                                <div className="flex-1 flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        {step1.thumbnail_uri ? (
                                            <div className="w-[280px] h-[180px] relative border mb-2 rounded overflow-hidden bg-white">
                                                <Image
                                                    alt="썸네일"
                                                    src={step1.thumbnail_uri}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-[280px] h-[180px] border-2 border-dashed border-gray-400 rounded flex items-center justify-center mb-2">
                                                <span className="text-gray-500">
                                                    썸네일 미리보기 없음
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                const input =
                                                    document.createElement(
                                                        'input',
                                                    );
                                                input.type = 'file';
                                                input.accept = 'image/*';

                                                input.onchange = (event) => {
                                                    const file = (
                                                        event.target as HTMLInputElement
                                                    ).files?.[0];
                                                    if (file) {
                                                        const reader =
                                                            new FileReader();
                                                        reader.onload = () => {
                                                            const result =
                                                                reader.result as string;
                                                            setStep1({
                                                                thumbnail_uri:
                                                                    result,
                                                            });
                                                        };
                                                        reader.readAsDataURL(
                                                            file,
                                                        );
                                                    }
                                                };

                                                input.click();
                                            }}
                                            className="bg-gray-700 text-white px-3 py-2 rounded text-sm w-full max-w-xs"
                                        >
                                            썸네일 이미지 업로드
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 발매 여부 + 발매일 */}
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <label className="font-bold text-lg pb-2 block">
                                        발매 여부
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={step1.isReleased}
                                                onChange={() =>
                                                    handleInputChange(
                                                        'isReleased',
                                                        true,
                                                    )
                                                }
                                            />
                                            발매
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={!step1.isReleased}
                                                onChange={() =>
                                                    handleInputChange(
                                                        'isReleased',
                                                        false,
                                                    )
                                                }
                                            />
                                            미발매
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="font-bold text-lg pb-2 block">
                                        발매일
                                    </label>
                                    <input
                                        type="date"
                                        value={step1.releaseDate}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'releaseDate',
                                                e.target.value,
                                            )
                                        }
                                        className="border p-2 w-full"
                                        disabled={step1.isReleased === false}
                                    />
                                </div>
                            </div>

                            {/* 장르 드롭다운 */}
                            <div>
                                <label className="font-bold text-lg pb-2 block">
                                    장르 선택
                                </label>
                                <Dropdown
                                    options={genreOptions}
                                    selected={step1.genre || '장르 선택'}
                                    onSelect={(selectedOption) => {
                                        const mapToValue: Record<
                                            string,
                                            string
                                        > = {
                                            발라드: 'ballad',
                                            힙합: 'hiphop',
                                            스윙: 'rnb',
                                            댄스: 'dance',
                                            재즈: 'jazz',
                                            클래식: 'classical',
                                            EDM: 'edm',
                                            국악: 'gukak',
                                            락: 'rock',
                                            팝: 'pop',
                                            트로트: 'trot',
                                            ccm: 'ccm',
                                        };
                                        handleInputChange(
                                            'genre',
                                            mapToValue[selectedOption],
                                        );
                                    }}
                                />
                            </div>

                            {/* 설문 기간 */}
                            <div>
                                <label className="font-bold text-lg pb-2 block">
                                    설문 기간
                                </label>
                                <div className="flex gap-2 pb-2">
                                    {[
                                        { label: '오늘', days: 0 },
                                        { label: '7일', days: 7 },
                                        { label: '15일', days: 15 },
                                        { label: '30일', days: 30 },
                                    ].map(({ label, days }) => (
                                        <button
                                            key={label}
                                            onClick={() =>
                                                setSurveyPeriod(days)
                                            }
                                            className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={step1.start_at}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'start_at',
                                                e.target.value,
                                            )
                                        }
                                        className="border p-2 w-full"
                                    />
                                    <input
                                        type="date"
                                        value={step1.end_at}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'end_at',
                                                e.target.value,
                                            )
                                        }
                                        className="border p-2 w-full"
                                    />
                                </div>
                            </div>

                            {/* 설문 유형 + 리워드 */}
                            <div className="flex flex-col md:flex-row md:items-end gap-6">
                                <div>
                                    <label className="font-bold text-lg pb-2 block">
                                        설문 유형
                                    </label>
                                    <div className="flex gap-4">
                                        {[
                                            {
                                                label: 'general',
                                                value: 'general',
                                            },
                                            {
                                                label: 'official',
                                                value: 'official',
                                            },
                                        ].map(({ label, value }) => (
                                            <label
                                                key={value}
                                                className="cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="surveyType"
                                                    value={value}
                                                    checked={
                                                        step1.surveyType ===
                                                        value
                                                    }
                                                    onChange={() =>
                                                        handleInputChange(
                                                            'surveyType',
                                                            value,
                                                        )
                                                    }
                                                    className="peer hidden"
                                                />
                                                <div className="px-4 py-2 rounded border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white transition">
                                                    {label}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* 공식 설문일 경우 리워드 입력 */}
                                {step1.surveyType === 'official' && (
                                    <div className="flex flex-wrap gap-4 flex-1 mt-4 md:mt-0">
                                        <div className="flex flex-col w-full md:w-[150px]">
                                            <label className="text-sm font-medium mb-1">
                                                전체 리워드 (포인트)
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="예: 0.001"
                                                value={
                                                    rewardInput.reward_amount
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    // 숫자/소수점만 필터링
                                                    if (
                                                        /^[0-9]*\.?[0-9]*$/.test(
                                                            val,
                                                        )
                                                    ) {
                                                        setRewardInput(
                                                            (prev) => ({
                                                                ...prev,
                                                                reward_amount:
                                                                    val,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                onBlur={() => {
                                                    const parsed = parseFloat(
                                                        rewardInput.reward_amount,
                                                    );
                                                    handleInputChange(
                                                        'reward_amount',
                                                        isNaN(parsed)
                                                            ? 0
                                                            : Math.round(
                                                                  parsed * 1000,
                                                              ),
                                                    );
                                                    setRewardInput((prev) => ({
                                                        ...prev,
                                                        reward_amount: isNaN(
                                                            parsed,
                                                        )
                                                            ? ''
                                                            : String(parsed),
                                                    }));
                                                }}
                                                className="border p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full md:w-[150px]">
                                            <label className="text-sm font-medium mb-1">
                                                일반 유저 리워드
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="예: 0.001"
                                                value={rewardInput.reward}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    // 숫자/소수점만 필터링
                                                    if (
                                                        /^[0-9]*\.?[0-9]*$/.test(
                                                            val,
                                                        )
                                                    ) {
                                                        setRewardInput(
                                                            (prev) => ({
                                                                ...prev,
                                                                reward: val,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                onBlur={() => {
                                                    const parsed = parseFloat(
                                                        rewardInput.reward,
                                                    );
                                                    handleInputChange(
                                                        'reward',
                                                        isNaN(parsed)
                                                            ? 0
                                                            : Math.round(
                                                                  parsed * 1000,
                                                              ),
                                                    );
                                                    setRewardInput((prev) => ({
                                                        ...prev,
                                                        reward: isNaN(parsed)
                                                            ? ''
                                                            : String(parsed),
                                                    }));
                                                }}
                                                className="border p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full md:w-[150px]">
                                            <label className="text-sm font-medium mb-1">
                                                Expert 유저 리워드
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="예: 0.001"
                                                value={rewardInput.expertReward}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    // 숫자/소수점만 필터링
                                                    if (
                                                        /^[0-9]*\.?[0-9]*$/.test(
                                                            val,
                                                        )
                                                    ) {
                                                        setRewardInput(
                                                            (prev) => ({
                                                                ...prev,
                                                                expertReward:
                                                                    val,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                onBlur={() => {
                                                    const parsed = parseFloat(
                                                        rewardInput.expertReward,
                                                    );
                                                    handleInputChange(
                                                        'expertReward',
                                                        isNaN(parsed)
                                                            ? 0
                                                            : Math.round(
                                                                  parsed * 1000,
                                                              ),
                                                    );
                                                    setRewardInput((prev) => ({
                                                        ...prev,
                                                        expertReward: isNaN(
                                                            parsed,
                                                        )
                                                            ? ''
                                                            : String(parsed),
                                                    }));
                                                }}
                                                className="border p-2"
                                            />
                                        </div>
                                        {tokenBalance !== null && (
                                            <div className=" pt-4  text-gray-500 text-right">
                                                <div>
                                                    보유 잔액:{' '}
                                                    <span className="font-semibold">
                                                        {tokenBalance} 포인트
                                                    </span>
                                                </div>
                                                {step1.reward_amount !==
                                                    undefined &&
                                                    !isNaN(
                                                        Number(
                                                            step1.reward_amount,
                                                        ),
                                                    ) && (
                                                        <div>
                                                            차감 후:{' '}
                                                            <span className="font-semibold">
                                                                {(
                                                                    tokenBalance -
                                                                    Number(
                                                                        step1.reward_amount,
                                                                    ) /
                                                                        1000
                                                                ).toFixed(
                                                                    0,
                                                                )}{' '}
                                                                포인트
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 다음 버튼 */}
                            <div className="pt-4">
                                <button
                                    onClick={() => {
                                        if (!step1.survey_title?.trim())
                                            return alert(
                                                '설문 제목을 입력해주세요.',
                                            );
                                        if (!step1.title?.trim())
                                            return alert(
                                                '곡 제목을 입력해주세요.',
                                            );
                                        if (!step1.start_at || !step1.end_at)
                                            return alert(
                                                '설문 기간을 입력해주세요.',
                                            );
                                        if (step1.start_at > step1.end_at)
                                            return alert(
                                                '설문 시작일은 종료일보다 이전이어야 합니다.',
                                            );
                                        const todayStr = new Date()
                                            .toISOString()
                                            .slice(0, 10);
                                        if (step1.start_at < todayStr)
                                            return alert(
                                                '설문 시작일은 오늘보다 이전일 수 없습니다.',
                                            );
                                        if (!step1.genre)
                                            return alert(
                                                '장르를 선택해주세요.',
                                            );
                                        if (
                                            step1.surveyType === 'official' &&
                                            [
                                                step1.reward_amount,
                                                step1.reward,
                                                step1.expertReward,
                                            ].some(
                                                (v) =>
                                                    v === undefined || v === 0,
                                            )
                                        ) {
                                            return alert(
                                                '리워드 항목을 모두 입력해주세요.',
                                            );
                                        }
                                        if (
                                            step1.isReleased &&
                                            (!step1.releaseDate ||
                                                step1.releaseDate.trim() === '')
                                        ) {
                                            return alert(
                                                '발매일을 입력해주세요.',
                                            );
                                        }
                                        if (
                                            step1.surveyType === 'official' &&
                                            tokenBalance !== null &&
                                            Number(step1.reward_amount) / 1000 >
                                                tokenBalance
                                        ) {
                                            return alert(
                                                '리워드가 보유 토큰보다 많습니다.',
                                            );
                                        }

                                        router.push('/survey/create/step2');
                                    }}
                                    className="mt-6 bg-black text-white px-6 py-2 rounded w-full"
                                >
                                    NEXT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyStep1;
