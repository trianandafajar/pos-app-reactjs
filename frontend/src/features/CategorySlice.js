import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all categories
export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async () => {
    const response = await axios.get("/categories");
    return response.data;
  }
);

// Create an entity adapter to normalize state
const categoryEntity = createEntityAdapter({
  selectId: (category) => category.id,
});

// Initial state with loading and error handling
const categorySlice = createSlice({
  name: "category",
  initialState: categoryEntity.getInitialState({
    loading: "idle", // idle | loading | succeeded | failed
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = "loading"; // Set loading state when request starts
        state.error = null; // Clear any previous errors
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = "succeeded"; // Set loading to succeeded once the data is fetched
        categoryEntity.setAll(state, action.payload);
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = "failed"; // Set loading to failed if the request fails
        state.error = action.error.message; // Store the error message
      });
  },
});

// Export selectors to use in the component
export const categorySelectors = categoryEntity.getSelectors(
  (state) => state.category
);

export default categorySlice.reducer;
