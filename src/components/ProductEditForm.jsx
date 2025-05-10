import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSingleProductQuery,
} from "../redux/api/product.api";
import toast from "react-hot-toast";
import {
  FaTag,
  FaDollarSign,
  FaBox,
  FaListAlt,
  FaEdit,
  FaTrash,
  FaImage,
} from "react-icons/fa";
import { NewLoader } from "./Loader";
import { useSelector } from "react-redux";

const ProductEditForm = ({ productId }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    data: single,
    isLoading: isFetching,
    isError,
    error,
  } = useGetSingleProductQuery(productId);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [showLoader, setShowLoader] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    description: "",
  });

  useEffect(() => {
    if (single) {
      setFormData({
        name: single.product.name || "",
        price: single.product.price || "",
        stock: single.product.stock || "",
        category: single.product.category || "",
        image: null,
        description: single.product.description || "",
      });
      setImagePreview(`https://e-commerse-backend-8cy9.onrender.com/${single.product.image.replace(/\\/g, "/")}` || "");
    }
  }, [single]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    submitData.append("category", formData.category);
    submitData.append("description", formData.description);
    if (formData.image instanceof File) {
      submitData.append("image", formData.image);
    }

    try {
      await updateProduct({
        id: productId,
        body: submitData,
        admin: user._id,
      }).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/manage");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setShowLoader(true);
      try {
        await deleteProduct({ id: productId, admin: user._id }).unwrap();
        toast.success("Product deleted successfully!");
        navigate("/admin/manage");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete product");
      } finally {
        setShowLoader(false);
      }
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading product details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">
            {error?.data?.message || "Failed to load product"}
          </p>
          <button
            onClick={() => navigate("/admin/manage")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {showLoader && <NewLoader height="100" />}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-gray-100 border-r border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaImage /> Product Image
            </h2>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-sm h-72 object-contain rounded border border-gray-300"
              />
            ) : (
              <div className="w-full max-w-sm h-72 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded">
                No Image Available
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 w-full cursor-pointer text-sm file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaEdit /> Edit Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                  <FaTag /> Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                    <FaDollarSign /> Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                    <FaBox /> Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                  <FaListAlt /> Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                  <FaEdit /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`flex-1 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-all duration-200 flex items-center justify-center gap-2 ${isUpdating ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  <FaEdit />
                  {isUpdating ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditForm;
