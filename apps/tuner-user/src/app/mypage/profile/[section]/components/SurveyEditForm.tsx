"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/users/store/useUserStore";
import { useEffect, useState } from "react";
import {
  genreMap,
  ageMap,
  GenderKey,
  AgeKey,
  GenreKey,
} from "@/features/users/constants/userInfoMap";
import FormSelect from "./FormSelect";
import Modal from "@/components/ui/Modal";
import { getUserInfo, updateUserInfo } from "@/features/users/services/user";

export default function SurveyEditForm() {
  const router = useRouter();

  const user = useUserStore((state) => state.userInfo);
  const { setUserInfo } = useUserStore();

  const [gender, setGender] = useState<GenderKey>("true");
  const [age, setAge] = useState<AgeKey>("twenties");
  const [genre, setGenre] = useState<GenreKey>("pop");
  const [job, setJob] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    redirectTo: "",
  });

  useEffect(() => {
    if (user) {
      setGender(user.gender ? "true" : "false");
      setAge(user.age as AgeKey);
      setGenre(user.genre as GenreKey);
      setJob(user.job_domain);
    }
  }, [user]);

  if (!user) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setIsModalOpen(false);
    router.push(modalContent.redirectTo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserInfo(user.id, {
        gender: gender === "true",
        age: age as AgeKey,
        genre: genre as GenreKey,
        job_domain: job,
      });

      const res = await getUserInfo(user.id);
      setUserInfo(res.data);

      setModalContent({
        image: "check.png",
        description: "회원 정보 수정을 완료했습니다.",
        buttonLabel: "확인",
        redirectTo: "/mypage/profile",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          image={modalContent.image}
          description={modalContent.description}
          buttonLabel={modalContent.buttonLabel}
          onClick={handleNext}
          onClose={handleClose}
          color={modalContent.image === "check.png" ? "blue" : "red"}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4">
        <FormSelect
          label="성별"
          value={String(gender)}
          onChange={(val) => setGender(val as GenderKey)}
          options={[
            { label: "남성", value: "true" },
            { label: "여성", value: "false" },
          ]}
        />

        <FormSelect
          label="연령대"
          value={age}
          onChange={(val) => setAge(val as AgeKey)}
          options={Object.entries(ageMap).map(([value, label]) => ({
            label,
            value,
          }))}
        />
        <FormSelect
          label="좋아하는 장르"
          value={genre}
          onChange={(val) => setGenre(val as GenreKey)}
          options={Object.entries(genreMap).map(([value, label]) => ({
            label,
            value,
          }))}
        />
        <FormSelect
          label="음악 관련 직무"
          value={String(job)}
          onChange={(val) => setJob(val === "true")}
          options={[
            { label: "예 ", value: "true" },
            { label: "아니오", value: "false" },
          ]}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          수정
        </button>
      </form>
    </>
  );
}
