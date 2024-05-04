import { Portfolio } from "@/store/portfolioSlice";
import { CircleCheck, CirclePlus, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { server } from "@/connection/backend/backendConnectorSingleton";

interface Props {
  portfolio: Portfolio | null;
}

export const PortfolioManageView = ({ portfolio }: Props) => {
  console.log("porfolijo", portfolio);

  const {currentPortfolioId} = useTypedSelector(state => state.portfolio)

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newCategoryError, setNewCategoryError] = useState('')
  const [newAccountError, setNewAccountError] = useState('')

console.log("konta aeadaddaw",portfolio?.accounts)
const {setCurrentPortfolio} = useActions()

  const submitNewCategory = async(e:React.FormEvent<HTMLFormElement>) =>{





    e.preventDefault()

   const result = await server.addNewCategory(currentPortfolioId,newCategoryName)//todo handle response/errors
    
    setIsCreatingCategory(false)

    const portfolio = await server.getPortfolioById(currentPortfolioId)
    setCurrentPortfolio(portfolio)
  }
  
  
  const submitNewAccount = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    
    server.addNewAccount(currentPortfolioId,newAccountName)//todo handle response/errors
    
    const result = await server.getPortfolioById(currentPortfolioId)
    setIsCreatingAccount(false)


    const portfolio = await server.getPortfolioById(currentPortfolioId);
    setCurrentPortfolio(portfolio)

    
  }

  if (!portfolio) return null;

  console.log("huj", portfolio.accounts);
  console.log("huj2", portfolio.categories);

  return (
    <div className="flex justify-around">
      <div>
        <div className="flex w-full items-center">
          <p>Accounts</p>
        </div>
        <ul className="border rounded-md">
          {portfolio.accounts.map((item) => (
            <li>{item.title}</li>
          ))}
        </ul>


        {isCreatingAccount ? (
            <>
            <form onSubmit={submitNewAccount} className='flex justify-between space-x-2'>
            <Input value={newAccountName} onChange={(e)=>{setNewAccountName(e.target.value)}}  placeholder='Name'/>
        
            <div className='flex space-x-1'>
            <button>
            <CircleCheck className='text-green-500 hover:text-green-600'/>
        
            </button>
            <button type='button' onClick={()=>{setIsCreatingAccount(false);setNewAccountError('')}} >
                <XCircle className='text-red-500 hover:text-red-600'/>
            </button>
            </div>
          </form>
          <p className="text-red-500 font-medium pb-2">{newAccountError}</p>
          </>
          ) : (
            <li className="flex items-center" onClick={() => {setIsCreatingAccount(true)}}>
              <CirclePlus />
            </li>
          )}
      </div>

      <div>
        <div className="flex w-full items-center">
          <p>Categories</p>
        </div>
        <ul className="border rounded-md">
          {portfolio.categories.map((item) => (
            <li>{item.category}</li>
          ))}

          {isCreatingCategory ? (
            <>
            <form onSubmit={submitNewCategory} className='flex justify-between space-x-2'>
            <Input value={newCategoryName} onChange={(e)=>{setNewCategoryName(e.target.value)}}  placeholder='Name'/>
        
            <div className='flex space-x-1'>
            <button>
            <CircleCheck className='text-green-500 hover:text-green-600'/>
        
            </button>
            <button type='button' onClick={()=>{setIsCreatingCategory(false);setNewCategoryError('')}} >
                <XCircle className='text-red-500 hover:text-red-600'/>
            </button>
            </div>
          </form>
          <p className="text-red-500 font-medium pb-2">{newCategoryError}</p>
          </>
          ) : (
            <li className="flex items-center" onClick={() => {setIsCreatingCategory(true)}}>
              <CirclePlus />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
