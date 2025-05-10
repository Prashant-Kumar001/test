import React from "react";

const SkeletonCards = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-xl bg-white shadow-md overflow-hidden"
        >
          <div className="relative h-40 bg-gray-200 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <div className="absolute top-2 right-2 h-6 w-16 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-4 py-3 space-y-3">
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCards;

export const OrderSkeleton = () => {
  return (
    <div className="animate-pulse p-4 w-full bg-white rounded-md shadow flex items-center space-x-4">
      <div className=" flex w-full justify-between items-center gap-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="w-10 h-10 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-16"></div>
        <div className="h-4 bg-gray-300 rounded w-4"></div>
        <div className="h-4 bg-gray-300 rounded w-12"></div>
        <div className="h-4 bg-gray-300 rounded w-10"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-6 bg-yellow-200 rounded w-16"></div>
        <div className="h-4 bg-gray-300 rounded w-14 font-bold"></div>
        <div className="h-5 w-5 bg-gray-300 rounded-full "></div>
      </div>
    </div>
  );
};

export const SingleCardSkeleton = () => {
  return (
    <div className="animate-pulse  w-full rounded-md  flex items-center space-x-4">
      <div className="flex w-full justify-around gap-4">
        <div className="flex flex-col gap-4">
          <div className="h-4 bg-gray-300 rounded w-80"></div>
          <div className="h-100 bg-gray-300 rounded w-96"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-4 bg-gray-300 rounded w-56"></div>
          <div className="h-4 bg-gray-300 rounded w-15"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-300 rounded w-35"></div>
          <div className="h-4 bg-gray-300 rounded w-72"></div>
          <div className="h-4 bg-gray-300 rounded w-50"></div>
          <div className="h-6 bg-yellow-200 rounded w-56"></div>
          <div className="h-4 bg-gray-300 rounded w-24 font-bold"></div>
          <div className="h-5 w-56 bg-gray-300 rounded"></div>
          <div className="h-5 w-46 bg-gray-300 rounded"></div>
          <div className="h-5 w-26 bg-gray-300 rounded"></div>
          <div className="h-5 w-26 bg-gray-300 rounded"></div>
          <div className="h-5 w-16 bg-gray-300 rounded"></div>
          <div className="h-5 w-36 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};
