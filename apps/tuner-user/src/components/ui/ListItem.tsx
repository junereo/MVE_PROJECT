import Image from "next/image";
type Props = {
  image: string;
  singer: string;
  title: string;
  period: string;
};

export default function ListItem({ image, singer, title, period }: Props) {
  return (
    <div className="flex justify-between items-center gap-3 mb-4 p-2 bg-white rounded-xl shadow-sm">
      <Image
        src={image}
        alt={title}
        width={60}
        height={80}
        className="rounded-md"
      />
      <div className="flex-1 ml-2">
        <p className="text-sm font-semibold">{singer}</p>
        <p className="text-base font-bold">{title}</p>
        <p className="text-xs text-gray-500">{period}</p>
      </div>
      <div>
        <button className="text-blue-600 text-sm underline">설문 결과</button>
      </div>
    </div>
  );
}
