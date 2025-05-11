import React, { useEffect } from 'react'
import AdminLayout from '../admin/AdminLayout'
import { useSelector } from 'react-redux'
import { useLineQuery } from '../redux/api/admin.api';
import DiscountTrendLineChart from '../chart/DiscountTrendLineChart';
import MonthlyOrderTrendChart from '../chart/MonthlyOrderTrendChart';
import RevenueTrendChart from '../chart/RevenueTrendChart';
import ProductTrendChart from '../chart/ProductTrendChart';
const LineChat = () => {


    const { user } = useSelector((state) => state.user);
    const line = useLineQuery({ id: user?._id });



    const discount = line?.data?.chart?.discounts || [];
    const orders = line?.data?.chart?.orders || {};
    const products = line?.data?.chart?.products || {};
    const revenue = line?.data?.chart?.revenue || {};




    return <AdminLayout>
        {line.isLoading ? (
            <div className="space-y-10.5 overflow-x-auto max-h-[610px] overflow-y-auto custom-scrollbar">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-55 w-full bg-gray-300 animate-pulse rounded"
                    />
                ))}
            </div>
        ) : line.isError ? (
            <p className="text-red-500 font-medium">Error: {line.error?.message}</p>
        ) : (
            <div className='bg-white rounded-lg  overflow-hidden'>
                <section className="  space-y-1.5 overflow-x-auto max-h-[610px] overflow-y-auto custom-scrollbar  ">
                    <DiscountTrendLineChart data={discount} />
                    <MonthlyOrderTrendChart data={orders} />
                    <ProductTrendChart data={products} />
                    <RevenueTrendChart data={revenue} />
                </section>
            </div>
        )}
    </AdminLayout>
}

export default LineChat