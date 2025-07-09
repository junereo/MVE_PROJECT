// components/SummaryCard.tsx
interface SummaryCardProps {
    title: string;
    value: string;
    trend: string;
    percentage: string;
}

const SummaryCard = ({ title, value, trend, percentage }: SummaryCardProps) => {
    return (
        <div className="w-1/4 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {value}
                    </h3>
                </div>
                <div className="bg-gray-100 text-xs text-green-600 font-semibold px-2 py-1 rounded-full">
                    {percentage}
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">{trend} ⬈</p>
            <p className="text-xs text-gray-400">
                Visitors for the last 6 months
            </p>
        </div>
    );
};

export default SummaryCard;
