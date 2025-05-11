import { FaMoneyCheckAlt, FaTruck, FaClock, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const statusColorMap = {
  PENDING: "bg-yellow-100 text-yellow-600",
  PROCESSING: "bg-blue-100 text-blue-600",
  DELIVERED: "bg-green-100 text-green-600",
};

const statusIconMap = {
  PENDING: <FaClock />,
  PROCESSING: <FaSpinner className="animate-spin" />,
  DELIVERED: <FaTruck />,
};

const TransactionCard = ({ transactions }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl  p-6 ">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Transactions</h3>
      <div className="space-y-4">
        {transactions.map((tx, idx) => (
          <motion.div
            key={tx._id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 shadow-sm">
                <FaMoneyCheckAlt />
              </div>
              <div className="text-sm space-y-1 max-w-[180px]">
                <p className="font-semibold text-gray-700 truncate" title={tx._id}>
                  {tx._id.toUpperCase()}
                </p>
                <p className="text-gray-500 text-xs">Quantity: {tx.quantity}</p>
                <p className="text-gray-500 text-xs">Discount: {tx.discount}%</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="font-bold text-lg text-gray-800">
                ₹{tx.totalPrice.toLocaleString()}
              </p>
              <div
                className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${statusColorMap[tx.status]}`}
              >
                {statusIconMap[tx.status]} {tx.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionCard;
