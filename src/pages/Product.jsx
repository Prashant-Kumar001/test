import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetSingleProductQuery } from "../redux/api/product.api";
import { addToCart } from "../redux/reducer/product.reducer";

const Product = () => {
  const { cart } = useSelector((state) => state.product);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) toast.error("Something went wrong");
  }, [id]);

  const { data, isLoading, isError, error } = useGetSingleProductQuery(id);

  const handleAddToCart = () => {
    const alreadyInCart = JSON.parse(localStorage.getItem("cart-product")) || [];
    const productInCart = alreadyInCart.findIndex((item) => item._id === id);

    if (productInCart > -1) {
      const product = alreadyInCart[productInCart];
      if (product.quantity === product.stock) {
        return toast.error("You have reached the maximum stock limit", {
          style: { minWidth: 400 },
        });
      }
    }

    const cartItem = {
      ...data.product,
    };

    dispatch(addToCart({ product: cartItem }));
    toast.success("Product added to cart!");
  };

  const goToCart = () => {
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-2xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isError) {
    toast.error(error?.data?.message || "Failed to load product");
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-xl text-red-600 font-semibold">Error loading product</div>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-xl text-yellow-600 font-medium">Product not found</div>
      </div>
    );
  }

  const { name, description, price, stock, image } = data.product;
  const isInCart = cart.some((item) => item._id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12">
      <div className="max-w-5xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src={`${import.meta.env.VITE_SERVER}/${image.replace(/\\/g, "/")}`}
              alt={name || "Product Image"}
              className="w-52 h-52 md:w-80 md:h-80 object-contain rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {name}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">{description}</p>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">${(price * 1.2).toFixed(2)}</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                20% OFF
              </span>
            </div>

            <p className="text-gray-700 font-medium">
              Stock:{" "}
              <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
                {stock > 0 ? `${stock} available` : "Out of stock"}
              </span>
            </p>

            {stock === 0 ? (
              <button
                type="button"
                disabled
                className="mt-4 w-full py-3 rounded-xl font-medium text-white bg-gray-400 cursor-not-allowed shadow-lg"
              >
                Out of Stock
              </button>
            ) : isInCart ? (
              <button
                type="button"
                onClick={goToCart}
                className="mt-4 w-full py-3 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Go to Cart
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-4 w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
