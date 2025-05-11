import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ProductTrendChart = ({ data }) => {
  const formattedData = data
    .map((item) => ({
      name: `${item.month.slice(0, 3)} '${item.year.toString().slice(-2)}`,
      products: item.productCount,
    }))
    .reverse();

  return (
    <div className="bg-white p-6 rounded-2xl ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Product Count Trend
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="products"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductTrendChart;
