import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/user.api";
import { productApi } from "./api/product.api";
import { userSlice } from "./reducer/user.reducer";
import { productSlice } from "./reducer/product.reducer";
import { adminApi } from "./api/admin.api";
import { orderApi } from "./api/order.api";
export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    user: userSlice.reducer,
    product: productSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(productApi.middleware)
      .concat(userAPI.middleware)
      .concat(adminApi.middleware)
      .concat(orderApi.middleware),
});
