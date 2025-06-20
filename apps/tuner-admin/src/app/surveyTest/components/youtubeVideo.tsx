// components/youtubeVideo.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSurveyStore } from "@/store/surceyStore";

const YoutuveVideo = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const title = searchParams.get("title");
  const thumbnail = searchParams.get("thumbnail");

  const { setStep1 } = useSurveyStore();

  // 쿼리 파라미터가 존재할 경우 Zustand에 저장
  useEffect(() => {
    if (videoId && title && thumbnail) {
      setStep1({
        youtubeVideoId: videoId,
        youtubeTitle: title,
        youtubeThumbnail: thumbnail,
      });
    }
  }, [videoId, title, thumbnail, setStep1]);

  return (
    <div>
      {videoId && (
        <div>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              className="w-[800px] h-[400px]"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title || "YouTube video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <h2 className="text-xl mt-2">{title}</h2>
        </div>
      )}
    </div>
  );
};

export default YoutuveVideo;
