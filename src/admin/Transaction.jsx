import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useProcessOrderMutation,
} from "../redux/api/order.api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const statusColors = {
  PENDING: "text-yellow-600",
  PROCESSING: "text-blue-600",
  SHIPPED: "text-indigo-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

const nextStatusMap = {
  PENDING: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const getNextStatusLabel = (status) => {
  const next = nextStatusMap[status];
  return next
    ? `Mark as ${next.charAt(0) + next.slice(1).toLowerCase()}`
    : "No further action";
};

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const { data, isLoading, isError } = useOrderDetailsQuery(id);
  const [processOrderApi] = useProcessOrderMutation();
  const [deleteOrderApi] = useDeleteOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isError) {
      navigate("/not-found");
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data?.SingleOrder) return null;

  const { SingleOrder } = data;
  const currentStatus = SingleOrder.status;
  const nextStatus = nextStatusMap[currentStatus];
  const isDisabled =
    isProcessing ||
    currentStatus === "DELIVERED" ||
    currentStatus === "CANCELLED";

  const processOrder = async (orderId) => {
    setIsProcessing(true);
    try {
      const res = await processOrderApi({
        orderId,
        userId: user._id,
      }).unwrap();
      toast.success(res?.message || "Order processed successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const res = await deleteOrderApi({
        orderId,
        userId: user._id,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Order deleted successfully");
        navigate("/admin/orders");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-red-500 font-semibold">
          Error: {data?.error?.message || "Failed to load order details."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Order Items */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Order Items
          </h2>
          {SingleOrder.orderItems.length === 0 ? (
            <p className="text-gray-500">No items found.</p>
          ) : (
            <ul className="space-y-4">
              {SingleOrder.orderItems.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_SERVER}/${item.image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-600">
                      Qty: {item.quantity} × ₹{item.price} = ₹
                      {item.quantity * item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order Info */}
        <div className="bg-white p-6 rounded-md shadow-md flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Order Info
          </h2>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">User Info</h3>
            <p className="text-gray-600">Name: {SingleOrder.user?.username}</p>
            <p className="text-gray-600">
              Address: {SingleOrder.shippingAddress?.address},{" "}
              {SingleOrder.shippingAddress?.city},{" "}
              {SingleOrder.shippingAddress?.state},{" "}
              {SingleOrder.shippingAddress?.country}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Amount Info</h3>
            <p className="text-gray-600">Subtotal: ₹{SingleOrder.subTotal}</p>
            <p className="text-gray-600">Delivery: ₹{SingleOrder.delivery}</p>
            <p className="text-gray-600">
              Shipping: ₹{SingleOrder.shippingPrice}
            </p>
            <p className="text-gray-600">Tax: ₹{SingleOrder.taxPrice}</p>
            <p className="text-gray-600">Discount: ₹{SingleOrder.discount}</p>
            <p className="font-bold text-gray-800">
              Total: ₹{SingleOrder.totalPrice}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Status Info</h3>
            <p
              className={`text-sm font-semibold ${statusColors[currentStatus] || "text-gray-600"
                }`}
            >
              Status: {currentStatus}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={isDisabled}
              onClick={() => processOrder(SingleOrder._id)}
              className={`px-4 py-2 rounded-md font-semibold text-white transition cursor-pointer ${isDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isProcessing
                ? "Processing..."
                : getNextStatusLabel(currentStatus)}
            </button>

            <button
              onClick={() => handleDelete(SingleOrder._id)}
              className=" cursor-pointer"
              title="Delete Order"
            >
              <FaTrash color="red" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
