import React from "react";
import { motion } from "framer-motion";
import { IoAddCircle } from "react-icons/io5";

const Products = ({ productId, price, name, stock, imageUrl, handler }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      key={productId}
      className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px] h-[280px] sm:h-[300px] flex flex-col items-center overflow-hidden cursor-pointer group ${stock === 0 ? "opacity-60" : "opacity-100"
        }`}
    >

      <figure className="w-full h-36 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
         src={`${import.meta.env.VITE_SERVER}/${imageUrl.replace(/\\/g, "/")}`}
          alt={name}
          className="w-full h-full object-cover p-3 sm:p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </figure>


      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between w-full">
        <div className="text-center">
          <h2
            className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate"
            title={name}
          >
            {name?.length > 15 ? `${name.slice(0, 15)}...` : name}
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mt-1">
            ${price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stock > 0 ? `${stock} in stock` : "Sold Out"}
          </p>
        </div>

        {stock > 0 && (
          <motion.button
            onClick={() => handler(productId)}
            whileHover={{ scale: 1.1 }}
            className="mt-2 sm:mt-3 mx-auto flex items-center cursor-pointer justify-center bg-indigo-600 text-white px-3 sm:px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-700 text-xs sm:text-sm"
            aria-label={`Add ${name} to cart`}
          >
            <IoAddCircle size={22} className="mr-1" />
          </motion.button>
        )}
      </div>

      <div className="absolute top-2 right-2">
        {stock === 0 ? (
          <span className="bg-red-500 text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full shadow">
            Sold Out
          </span>
        ) : stock <= 5 ? (
          <span className="bg-orange-400 text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full shadow">
            Low Stock
          </span>
        ) : (
          <span className="bg-green-500 text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full shadow">
            In Stock
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default Products;