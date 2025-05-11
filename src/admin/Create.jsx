import React, { useState } from "react";
import { useCreateProductMutation } from "../redux/api/product.api";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    name: yup.string().required("Product name is required").min(3),
    price: yup.number().typeError("Price must be a number").positive().required(),
    stock: yup.number().typeError("Stock must be a number").integer().min(1).required(),
    description: yup.string().required().min(10),
    category: yup.string().required("Category is required"),
    image: yup.mixed().required("Product image is required"),
});

const Create = () => {
    const { user } = useSelector((state) => state.user);
    const [imagePreview, setImagePreview] = useState(null);
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setImagePreview(URL.createObjectURL(file));
            setValue("image", file);
        } else {
            toast.error("Image must be less than 5MB");
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await createProduct({ id: user._id, data: formData }).unwrap();
            toast.success("Product created successfully!");
            navigate("/admin/manage");
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };

    return (
        <AdminLayout>
            <>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Product</h1>
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 rounded-lg shadow bg-white max-h-[560px] overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="flex items-center gap-4">
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded border border-gray-300"
                                    />
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:bg-pink-100 file:text-pink-700 text-sm text-gray-500 w-full"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                                    {errors.image && (
                                        <p className="text-sm text-red-600">{errors.image.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Product name"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300  "
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price")}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300 "
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-600">{errors.price.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    {...register("stock")}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300 "
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-600">{errors.stock.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={4}
                                {...register("description")}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300 resize-none"
                                placeholder="Product description"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Category</label>
                            <select
                                {...register("category")}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300 "
                            >
                                <option value="">Select a category</option>
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion</option>
                                <option value="home">Home & Furniture</option>
                                <option value="sports">Sports</option>
                                <option value="art">Art</option>
                            </select>
                            {errors.category && (
                                <p className="text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                {isLoading ? "Creating..." : "Create Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </>
        </AdminLayout>
    );
};

export default Create;
