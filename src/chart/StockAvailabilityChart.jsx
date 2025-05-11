import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#16a34a", "#dc2626"]; // Green & Red

const StockAvailabilityChart = ({ stockAvailability }) => {
  const data = [
    { name: "In Stock", value: stockAvailability.inStock },
    { name: "Out of Stock", value: stockAvailability.outOfStock },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl  w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Product Stock Availability
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockAvailabilityChart;
