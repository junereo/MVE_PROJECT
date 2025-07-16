import { DonutChart, COLORS } from '@/app/dashboard/components/DonutChart';

interface DonutChartWithLegendProps {
    title: string;
    data: {
        name: string;
        value: number;
    }[];
}

const DonutChartWithLegend = ({ title, data }: DonutChartWithLegendProps) => {
    return (
        <div className=" rounded-xl shadow p-4 flex flex-row items-center pl-20">
            {/* 왼쪽: 도넛 */}
            <div className="min-w-[160px] flex items-center justify-center">
                <DonutChart
                    data={data}
                    colors={
                        title === '성별 참여 비율'
                            ? ['#4A90E2', '#F06292'] // 남성:파랑, 여성:분홍
                            : COLORS
                    }
                />
            </div>

            {/* 오른쪽: 레전드 */}
            <div className="flex-1">
                <h4 className="text-xl font-bold pl-20 mb-3">{title}</h4>
                <ul className="space-y-2 text-base">
                    {data.map((item, index) => {
                        // 성별일 경우 고정 색상 부여
                        const customColor =
                            title === '성별 참여 비율'
                                ? item.name === '남성'
                                    ? '#4A90E2' // 파랑
                                    : '#F06292' // 분홍
                                : COLORS[index % COLORS.length];

                        return (
                            <li
                                key={index}
                                className="flex items-center gap-2 text-sm pl-20 py-1"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: customColor,
                                    }}
                                />
                                <span>
                                    {item.name} ({item.value}명)
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default DonutChartWithLegend;
