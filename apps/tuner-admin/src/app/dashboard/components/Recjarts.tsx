'use client';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface RewardLineChartProps {
    data: { date?: string; month?: string; participants: number }[];
    viewMode: '주간' | '월간';
}

const RewardLineChart = ({ data, viewMode }: RewardLineChartProps) => {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        interval={0}
                        scale="point"
                        tickFormatter={(val: string) => {
                            if (viewMode === '주간') {
                                const weekday = new Date(val).getDay(); // 0 ~ 6
                                const weekdays = [
                                    '일',
                                    '월',
                                    '화',
                                    '수',
                                    '목',
                                    '금',
                                    '토',
                                ];
                                return weekdays[weekday];
                            }
                            // 월간일 경우
                            const m = val.split('-')[1];
                            return `${parseInt(m)}월`;
                        }}
                    />
                    <YAxis tickFormatter={(v) => `${v}명`} />
                    <Tooltip formatter={(val: number) => `${val}명`} />
                    <Line
                        type="monotone"
                        dataKey="participants"
                        stroke="#00C49F"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RewardLineChart;
