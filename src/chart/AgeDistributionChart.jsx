import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AgeDistributionChart = ({ ageDistribution }) => {
  const chartData = Object.entries(ageDistribution).map(([range, count]) => ({
    ageRange: range,
    count,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl  w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Age Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ageRange" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeDistributionChart;
