import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { Asset } from "@/store/portfolioSlice";
import { toast } from "@/utils/toasts";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SellAssetModal = () => {
  const location = useLocation();

  const id = new URLSearchParams(location.search).get("id");
  const navigate = useNavigate();

  const { currentPortfolioId, currentPortfolio } = useTypedSelector(
    (state) => state.portfolio,
  );
  const { refetchPortfolioData: updatePortfolioData } = useActions();

  //todo
  const assets = currentPortfolio?.assets || [];

  const [asset, setAsset] = useState<Asset | null>(
    /*  id ? assets.find((asset: Asset) => asset.id === id) : */ null,
  );

  const [quantity, setQuantity] = useState(0);
  const [currencyRate, setCurrencyRate] = useState(0);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!asset) return;

    const result = await server.sellAsset(
      currentPortfolioId,
      asset.id,
      asset.category,
      asset.accountId,
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
        className=" bg-white max-w-96 p-4 rounded-xl m-auto text-gray-700 font-semibold flex flex-col relative"
      >
        <form onSubmit={submitForm} className="flex flex-col space-y-2 ">
          <p className="text-2xl text-center pb-4">Sell asset</p>

          <div
            onClick={() => {
              navigate("/portfolio");
            }}
            className="absolute right-4   cursor-pointer  "
          >
            <X />
          </div>

          <FormField label={"Asset"}>
            <InputDropdown data={assets} value={asset} setValue={setAsset} />
          </FormField>

          <FormField label={"Quantity"}>
            <Input
              className="w-fit"
              value={quantity}
              disabled={!asset}
              onChange={(e) => {
                setQuantity(
                  Number(e.target.value) > (asset?.quantity || 0)
                    ? asset?.quantity || 0
                    : Number(e.target.value),
                );
              }}
              type="number"
              max={(asset && asset.quantity) || 0}
            />
          </FormField>

          {asset ? (
            <p className="mx-auto text-xs text-gray-700/70">
              available: {asset.quantity}
            </p>
          ) : null}

          <FormField label="Currency Rate">
            <Input
              className="w-fit"
              value={currencyRate}
              disabled={!asset}
              onChange={(e) => {
                setCurrencyRate(Number(e.target.value));
              }}
              type="number"
            />
          </FormField>

          <Button className="!mt-4">Sell</Button>
        </form>
      </div>
    </ModalWrapper>
  );
};
