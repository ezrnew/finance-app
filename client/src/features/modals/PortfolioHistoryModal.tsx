import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { PortfolioHistoricalChart } from "@/pages/PortfolioHistoricalChart";
import { useNavigate } from "react-router-dom";

export const PortfolioHistoryModal = () => {
  const navigate = useNavigate();

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
        className=" bg-white h-3/5 w-4/5 p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative"
      >
        <PortfolioHistoricalChart />
      </div>
    </ModalWrapper>
  );
};
