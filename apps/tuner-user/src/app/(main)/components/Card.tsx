"use client";

import Image from "next/image";

const cardItems = [
  {
    id: 1,
    thumbnail_url: `https://i.ytimg.com/vi/LBHVOiw274A/sddefault.jpg`,
    artist: "Beenzino (빈지노)",
    title: "Fashion Hoarder (Feat. ZENE THE ZILLA)",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 2,
    thumbnail_url: `https://i.ytimg.com/vi/08h8u8Z9iJQ/sddefault.jpg`,
    artist: "Beenzino (빈지노)",
    title: "Aqua Man",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 3,
    thumbnail_url: `https://i.ytimg.com/vi/UDyPp9bkfD0/sddefault.jpg`,
    artist: "DPR LIVE",
    title: "Martini Blue",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 4,
    thumbnail_url: `https://i.ytimg.com/vi/ppudgIu2TaM/sddefault.jpg`,
    artist: "Jazzyfact (재지팩트)",
    title: "아까워",
    period: "25.06.19 - 25.06.26",
  },
];

export default function Card() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cardItems.map((item) => (
        <div
          key={item.id}
          className="rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden"
        >
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={item.thumbnail_url}
              alt={`card ${item.id}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="p-3 space-y-1">
            <p className="text-base font-semibold text-gray-900 truncate">
              {item.title}
            </p>
            <p className="text-sm text-gray-500 truncate">{item.artist}</p>
            <p className="text-xs text-gray-400">{item.period}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
