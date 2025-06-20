"use client";

import Accordion from "../../../components/ui/Accordion";

const items = [
  { id: 1, title: "첫 번째 아코디언", content: "첫 번째 아코디언 내용" },
  { id: 2, title: "두 번째 아코디언", content: "두 번째 아코디언 내용" },
  { id: 3, title: "세 번째 아코디언", content: "세 번째 아코디언 내용" },
];

export default function SutveyAccordion() {
  return (
    <div>
      {items.map((item) => (
        <Accordion key={item.id} title={item.title} content={item.content} />
      ))}
    </div>
  );
}
