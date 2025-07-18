interface Props {
  value: number | null;
  onChange: (val: number) => void;
}

export default function QuestionScore({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 text-center text-sm">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          className={`py-2 rounded border ${
            value === num
              ? "bg-[	#57CC7E] text-white border-[	#57CC7E]"
              : "bg-white text-gray-700"
          }`}
          onClick={() => onChange(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
