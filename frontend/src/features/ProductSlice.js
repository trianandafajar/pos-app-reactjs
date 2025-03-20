import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const getProduct = createAsyncThunk("product/getProduct", async () => {
  const response = await axios.get("/products");
  return response.data;
});

// Fetch products by category
export const getProductByCategory = createAsyncThunk(
  "product/getProductByCategory",
  async (category) => {
    const response = await axios.get(`/products?category_id=${category}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    loading: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = "loading"; // Set loading state
        state.error = null;
        state.data = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = "succeeded"; // Request succeeded
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = "failed"; // Request failed
        state.data = null;
      })
      // Fetch products by category
      .addCase(getProductByCategory.pending, (state) => {
        state.loading = "loading"; // Set loading state
        state.error = null;
        state.data = null;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = "succeeded"; // Request succeeded
        state.error = null;
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = "failed"; // Request failed
        state.data = null;
      });
  },
});

export default productSlice.reducer;
