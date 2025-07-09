export default function ParticipantStats() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center text-sm sm:text-base text-gray-600">
      <div className="bg-gray-50 border rounded-xl p-3 sm:p-4">
        여성 비율
        <br />
        <span className="text-lg sm:text-xl font-bold text-gray-800">55%</span>
      </div>
      <div className="bg-gray-50 border rounded-xl p-3 sm:p-4">
        음악 종사자
        <br />
        <span className="text-lg sm:text-xl font-bold text-gray-800">38%</span>
      </div>
      <div className="bg-gray-50 border rounded-xl p-3 sm:p-4">
        20대 비율
        <br />
        <span className="text-lg sm:text-xl font-bold text-gray-800">62%</span>
      </div>
    </div>
  );
}
