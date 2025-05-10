import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/order/`,
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        placeOrder: builder.mutation({
            query: (order) => ({
                url: `create`,
                method: "POST",
                body: order,
            }),
            providesTags: ["orders"],
            invalidatesTags: ["orders, Products"],
        }),
        myOrders: builder.query({
            query: ({ userId }) => ({
                url: `my-orders?id=${userId}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
        orderDetails: builder.query({
            query: (orderId) => ({
                url: `${orderId}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
        allOrders: builder.query({
            query: ({ userId }) => ({
                url: `all?id=${userId}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),
        ProcessOrder: builder.mutation({
            query: ({ orderId, order, userId }) => ({
                url: `${orderId}?id=${userId}`,
                method: "PUT",
                body: order,
            }),
            invalidatesTags: ["orders"],
        }),
        deleteOrder: builder.mutation({
            query: ({ orderId, userId }) => ({
                url: `${orderId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
    }),
});

export const {
    usePlaceOrderMutation,
    useMyOrdersQuery,
    useOrderDetailsQuery,
    useAllOrdersQuery,
    useProcessOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
