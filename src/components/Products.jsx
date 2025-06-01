import React from "react";
import { motion } from "framer-motion";
import { IoAddCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

const Products = ({ productId, price, name, stock, imageUrl, handler }) => {
  return (
    <div
      key={productId}
      className={`relative font-ubuntu rounded-2xl w-full  justify-center flex md:flex-col flex-row sm:max-w-[220px] md:max-w-[260px]  sm:h-[340px]  overflow-hidden cursor-pointer group ${
        stock === 0 ? "opacity-70" : "opacity-100"
      }`}
    >
      <figure className="w-full h-44 sm:h-48 md:h-56 bg-gray-50 flex items-center justify-center overflow-hidden relative">
        <Link to={`product/view/${productId}`}>
          <img
            src={imageUrl?.secure_url}
            alt={name}
            className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-3 right-3">
          {stock === 0 ? (
            <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          ) : stock <= 5 ? (
            <span className="bg-orange-400 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              Low Stock
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              In Stock
            </span>
          )}
        </div>
      </figure>

      <div className="p-4 sm:p-5 flex flex-col   w-full">
        <div className="text-center space-y-1">
          <h2
            className="text-sm sm:text-base md:text-lg text-gray-900 truncate"
            title={name}
          >
            {name?.length > 18 ? `${name.slice(0, 18)}...` : name}
          </h2>
          <p className="text-base sm:text-lg font-bold ">
            ₹{price.toFixed(2)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {stock > 0 ? `${stock} in stock` : "Sold Out"}
          </p>
        </div>

        {stock > 0 && (
          <motion.button
            onClick={() => handler(productId)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-gray-100 text-orange-700 flex justify-center rounded items-center px-3 py-1 mt-5"
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Products;