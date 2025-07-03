interface Props {
  text: string;
}

export default function QuestionText({ text }: Props) {
  return <p className="font-semibold mb-2 text-base text-gray-900">{text}</p>;
}
