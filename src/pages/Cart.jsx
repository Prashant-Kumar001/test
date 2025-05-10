import React, { useState, useEffect, useCallback } from "react";
import { VscError } from "react-icons/vsc";
import toast from "react-hot-toast";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementProduct,
  decrementProduct,
  discardProduct,
  emptyCart,
  applyCouponDiscount,
} from "../redux/reducer/product.reducer";
import axios from "axios";
import debounce from "lodash/debounce";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    cart,
    totalQuantity,
    delivery,
    subTotal,
    tax,
    shipping,
    grandTotal,
    discount,
  } = useSelector((state) => state.product);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/");
    }
  }, [cart]);

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const handlerIncrement = (id) => {
    dispatch(incrementProduct({ id }));
  };

  const handlerDecrement = (id) => {
    dispatch(decrementProduct({ id }));
  };

  const handlerDelete = (id) => {
    dispatch(discardProduct({ id }));
    toast.error("Product removed from cart");
  };

  const handlerClearCart = () => {
    dispatch(emptyCart());
    setCoupon("");
    setIsCouponApplied(false);
    setCouponMessage("");
    toast.error("Cart cleared");
  };

  const validateCoupon = async (code, source) => {
    if (!code.trim()) {
      setIsCouponApplied(false);
      setCouponMessage("");
      dispatch(applyCouponDiscount({ discountAmount: 0 }));
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/payment/coupon/apply`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cancelToken: source.token,
        }
      );

      if (res.data.success) {
        setIsCouponApplied(true);
        setCouponMessage(res.data.message || "Coupon applied successfully!");
        dispatch(applyCouponDiscount({ discountAmount: res.data.discountAmount || 0 }));
        toast.success(`Coupon applied! Discount: ₹${res.data.discountAmount}`);
      } else {
        throw new Error("Invalid coupon.");
      }
    } catch (error) {
      if (axios.isCancel(error)) return;

      setIsCouponApplied(false);
      dispatch(applyCouponDiscount({ discountAmount: 0 }));

      const message = error.response?.data?.message || error.message || "Error applying coupon";
      setCouponMessage(message);
      toast.error(message);
    }
  };

  const debouncedValidateCoupon = useCallback(
    debounce((code, source) => validateCoupon(code, source), 500),
    []
  );

  useEffect(() => {
    const source = axios.CancelToken.source();

    debouncedValidateCoupon(coupon, source);

    return () => {
      source.cancel("Operation canceled due to new request.");
      debouncedValidateCoupon.cancel();
    };
  }, [coupon]);

  const handleWarning = (id, message) => {
    toast.error(message, { style: { minWidth: "400px" } });
  };

  return (
    <div className="min-h-screen py-6 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Cart Section */}
        <div className="lg:w-2/3 w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Shopping Cart</h2>
            {cart.length > 0 && (
              <button
                onClick={handlerClearCart}
                className="text-sm text-red-600 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 ">
            {cart.map((item) => (
              <CartItem
                key={item._id}
                {...item}
                imageUrl={item.image}
                handlerDecrement={handlerDecrement}
                handlerIncrement={handlerIncrement}
                handlerDelete={handlerDelete}
                handleWarning={handleWarning}
              />
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="lg:w-1/3 w-full p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

          <div className="space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{totalQuantity === 10 ? "Free" : `₹${delivery.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span>{totalQuantity}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between border-t pt-2 font-bold text-gray-900">
              <span>Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {coupon.trim() && couponMessage && (
              <p className={`mt-2 text-sm flex items-center ${isCouponApplied ? "text-green-600" : "text-red-600"}`}>
                {!isCouponApplied && <VscError className="mr-2" />}
                {couponMessage}
              </p>
            )}
          </div>

          <Link
            to="/checkout"
            className="block w-full mt-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
