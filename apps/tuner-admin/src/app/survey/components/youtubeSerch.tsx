'use client';

import { useState } from 'react';
import { fetchYoutubeVideos } from '@/lib/youtube';
import { useRouter } from 'next/navigation';

type YoutubeVideo = {
    videoId: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
};
export default function YoutubeSearch() {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState<YoutubeVideo[]>([]);
    const router = useRouter();
    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const url = new URL(query, 'https://www.youtube.com');
            const videoId = url.searchParams.get('v');

            if (videoId) {
                const result = await fetchYoutubeVideos(videoId, true);
                if (result && !Array.isArray(result)) {
                    setVideos([result]);
                    return;
                }
            }

            const results = await fetchYoutubeVideos(query);
            if (results && Array.isArray(results)) {
                setVideos(results);
            } else {
                setVideos([]);
            }
        } catch (err) {
            console.error('검색 중 오류 발생:', err);
            setVideos([]);
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-xl font-bold mb-4">유튜브 영상 검색</h1>
                <div className="flex gap-2 mb-4 max-w-3x">
                    <input
                        className="border border-gray-400 p-2 flex-1 rounded"
                        placeholder="검색어 또는 Url 을 입력해주세요"
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
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {videos.map((video) => (
                        <div
                            key={video.videoId}
                            className="cursor-pointer bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow"
                            onClick={() => {
                                const query = new URLSearchParams({
                                    videoId: video.videoId,
                                    title: video.title,
                                    thumbnail: video.thumbnail,
                                    channelTitle: video.channelTitle,
                                    fromSearch: 'true',
                                }).toString();
                                router.push(`/survey/create/step1?${query}`);
                            }}
                        >
                            <div className="w-full aspect-video bg-gray-200 overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <p className="text-black font-medium line-clamp-2 hover:underline">
                                    {video.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {video.channelTitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
