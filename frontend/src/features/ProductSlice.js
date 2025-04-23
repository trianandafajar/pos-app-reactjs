import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/products");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch products by category
export const getProductByCategory = createAsyncThunk(
  "product/getProductByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/products?category_id=${category}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  data: null,
  loading: "idle", // idle | loading | succeeded | failed
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProduct.pending, (state) => {
        state.loading = "loading";
        state.error = null;
        state.data = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = "succeeded";
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch products";
        state.loading = "failed";
        state.data = null;
      })

      // Get products by category
      .addCase(getProductByCategory.pending, (state) => {
        state.loading = "loading";
        state.error = null;
        state.data = null;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = "succeeded";
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch products by category";
        state.loading = "failed";
        state.data = null;
      });
  },
});

export default productSlice.reducer;
