import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch cart
export const getCart = createAsyncThunk("cart/getCart", async () => {
  const response = await axios.get("/carts");
  return response.data;
});

// Add new cart item
export const inputCart = createAsyncThunk("cart/inputCart", async (data, { dispatch }) => {
  await axios.post("/carts", data);
  dispatch(getCart()); // Refetch or directly add item to state if needed
  return data;
});

// Update existing cart item
export const updateCart = createAsyncThunk("cart/updateCart", async (data) => {
  await axios.put(`/carts/${data.id}`, data);
  return data;  // Return updated data directly
});

// Delete cart item
export const delCart = createAsyncThunk("cart/delCart", async (id) => {
  await axios.delete(`/carts/${id}`);
  return id;  // Return deleted ID
});

// Update cart with quantity calculation
export const updCart = createAsyncThunk("cart/updCart", async (data) => {
  data.totalPrice = data.qty * data.price;
  await axios.put(`/carts/${data.id}`, data);
  return data;  // Return updated data directly
});

// Save order and clear cart
export const saveOrder = createAsyncThunk("cart/saveOrder", async (data, { dispatch }) => {
  await axios.post("/orders", data);
  // After saving, empty the cart (no need to re-fetch if updating directly)
  dispatch(getCart());
  return [];
});

// Set cart detail for editing
export const setDetail = createAsyncThunk("cart/setDetail", async (data) => {
  return data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: null,
    loading: false,
    error: null,
    dataEdit: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch cart";
        state.loading = false;
      })
      // Input cart item
      .addCase(inputCart.fulfilled, (state, action) => {
        state.data = action.payload;  // Optionally update cart state
        state.loading = false;
      })
      .addCase(inputCart.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to add item to cart";
        state.loading = false;
      })
      // Update cart item
      .addCase(updateCart.fulfilled, (state, action) => {
        const updatedCart = state.data.map(item =>
          item.id === action.payload.id ? action.payload : item
        );
        state.data = updatedCart;
        state.loading = false;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to update cart item";
        state.loading = false;
      })
      // Save order and reset cart
      .addCase(saveOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.data = [];  // Reset cart after order
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to save order";
        state.loading = false;
      })
      // Set cart detail for editing
      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      })
      // Delete cart item
      .addCase(delCart.fulfilled, (state, action) => {
        state.data = state.data.filter(item => item.id !== action.payload);
      })
      // Update cart item with quantity calculation
      .addCase(updCart.fulfilled, (state, action) => {
        const updatedCart = state.data.map(item =>
          item.id === action.payload.id ? action.payload : item
        );
        state.data = updatedCart;
      });
  },
});

export default cartSlice.reducer;
