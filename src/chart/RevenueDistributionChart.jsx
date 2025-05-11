// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
//   LabelList,
// } from "recharts";

// const RevenueDistributionChart = ({ revenueDistribution }) => {
//   const data = [
//     { name: "Gross Income", value: revenueDistribution.grossIncome, color: "#10B981" },
//     { name: "Net Income", value: revenueDistribution.netIncome, color: "#3B82F6" },
//     { name: "Marketing", value: revenueDistribution.marketingCost, color: "#F59E0B" },
//     { name: "Tax", value: revenueDistribution.totalTax, color: "#EF4444" },
//     { name: "Shipping", value: revenueDistribution.totalShipping, color: "#8B5CF6" },
//     { name: "Discount", value: revenueDistribution.totalDiscount, color: "#EC4899" },
//   ].filter(item => item.value !== undefined && item.value !== null);

//   const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-xl shadow-sm 
//       border border-gray-100 hover:shadow-md transition-shadow duration-300">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Revenue Distribution
//         </h2>
//         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//           INR
//         </span>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 10, right: 100, left: 20, bottom: 50 }} // Increased right margin for spacing
//           barSize={24}
//         >
//           <XAxis
//             dataKey="name"
//             axisLine={false}
//             tickLine={false}
//             tick={{ 
//               fill: "#6B7280", 
//               fontSize: 12,
//               angle: -45,
//               textAnchor: "end",
//               dy: 10
//             }}
//             interval={0}
//           />
//           <YAxis
//             axisLine={false}
//             tickLine={false}
//             tick={{ fill: "#9CA3AF", fontSize: 12 }}
//             tickFormatter={formatCurrency}
//           />
//           <Tooltip
//             cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
//             contentStyle={{
//               background: "white",
//               border: "none",
//               borderRadius: 8,
//               boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//               padding: "8px 12px",
//               fontSize: "14px",
//             }}
//             formatter={(value) => formatCurrency(value)}
//             labelStyle={{ color: "#111827", marginBottom: 4 }}
//           />
//           <Bar 
//             dataKey="value" 
//             radius={[4, 4, 0, 0]}
//           >
//             {data.map((entry, index) => (
//               <Cell 
//                 key={`cell-${index}`} 
//                 fill={entry.color}
//               />
//             ))}
//             <LabelList
//               dataKey="value"
//               position="top"
//               formatter={formatCurrency}
//               fill="#374151"
//               fontSize={12}
//               offset={8}
//             />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>

//       <div className="mt-4 flex flex-wrap gap-3 justify-center">
//         {data.map((item) => (
//           <div key={item.name} className="flex items-center gap-2">
//             <div 
//               className="w-3 h-3 rounded-full" 
//               style={{ backgroundColor: item.color }}
//             />
//             <span className="text-xs text-gray-600">{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RevenueDistributionChart;


import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const RevenueDistributionChart = ({ revenueDistribution }) => {
  const data = [
    { name: "Gross Income", value: revenueDistribution.grossIncome, color: "#10B981" },
    { name: "Net Income", value: revenueDistribution.netIncome, color: "#3B82F6" },
    { name: "Marketing", value: revenueDistribution.marketingCost, color: "#F59E0B" },
    { name: "Tax", value: revenueDistribution.totalTax, color: "#EF4444" },
    { name: "Shipping", value: revenueDistribution.totalShipping, color: "#8B5CF6" },
    { name: "Discount", value: revenueDistribution.totalDiscount, color: "#EC4899" },
  ].filter(item => item.value !== undefined && item.value !== null);

  const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-xl 
      border border-gray-100  transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Revenue Distribution
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          INR
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 40, left: 80, bottom: 20 }}
          barSize={24}
        >
          <XAxis
            type="number"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={formatCurrency}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#6B7280", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              background: "white",
              border: "none",
              borderRadius: 8,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              padding: "8px 12px",
              fontSize: "14px",
            }}
            labelStyle={{ color: "#111827" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={formatCurrency}
              fill="#374151"
              fontSize={12}
              offset={8}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueDistributionChart;
