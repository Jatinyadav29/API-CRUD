import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  sort: "default",
};

const productFiltersSlice = createSlice({
  name: "productFilters",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearch, setSort, resetFilters } = productFiltersSlice.actions;

export const selectSearch = (state) => state.productFilters.search;
export const selectSort = (state) => state.productFilters.sort;

export default productFiltersSlice.reducer;
