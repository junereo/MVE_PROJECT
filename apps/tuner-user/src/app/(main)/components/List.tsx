"use client";

import ListItem from "../../../components/ui/ListItem";

const ListItems = [
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

export default function List() {
  return (
    <div className="flex flex-col gap-3">
      {ListItems.map((item) => (
        <ListItem
          key={item.id}
          image={item.image}
          singer={item.singer}
          title={item.title}
          period={item.period}
        />
      ))}
    </div>
  );
}
