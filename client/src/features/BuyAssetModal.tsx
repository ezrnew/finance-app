import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Datepicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useTypedSelector } from "@/hooks/use-redux";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const BuyAssetModal = () => {
  const { categories, accounts } = useTypedSelector((state) => state.portfolio);

  const navigate = useNavigate();

  const [availableAssets, setAvailableAssets] = useState<string[]>([]);

  const [asset, setAsset] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [currency, setCurrency] = useState("");
  const [currencyRate, setCurrencyRate] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const [addPayment, setAddPayment] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      const data = await server.getAllAssetNames();

      const mergedArray = data.bonds_pltr.concat(data.tickers); //todo iterate over keys when there are more categories further

      setAvailableAssets(mergedArray);
      console.log("dejta", data);
    };

    fetchAssets();
  }, []);

  const categoryNames = categories.map((item) => item.category);
  const accountNames = accounts.map((item) => item.title);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const result = validateData();
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

    const acc = accounts.find((item) => item.title === account);
    if (!acc) {
      setError("account doesnt exist!");
      return false;
    }

    console.log("prajs i kesz", price * quantity, acc.cash);
    const canAfford = price * quantity <= acc.cash;
    if (!canAfford && !addPayment) {
      setError(
        "You dont have enought cash on selected account. Did you mean to include 'Add Payment to account' option?"
      );
      return false;
    }


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
          className="absolute right-4  cursor-pointer"
        >
          <X />
        </div>
        <div className="flex flex-col p-2 space-y-2">
          <div className="flex items-center space-x-2 ">
            <span>Asset</span>

            <InputDropdown
              data={availableAssets || []}
              value={asset}
              setValue={setAsset}
              placeholder="Search Assets..."
            />
          </div>

          <div className="flex items-center space-x-2 ">
            <span>Category</span>

            <InputDropdown
              data={categoryNames}
              value={category}
              setValue={setCategory}
              placeholder="Search Categories..."
            />
          </div>

          <div className="flex items-center space-x-2 ">
            <span>Account</span>

            <InputDropdown
              data={accountNames}
              value={account}
              setValue={setAccount}
              placeholder="Search Accounts..."
            />
          </div>
          <div className="h-[1px] mx-auto w-4/5 bg-gray-200" />

          <div className="flex items-center space-x-2 ">
            <span>Date</span>

            <Datepicker date={date} setDate={setDate} />
          </div>

          <div className="flex items-center space-x-2 ">
            <span>Currency </span>

            {/* //todo data */}
            <InputDropdown
              data={["PLN", "USD", "EUR", "GBP"]}
              value={currency}
              setValue={setCurrency}
            />
          </div>

          {/* //todo popup info "at buy time" */}
          <div className="flex items-center space-x-2 ">
            <span>Currency Rate</span>
            <Input type="number" />
          </div>

          <div className="flex items-center space-x-2 ">
            <span>Unit Price</span>

            <Input />
          </div>
          <div className="flex items-center space-x-2 ">
            <span>Quantity</span>

            <Input />
          </div>

          <div className="flex items-center space-x-2 ">
            {/* //todo shadcn style checkbox */}
            <input
              type="checkbox"
              checked={addPayment}
              onChange={() => {
                setAddPayment((item) => !item);
              }}
              id="checkbox-payment"
            />
            <label htmlFor="checkbox-payment">Add payment to account </label>
          </div>

          <p className="text-red-500 font-medium pb-2">{error}</p>

          {/* <div className="flex -center space-x-2 "> */}
          <Button>Buy</Button>
          {/* </div> */}
        </div>
      </form>
    </ModalWrapper>
  );
};
