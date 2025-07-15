import Image from "next/image";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Button from "@/components/ui/Button";

export default function ThumbnailUploader() {
  const { step1, setStep1 } = useSurveyStore();

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setStep1({ thumbnail_uri: result });
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleDelete = () => {
    setStep1({ thumbnail_uri: "" });
  };

  return (
    <>
      <h2 className="text-base font-semibold text-gray-700">이미지 업로드</h2>
      <div className="flex flex-col items-center">
        {step1.thumbnail_uri ? (
          <div className="w-full h-[180px] relative border mb-2 rounded overflow-hidden bg-white">
            <Image
              alt="설문 업로드 사진"
              src={step1.thumbnail_uri}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-[180px] border-2 border-dashed border-gray-400 rounded flex items-center justify-center mb-2">
            <span className="text-gray-500">
              이미지 업로드하지 않을 시<div /> 유튜브 썸네일로 설문이
              생성됩니다.
            </span>
          </div>
        )}
        <Button onClick={handleUpload} color="blue">
          이미지 업로드
        </Button>
        {step1.thumbnail_uri && (
          <Button onClick={handleDelete} color="white">
            삭제
          </Button>
        )}
      </div>
    </>
  );
}
