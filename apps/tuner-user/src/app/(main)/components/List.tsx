"use client";

import ListItem from "../../../components/ui/ListItem";

const ListItems = [
  {
    id: 1,
    thumbnail_url: `https://i.ytimg.com/vi/LBHVOiw274A/hqdefault.jpg`,
    artist: "Beenzino (빈지노)",
    title: "Fashion Hoarder (Feat. ZENE THE ZILLA)",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 2,
    thumbnail_url: `https://i.ytimg.com/vi/08h8u8Z9iJQ/hqdefault.jpg`,
    artist: "Beenzino (빈지노)",
    title: "Aqua Man",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 3,
    thumbnail_url: `https://i.ytimg.com/vi/UDyPp9bkfD0/hqdefault.jpg`,
    artist: "DPR LIVE",
    title: "Martini Blue",
    period: "25.06.19 - 25.06.26",
  },
  {
    id: 4,
    thumbnail_url: `https://i.ytimg.com/vi/ppudgIu2TaM/hqdefault.jpg`,
    artist: "Jazzyfact (재지팩트)",
    title: "아까워",
    period: "25.06.19 - 25.06.26",
  },
];

export default function List() {
  return (
    <div className="flex flex-col gap-3">
      {ListItems.map((item) => (
        <ListItem
          key={item.id}
          image={item.thumbnail_url}
          artist={item.artist}
          title={item.title}
          period={item.period}
        />
      ))}
    </div>
  );
}
