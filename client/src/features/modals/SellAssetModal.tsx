import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { InputDropdownCustom } from "@/components/ui/input-dropdown-custom";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useTypedSelector } from "@/hooks/use-redux";
import { getFlattenAssets } from "@/pages/PortfolioPage";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SellAssetModal = () => {
  const navigate = useNavigate();

  const { currentPortfolio,currentPortfolioId } = useTypedSelector((state) => state.portfolio);

  
  const assets = getFlattenAssets(currentPortfolio?.accounts || []);
  console.log("ASSETY",assets)

  const [asset, setAsset] = useState<any>({});

  const [quantity,setQuantity] = useState(0)

  console.log("plaskie", assets);

  console.log("ASSECIKS", asset);

  const submitForm = async(e: React.FormEvent<HTMLFormElement>) =>{
e.preventDefault()

const result = await server.sellAsset(currentPortfolioId,asset.id,asset.category,asset.account,quantity)


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
          <div className="flex items-center space-x-2">
            <p>Asset</p>

            <InputDropdownCustom
              data={assets}
              value={asset}
              setValue={setAsset}
            />
          </div>

          <div className="flex items-center space-x-2">
            <p>Quantity</p>

            <Input
            value={quantity}
            onChange={(e)=>{setQuantity((Number(e.target.value)>asset.quantity) ?asset.quantity:Number(e.target.value) )}}
              type="number" max={asset && asset.quantity || 0}
            />
          </div>

          <Button>Sell</Button>
        </form>
      </div>
    </ModalWrapper>
  );
};
