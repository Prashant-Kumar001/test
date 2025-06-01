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

const RevenueTrendChart = ({ data }) => {
  const formattedData = data
    .map((item) => ({
      name: `${item.month.slice(0, 3)} '${item.year.toString().slice(-2)}`,
      revenue: item.revenue,
    }))
    .reverse();

  return (
    <div className="bg-white p-6 border-t-2 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Revenue Trend
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
          <YAxis
            tickFormatter={(value) => `₹${value}`}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendChart;
