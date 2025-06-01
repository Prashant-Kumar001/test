import React, { useEffect } from "react";
import AdminLayout from "../admin/AdminLayout";
import { usePieQuery } from "../redux/api/admin.api";
import { useSelector } from "react-redux";

import CategoryPieChart from "../chart/CategoryPieChart";
import UserGenderPieChart from "../chart/UserGenderPieChart";
import OrderStatusPieChart from "../chart/OrderStatusPieChart";
import AgeDistributionChart from "../chart/AgeDistributionChart";
import StockAvailabilityChart from "../chart/StockAvailabilityChart.jsx";
import RevenueDistributionChart from "../chart/RevenueDistributionChart.jsx";

const Charts = () => {


  const { user } = useSelector((state) => state.user);
  const pie = usePieQuery({ id: user?._id });

  const category = pie?.data?.chart?.categories || [];
  const revenue = pie?.data?.chart?.revenueDistribution || {};
  const status = pie?.data?.chart?.status || [];
  const stock = pie?.data?.chart?.stockAvailability || {};
  const users = pie?.data?.chart?.users || {};
  const age = pie?.data?.chart?.ageDistribution || {};


  return (
    <AdminLayout>
      <>
        {pie.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-140 w-full bg-gray-300 animate-pulse rounded"
              />
            ))}
          </div>
        ) : pie.isError ? (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow text-center border border-red-200">
            <p className="text-red-500 font-semibold text-lg">
              Error: {pie.error?.message || "Failed to load charts."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <section className="overflow-x-auto max-h-[93vh] overflow-y-auto custom-scrollbar ">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
                <UserGenderPieChart users={users} />
                <CategoryPieChart categories={category} />
                <OrderStatusPieChart status={status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6  place-items-center border-t pt-4">
                <AgeDistributionChart ageDistribution={age} />
                <StockAvailabilityChart stockAvailability={stock} />
              </div>

              <div className=" border-t pt-4">
                <RevenueDistributionChart revenueDistribution={revenue} />
              </div>
            </section>
          </div>
        )}
      </>
    </AdminLayout>
  );
};

export default Charts;
