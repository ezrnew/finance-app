import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const SellAssetModal = () => {

    const navigate = useNavigate();


  return (
    <ModalWrapper onClick={()=>{navigate('/portfolio')}}>
      <div  onClick={(e)=>{e.stopPropagation()}} className=" bg-white p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative">
      sell fms+9
      </div>
    </ModalWrapper>
  );
};
