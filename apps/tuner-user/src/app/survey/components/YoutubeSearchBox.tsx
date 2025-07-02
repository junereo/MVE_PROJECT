"use client";

import { useState } from "react";
import { fetchYoutubeVideos } from "@/lib/youtube";
import {
  useSurveyStore,
  SelectedVideo,
} from "@/features/survey/store/useSurveyStore";
import Input from "@/components/ui/Input";
import Image from "next/image";

export default function YoutubeSearchBox() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<SelectedVideo[]>([]);
  const { selectedVideo, setSelectedVideo } = useSurveyStore();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSelectedVideo(null);
    const results = await fetchYoutubeVideos(query);
    setVideos(results);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="검색어 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {selectedVideo ? (
        <div className="space-y-2 mt-4">
          <iframe
            src={selectedVideo.select_url}
            className="w-full h-[200px] rounded"
            allowFullScreen
          />
          <Input
            label="곡 제목"
            value={selectedVideo?.title || ""}
            onChange={(e) =>
              setSelectedVideo({
                ...selectedVideo,
                title: e.target.value,
              })
            }
            placeholder="곡 제목을 입력해주세요."
          />
          <Input
            label="아티스트"
            value={selectedVideo?.artist || ""}
            onChange={(e) =>
              setSelectedVideo({
                ...selectedVideo,
                artist: e.target.value,
              })
            }
            placeholder="아티스트명을 입력해주세요."
          />
          <button
            className="text-blue-500 underline text-sm mt-2"
            onClick={() => setSelectedVideo(null)}
          >
            ← 다시 선택하기
          </button>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-2">
          {videos.map((video) => (
            <div
              key={video.artist + video.title}
              className="cursor-pointer border p-2 rounded"
              onClick={() => {
                setSelectedVideo(video);
                setVideos([]);
              }}
            >
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-[140px] object-cover rounded"
                width={140}
                height={140}
              />
              <p className="mt-2 text-sm line-clamp-2">{video.title}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
