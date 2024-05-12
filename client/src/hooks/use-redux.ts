import { useMemo } from "react";
import { AppDispatch, RootState } from "../store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { portfolioActions } from "@/store/portfolioSlice";
import { authActions } from "@/store/authSlice";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const useAppDispatch: () => AppDispatch = useDispatch;

const rootActions = {
  ...portfolioActions,
  ...authActions,
};

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    return bindActionCreators(rootActions, dispatch);
  }, [dispatch]);
};
