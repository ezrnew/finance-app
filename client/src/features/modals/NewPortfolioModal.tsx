import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useTypedSelector } from "@/hooks/use-redux";
import { toast } from "@/utils/toasts";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NewPortfolioModal = () => {
  const navigate = useNavigate();
  const { availablePortfolios } = useTypedSelector((state) => state.portfolio);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [newPortfolioError, setNewPortfolioError] = useState("");

  const submitNewPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const existingPortfolio = availablePortfolios.find(
      (item) => item.title.toUpperCase() === name.toUpperCase(),
    );

    if (existingPortfolio) {
      setNewPortfolioError("Portfolio with this name already exists!");
      return;
    }

    const result = await server.createNewPortfolio(name, currency);

    if (!result) {
      setNewPortfolioError("cannot create portfolio");
      return;
    }

    setName("");
    setNewPortfolioError("");
    toast.portfolioCreated();
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
        className=" max-w-80 bg-white p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative"
      >
        <form onSubmit={submitNewPortfolio} className="flex flex-col space-y-2">
          <p className="text-xl mx-auto text-center">Create new portfolio</p>

          <div className="w-11/12 my-1 mx-auto h-[1px] bg-gray-300"> </div>
          <div className="flex items-center space-x-2 ">
            <span className="w-28">Name</span>

            <Input
            className="w-fit"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center space-x-2 ">
            <span className="w-28">Currency</span>

            <InputDropdown
              data={["PLN", "USD", "EUR", "GBP"]}
              value={currency}
              setValue={setCurrency}
            />
          </div>
          <p className="text-red-500 font-medium pb-2">{newPortfolioError}</p>

          <div className="flex space-x-2 !mt-6">
            <Button className="w-1/2">Confirm</Button>{" "}
            <Button
              variant={"secondary"}
              className="w-1/2"
              type="button"
              onClick={() => {
                navigate("/portfolio");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};
