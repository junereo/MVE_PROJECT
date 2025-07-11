import { InputTypeEnum } from "@/features/survey/types/enums";

interface Props {
  options: string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  maxSelect?: number;
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
  type = InputTypeEnum.MULTIPLE,
  maxSelect,
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

      const alreadySelected = selected.includes(opt);
      const newValue = alreadySelected
        ? selected.filter((v) => v !== opt)
        : [...selected, opt];

      // ✅ 선택 제한 조건: 새 항목 선택 + max 초과일 때 막기
      if (!alreadySelected && maxSelect && selected.length >= maxSelect) {
        return;
      }

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
        const selected = isMulti
          ? Array.isArray(value) && value.includes(opt)
          : value === opt;

        const isMaxed =
          isMulti &&
          maxSelect !== undefined &&
          Array.isArray(value) &&
          value.length >= maxSelect;

        const isDisabled = disabled || (isMaxed && !selected);

        return (
          <button
            key={opt}
            type="button"
            disabled={isDisabled}
            onClick={() => handleClick(opt)}
            className={`
              px-4 py-2 text-sm rounded-xl border transition-all
              ${
                selected
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-800 border-gray-300"
              }
              ${
                isDisabled
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
