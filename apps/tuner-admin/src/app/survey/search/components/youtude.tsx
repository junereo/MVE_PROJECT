'use client';

import { useState } from 'react';
import { fetchYoutubeVideos } from '@/lib/network/youtube';
import { useRouter } from 'next/navigation';

export default function YoutubeSearch() {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState<any[]>([]);
    const router = useRouter();
    const handleSearch = async () => {
        if (!query.trim()) return;
        const results = await fetchYoutubeVideos(query);
        setVideos(results);
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-xl font-bold mb-4">유튜브 영상 검색</h1>

            <div className="flex gap-2 mb-4 max-w-3xl">
                <input
                    className="border border-gray-400 p-2 flex-1 rounded"
                    placeholder="검색어를 입력해주세요"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleSearch}
                >
                    검색
                </button>
            </div>
            <div className="flex gap-7  w-full items-center w-min[1000px]">
                {videos.map((video) => (
                    <div
                        key={video.videoId}
                        className="mb-6 cursor-pointer "
                        onClick={() => {
                            router.push(
                                `/survey?videoId=${video.videoId
                                }&title=${encodeURIComponent(
                                    video.title,
                                )}&thumbnail=${encodeURIComponent(
                                    video.thumbnail,
                                )}`,
                            );
                        }}
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="rounded w-full w-[300px] h-[200px]"
                        />
                        <p className="text-blue-600 underline block mt-2">
                            {video.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
