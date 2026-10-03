import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import productFiltersReducer from "@/features/products/state/productFiltersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    productFilters: productFiltersReducer,
  },
});

export default store;
