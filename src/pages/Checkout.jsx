import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePlaceOrderMutation } from "../redux/api/order.api.js";
import { emptyCart } from "../redux/reducer/product.reducer";

const stripePromise = loadStripe("pk_test_51RAj9706JABAxPu0OX5hk6G2CQcMRBiFkPSHSZmFmu5mbQmZR7zTdsM2L2C4x3ywag030uppXQ8qKRuaovMa1s4P006triytex");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.user);
  const {
    cart,
    subTotal,
    shipping,
    tax,
    grandTotal,
    discount,
    delivery,
    shippingInfo: formData,
  } = useSelector((state) => state.product);

  const [placeOrder] = usePlaceOrderMutation();



  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) return;
  
    setIsProcessing(true);
    setError(null);


    const newOrder = {
        user: user._id,
        orderItems: cart,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pinCode: formData.pinCode,
        },
        subTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        delivery,
        discount: discount,
        totalPrice: grandTotal,
      };

  
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: "if_required",
      });
  
    if (error) {
      setError(error);
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }
  
    if (paymentIntent.status === "succeeded") {
      try {
        const response = await placeOrder(newOrder).unwrap();
  
        if (response) {
          toast.success("Order placed successfully!");
          dispatch(emptyCart());
          navigate("/orders", { state: { order: response } });
          return; 
        } else {
          toast.error("Order not created. Please try again.");
        }
      } catch  {
        toast.error("Failed to place order");
      }
    } else {
      toast.error("Payment not successful");
    }
  
    setIsProcessing(false);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md space-y-4"
    >
      <PaymentElement />

      {error && (
        <div className="text-red-600 text-sm mt-2">{error.message}</div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const clientSecret = location?.state;
  if (!clientSecret) {
    return <Navigate to="/checkout" />;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;
