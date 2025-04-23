import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

// Helper: update specific item in array
const updateItemInArray = (items, updatedItem) =>
  items.map((item) => (item.id === updatedItem.id ? updatedItem : item));

// Thunks
export const getCart = createAsyncThunk("cart/getCart", async () => {
  const { data } = await axios.get("/carts");
  return data;
});

export const inputCart = createAsyncThunk("cart/inputCart", async (item, { dispatch }) => {
  const { data } = await axios.post("/carts", item);
  dispatch(getCart()); // Optionally re-fetch, or return updated list directly
  return data;
});

export const updateCart = createAsyncThunk("cart/updateCart", async (item) => {
  const updated = { ...item, totalPrice: item.qty * item.price };
  await axios.put(`/carts/${item.id}`, updated);
  return updated;
});

export const delCart = createAsyncThunk("cart/delCart", async (id) => {
  await axios.delete(`/carts/${id}`);
  return id;
});

export const saveOrder = createAsyncThunk("cart/saveOrder", async (data, { dispatch }) => {
  await axios.post("/orders", data);
  dispatch(getCart());
  return [];
});

export const setDetail = createAsyncThunk("cart/setDetail", async (data) => data);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: [],
    loading: false,
    error: null,
    dataEdit: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(inputCart.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.data = updateItemInArray(state.data, action.payload);
      })
      .addCase(delCart.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(saveOrder.fulfilled, (state) => {
        state.data = [];
      })
      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      })

      // DRY handlers for pending/rejected
      .addMatcher(isPending(getCart, inputCart, updateCart, delCart, saveOrder), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected(getCart, inputCart, updateCart, delCart, saveOrder), (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Something went wrong";
      });
  },
});

export default cartSlice.reducer;
