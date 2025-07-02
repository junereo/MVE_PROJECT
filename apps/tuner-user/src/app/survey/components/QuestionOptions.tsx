interface Props {
  options: string[];
  selected?: string;
  onChange?: (value: string) => void;
  optionClassName?: string;
  layout?: "vertical" | "horizontal";
  disabled?: boolean;
}

export default function QuestionOptions({
  options,
  selected = "",
  onChange,
  optionClassName = "",
  layout = "vertical",
  disabled = false,
}: Props) {
  return (
    <div
      className={layout === "horizontal" ? "flex flex-wrap gap-2" : "space-y-2"}
    >
      {options.map((opt) => {
        const isSelected = selected === opt;

        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled && onChange) {
                onChange(opt);
              }
            }}
            className={`
              px-4 py-2 text-sm rounded-xl border transition-all
              ${
                isSelected
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-800 border-gray-300"
              }
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-blue-500"
              }
              ${optionClassName}
            `}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
