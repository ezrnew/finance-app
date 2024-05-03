import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {

    availablePortfolios:{id:string,title:string}[]

    currentPortfolioId:string
    currency:string
    categories:{category:string,value:number}[]
    accounts:{title:string,cash:number,assets:any[]}[]
}

const initialState: State = {
    availablePortfolios:[],

    currentPortfolioId:"1",
    currency:'',
    categories:[],
    accounts:[]

};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
        setAvailablePortfolios: (state, action: PayloadAction<{id:string,title:string}[]>) => {
      state.availablePortfolios = action.payload;
    },
    setCurrentPortfolioId: (state, action: PayloadAction<string>) => {
        state.currentPortfolioId = action.payload;
      },
      setCurrency: (state, action: PayloadAction<string>) => {
        state.currency = action.payload;
      },
      setCategories: (state, action: PayloadAction<{category:string,value:number}[]>) => {
        state.categories = action.payload;
      },
      setAccounts: (state, action: PayloadAction<{title:string,cash:number,assets:any[]}[]>) => {
        state.accounts = action.payload;
      },
    
    

  },
});


export const portfolioActions = portfolioSlice.actions;

export const portfolioReducer = portfolioSlice.reducer;
