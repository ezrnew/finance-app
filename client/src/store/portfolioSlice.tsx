import { CurrencyType } from "@/utils/formatters";
import { ls } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Portfolio {
  title: string;
  currency: CurrencyType;
  totalValue: number;
  categories: { category: string; value: number }[];
  accounts: { title: string; cash: number; assets: any[] }[];
}
interface State {

    availablePortfolios:{_id:string,title:string}[]

    currentPortfolioId:string
    currentPortfolio:Portfolio | null
    // currency:string
    // categories:{category:string,value:number}[]
    // accounts:{title:string,cash:number,assets:any[]}[]
}

const initialState: State = {
    availablePortfolios:[],

    currentPortfolioId:ls.getPortfolioId() ||'',
    currentPortfolio:null

};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
        setAvailablePortfolios: (state, action: PayloadAction<{_id:string,title:string}[]>) => {
      state.availablePortfolios = action.payload;
    },
    setCurrentPortfolioId: (state, action: PayloadAction<string>) => {
        state.currentPortfolioId = action.payload;
      },
      setCurrentPortfolio: (state, action: PayloadAction<Portfolio | null>) => {
        state.currentPortfolio = action.payload;
      },
      // setCategories: (state, action: PayloadAction<{category:string,value:number}[]>) => {
      //   state.categories = action.payload;
      // },
      // setAccounts: (state, action: PayloadAction<{title:string,cash:number,assets:any[]}[]>) => {
      //   state.accounts = action.payload;
      // },
    

  },
});


export const portfolioActions = portfolioSlice.actions;

export const portfolioReducer = portfolioSlice.reducer;
