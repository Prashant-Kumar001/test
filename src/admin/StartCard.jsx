import { motion } from "framer-motion";
import {
    FiTrendingUp,
    FiTrendingDown,
    FiMinus,
    FiPackage,
} from "react-icons/fi";

const colorMap = {
    green: { text: "text-green-500", bar: "bg-green-500" },
    red: { text: "text-red-500", bar: "bg-red-500" },
    blue: { text: "text-blue-500", bar: "bg-blue-500" },
    purple: { text: "text-purple-500", bar: "bg-purple-500" },
    gray: { text: "text-gray-500", bar: "bg-gray-500" },
};

const StatCard = ({
    title,
    value,
    color = "gray",
    rate = 0,
    percentage = 0,
    change = 0,
    icon: Icon = FiPackage,
}) => {


    const textColor = colorMap[color]?.text || colorMap.gray.text;
    const barColor = colorMap[color]?.bar || colorMap.gray.bar;

    const rateIcon = rate > 0 ? (
        <FiTrendingUp className="w-4 h-4" />
    ) : rate < 0 ? (
        <FiTrendingDown className="w-4 h-4" />
    ) : (
        <FiMinus className="w-4 h-4" />
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-3 rounded-lg  border border-gray-100 
                hover:shadow-md transition-shadow duration-300 w-full max-w-xs"
        >
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${textColor}`} />
                        <h3 className="text-sm font-semibold text-gray-700">
                            {title}
                        </h3>
                    </div>
                    <p className={`text-3xl font-bold ${textColor}`}>
                        {value?.toLocaleString?.() || value || "0"}
                    </p>
                </div>
                <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 
                        rounded-lg ${
                            rate > 0
                                ? "text-green-600 bg-green-100"
                                : rate < 0
                                ? "text-red-600 bg-red-100"
                                : "text-gray-600 bg-gray-100"
                        }`}
                >
                    {rateIcon}
                    <span>{Math.abs(rate)}%</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{change >= 0 ? "+" : "-"}{Math.abs(change)}</span>
                    <span>{Math.min(percentage, 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${barColor} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;