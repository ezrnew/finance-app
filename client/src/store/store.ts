import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { portfolioReducer } from "./portfolioSlice";
import { miscReducer } from "./miscSlice";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  misc: miscReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
