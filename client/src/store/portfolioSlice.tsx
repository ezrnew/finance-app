import { CurrencyType } from "@/utils/formatters";
import { ls } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OperationType = 'sell' | 'buy' | 'withdraw' | 'deposit';
export type OperationHistoryType = {id:string; accountName: string; type: OperationType; amount: number; date: Date; asset?: string; quantity?:number; buyDate?:Date }

export interface Portfolio {
  title: string;
  currency: CurrencyType;
  totalValue: number;
  categories: { category: string; value: number }[];
  operationHistory: OperationHistoryType[];
  accounts: {id:string, title: string; cash: number; assets: any[] }[];

  // miscSlice:
  
}





interface State {

    availablePortfolios:{_id:string,title:string}[]

    currentPortfolioId:string
    currentPortfolio:Portfolio | null
    currentAccount:{id:string, title: string; cash: number; assets: any[] } | null
    // currentCategory:string


    //
    updatePortfolioData:boolean
}

const initialState: State = {
    availablePortfolios:[],

    currentPortfolioId:ls.getPortfolioId() ||'',
    currentPortfolio:null,
    currentAccount:null,
    // currentCategory:'',


    
    updatePortfolioData:false

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
      setCurrentAccount: (state, action: PayloadAction<{id:string, title: string; cash: number; assets: any[] }>) => {
        state.currentAccount = action.payload;
      },
      // setCurrentCategory: (state, action: PayloadAction<string>) => {
      //   state.currentCategory = action.payload;
      // },

      //
      refetchPortfolioData: (state) => {
        
        
        state.updatePortfolioData = !state.updatePortfolioData
      },

  },
});


export const portfolioActions = portfolioSlice.actions;

export const portfolioReducer = portfolioSlice.reducer;
