'use client';

import { useState } from 'react';
import { fetchYoutubeVideos } from '@/lib/network/youtube';

export default function YoutubeSearch() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const results = await fetchYoutubeVideos(query);
    setVideos(results);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🔍 유튜브 영상 검색</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-400 p-2 flex-1 rounded"
          placeholder="검색어 입력 (예: 손흥민)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {videos.map((video) => (
        <div key={video.videoId} className="mb-6">
          <img src={video.thumbnail} alt={video.title} className="rounded w-full" />
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-2"
          >
            {video.title}
          </a>
        </div>
      ))}
    </div>
  );
}