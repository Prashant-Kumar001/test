import React from "react";
import AdminLayout from "./AdminLayout";
import { useGetAdminStatisticsQuery } from "../redux/api/admin.api";
import { useSelector } from "react-redux";

import TrendChart from "../chart/TrendChart";
import StatCard from "./StartCard";
import InventoryProgress from "./InventoryProgress";
import GenderChart from "./Gender";
import TransactionCard from "./TransactionCard";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const statistics = useGetAdminStatisticsQuery({ id: user?._id });

  const stats = statistics.data?.stats?.lifetimeStats || {};
  const inventory = statistics.data?.stats?.inventory || [];
  const lastSixMonthRevenueTrend =
    statistics.data?.stats?.sixMonthRevenueTrend || [];
  const lastSixMonthOrderTrend =
    statistics.data?.stats?.sixMonthOrderTrend || [];
  const GrowthRate = statistics.data?.stats?.growthRate || {};
  const GrowthPercentage = statistics.data?.stats?.growthPercentage || {};
  const genderRate = statistics.data?.stats?.gender || [];
  const transaction = statistics.data?.stats?.firstFiveTransactions || [];

  const isLoading = statistics?.isLoading;
  const isError = statistics?.isError;
  const error = statistics?.error;

  return (
    <AdminLayout>
      <>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dashboard Overview
        </h2>
        <div className= "rounded-lg overflow-hidden ">
          <div className="space-y-6 overflow-x-auto max-h-[560px] overflow-y-auto custom-scrollbar">
            <section className=" rounded-2xl">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-32 rounded-xl" />
                  ))}
                </div>
              ) : isError ? (
                <p className="text-red-500 font-medium">
                  Error: {error?.message}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <StatCard
                    percentage={Number(GrowthPercentage?.users?.rate)}
                    change={Number(GrowthPercentage?.users?.change)}
                    rate={GrowthRate?.users}
                    title="Total Users"
                    value={stats.totalUsers}
                    color="indigo"
                  />
                  <StatCard
                    percentage={GrowthPercentage?.products?.rate}
                    change={Number(GrowthPercentage?.products?.change)}
                    rate={GrowthRate?.products}
                    title="Total Products"
                    value={stats.totalProducts}
                    color="green"
                  />
                  <StatCard
                    percentage={GrowthPercentage?.revenue?.rate}
                    change={Number(GrowthPercentage?.revenue?.change)}
                    rate={
                      typeof GrowthRate?.revenue === "number" &&
                        GrowthRate.revenue < 1000000
                        ? GrowthRate.revenue
                        : 999
                    }
                    title="Total Revenue"
                    value={stats.totalRevenue}
                    color="purple"
                  />
                  <StatCard
                    percentage={GrowthPercentage?.orders?.rate}
                    change={Number(GrowthPercentage?.orders?.change)}
                    rate={GrowthRate?.orders}
                    title="Transactions"
                    value={stats.totalOrders}
                    color="blue"
                  />
                </div>
              )}
            </section>

            <section className=" rounded-2xl   ">
              {isLoading ? (
                <div className="w-full">
                  <div className="skeleton h-32 rounded-xl" />
                </div>
              ) : isError ? (
                <p className="text-red-500 font-medium">
                  Error: {error?.message}
                </p>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-[70%]">
                    <TrendChart
                      orderData={lastSixMonthOrderTrend}
                      revenueData={lastSixMonthRevenueTrend}
                    />
                  </div>
                  <div className="w-full lg:flex-1">
                    {inventory?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full w-full shadow-lg rounded-2xl ">
                        <p className="text-gray-500 font-medium">
                          No inventory yet
                        </p>
                      </div>
                    ) : (
                      <InventoryProgress inventory={inventory} />
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className=" rounded-2xl   ">
              {isLoading ? (
                <div className="flex flex-col w-full gap-2.5">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="skeleton h-32 rounded-xl" />
                  ))}
                </div>
              ) : isError ? (
                <p className="text-red-500 font-medium">
                  Error: {error?.message}
                </p>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:flex-1">
                    <GenderChart data={genderRate} />
                  </div>
                  <div className="w-full lg:w-[50%]">
                    {transaction?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full w-full shadow-lg rounded-2xl">
                        <p className="text-gray-500 font-medium">
                          No transactions yet
                        </p>
                      </div>
                    ) : (
                      <TransactionCard transactions={transaction} />
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default Home;
