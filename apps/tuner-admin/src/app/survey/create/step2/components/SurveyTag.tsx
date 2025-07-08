// components/hashtag/HashTagSelectorCreate.tsx
'use client';
import { useEffect } from 'react';
import { useSurveyStore } from '@/store/useSurveyCreateStore';

export const predefinedTags: { [key: string]: string } = {
    emotional: '감각적인',
    fancy: '화려한',
    sentimental: '감성적인',
    dreamy: '몽환적인',
    trendy: '트렌디한',
    retro: '복고풍',
    addictive: '중독성 있는',
    calm: '잔잔한',
    dynamic: '역동적인',
    original: '독창적인',
};

const TagCreate = () => {
    const { setStep2 } = useSurveyStore();

    useEffect(() => {
        const tags = Object(predefinedTags);
        setStep2({ tags });
    }, [setStep2]);

    return (
        <div className="mb-8">
            <p className="font-semibold mb-2">이 설문에 사용될 해시태그</p>
            <div className="flex flex-wrap gap-2">
                {Object.entries(predefinedTags).map(([key, tag]) => (
                    <span
                        key={key}
                        className="px-4 py-2 rounded-full bg-gray-200 text-gray-800"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagCreate;
