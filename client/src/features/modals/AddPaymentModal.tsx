import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { InputDropdownCustom } from "@/components/ui/input-dropdown-custom";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { getFlattenAssets } from "@/pages/PortfolioPage";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "@/utils/toasts";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddPaymentModal = () => {
  const navigate = useNavigate();

  const { currentAccount,currentPortfolioId } = useTypedSelector((state) => state.portfolio);
  const { setCurrentPortfolio,refetchPortfolioData: updatePortfolioData } = useActions();

  const [_,refetch] = useState(false)

  const [amount,setAmount] = useState<number>(0)
  

  const submitForm = async(e: React.FormEvent<HTMLFormElement>) =>{
e.preventDefault()

console.log('KWOTA',amount)
console.log('KONTOO',currentAccount)

const res = await server.addOperation(currentPortfolioId,currentAccount?.id||"",amount)
if(res){

  toast.operationSuccessful()  
  updatePortfolioData()
  navigate('/portfolio')
}else{
  toast.operationFailure()
}
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
        className=" bg-white p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative"
      >
        <form onSubmit={submitForm} className="flex flex-col space-y-2">

<p className="text-xl mx-auto">Add operation</p>
<div className="w-11/12 my-1 mx-auto h-[1px] bg-gray-300"> </div>

          <div className="w-full flex flex-col">

            <p className="mx-auto"> {currentAccount?.title}</p>
            <p className="mx-auto">{formatCurrency('Pl-pl',currentAccount?.cash||0,'PLN')}</p>
          </div>

          <div className="flex items-center space-x-2">


             <p>Amount:</p>     
              <Input
              type="number"
                          value={amount}
                          onChange={(e)=>{setAmount(Number(e.target.value))}}
              /> 

            
            

  
          </div>

<div className="flex space-x-2 !mt-6">

          <Button className="">Make Operation</Button> <Button  variant={'secondary'} className="w-full" type="button" onClick={()=>{        navigate("/portfolio")}}>Close</Button>
</div>
        </form>
      </div>
    </ModalWrapper>
  );
};
