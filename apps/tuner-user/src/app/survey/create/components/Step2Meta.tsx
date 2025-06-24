"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DatePicker from "../../components/DataPicker";
import TagInput from "../../components/TagInput";
import Select from "@/components/ui/Select";
import { useState } from "react";

interface Step2Props {
  onNext: () => void;
}

const genreOptions = [
  { value: "rnb", label: "R&B" },
  { value: "hiphop", label: "Hip-Hop" },
  { value: "pop", label: "Pop" },
  { value: "ballad", label: "Ballad" },
  { value: "indie", label: "Indie" },
];

export default function Step2Meta({ onNext }: Step2Props) {
  const [releaseType, setReleaseType] = useState<
    "released" | "unreleased" | null
  >(null);
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Step 2: 음원 정보</h2>

      <Input label="설문 제목" placeholder="예) 6월 감성 R&B 설문" />

      <div className="space-y-2">
        <div className="text-sm font-medium">음원 상태</div>
        <div className="flex gap-2">
          <Button
            color={releaseType === "unreleased" ? "blue" : "white"}
            onClick={() => setReleaseType("unreleased")}
          >
            미발매
          </Button>
          <Button
            color={releaseType === "released" ? "blue" : "white"}
            onClick={() => setReleaseType("released")}
          >
            발매
          </Button>
        </div>
      </div>

      {releaseType === "released" && (
        <DatePicker
          label="발매일"
          selected={releaseDate}
          onChange={(date) => setReleaseDate(date)}
        />
      )}

      <Select
        label="음악 장르"
        options={genreOptions}
        value={genre}
        onChange={(value) => setGenre(value)}
        placeholder="장르 선택"
      />

      <TagInput
        label="해시태그"
        placeholder="예: 감성, 여름, R&B"
        tags={tags}
        onChange={(newTags) => setTags(newTags)}
      />

      <div className="flex justify-between pt-4">
        <Button color="white">이전</Button>
        <Button color="blue" onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
