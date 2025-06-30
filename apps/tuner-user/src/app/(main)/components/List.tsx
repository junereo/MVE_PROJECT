"use client";

import ListItem from "../../../components/ui/ListItem";

const ListItems = [
  {
    id: 1,
    thumbnail_url: `https://i.ytimg.com/vi/LBHVOiw274A/hqdefault.jpg`,
    artist: "Beenzino (빈지노)",
    title: "Fashion Hoarder (Feat. ZENE THE ZILLA)",
    surveyTitle: "Fashion Hoarder 설문",
    period: "25.06.19 - 25.06.26",
    status: "종료",
    participants: 48,
    reward: 435,
  },
  {
    id: 2,
    thumbnail_url: `https://i.ytimg.com/vi/08h8u8Z9iJQ/hqdefault.jpg`,
    artist: "Beenzino (빈지노)",
    title: "Aqua Man",
    surveyTitle: "Aqua Man 설문",
    period: "25.06.19 - 25.06.26",
    status: "종료",
    participants: 70,
    reward: 435,
  },
  {
    id: 3,
    thumbnail_url: `https://i.ytimg.com/vi/UDyPp9bkfD0/hqdefault.jpg`,
    artist: "DPR LIVE",
    title: "Martini Blue",
    surveyTitle: "Martini Blue 설문",
    period: "25.06.19 - 25.06.26",
    status: "종료",
    participants: 26,
    reward: 435,
  },
  {
    id: 4,
    thumbnail_url: `https://i.ytimg.com/vi/ppudgIu2TaM/hqdefault.jpg`,
    artist: "Jazzyfact (재지팩트)",
    title: "아까워",
    surveyTitle: "아까워 설문",
    period: "25.06.19 - 25.06.26",
    status: "종료",
    participants: 39,
    reward: 125,
  },
] as const;

export default function List() {
  return (
    <div className="flex flex-col gap-3">
      {ListItems.map((item) => (
        <ListItem
          key={item.id}
          image={item.thumbnail_url}
          artist={item.artist}
          title={item.title}
          surveyTitle={item.surveyTitle}
          period={item.period}
          status={item.status}
          participants={item.participants}
          reward={item.reward}
        />
      ))}
    </div>
  );
}
