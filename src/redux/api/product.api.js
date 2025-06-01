import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER;

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/product/`,
  }),
  tagTypes: ["Products", "Categories", "SingleProduct", "adminProducts", "AdminStatistics", "topReviews"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "latest",
      providesTags: ["Products"],
    }),

    getAllProducts: builder.query({
      query: () => "products",
      providesTags: ["Products"],
    }),
    getAllAdminProducts: builder.query({
      query: ({ userId }) => `all?id=${userId}`,
      providesTags: ["adminProducts"],
    }),

    getSearchProduct: builder.query({
      query: ({ search, price, category, sort, page }) => {
        let query = `my?search=${encodeURIComponent(search)}&page=${page}`;
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
      invalidatesTags: ["Products", "Categories", "AdminStatistics", "adminProducts", "SingleProduct"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, body, admin }) => ({
        url: `${id}?id=${admin}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Products", "Categories", "SingleProduct", "adminProducts", "AdminStatistics"],
    }),

    deleteProduct: builder.mutation({
      query: ({ id, admin }) => ({
        url: `${id}?id=${admin}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Categories", "SingleProduct", "adminProducts", "AdminStatistics"],
    }),

    getProductsReviews: builder.query({
      query: (id) => `reviews?id=${id}`,
      providesTags: ["SingleProduct"],
    }),
    
    getTopReviews: builder.query({
      query: () => `top-reviews`,
      providesTags: ["topReviews"],
    }),

    writeReview: builder.mutation({
      query: ({ id, data, productId }) => ({
        url: `review/new?id=${id}&productId=${productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SingleProduct", "topReviews"],
    }),

    deleteReview: builder.mutation({
      query: ({ id, authorId }) => ({
        url: `review/${id}?authorId=${authorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SingleProduct", "topReviews"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetAllAdminProductsQuery,
  useGetSearchProductQuery,
  useGetCategoriesQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsReviewsQuery,
  useGetTopReviewsQuery,
  useWriteReviewMutation,
  useDeleteReviewMutation,
} = productApi;
