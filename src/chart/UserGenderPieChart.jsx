import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#f472b6", "#60a5fa"]; // pink for female, blue for male

const UserGenderPieChart = ({ users }) => {
  const formattedData = users.map((item) => ({
    name: item._id === "femail" ? "Female" : "Male",
    value: item.count,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl  w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">User Gender Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
            dataKey="value"
          >
            {formattedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGenderPieChart;
