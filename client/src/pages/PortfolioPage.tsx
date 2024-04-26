import { PortfolioTable } from "@/components/portfolio/portfolioTable";
import { Button } from "@/components/ui/button";
import { EXAMPLE_PORTFOLIO } from "@/data/example_data";
import { useNavigate } from "react-router-dom";

export const PortfolioPage = () => {
  const data = EXAMPLE_PORTFOLIO;

  const navigate = useNavigate();

  return (
    <div className="flex-grow bg-white flex flex-col  ">
      <div className="flex w-full h-full">
        <div className="w-52 bg-neutral-50 hidden md:block "></div>

        <div className="p-4 text-2xl font-semibold flex flex-col flex-grow  shadow-lg">
          <div className="flex justify-between p-6">
            <span>{data.title}</span>
            <div className="flex space-x-2 md:space-x-4 md:mr-4">
              <Button>Buy</Button>
              <Button>Sell</Button>
              <Button>History</Button>
            </div>
          </div>
          <div className="w-11/12 mx-auto h-[1px] bg-gray-200" />
          <PortfolioTable
            data={getFlattenAssets(data.accounts)}
            currency={data.currency as "PLN"} //todo
          />
        </div>
      </div>
    </div>
  );
};

function getFlattenAssets(data: any) {
  const result: any = [];

  data.forEach((account) => {
    const { title, assets } = account;
    assets.forEach((asset) => {
      result.push({ ...asset, account: title });
    });
  });

  return result;
}
