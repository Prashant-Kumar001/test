import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../redux/api/order.api";
import { SingleCardSkeleton } from "../components/SkeletonCards";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useOrderDetailsQuery(id);

  useEffect(() => {
    if (isError) {
      navigate("/not-found");
    }
  }, [isError, navigate]);

  const SingleOrder = data?.SingleOrder;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto  p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold border-b pb-2 mb-6 text-gray-800">
          Order Summary
        </h2>

        {isLoading ? (
          <div>
            <SingleCardSkeleton />
          </div >
        ) : !SingleOrder ? (
          <p className="text-red-500">Order details not available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Items</h3>
              {SingleOrder.orderItems?.length > 0 ? (
                <ul className="space-y-4">
                  {SingleOrder.orderItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <img
                        src={
                          item.image
                            ? `${import.meta.env.VITE_SERVER_URL}/${item.image.replace(/\\/g, "/")}`
                            : "/placeholder.png"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No items found.</p>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  User & Shipping Info
                </h3>
                <p>
                  <strong>User:</strong> {SingleOrder.user?.username}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {[
                    SingleOrder.shippingAddress?.address,
                    SingleOrder.shippingAddress?.city,
                    SingleOrder.shippingAddress?.state,
                    SingleOrder.shippingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  - {SingleOrder.shippingAddress?.pinCode}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Pricing
                </h3>
                <p>Subtotal: ₹{SingleOrder.subTotal}</p>
                <p>Shipping: ₹{SingleOrder.shippingPrice}</p>
                <p>Tax: ₹{SingleOrder.taxPrice}</p>
                <p>Discount: ₹{SingleOrder.discount}</p>
                <p className="font-bold text-lg">
                  Total: ₹{SingleOrder.totalPrice}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Status
                </h3>
                <p>
                  Status:{" "}
                  <span
                    className={
                      SingleOrder.status === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {SingleOrder.status}
                  </span>
                </p>
                <p>
                  Delivered:{" "}
                  <span
                    className={
                      SingleOrder.isDelivered
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {SingleOrder.isDelivered ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Ordered on:{" "}
                  {new Date(SingleOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
