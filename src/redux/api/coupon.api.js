import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER

export const CouponApi = createApi({
    reducerPath: "CouponApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/payment/`,
    }),
    tagTypes: ['AdminStatistics'],
    endpoints: (builder) => ({
        ActiveCoupon: builder.query({
            query: (id) => `/coupon/all?id=${id}`,
            providesTags: ['AdminStatistics'],
        }),

    }),
});

export const {
    useActiveCouponQuery
} = CouponApi;
