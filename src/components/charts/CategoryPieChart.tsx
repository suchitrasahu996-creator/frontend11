import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  'hsl(168, 80%, 36%)', 'hsl(262, 60%, 55%)', 'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)', 'hsl(200, 80%, 50%)', 'hsl(330, 70%, 50%)',
  'hsl(90, 60%, 45%)', 'hsl(280, 50%, 60%)',
];

interface CategoryPieChartProps {
  data: Array<{ category: string; amount: number }>;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="amount"
          nameKey="category"
          paddingAngle={4}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))',
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
