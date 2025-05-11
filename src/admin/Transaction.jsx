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
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!data || !data.SingleOrder) return null;

  const { SingleOrder } = data;

  const processOrder = async (orderId) => {
    setIsProcessing(true);
    try {
      const res = await processOrderApi({
        orderId,
        userId: user._id,
      }).unwrap();
      toast.success(res?.message || "Order processed successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to process order", {
        style: { minWidth: "600px" },
      });
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
      toast.error(err?.data?.message || "Failed to delete order", {
        style: { minWidth: "600px" },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
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
                    src={`${import.meta.env.VITE_SERVER}/${item.image.replace(/\\/g, "/")}`}
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
              Shipping Charges: ₹{SingleOrder.shippingPrice}
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
              className={`text-sm font-semibold ${SingleOrder.status === "Processing"
                ? "text-yellow-600"
                : "text-green-600"
                }`}
            >
              Status: {SingleOrder.status}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={SingleOrder.status === "DELIVERED" || isProcessing}
              onClick={() => processOrder(SingleOrder._id)}
              className={`btn btn-primary `}
            >
              {isProcessing
                ? "Processing..."
                : SingleOrder.status === "Processing"
                  ? "Mark as Delivered"
                  : SingleOrder.status === "DELIVERED" ? 'Mark as Shipped' : 'Mark as Processing'}
            </button>
            <button
              onClick={() => handleDelete(SingleOrder._id)}
              className="btn btn-error btn-sm btn-active"
            >
              <FaTrash color="white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
