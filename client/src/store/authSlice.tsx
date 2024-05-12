import { CurrencyType } from "@/utils/formatters";
import { ls } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  username: string;
}

const initialState: State = {
  username: "",
};

const authSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export const authReducer = authSlice.reducer;
