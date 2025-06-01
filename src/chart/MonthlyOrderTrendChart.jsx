import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyOrderTrendChart = ({ data }) => {
  const chartData = [...data]
    .reverse() 
    .map((item) => ({
      name: `${item.month.slice(0, 3)} '${item.year.toString().slice(-2)}`,
      orders: item.orderCount,
    }));

  return (
    <div className="bg-white p-6  border-t-2 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Monthly Order Trends
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => `${value} orders`}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              color: "#111827",
            }}
          />
          <Line
            type="monotone"
            dataKey="orders"
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

export default MonthlyOrderTrendChart;
