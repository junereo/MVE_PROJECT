import Image from "next/image";

type Props = {
  image: string;
  artist: string;
  title: string;
  period: string;
  reward: string;
};

export default function MusicCard({
  image,
  artist,
  title,
  period,
  reward,
}: Props) {
  return (
    <div className="flex items-center gap-4 p-2">
      <Image
        src={image}
        alt={`${title} Music Info`}
        width={120}
        height={160}
        className="rounded-md object-cover"
      />
      <div>
        <p>{artist}</p>
        <p>{title}</p>
        <p>{period}</p>
        <p>{reward}</p>
      </div>
    </div>
  );
}
