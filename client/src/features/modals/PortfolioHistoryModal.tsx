import { OperationsTable } from "@/components/portfolio/tables/OperationsTable";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { useTypedSelector } from "@/hooks/use-redux";
import { PortfolioHistoricalChart } from "@/pages/PortfolioHistoricalChart";
import { useNavigate } from "react-router-dom";

export const PortfolioHistoryModal = () => {
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
        className=" bg-white h-4/5 w-4/5 p-4 rounded-md m-auto text-gray-700 font-semibold flex flex-col relative"
      >

<PortfolioHistoricalChart/>


      </div>
    </ModalWrapper>
  );
};
