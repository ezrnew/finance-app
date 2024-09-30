import { OperationsTable } from "@/components/portfolio/tables/OperationsTable";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { useTypedSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router-dom";

export const PortfolioOperationsModal = () => {
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
          <OperationsTable
            currency={currentPortfolio?.currency || "PLN"}
            data={currentPortfolio?.operationHistory || []}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};
