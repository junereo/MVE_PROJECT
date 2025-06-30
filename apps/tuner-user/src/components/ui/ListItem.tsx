import Image from "next/image";
import clsx from "clsx";

type Props = {
  image: string;
  artist: string;
  title: string;
  surveyTitle: string;
  period: string;
  status: "예정" | "진행중" | "종료";
  participants: number;
  reward?: number;
};

const statusColorMap = {
  예정: "bg-yellow-100 text-yellow-700",
  진행중: "bg-green-100 text-green-700",
  종료: "bg-gray-100 text-gray-500",
};

export default function ListItem({
  image,
  artist,
  title,
  surveyTitle,
  period,
  status,
  participants,
  reward,
}: Props) {
  return (
    <div className="flex gap-3 items-center p-3 sm:p-4 md:p-5 rounded-md border hover:shadow-sm transition bg-white w-full max-w-[485px] sm:max-w-[600px] md:max-w-[700px] mx-auto">
      <div className="relative w-[100px] h-[60px] sm:w-[140px] sm:h-[80px] rounded overflow-hidden border shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100px, 140px"
        />
      </div>

      <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
        <p className="text-xs sm:text-sm text-gray-500 truncate">
          {artist} - {title}
        </p>
        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
          {surveyTitle}
        </p>
        <p className="text-xs sm:text-sm text-gray-400">{period}</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={clsx(
            "px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded-full whitespace-nowrap",
            statusColorMap[status]
          )}
        >
          {status}
        </span>
        <p className="text-[11px] sm:text-xs text-gray-600 whitespace-nowrap">
          {participants}명 참여
        </p>
        {reward !== undefined && (
          <p className="text-xs sm:text-sm text-orange-500 font-medium">
            🎁 {reward} STK
          </p>
        )}
      </div>
    </div>
  );
}
