import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { Portfolio } from "@/store/portfolioSlice";
import { toast } from "@/utils/toasts";
import { CircleCheck, CirclePlus, XCircle } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { accountColumns } from "./tables/AccountColumns";
import { AccountsTable } from "./tables/AccountsTable";
import { categoriesColumns } from "./tables/CategoriesColumns";
import { CategoriesTable } from "./tables/CategoriesTable";

interface Props {
  portfolio: Portfolio | null;
}

export const PortfolioManageView = ({ portfolio }: Props) => {
  let location = useLocation();
  const navigate = useNavigate();

  const { currentPortfolioId } = useTypedSelector((state) => state.portfolio);

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newCategoryError, setNewCategoryError] = useState("");
  const [newAccountError, setNewAccountError] = useState("");

  const { setCurrentPortfolio } = useActions();
  const { refetchPortfolioData } = useActions();

  const submitNewCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await server.addNewCategory(
      currentPortfolioId,
      newCategoryName,
    );

    setIsCreatingCategory(false);

    const portfolio = await server.getPortfolioById(currentPortfolioId);
    setCurrentPortfolio(portfolio);
  };

  const submitNewAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    server.addNewAccount(currentPortfolioId, newAccountName);

    const result = await server.getPortfolioById(currentPortfolioId);
    setIsCreatingAccount(false);

    const portfolio = await server.getPortfolioById(currentPortfolioId);
    setCurrentPortfolio(portfolio);
  };

  const addPaymentHandler = (name: string) => {
    navigate("payment", { state: { background: location } });
  };

  const deleteAccountHandler = () => {
    navigate("deleteAccount", { state: { background: location } });
  };

  const deleteCategoryHandler = (portfolioId: string) => {
    return async (category: string) => {
      const result = await server.deleteCategory(portfolioId, category);
      if (result) {
        toast.categoryDeleteSuccess();

        refetchPortfolioData();
      } else toast.categoryDeleteFail();
    };
  };

  if (!portfolio) return null;

  return (
    <div className="flex justify-around">
      <div>
        <div className="flex w-full items-center">
          {isCreatingAccount ? (
            <>
              <form
                onSubmit={submitNewAccount}
                className="flex justify-between space-x-2"
              >
                <Input
                  value={newAccountName}
                  onChange={(e) => {
                    setNewAccountName(e.target.value);
                  }}
                  placeholder="Name"
                />

                <div className="flex space-x-1">
                  <button>
                    <CircleCheck className="text-green-500 hover:text-green-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingAccount(false);
                      setNewAccountError("");
                    }}
                  >
                    <XCircle className="text-red-500 hover:text-red-600" />
                  </button>
                </div>
              </form>
              <p className="text-red-500 font-medium pb-2">{newAccountError}</p>
            </>
          ) : (
            <div
              className="flex items-center mb-4 "
              onClick={() => {
                setIsCreatingAccount(true);
              }}
            >
              <p className="pr-3">Accounts</p>
              <CirclePlus className="text-gray-600 " />
            </div>
          )}
        </div>
        {portfolio.accounts.length > 0 ? (
          <AccountsTable
            data={portfolio.accounts}
            accountColumns={accountColumns({
              addPaymentHandler,
              deleteAccountHandler,
            })}
          />
        ) : null}
      </div>

      <div>
        <div className="flex w-full items-center">
          {isCreatingCategory ? (
            <>
              <form
                onSubmit={submitNewCategory}
                className="flex justify-between space-x-2"
              >
                <Input
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                  }}
                  placeholder="Name"
                />

                <div className="flex space-x-1">
                  <button>
                    <CircleCheck className="text-green-500 hover:text-green-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCategory(false);
                      setNewCategoryError("");
                    }}
                  >
                    <XCircle className="text-red-500 hover:text-red-600" />
                  </button>
                </div>
              </form>
              <p className="text-red-500 font-medium pb-2">
                {newCategoryError}
              </p>
            </>
          ) : (
            <div
              className="flex items-center mb-4 "
              onClick={() => {
                setIsCreatingCategory(true);
              }}
            >
              <p className="pr-3">Categories</p>
              <CirclePlus className="text-gray-600 " />
            </div>
          )}
        </div>
        {portfolio.categories.length > 0 ? (
          <CategoriesTable
            data={portfolio.categories}
            categoryColumns={categoriesColumns({
              deleteCategory: deleteCategoryHandler(currentPortfolioId),
            })}
          />
        ) : null}
      </div>
    </div>
  );
};
