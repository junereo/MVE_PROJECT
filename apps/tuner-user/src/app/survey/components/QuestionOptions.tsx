interface Props {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function QuestionOptions({
  options,
  selected,
  onChange,
}: Props) {
  return (
    <div className="space-y-2 mb-4">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="radio-group"
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(opt)}
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}
