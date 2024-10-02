import { CurrencyType } from "@/utils/formatters";
import { ls } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OperationType = "sell" | "buy" | "withdraw" | "deposit";
export type OperationHistoryType = {
  id: string;
  accountName: string;
  type: OperationType;
  amount: number;
  date: Date;
  asset?: string;
  quantity?: number;
  buyDate?: Date;
};

export type AssetType = "bond_pltr" | "ticker";

export type Asset = {
  accountId: string;
  category: string;

  type: AssetType;
  id: string;
  name: string;
  date: Date;
  currency: CurrencyType;
  currencyRate: number;
  buyPrice: number;
  price: number;
  originalCurrencyPrice: number;
  originalCurrencyBuyPrice: number;
  quantity: number;
};

export interface Portfolio {
  title: string;
  currency: CurrencyType;
  totalValue: number;
  freeCash: number;
  categories: { category: string; value: number }[];
  operationHistory: OperationHistoryType[];
  accounts: { id: string; title: string; cash: number }[];
  assets: Asset[];
  createdAt: Date;
  timeseriesValueLastUpdate: Date;
}

interface State {
  availablePortfolios: { _id: string; title: string }[];

  currentPortfolioId: string;
  currentPortfolio: Portfolio | null;
  currentAccount: {
    id: string;
    title: string;
    cash: number;
  } | null;

  updatePortfolioData: boolean;
}

const initialState: State = {
  availablePortfolios: [],

  currentPortfolioId: ls.getPortfolioId() || "",
  currentPortfolio: null,
  currentAccount: null,
  updatePortfolioData: false,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setAvailablePortfolios: (
      state,
      action: PayloadAction<{ _id: string; title: string }[]>
    ) => {
      state.availablePortfolios = action.payload;
    },
    setCurrentPortfolioId: (state, action: PayloadAction<string>) => {
      state.currentPortfolioId = action.payload;
    },
    setCurrentPortfolio: (state, action: PayloadAction<Portfolio | null>) => {
      state.currentPortfolio = action.payload;
    },
    setCurrentAccount: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        cash: number;
      }>
    ) => {
      state.currentAccount = action.payload;
    },

    refetchPortfolioData: (state) => {
      state.updatePortfolioData = !state.updatePortfolioData;
    },
  },
});

export const portfolioActions = portfolioSlice.actions;

export const portfolioReducer = portfolioSlice.reducer;
