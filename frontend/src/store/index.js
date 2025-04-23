import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/CategorySlice";
import productReducer from "../features/ProductSlice";
import cartReducer from "../features/CartSlice";

// Middleware setup (can add custom middleware or logging if needed)
const middleware = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false, // Disable serializableCheck for complex data (optional)
  });

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
  },
  middleware, // Add custom middleware if needed
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in non-production environments
});
