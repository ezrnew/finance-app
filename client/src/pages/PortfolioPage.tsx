import { PortfolioManageView } from "@/components/portfolio/PortfolioManageView";
import { PortfolioPieChart } from "@/components/portfolio/PortfolioPieChart";
import { PortfolioSidebar } from "@/components/portfolio/PortfolioSidebar";
import { PortfolioTable } from "@/components/portfolio/tables/PortfolioTable";
import { Button } from "@/components/ui/button";
import { EXAMPLE_PORTFOLIO } from "@/data/example_data";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
} from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const PortfolioPage = () => {
  // const data = EXAMPLE_PORTFOLIO;
  const { currentPortfolio } = useTypedSelector((state) => state.portfolio);
  const assets = getFlattenAssets(currentPortfolio?.accounts || []);

  const [isManageView, setIsManageView] = useState(false);

  let location = useLocation();

  // useTypedSelector(state => state.portfolio)

  console.log("SAAAAAAAAAA",currentPortfolio)

  //todo create routes

  return (
    <div className="flex-grow bg-white flex flex-col  ">
      <div className="flex w-full h-full">
        <PortfolioSidebar />

        <div className="h-full w-full shadow-lg">
          <div className="p-4 text-2xl font-semibold flex flex-col flex-grow   max-w-screen-xl mx-auto ">
            <div className="flex justify-between p-6 ">
              <span>{currentPortfolio?.title}</span>
              <div className="flex space-x-2 md:space-x-4">
                <Button asChild>
                  <Link to="buy" state={{ background: location }}>
                    Buy
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="sell" state={{ background: location }}>
                    Sell
                  </Link>
                </Button>
                <div className="w-[1px] my-auto h-4/5 bg-gray-200" />
                <Button
                  onClick={() => {
                    setIsManageView((item) => !item);
                  }}
                >
                  {" "}
                  {isManageView ? "Done" : "Manage"}{" "}
                </Button>
                <Button asChild>
                  <Link to="operations" state={{ background: location }}>
                    History
                  </Link>
                </Button>
              </div>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          </div> */}
            <div className="w-11/12 mx-auto h-[1px] bg-gray-200" />

            <div className="w-full mx-auto p-6 ">
              {/* <p>Total value: { ,)}</p> */}

              {isManageView?
             <PortfolioManageView portfolio={currentPortfolio}/> : 
             
            

              <div className="  w-full mx-auto px-6 ">
                <PortfolioPieChart
                  totalValueLabel={formatCurrency(
                    currencyToIntlZone[
                      currentPortfolio?.currency as CurrencyType
                    ],
                    currentPortfolio?.totalValue || 0,
                    currentPortfolio?.currency || "PLN"
                  )}
                  data={currentPortfolio?.categories || []}
                  currency={
                    currentPortfolio?.currency || ("PLN" as CurrencyType)
                  }
                />

                <PortfolioTable
                  data={assets}
                  currency={currentPortfolio?.currency || ""} //todo
                />
              </div> }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function getFlattenAssets(accounts: { title: string; cash: number; assets: any[] }[]) {
  const result: any = [];

  accounts.forEach((account) => {
    const { title, assets } = account;
    assets.forEach((asset) => {
      result.push({ ...asset, account: title });
    });
  });

  return result;
}
