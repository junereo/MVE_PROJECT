interface SortOption<T extends string> {
  label: string;
  value: T;
}

interface SortToggleProps<T extends string> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  optionClassName?: string;
}

export default function SortToggle<T extends string>({
  options,
  value,
  onChange,
  optionClassName,
}: SortToggleProps<T>) {
  return (
    <div className={`flex gap-4 text-sm text-gray-500 px-1 ${optionClassName}`}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <span
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer transition-all ${
              isActive
                ? "text-black font-semibold underline underline-offset-4"
                : "hover:text-black"
            }`}
          >
            {option.label}
          </span>
        );
      })}
    </div>
  );
}
