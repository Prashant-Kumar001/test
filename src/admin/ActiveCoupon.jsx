import React from "react";
import AdminLayout from "./AdminLayout";
import { useActiveCouponQuery } from "../redux/api/coupon.api";
import { useSelector } from "react-redux";
import { IoIosRefreshCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";


const ActiveCoupon = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useActiveCouponQuery(user?._id, { skip: !user?._id });

    const { coupons = [] } = data || {};

    const handleEdit = (id) => navigate(`/admin/manage-coupon/${id}`);

    const showSkeleton = isLoading || (isFetching && !coupons.length);
    const showTable = !!coupons.length;
    const showEmptyState = !showSkeleton && !isError && !coupons.length;


    return (
        <AdminLayout>
            <div className="w-full">
                <div className="border border-gray-200 rounded-xl p-2 relative">
                    <button
                        type="button"
                        onClick={refetch}
                        className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition"
                        aria-label="Refresh list"
                        disabled={isFetching}
                    >
                        <IoIosRefreshCircle size={24} className={isFetching ? "animate-spin" : ""} />
                    </button>

                    {showSkeleton && (
                        <div className="space-y-3" role="status" aria-live="polite">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={`skeleton-${i}`}
                                    className="h-8 w-full bg-gray-300 animate-pulse rounded"
                                />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-red-600">
                            <p className="font-semibold">Failed to load coupons</p>
                            <p className="text-sm opacity-80">{error?.message || "Unknown error"}</p>
                        </div>
                    )}

                    {showEmptyState && (
                        <div className="flex items-center justify-center h-40 text-gray-500">
                            No active coupons found
                        </div>
                    )}

                    {showTable && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 font-ubuntu text-xs uppercase tracking-wider text-gray-500 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left">Code</th>
                                        <th scope="col" className="px-6 py-3 text-left">Discount</th>
                                        <th scope="col" className="px-6 py-3 text-left">Validity</th>
                                        <th scope="col" className="px-6 py-3 text-left">Count</th>
                                        <th scope="col" className="px-6 py-3 text-left">Active</th>
                                        <th scope="col" className="px-6 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 font-montserrat text-sm">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{coupon._id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{coupon.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{coupon.discount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{coupon.validity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{coupon.count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {coupon.isActiveNow ? (
                                                    <span className="text-green-600 font-semibold">Yes</span>
                                                ) : (
                                                    <span className="text-red-600 font-semibold">No</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(coupon._id)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition"
                                                    aria-label={`Edit coupon ${coupon.code}`}
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ActiveCoupon;
