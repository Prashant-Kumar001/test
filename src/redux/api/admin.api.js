import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = "https://e-commerse-backend-8cy9.onrender.com";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/admin/`,
    }),
    tagTypes: ['AdminStatistics'],
    endpoints: (builder) => ({
        getAdminStatistics: builder.query({
            query: ({ id }) => `stats/?id=${id}`,
            providesTags: ['AdminStatistics'],
            keepUnusedDataFor: 0
        }),
        pie: builder.query({
            query: ({ id }) => `pie/?id=${id}`,
            keepUnusedDataFor: 0

        }),
        Bar: builder.query({
            query: ({ id }) => `bar/?id=${id}`,
            keepUnusedDataFor: 0

        }),
        line: builder.query({
            query: ({ id }) => `line/?id=${id}`,
            keepUnusedDataFor: 0

        }),
    }),
});

export const {
    useGetAdminStatisticsQuery,
    usePieQuery,
    useBarQuery,
    useLineQuery
} = adminApi;
