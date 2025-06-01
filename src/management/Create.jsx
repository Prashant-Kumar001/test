import React, { useEffect, useState } from "react";
import { useCreateProductMutation } from "../redux/api/product.api";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import AdminLayout from "../admin/AdminLayout";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    name: yup.string().required("Product name is required").min(3),
    price: yup
        .number()
        .typeError("Price must be a number")
        .positive()
        .required(),
    stock: yup
        .number()
        .typeError("Stock must be a number")
        .integer()
        .min(1)
        .required(),
    description: yup.string().required().min(10),
    category: yup.string().required("Category is required"),
    images: yup
        .mixed()
        .test("required", "Product image is required", (value) => value && value.length > 0),
});

const Create = () => {
    const { user } = useSelector((state) => state.user);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [customCategoryVisible, setCustomCategoryVisible] = useState(false);

    const [createProduct, { isLoading }] = useCreateProductMutation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    useEffect(() => {
        if (localStorage.getItem("current-product")) {
           const  errorP = JSON.parse(localStorage.getItem("current-product"))
           setValue("category",errorP.category)
           setValue("description", errorP.description)
           setValue("name", errorP.name)
           setValue("price", errorP.price)
           setValue("stock", errorP.stock)
           toast.error('product which is not created ')
        }
    }, [])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

        if (validFiles.length !== files.length) {
            toast.error("Each image must be less than 5MB");
        }

        setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)));
        setValue("images", validFiles);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("description", data.description);
        formData.append("category", data.category);

        data.images.forEach((file) => {
            formData.append("images", file);
        });

        try {
            await createProduct({ id: user._id, data: formData }).unwrap();
            toast.success("Product created successfully!");
            navigate("/admin/manage");
            localStorage.clear()
        } catch (error) {
            const notCreated = {
                name: data.name,
                price: data.price,
                stock: data.price,
                description: data.description,
                category: data.category,
            }
            localStorage.setItem("current-product", JSON.stringify(notCreated))
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto bg-white rounded-lg">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 p-6 rounded-lg bg-white"
                >
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Product Images</label>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {imagePreviews.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Preview ${i}`}
                                    className="w-24 h-24 object-cover rounded border border-gray-300"
                                />
                            ))}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:bg-pink-100 file:text-pink-700 text-sm text-gray-500 w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB each</p>
                        {errors.images && (
                            <p className="text-sm text-red-600">{errors.images.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Product name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("price")}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300"
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
                                className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300"
                            />
                            {errors.stock && (
                                <p className="text-sm text-red-600">{errors.stock.message}</p>
                            )}
                        </div>
                    </div>

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
                            onChange={(e) => {
                                const value = e.target.value;
                                setValue("category", value);
                                setCustomCategoryVisible(value === "custom");
                            }}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300"
                        >
                            <option value="">Select a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home & Furniture</option>
                            <option value="sports">Sports</option>
                            <option value="art">Art</option>
                            <option value="custom">Other (Custom)</option>
                        </select>
                        {errors.category && (
                            <p className="text-sm text-red-600">{errors.category.message}</p>
                        )}

                        {/* Custom Category Input */}
                        {customCategoryVisible && (
                            <input
                                type="text"
                                placeholder="Enter custom category"
                                onChange={(e) => setValue("category", e.target.value)}
                                className="mt-3 w-full px-4 py-2 border rounded-lg focus:ring-pink-500 outline-0 focus:ring-1 transition-all border-gray-300"
                            />
                        )}
                    </div>


                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            )}
                            {isLoading ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Create;
