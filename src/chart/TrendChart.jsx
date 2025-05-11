import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { FiBarChart2 } from "react-icons/fi";

const RevenueOrdersChart = ({ revenueData, orderData }) => {
  const mergedData = revenueData.map((revItem) => {
    const orderItem = orderData.find(
      (o) => o.month === revItem.month && o.year === revItem.year
    );
    return {
      name: `${revItem.month.slice(0, 3)} '${String(revItem.year).slice(-2)}`,
      revenue: revItem.revenue,
      orders: orderItem?.orderCount || 0,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl p-6 "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiBarChart2 className="text-indigo-500" />
            Revenue & Orders
          </h2>
          <p className="text-sm text-gray-500 mt-1">Past 6 Months Performance</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <AreaChart
          data={mergedData}
          margin={{ top: 30, right: 60, left: 40, bottom: 10 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="name"
            tick={{ fill: "#4B5563", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            domain={[0, (dataMax) => dataMax + dataMax * 0.2]}
            orientation="left"
            tickFormatter={(v) =>
              v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`
            }
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />

          <YAxis
            yAxisId="right"
            domain={[0, (dataMax) => dataMax + 5]}
            orientation="right"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />

          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "0.85rem",
              color: "#111827",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value, name) =>
              name === "Revenue" ? `₹${value}` : value
            }
          />

          <Legend verticalAlign="top" height={36} iconType="circle" />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#22c55e"
            fill="url(#revenueGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#6366F1"
            fill="url(#ordersGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RevenueOrdersChart;
