import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  DELIVERED: "#22c55e",   // green
  PROCESSING: "#3b82f6",  // blue
  PENDING: "#f59e0b",     // amber
};

const OrderStatusPieChart = ({ status }) => {


  const formattedData = status.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  if(status.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl  w-full max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Status Distribution</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl  w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Status Distribution</h2>
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
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || "#a3a3a3"}
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

export default OrderStatusPieChart;
