import { InputTypeEnum } from "@/features/survey/types/enums";

interface Props {
  options: string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  type?: InputTypeEnum;
  optionClassName?: string;
  layout?: "vertical" | "horizontal";
  disabled?: boolean;
  label?: string;
}

export default function QuestionOptions({
  options,
  value,
  onChange,
  type,
  optionClassName = "",
  layout = "vertical",
  disabled = false,
  label,
}: Props) {
  const isMulti = type === InputTypeEnum.CHECKBOX;

  const handleClick = (opt: string) => {
    if (disabled || !onChange) return;

    if (isMulti) {
      const selected = Array.isArray(value) ? value : [];
      const newValue = selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt];
      onChange(newValue);
    } else {
      onChange(opt);
    }
  };

  return (
    <div
      className={layout === "horizontal" ? "flex flex-wrap gap-2" : "space-y-2"}
    >
      {options.map((opt) => {
        const isSelected = disabled
          ? false
          : isMulti
          ? Array.isArray(value) && value.includes(opt)
          : value === opt;

        return (
          <>
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(opt)}
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
          </>
        );
      })}
    </div>
  );
}
