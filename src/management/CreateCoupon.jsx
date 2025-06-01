import AdminLayout from "../admin/AdminLayout";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateCoupon = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [message, setMessage] = useState(null);

    const { user } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        validity: "",
        count: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validity = `${formData.validity || '1d'}`;

        const submissionData = {
            code: formData.code,
            discount: Number(formData.discount),
            validity: validity,
            count: Number(formData.count),
        };

        const server = import.meta.env.VITE_SERVER

        try {
            const response = await axios.post(`${server}/api/v1/payment/coupon/new?id=${user._id}`, submissionData)

            console.log(response);
            if(response.status === 201) {
                setSuccess(response?.data?.message)
                
            }


        } catch (error) {
            console.error("Error creating coupon:", error);
            setError(error.response?.data?.message || "An error occurred while creating the coupon.");
            setSuccess(null);
        }

        finally {
            setLoading(false);
        }



    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto mt-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Coupon</h3>
                <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g. BIG2001"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (Amount)</label>
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="e.g. 100000"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
                            <input
                                type="text"
                                id="validity"
                                name="validity"
                                value={formData.validity}
                                onChange={handleChange}
                                placeholder="e.g. 1d (1 day), 2h (2 hours), 30m (30 minutes)"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-lg transition duration-150"
                            >
                                {
                                    loading ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3 text-white inline-block"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                fill="none"
                                                strokeWidth="4"
                                                stroke="currentColor"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                                            />
                                        </svg>
                                    ) : "Create Coupon"
                                }
                            </button>
                        </div>
                    </form>
                </div>
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
                {success && <div className="mt-4 text-green-600">{success}</div>}
            </div>
        </AdminLayout>
    );
};

export default CreateCoupon;