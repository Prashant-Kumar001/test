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

const SixMonthRevenueBarChart = ({ sixMonthOrders }) => {
  const data = sixMonthOrders
    ?.map((item) => ({
      name: `${item.month.slice(0, 3)} '${String(item.year).slice(2)}`, // Apr '25
      revenue: item.revenue,
    }))
    .reverse(); 

  return (
    <div className="bg-white p-6 rounded-2xl  w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Revenue - Last 6 Months
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={28} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(val) => `₹${val}`}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `₹${value}`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="revenue" position="top" formatter={(v) => `₹${v}`} fill="#374151" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SixMonthRevenueBarChart;
