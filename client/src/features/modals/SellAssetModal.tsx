import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputDropdownCustom } from "@/components/ui/input-dropdown-custom";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { getFlattenAssets } from "@/pages/PortfolioPage";
import { toast } from "@/utils/toasts";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SellAssetModal = () => {
  const navigate = useNavigate();

  const { currentPortfolio, currentPortfolioId } = useTypedSelector(
    (state) => state.portfolio,
  );
  const { refetchPortfolioData: updatePortfolioData } = useActions();

  const assets = getFlattenAssets(currentPortfolio?.accounts || []);

  const [asset, setAsset] = useState<any>(null);

  const [quantity, setQuantity] = useState(0);
  const [currencyRate, setCurrencyRate] = useState(0);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await server.sellAsset(
      currentPortfolioId,
      asset.id,
      asset.category,
      asset.account,
      quantity,
    );
    if (result) {
      toast.operationSuccessful();
      updatePortfolioData();
    } else {
      toast.sellOperationFailure();
    }
    navigate("/portfolio");
  };

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
          <p className="text-2xl text-center ">Sell asset</p>

          <div
            onClick={() => {
              navigate("/portfolio");
            }}
            className="absolute right-4   cursor-pointer"
          >
            <X />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            Asset
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
              disabled={!asset}
              onChange={(e) => {
                setQuantity(
                  Number(e.target.value) > asset.quantity
                    ? asset.quantity
                    : Number(e.target.value),
                );
              }}
              type="number"
              max={(asset && asset.quantity) || 0}
            />
          </div>
          {asset ? (
            <p className="mx-auto text-xs text-gray-700">
              available: {asset.quantity}
            </p>
          ) : null}

          <div className=" flex">
            <p>Currency rate</p>

            <Input
              value={currencyRate}
              disabled={!asset}
              onChange={(e) => {
                setCurrencyRate(Number(e.target.value));
              }}
              type="number"
            />
          </div>

          <Button>Sell</Button>
        </form>
      </div>
    </ModalWrapper>
  );
};
