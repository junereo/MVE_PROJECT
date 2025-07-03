interface Props {
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

export default function QuestionSubjective({
  value = "",
  onChange,
  disabled = false,
}: Props) {
  return (
    <textarea
      className="w-full min-h-[100px] px-4 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      placeholder="여기에 답변을 입력해 주세요."
      value={value}
      onChange={(e) => {
        if (!disabled && onChange) {
          onChange(e.target.value);
        }
      }}
      disabled={disabled}
      maxLength={300}
    />
  );
}
