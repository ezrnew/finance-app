import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const BuyModal = () => {

    const navigate = useNavigate();


  return (
    <ModalWrapper onClick={()=>{navigate('/portfolio')}}>
      <div className=" bg-white p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative">
        <p className="text-2xl text-center pb-4">Buy asset</p>
<div onClick={()=>{navigate('/portfolio')}} className="absolute right-4  cursor-pointer"><X/></div>
        <div className="flex flex-col p-2 space-y-2">
          <div className="flex items-center space-x-2 ">
            <span>Asset</span>

            <InputDropdown />
          </div>

          <div className="flex items-center space-x-2 ">
            <span>Category</span>

            <InputDropdown />
          </div>

          <div className="flex items-center space-x-2 ">
            <span>Account</span>

            <InputDropdown />
          </div>
          <div className="h-[1px] mx-auto w-4/5 bg-gray-200" />

          <div className="flex items-center space-x-2 ">
            <span>Date</span>

            <Input />
          </div>
          <div className="flex items-center space-x-2 ">
            <span>Quantity</span>

            <Input />
          </div>
          <div className="flex items-center space-x-2 ">
            <span>Price</span>

            <Input />
          </div>

          <div className="flex items-center space-x-2 ">
            <Checkbox id="checkbox-payment" />
            <label htmlFor="checkbox-payment">add payment </label>
          </div>


          {/* <div className="flex -center space-x-2 "> */}
          <Button>Buy</Button>
          {/* </div> */}

      
        </div>
      </div>
    </ModalWrapper>
  );
};
