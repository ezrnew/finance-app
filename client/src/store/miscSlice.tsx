import { CurrencyType } from "@/utils/formatters";
import { ls } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  showPortfolioSidebar: boolean;
}

const initialState: State = {
  showPortfolioSidebar: true,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setShowPortfolioSidebar: (state, action: PayloadAction<boolean>) => {
      state.showPortfolioSidebar = action.payload;
    },
  },
});

export const miscActions = miscSlice.actions;

export const miscReducer = miscSlice.reducer;
