import React from "react";
import { useAllOrdersQuery } from "../redux/api/order.api";
import { useSelector } from "react-redux";
import AdminLayout from "./AdminLayout";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useAllOrdersQuery(
    { userId: user._id },
    { refetchOnMountOrArgChange: true }
  );

  const handleManage = (id) => {
    navigate(`/admin/transaction/${id}`);
  };

  return (
    <AdminLayout>
      <>
        <h2 className="text-2xl font-semibold mb-4">Orders</h2>

        {isLoading ? (
          <div className="rounded-lg space-y-7">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-full bg-gray-300 animate-pulse rounded"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white p-8 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-red-600">
              Failed to Load Users
            </h2>
            <p className="text-gray-600 mt-2">
              {error?.data?.message || "Something went wrong."}
            </p>
            <button
              onClick={refetch}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : orders?.allOrders?.length === 0 ? (
          <div className="text-gray-600 bg-white p-6 rounded shadow">
            No orders found.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[560px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      User
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Total (₹)
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Discount (₹)
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {orders.allOrders.map((order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition duration-200"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={
                              order.user?.photo ||
                              "https://via.placeholder.com/40"
                            }
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-800">
                            {order.user?.username || "Unknown User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          ₹{order.discount?.toFixed(2) || 0}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {totalQuantity}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "DELIVERED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleManage(order._id)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition text-sm"
                          >
                            <FiEdit2 size={14} />
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </AdminLayout>
  );
};

export default Order;
