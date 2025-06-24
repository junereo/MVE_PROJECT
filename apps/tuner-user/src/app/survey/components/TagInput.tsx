"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
        setInput("");
      }
    } else if (e.key === "Backspace" && input === "") {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex flex-wrap gap-2 border rounded px-2 py-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"
          >
            #{tag}
            <button onClick={() => removeTag(tag)} className="text-xs">
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[120px] text-sm py-1 outline-none"
          placeholder={placeholder || "태그를 입력 후 Enter"}
        />
      </div>
    </div>
  );
}
