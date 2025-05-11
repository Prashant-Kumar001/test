import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EC4899", "#3B82F6"];

const CategoryPieChart = ({ categories }) => {
  const pieData = categories.map((cat) => ({
    name: cat,
    value: 1,
  }));

  if(categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl  w-full max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Categories</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl  w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Categories</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
