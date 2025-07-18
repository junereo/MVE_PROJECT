import { useState } from "react";
import Image from "next/image";

interface YoutubeThumbnailPlayerProps {
  thumbnail: string;
  youtubeUrl: string;
  title: string;
  badgeText?: string;
  type?: "official" | "general";
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match?.[1] ?? "";
}

export default function YoutubeThumbnailPlayer({
  thumbnail,
  youtubeUrl,
  title,
  badgeText,
  type,
}: YoutubeThumbnailPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const youtubeId = extractYoutubeId(youtubeUrl);

  return (
    <div className="relative w-full aspect-video rounded-xl mb-6 shadow-md overflow-hidden">
      {showPlayer ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={() => setShowPlayer(true)}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Image src="/icons/play.svg" alt="재생" width={60} height={60} />
          </div>
          {badgeText && (
            <div
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm
                ${
                  type === "official"
                    ? "bg-[#57CC7E] text-white"
                    : "bg-gray-100 text-[#57CC7E]"
                }
              `}
            >
              {badgeText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
