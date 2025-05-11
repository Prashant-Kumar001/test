import React from "react";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/order.api";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { OrderSkeleton } from "../components/SkeletonCards";

const Order = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const { data, isLoading, isError, error } = useMyOrdersQuery(
    { userId: user?._id },
    { refetchOnMountOrArgChange: true }
  );

  const orders = data?.orders || [];
  const SERVER_URL = import.meta.env.VITE_SERVER || "http://localhost:5000";

  const handleManage = (id) => {
    navigate(`/order/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">{error?.data?.message || "An unexpected error occurred."}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3 text-center">Products</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Discount</th>
                      <th className="px-4 py-3">Shipping</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y p-3 divide-gray-100 font-medium text-gray-700">
                    {orders.map((order) => {
                      const totalQty = order.orderItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );
                      return (
                        <tr key={order._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4">{order._id.slice(0, 8)}...</td>
                          <td className="px-4 py-4 space-y-1">
                            {order.orderItems.map((item) => (
                              <div key={item._id} className="flex items-center gap-2">
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  href={`${SERVER_URL}/${item.image?.replace(/\\/g, "/")}`}
                                >
                                  <img
                                    src={`${SERVER_URL}/${item.image?.replace(/\\/g, "/")}`}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                </a>
                                <span className="text-sm">{item.name}</span>
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-4 text-center">{totalQty}</td>
                          <td className="px-4 py-4">₹{order.subTotal}</td>
                          <td className="px-4 py-4">₹{order.discount}</td>
                          <td className="px-4 py-4">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </td>
                          <td className="px-4 py-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                order.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "DELIVERED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-semibold">₹{order.totalPrice}</td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => handleManage(order._id)}
                              className="text-indigo-600 hover:text-indigo-800 transition"
                            >
                              <AiOutlineEye size={20} />
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
      )}
    </div>
  );
};

export default Order;
