export default function TrendHighlight({ genre }: { genre: string }) {
  return (
    <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 sm:p-5 text-sm sm:text-base text-yellow-800 leading-snug sm:leading-normal">
      🔥 참여자들이 가장 많이 선택한 장르는 <strong>{genre}</strong>입니다.
    </div>
  );
}
