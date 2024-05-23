import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { InputDropdownCustom } from "@/components/ui/input-dropdown-custom";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { toast } from "@/utils/toasts";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type assetType = {
  name: string;
  type: string;
  currency: string;
  price: number;
};

export const BuyAssetModal = () => {
  const { currentPortfolio, currentPortfolioId } = useTypedSelector(
    (state) => state.portfolio,
  );

  const navigate = useNavigate();

  const [availableAssets, setAvailableAssets] = useState<assetType[]>([]);

  const [asset, setAsset] = useState<assetType | null>(null);
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [currency, setCurrency] = useState("");
  const [currencyRate, setCurrencyRate] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const { refetchPortfolioData } = useActions();

  const [paymentAdded, setPaymentAdded] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      const data = await server.getAllAssetNames();

      setAvailableAssets(data);
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    setCurrency(asset?.currency || "");
    setPrice(asset?.price || 0);
  }, [asset]);

  const categoryNames = currentPortfolio?.categories.map(
    (item) => item.category,
  );
  const accountNames = currentPortfolio?.accounts.map((item) => item.title);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationResult = validateData();
    if (!validationResult) return;

    const result = await server.buyAsset(
      currentPortfolioId,
      category,
      account,
      // @ts-ignore
      asset,
      date,
      currency,
      currencyRate,
      price,
      quantity,
      paymentAdded,
    );
    if (result) {
      toast.operationSuccessful();
      refetchPortfolioData();
    } else {
      toast.buyOperationFailure();
    }
    navigate("/portfolio");
  };

  function validateData() {
    if (currencyRate < 0) {
      setError("Invalid currency rate");
      return false;
    }
    if (price < 0) {
      setError("Invalid price");
      return false;
    }
    if (quantity < 0) {
      setError("Invalid quantity");
      return false;
    }

    const acc = currentPortfolio?.accounts.find(
      (item) => item.title === account,
    );
    if (!acc) {
      setError("account doesnt exist!");
      return false;
    }

    const canAfford = price * quantity <= acc.cash;
    if (!canAfford && !paymentAdded) {
      setError(
        "You dont have enought cash on selected account. Did you mean to include 'Add Payment to account' option?",
      );
      return false;
    }

    if (!asset) return false;
    if (!date) return false;

    return true;
  }

  return (
    <ModalWrapper
      onClick={() => {
        navigate("/portfolio");
      }}
    >
      <form
        onSubmit={submitForm}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" bg-white max-w-96 p-4 rounded-xl m-auto text-gray-700 font-semibold flex flex-col relative"
      >
        <p className="text-2xl text-center pb-4">Buy asset</p>
        <div
          onClick={() => {
            navigate("/portfolio");
          }}
          className="absolute right-4  cursor-pointer pt-[6px]"
        >
          <X />
        </div>
        <div className="flex flex-col p-2 space-y-2">
          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Asset</span>

            <InputDropdownCustom
              data={availableAssets || []}
              value={asset}
              setValue={setAsset}
              placeholder="Search Assets..."
            />
          </div>

          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Category</span>

            <InputDropdown
              data={categoryNames?.filter((item) => item !== "cash") || []}
              value={category}
              setValue={setCategory}
              placeholder="Search Categories..."
            />
          </div>

          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Account</span>

            <InputDropdown
              data={accountNames || []}
              value={account}
              setValue={setAccount}
              placeholder="Search Accounts..."
            />
          </div>
          {/* <div className="h-[1px] !my-3 mx-auto w-4/5 bg-gray-200" /> */}

          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Date</span>

            <Datepicker date={date} setDate={setDate} />
          </div>

          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Currency </span>

            <InputDropdown
            
              data={["PLN", "USD", "EUR", "GBP"]}
              value={currency}
              setValue={setCurrency}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Currency Rate</span>
            <Input
            className="w-fit"
              value={currencyRate}
              onChange={(e) => {
                setCurrencyRate(Number(e.target.value));
              }}
              type="number"
            />
          </div>

          <div className="flex items-center justify-between space-x-2 ">
            <span className="w-28">Unit Price</span>

            <Input
            className="w-fit"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
              type="number"
            />
          </div>
          <div className="flex flex-shrink-0 items-center justify-between space-x-2 ">
            <span className="w-28">Quantity</span>

            <Input
                        className="w-fit"

              value={quantity}
              onChange={(e) => {
                setQuantity(Number(e.target.value));
              }}
            />
          </div>

          <div className="flex items-center  space-x-2 pt-2 ">
            <input
              type="checkbox"
              checked={paymentAdded}
              onChange={() => {
                setPaymentAdded((item) => !item);
              }}
              id="checkbox-payment"
            />
            <label htmlFor="checkbox-payment">Add payment to account </label>
          </div>

          <p className="text-red-500 font-medium pb-2">{error}</p>

          <Button>Buy</Button>
        </div>
      </form>
    </ModalWrapper>
  );
};
