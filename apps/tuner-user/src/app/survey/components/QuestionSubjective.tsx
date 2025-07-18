interface Props {
  name?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

export default function QuestionSubjective({
  name,
  value = "",
  onChange,
  disabled = false,
}: Props) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      placeholder="여기에 답변을 입력해주세요."
      onChange={(e) => {
        if (!disabled && onChange) {
          onChange(e.target.value);
        }
      }}
      disabled={disabled}
      maxLength={40}
      className="w-full border-b border-gray-300 px-1 py-2 text-sm focus:outline-none focus:border-[#A2EDB4] disabled:bg-transparent disabled:text-gray-400"
    />
  );
}
