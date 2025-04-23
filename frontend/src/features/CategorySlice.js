import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

// Thunk untuk ambil semua kategori
export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/categories");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Adapter untuk normalisasi state
const categoryAdapter = createEntityAdapter({
  selectId: (category) => category.id,
});

// Initial state pakai adapter + custom fields
const initialState = categoryAdapter.getInitialState({
  loading: "idle", // idle | loading | succeeded | failed
  error: null,
});

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = "succeeded";
        categoryAdapter.setAll(state, action.payload);
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

// Selector yang udah siap pakai
export const categorySelectors = categoryAdapter.getSelectors(
  (state) => state.category
);

export default categorySlice.reducer;
