import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "@/utils/toasts";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DeleteAccountModal = () => {
  const navigate = useNavigate();

  const { currentAccount } = useTypedSelector((state) => state.portfolio);
  const  {currentPortfolioId}= useTypedSelector(state => state.portfolio)
  const {refetchPortfolioData} = useActions()

  const submitForm = async(e: React.FormEvent<HTMLFormElement>) =>{
e.preventDefault()

const res = await server.deleteAccount(currentPortfolioId,currentAccount?.id||"")
if(res){

    toast.operationSuccessful()
    refetchPortfolioData()


}else{
  toast.operationFailure()
}
navigate('/portfolio')
}



  return (
    <ModalWrapper
      onClick={() => {
        navigate("/portfolio");
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" max-w-80 bg-white p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative"
      >
        <form onSubmit={submitForm} className="flex flex-col space-y-2">
        <p className="text-xl mx-auto text-center">Are you sure?</p>

<div className="w-11/12 my-1 mx-auto h-[1px] bg-gray-300"> </div>
<p className="mx-auto text-center text-base">Account  {currentAccount?.title} and all its assets will be removed from portfolio </p>

          <div className="w-full flex flex-col">


  
          </div>

<div className="flex space-x-2 !mt-6">

          <Button className="w-1/2">Confirm</Button> <Button  variant={'secondary'} className="w-1/2" type="button" onClick={()=>{        navigate("/portfolio")}}>Cancel</Button>
</div>
        </form>
      </div>
    </ModalWrapper>
  );
};
