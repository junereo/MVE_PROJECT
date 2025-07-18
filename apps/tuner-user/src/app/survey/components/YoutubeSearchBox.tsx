import { useEffect, useState } from "react";
import { fetchYoutubeVideos } from "@/lib/youtube";
import {
  useSurveyStore,
  SelectedVideo,
} from "@/features/survey/store/useSurveyStore";
import Input from "@/components/ui/Input";
import Image from "next/image";

interface YoutubeSearchBoxProps {
  music_uri?: string;
  editMode?: boolean;
  showMusicUri?: boolean;
  setShowMusicUri?: (show: boolean) => void;
}

export default function YoutubeSearchBox({
  music_uri,
  editMode = false,
  showMusicUri = true,
  setShowMusicUri,
}: YoutubeSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<SelectedVideo[]>([]);
  // editMode일 때만 showMusicUri를 상태로 관리, 아니면 항상 true
  const { selectedVideo, setSelectedVideo, step1, setStep1 } = useSurveyStore();

  // music_uri가 바뀌면 showMusicUri를 true로 복구 (editMode에 따라)
  useEffect(() => {
    if (editMode) {
      setShowMusicUri?.(!!music_uri);
    }
  }, [music_uri, editMode, setShowMusicUri]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const results = await fetchYoutubeVideos(query);
    setVideos(results as SelectedVideo[]);
    if (editMode && setShowMusicUri) setShowMusicUri(false); // editMode일 때만 검색 시 music_uri 영상 숨김
  };

  useEffect(() => {
    // edit 모드일 때만: 검색 결과/선택된 영상이 모두 사라지면 다시 music_uri 영상 보이게
    if (editMode && setShowMusicUri && videos.length === 0 && !selectedVideo) {
      setShowMusicUri(!!music_uri);
    }
  }, [videos, selectedVideo, music_uri, editMode, setShowMusicUri]);

  function toEmbedUrl(youtubeUrl: string) {
    const match = youtubeUrl.match(/v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : youtubeUrl;
  }

  return (
    <>
      <h2 className="text-base font-semibold text-gray-700">YOUTUBE 선택</h2>
      <div className="space-y-2">
        {music_uri && showMusicUri && (
          <div className="space-y-2 mt-4">
            <iframe
              src={toEmbedUrl(music_uri)}
              className="w-full h-[200px] rounded"
              allowFullScreen
            />
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="border p-2 pl-5 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-[#A2EDB4]"
            placeholder="YOUTUBE 제목 또는 URL 주소를 입력해주세요."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="bg-[#57CC7E] px-3 py-1 rounded"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {videos.map((video) => (
              <div
                key={video.artist + video.music_title}
                className="cursor-pointer border p-2 rounded"
                onClick={() => {
                  setSelectedVideo(video);
                  setStep1({
                    ...step1,
                    video,
                    thumbnail_uri: video.thumbnail_uri,
                  });
                  setVideos([]);
                }}
              >
                <Image
                  src={video.thumbnail_uri}
                  alt={video.music_title}
                  className="w-full h-[140px] object-cover rounded"
                  width={140}
                  height={140}
                />
                <p className="mt-2 text-sm line-clamp-2">{video.music_title}</p>
              </div>
            ))}
          </div>
        ) : selectedVideo ? (
          <div className="space-y-2 mt-4">
            <iframe
              src={toEmbedUrl(selectedVideo.select_url)}
              className="w-full h-[200px] rounded"
              allowFullScreen
            />
            <Input
              label="곡 제목"
              value={selectedVideo?.music_title || ""}
              onChange={(e) =>
                setSelectedVideo({
                  ...selectedVideo,
                  music_title: e.target.value,
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
              className="text-[#57CC7E] underline text-sm mt-2"
              onClick={() => setSelectedVideo(null)}
            >
              ← 다시 선택하기
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
