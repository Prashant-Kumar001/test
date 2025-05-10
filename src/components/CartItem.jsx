import React from "react";
import { IoAddOutline, IoRemove } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const CartItem = ({
  _id,
  imageUrl,
  name,
  price,
  quantity,
  stock,
  handlerIncrement,
  handlerDecrement,
  handlerDelete,
  handleWarning
}) => {
  return (
    <>
      <div className="flex md:flex-row flex-col md:items-center justify-between font-montserrat gap-4">
        <div className="flex justify-between items-center gap-4">
          <img
            className="w-23 h-23 rounded "
            src={`${import.meta.env.VITE_SERVER_URL}/${imageUrl?.replace(/\\/g, "/")}`}
            alt={name}
          />
          <article className="flex flex-col">
            <Link to={`/product/${_id}`} className="font-medium ">{name}</Link>
            <span className="text-gray-500 text-sm">₹{price.toFixed(2)}</span>
          </article>
        </div>
        <div className="flex items-center justify-center md:justify-normal gap-3 dark:text-gray-800 md:mr-10">
          <button
            onClick={quantity > 1 ? () => handlerDecrement(_id) : () => handleWarning(_id, "you have reached the minimum stock limit")}
            className="p-2 bg-gray-100  rounded cursor-pointer hover:bg-black hover:text-white"
          >
            <IoRemove />
          </button>
          <span className=" font-medium">{quantity}</span>
          <button
            onClick={
              stock > quantity ? () => handlerIncrement(_id) : () => handleWarning(_id, "you have reached the maximum stock limit")
            }
            className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-black hover:text-white"
          >
            <IoAddOutline />
          </button>
          <div className="tooltip tooltip-bottom tooltip-error text-white" data-tip="Delete">
            <button onClick={() => handlerDelete(_id)}>
              <MdDelete color="red" size={23} />
            </button>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
};

export default CartItem;
