"use client";

import Image from "next/image";

const cardItems = [
  {
    id: 1,
    image: "/images/slide1.jpeg",
    singer: "가수1",
    title: "제목1",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 2,
    image: "/images/slide2.jpeg",
    singer: "가수2",
    title: "제목2",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 3,
    image: "/images/slide3.jpeg",
    singer: "가수3",
    title: "제목3",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 4,
    image: "/images/slide4.jpeg",
    singer: "가수4",
    title: "제목4",
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
          <Image
            src={item.image}
            alt={`card ${item.id}`}
            width={120}
            height={160}
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="p-3 space-y-1">
            <p className="text-base font-semibold text-gray-900 truncate">
              {item.title}
            </p>
            <p className="text-sm text-gray-500 truncate">{item.singer}</p>
            <p className="text-xs text-gray-400">{item.period}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
