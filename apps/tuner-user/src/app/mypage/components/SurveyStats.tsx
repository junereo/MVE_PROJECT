interface Props {
  title: string;
  stats: { label: string; value: number }[];
  onClick?: () => void;
}

export default function SurveyStats({ title, stats, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 ${
        onClick ? "cursor-pointer hover:shadow-sm transition" : ""
      }`}
    >
      <h2 className="text-base font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="grid grid-flow-col grid-row-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
