interface SurveyActionsProps {
  onTempSave: () => void;
  onComplete: () => void;
}

export default function SurveyActions({
  onTempSave,
  onComplete,
}: SurveyActionsProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        className="bg-gray-400 text-white px-6 py-2 rounded"
        onClick={onTempSave}
      >
        임시 저장
      </button>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded"
        onClick={onComplete}
      >
        설문지 생성 완료
      </button>
    </div>
  );
}
