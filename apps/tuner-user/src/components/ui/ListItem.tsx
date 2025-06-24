import Image from "next/image";

type Props = {
  image: string;
  artist: string;
  title: string;
  period: string;
};

export default function ListItem({ image, artist, title, period }: Props) {
  return (
    <div className="flex items-center gap-4 p-2 hover:shadow-md transition">
      <Image
        src={image}
        alt={title}
        width={60}
        height={80}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold">{artist}</p>
        <p className="text-base font-bold">{title}</p>
        <p className="text-xs text-gray-500">{period}</p>
      </div>
      <div>
        <button className="text-blue-600 text-sm underline">설문 결과</button>
      </div>
    </div>
  );
}
