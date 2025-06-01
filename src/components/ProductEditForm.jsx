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
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    if (single?.product) {
      const { product } = single;
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category || "",
        description: product.description || "",
      });
      setExistingImages(product.image || []);
    }
  }, [single]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.price || formData.price <= 0) errors.price = "Price must be a positive number";
    if (!formData.stock || formData.stock < 0) errors.stock = "Stock must be a non-negative number";
    if (!formData.category.trim()) errors.category = "Category is required"; // Fixed typo: plateData -> formData
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setNewImages((prev) => [...prev, ...validFiles]);
    const previewURLs = validFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previewURLs]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    const formDataToSend = new FormData();
    const changedFields = {};
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const newValue = formData[key];
        const oldValue = single?.product[key];
        if (newValue !== oldValue?.toString()) {
          changedFields[key] = newValue;
          formDataToSend.append(key, newValue);
        }
      }
    }
    newImages.forEach((file) => formDataToSend.append("images", file));

    if (Object.keys(changedFields).length === 0 && newImages.length === 0) {
      toast.error("No changes to update");
      return;
    }

    try {
      const res = await updateProduct({ id: productId, body: formDataToSend, admin: user._id }).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/manage");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct({ id: productId, admin: user._id }).unwrap();
      toast.success("Product deleted successfully!");
      navigate("/admin/manage");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  const renderImageGrid = (images, emptyText, isNew = false) => (
    images.length ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((src, idx) => (
          <div key={idx} className="relative">
            <img
              src={typeof src === "string" ? src : src.secure_url || src}
              alt={`product-${idx}`}
              className="w-full h-40 object-contain rounded"
            />
            {isNew && (
              <button
                onClick={() => handleRemoveNewImage(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                aria-label={`Remove image ${idx + 1}`}
              >
                <FaTimes />
              </button>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 italic text-center border border-dashed rounded p-4">{emptyText}</p>
    )
  );

  if (isFetching) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-40 w-full bg-gray-200 rounded"></div>
              <div className="h-40 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-20 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[90vh] flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error?.data?.message || "Failed to load product"}</p>
          <button
            onClick={() => navigate("/admin/manage")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
            aria-label="Back to product management"
          >
            Back to Products
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[90vh] bg-gray-50 overflow-auto custom-scrollbar p-4"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-gray-100 border-r border-gray-200 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <FaImage /> Images
            </h2>
            <div>
              <h3 className="text-gray-600 font-medium mb-2">Existing Images</h3>
              {renderImageGrid(existingImages, "No images available")}
            </div>
            <div>
              <h3 className="text-gray-600 font-medium mb-2">New Images (not yet saved)</h3>
              {renderImageGrid(newImagePreviews, "No new images selected", true)}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full cursor-pointer text-sm file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-label="Upload new product images"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaEdit /> Edit Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                  <FaTag /> Product Name
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border ${formErrors.name ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  required
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                />
                {formErrors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                    <FaDollarSign /> Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.price ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                    required
                    min="0"
                    step="0.01"
                    aria-describedby={formErrors.price ? "price-error" : undefined}
                  />
                  {formErrors.price && (
                    <p id="price-error" className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="stock" className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                    <FaBox /> Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.stock ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                    required
                    min="0"
                    aria-describedby={formErrors.stock ? "stock-error" : undefined}
                  />
                  {formErrors.stock && (
                    <p id="stock-error" className="text-red-500 text-sm mt-1">{formErrors.stock}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="category" className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                  <FaListAlt /> Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full border ${formErrors.category ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  required
                  aria-describedby={formErrors.category ? "category-error" : undefined}
                />
                {formErrors.category && (
                  <p id="category-error" className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                )}
              </div>
              <div>
                <label htmlFor="description" className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                  <FaEdit /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  aria-describedby="description-hint"
                />
                <p id="description-hint" className="text-gray-500 text-sm mt-1">Optional: Add a detailed product description</p>
              </div>
              <div className="flex justify-between items-center mt-6 gap-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="Update product"
                >
                  <FaEdit />
                  {isUpdating ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all duration-200"
                  aria-label="Delete product"
                >
                  <FaTrash />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductEditForm;