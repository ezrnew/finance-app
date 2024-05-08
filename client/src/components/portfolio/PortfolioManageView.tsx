import { Portfolio } from "@/store/portfolioSlice";
import { CircleCheck, CirclePlus, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { AccountsTable } from "./AccountsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { CategoriesTable } from "./CategoriesTable";
import { accountColumns } from "./AccountColumns";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  portfolio: Portfolio | null;
}

export const PortfolioManageView = ({ portfolio }: Props) => {
  console.log("porfolijo", portfolio);
  let location = useLocation();

  const { currentPortfolioId } = useTypedSelector((state) => state.portfolio);

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newCategoryError, setNewCategoryError] = useState("");
  const [newAccountError, setNewAccountError] = useState("");

  console.log("konta aeadaddaw", portfolio?.accounts);
  const { setCurrentPortfolio } = useActions();
  const navigate = useNavigate();

  const submitNewCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await server.addNewCategory(
      currentPortfolioId,
      newCategoryName
    ); //todo handle response/errors

    setIsCreatingCategory(false);

    const portfolio = await server.getPortfolioById(currentPortfolioId);
    setCurrentPortfolio(portfolio);
  };

  const submitNewAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    server.addNewAccount(currentPortfolioId, newAccountName); //todo handle response/errors

    const result = await server.getPortfolioById(currentPortfolioId);
    setIsCreatingAccount(false);

    const portfolio = await server.getPortfolioById(currentPortfolioId);
    setCurrentPortfolio(portfolio);
  };

  const addPaymentHandler = (name:string) =>{

    console.log("pizza",name)
    navigate('payment',{state:{background:location}})

  }

  if (!portfolio) return null;

  console.log("huj", portfolio.accounts);
  console.log("huj2", portfolio.categories);

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

        <AccountsTable data={portfolio.accounts} accountColumns={accountColumns({addPaymentHandler})} />

        {/* 
        <ul className=" rounded-md space-y-2 pb-4">
          {portfolio.accounts.map((item) => (
            <li className="border border-gray-200 rounded-lg p-2 text-lg" >{item.title}</li>
          ))}
        </ul> */}


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

        <CategoriesTable data={portfolio.categories} />
{/* 
        <ul className="border rounded-md">
          {portfolio.categories.map((item) => (
            <li>{item.category}</li>
          ))} */}


        {/* </ul> */}
      </div>
    </div>
  );
};
