import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios, { all } from "axios";

const server = import.meta.env.VITE_SERVER

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/user/`
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "new",
                method: "POST",
                body: credentials
            }),
            invalidatesTags: ["User"],
        }),

        allUsers: builder.query({
            query: ({ admin }) => "all?id=" + admin,
            providesTags: ["User"],
        }),

        deleteUser: builder.mutation({
            query: ({ userId, admin }) => ({
                url: `${userId}?id=${admin}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

    })
})

export const getCurrentUser = async (id) => {
    try {
        const res = await axios.get(`${server}/api/v1/user/${id}`)
        return res.data
    } catch (error) {
        throw error
    }

}

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation, useGetUserQuery } = userAPI