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
        setIsCouponApplied(false);
        setCouponMessage("Invalid coupon.");
        dispatch(applyCouponDiscount({ discountAmount: 0 }));
        toast.error("Invalid coupon.");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
  
      setIsCouponApplied(false);
      dispatch(applyCouponDiscount({ discountAmount: 0 }));
  
      const errorMessage = error.response?.data?.message || "Error applying coupon";
      if (error.response?.status === 404) {
        setCouponMessage("Coupon not found.");
        toast.error("Coupon not found.");
      } else if (error.response?.status === 400) {
        setCouponMessage("Coupon is expired.");
        toast.error("Coupon is expired.");
      } else {
        setCouponMessage(errorMessage);
        toast.error(errorMessage);
      }
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
    toast.error(message, {
      style: {
        minWidth: "400px",
      },
    });
  };

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 w-full px-5 border border-gray-300 rounded">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
            {cart.length > 0 && (
              <button
                onClick={handlerClearCart}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
          <div className="space-y-4 max-h-[60vh] bg-white p-2 rounded-2xl overflow-scroll hide-scrollbar">
            {cart.length > 0 ? (
              cart.map((item) => (
                <CartItem
                  key={item._id}
                  {...item}
                  imageUrl={item.image}
                  handlerDecrement={handlerDecrement}
                  handlerIncrement={handlerIncrement}
                  handlerDelete={handlerDelete}
                  handleWarning={handleWarning}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Your cart is empty</p>
            )}
          </div>
        </div>

        <div className="lg:w-1/3 w-full p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-700">
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
              <span>Total Quantity:</span>
              <span>{totalQuantity}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-gray-800">
              <span>Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Promo Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            />
            {coupon.trim() && couponMessage && (
              <div
                className={`mt-2 text-sm flex items-center ${isCouponApplied ? "text-green-600" : "text-red-600"
                  }`}
              >
                {!isCouponApplied && <VscError className="mr-2" />}
                <span>{couponMessage}</span>
              </div>
            )}
          </div>

          <Link
            to="/checkout"
            className="block w-full mt-4 py-2 bg-indigo-600 text-white text-center rounded font-semibold hover:bg-indigo-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
