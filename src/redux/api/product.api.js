import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/product/`,
  }),
  tagTypes: ["Products", "Categories", "SingleProduct"],
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: () => "latest",
      providesTags: ["Products"],
    }),


    getAllProducts: builder.query({
      query: () => "products",
      providesTags: ["Products"],
    }),


    getSearchProduct: builder.query({
      query: ({ search, price, category, sort, page }) => {
        let query = `all?search=${encodeURIComponent(search)}&page=${page}`;
        if (price) query += `&price=${price}`;
        if (category) query += `&category=${category}`;
        if (sort) query += `&sort=${sort}`;
        return query;
      },
      providesTags: ["Products"],
    }),


    getCategories: builder.query({
      query: () => "category",
      providesTags: ["Categories"],
    }),

    getSingleProduct: builder.query({
      query: (id) => `${id}`,
      providesTags: ["SingleProduct"],
    }),


    createProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `create?id=${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products", "Categories", 'AdminStatistics'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, body, admin }) => ({
        url: `${id}?id=${admin}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Products", "Categories", "SingleProduct"],
    }),

    deleteProduct: builder.mutation({
      query: ({ id, admin }) => ({
        url: `${id}?id=${admin}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),


  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetSearchProductQuery,
  useGetCategoriesQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsQuery,
} = productApi;
