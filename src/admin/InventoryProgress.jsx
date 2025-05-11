import { FaBox } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
const InventoryProgress = ({ inventory }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl ">
      <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <FiBarChart2 className="text-indigo-500" />
        Inventory </h3>
      <div className="space-y-6">
        {inventory.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full shadow-sm">
                  <FaBox className="w-4 h-4" />
                </div>
                <span className="capitalize">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">
                {item.productPercentage}% in stock
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm transition-all duration-500 ease-in-out"
                style={{ width: `${item.productPercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryProgress;
