import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaGenderless } from "react-icons/fa";

const COLORS = ["#8b5cf6", "#ec4899", "#10b981"]; // Indigo, Pink, Emerald

const GenderChart = ({ data }) => {
  const formattedData = data?.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
  }));

  return (
    <div className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl p-6 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FaGenderless className="text-indigo-500" />
          Gender Distribution
        </h2>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              innerRadius={55}
              fill="#8884d8"
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {formattedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              wrapperClassName="!bg-white/90 !backdrop-blur-md text-sm !rounded-lg !shadow-lg"
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => <span className="text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenderChart;
