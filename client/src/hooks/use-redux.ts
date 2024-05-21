import { useMemo } from "react";
import { AppDispatch, RootState } from "../store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { portfolioActions } from "@/store/portfolioSlice";
import { miscActions } from "@/store/miscSlice";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const useAppDispatch: () => AppDispatch = useDispatch;

const rootActions = {
  ...portfolioActions,
  ...miscActions,
};

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    return bindActionCreators(rootActions, dispatch);
  }, [dispatch]);
};
