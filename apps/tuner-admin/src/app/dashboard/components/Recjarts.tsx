'use client'; // Next.js App Router라면 필요

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// 샘플 데이터
const data = [
    { month: 'Jan', reward: 700 },
    { month: 'Feb', reward: 650 },
    { month: 'Mar', reward: 800 },
    { month: 'Apr', reward: 1000 },
    { month: 'May', reward: 1200 },
    { month: 'Jun', reward: 1350 },
];

const RewardLineChart = () => {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="reward"
                        stroke="#8884d8"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
// 요소	커스터마이징 방법
// 선 색상	stroke="#00C49F" 바꾸기
// 툴팁 형식	<Tooltip formatter={(val) => $${val}} />
// Y축 단위	<YAxis tickFormatter={(v) => $${v}} />
export default RewardLineChart;
