import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const TwelveMonthOrdersBarChart = ({ twelveMonthOrders }) => {
  const data = twelveMonthOrders
    ?.map((item) => ({
      name: `${item.month.slice(0, 3)} '${String(item.year).slice(2)}`,
      orders: item.orderCount,
    }))
    .reverse(); // Reverse to show from oldest to newest

  return (
    <div className="bg-white p-6 border-t-2  w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Orders - Last 12 Months
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          barSize={26}
          margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `${value} orders`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar dataKey="orders" fill="#10B981" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="orders" position="top" fill="#374151" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TwelveMonthOrdersBarChart;
