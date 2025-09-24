import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";

interface FilterState {
  date: DateRange | undefined;
  priceRange: number[];
  search: string;
}

const initialState: FilterState = {
  date: undefined,
  priceRange: [],
  search: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<DateRange | undefined>) => {
      state.date = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<number[]>) => {
      state.priceRange = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    clearFilters: (state) => {
      state.date = undefined;
      state.priceRange = [];
      state.search = "";
    },
  },
});

export const { setDate, setPriceRange, setSearch, clearFilters } =
  filterSlice.actions;

export const filterReducer = filterSlice.reducer;
