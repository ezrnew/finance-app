import { OperationsTable } from "@/components/portfolio/tables/OperationsTable";
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

export const PortfolioOperationsHistoryModal = () => {
  const navigate = useNavigate();

  const { currentPortfolio } = useTypedSelector((state) => state.portfolio);


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

<div className="w-full min-w-96">


<OperationsTable currency={currentPortfolio?.currency || "PLN"} data={currentPortfolio?.operationHistory ||[]}/>
</div>


      </div>
    </ModalWrapper>
  );
};
