import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
    data: {
        name: string;
        value: number;
    }[];
    colors?: string[];
}

export const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A28EFF',
    '#FF69B4',
];

export const DonutChart = ({ data, colors }: DonutChartProps) => (
    <PieChart width={300} height={300}>
        <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
        >
            {data.map((entry, index) => (
                <Cell
                    key={`cell-${index}`}
                    fill={
                        colors?.length
                            ? colors[index % colors.length]
                            : COLORS[index % COLORS.length]
                    }
                />
            ))}
        </Pie>
        <Tooltip />
        <Legend />
    </PieChart>
);
