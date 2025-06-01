import React, { useEffect } from "react";
import AdminLayout from "../admin/AdminLayout";
import { useSelector } from "react-redux";
import { useBarQuery } from "../redux/api/admin.api";
import SixMonthRevenueBarChart from "../chart/SixMonthRevenueBarChart";
import SixMonthProductBarChart from "../chart/SixMonthProductBarChart";
import SixMonthUserBarChart from "../chart/SixMonthUserBarChart";
import TwelveMonthOrdersBarChart from "../chart/TwelveMonthOrdersBarChart";

const BarChat = () => {
 

  const { user } = useSelector((state) => state.user);
  const bar = useBarQuery({ id: user?._id });

  const sixMonthOrders = bar?.data?.chart?.sixMonthOrders || [];
  const sixMonthProducts = bar?.data?.chart?.sixMonthProducts || [];
  const sixMonthUsers = bar?.data?.chart?.sixMonthUsers || [];
  const twelveMonthOrders = bar?.data?.chart?.twelveMonthOrders || [];

  return (
    <AdminLayout>
      {bar.isLoading ? (
        <div className="space-y-10.5 overflow-x-auto max-h-[610px] overflow-y-auto custom-scrollbar">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-55 w-full bg-gray-300 animate-pulse rounded"
            />
          ))}
        </div>
      ) : bar.isError ? (
        <p className="text-red-500 font-medium">Error: {bar.error?.message}</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <section className="flex flex-col gap-6 overflow-x-auto max-h-[93vh] overflow-y-auto custom-scrollbar">
            <SixMonthRevenueBarChart sixMonthOrders={sixMonthOrders} />
            <SixMonthProductBarChart sixMonthProducts={sixMonthProducts} />
            <SixMonthUserBarChart sixMonthUsers={sixMonthUsers} />
            <TwelveMonthOrdersBarChart twelveMonthOrders={twelveMonthOrders} />
          </section>
        </div>
      )}
    </AdminLayout>
  );
};

export default BarChat;
