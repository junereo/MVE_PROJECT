import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "Survey A", value: 400 },
  { name: "Survey B", value: 300 },
  { name: "Survey C", value: 300 },
  { name: "Survey D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const DonutChart = () => (
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
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);
