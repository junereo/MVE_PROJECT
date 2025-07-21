import Image from "next/image";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import Button from "@/components/ui/Button";

export default function ThumbnailUploader() {
  const { step1, setStep1 } = useSurveyStore();

  const imageSrc = step1.thumbnail_uri || step1.video?.thumbnail_uri || "";

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
    <div className="pt-4 pb-4">
      <div className="mb-4 space-y-1">
        <h2 className="text-base font-semibold text-gray-800">
          썸네일 이미지 업로드
        </h2>
        <p className="text-sm text-gray-500">
          이미지를 업로드하지 않으면 유튜브 썸네일이 자동으로 사용됩니다.
        </p>
      </div>

      <div className="flex flex-col items-center">
        {imageSrc ? (
          <div className="w-full h-[180px] relative border mb-2 rounded overflow-hidden bg-white">
            <Image
              alt="설문 업로드 사진"
              src={imageSrc}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-[180px] border-2 border-dashed border-gray-400 rounded flex items-center justify-center mb-2">
            <span className="text-gray-500">
              썸네일 이미지를 업로드해주세요.
            </span>
          </div>
        )}

        <Button onClick={handleUpload} color="black">
          이미지 업로드
        </Button>

        {step1.thumbnail_uri && (
          <Button onClick={handleDelete} color="white">
            삭제
          </Button>
        )}
      </div>
    </div>
  );
}
