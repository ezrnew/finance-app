import { PortfolioManageView } from "@/components/portfolio/PortfolioManageView";
import { PortfolioPieChart } from "@/components/portfolio/PortfolioPieChart";
import { PortfolioSidebar } from "@/components/portfolio/PortfolioSidebar";
import { getPortfolioColumns } from "@/components/portfolio/tables/PortfolioColumns";
import { PortfolioTable } from "@/components/portfolio/tables/PortfolioTable";
import { Button } from "@/components/ui/button";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
} from "@/utils/formatters";
import { toast } from "@/utils/toasts";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PortfolioHistoricalChart } from "./PortfolioHistoricalChart";

let initialRender = true;
export const PortfolioPage = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const { currentPortfolio } = useTypedSelector((state) => state.portfolio);
  const { currentPortfolioId, updatePortfolioData } = useTypedSelector(
    (state) => state.portfolio
  );
  const { showPortfolioSidebar } = useTypedSelector((state) => state.misc);
  const { setAvailablePortfolios, setCurrentPortfolio } = useActions();
  const [isManageView, setIsManageView] = useState(false);
  //todo
  const assets = useMemo(() => {
    console.log("PORTFOLIO", currentPortfolio);
    const updatedAssets = structuredClone(currentPortfolio?.assets);

    if (updatedAssets) {
      updatedAssets.forEach(
        (asset) =>
          // @ts-ignore
          (asset.account = currentPortfolio?.accounts.find(
            (item) => item.id === asset.accountId
          )?.title)
      );
    }

    return updatedAssets;
  }, [currentPortfolio]);

  useEffect(() => {
    const fetchAllPortfolios = async () => {
      const portfolios = await server.getAllPortfolios();

      setAvailablePortfolios(portfolios);
    };
    fetchAllPortfolios();
  }, []);

  useEffect(() => {
    if (initialRender) {
      initialRender = false;
      return;
    }
    const getPortfolioData = async () => {
      const portfolio = await server.getPortfolioById(currentPortfolioId);

      setCurrentPortfolio(portfolio);

      const portfolioWithReevaluatedValues = await server.reevaluateAssets(
        currentPortfolioId
      );

      setCurrentPortfolio(portfolioWithReevaluatedValues);
    };

    getPortfolioData();
  }, [currentPortfolioId]);

  useEffect(() => {
    const reevaluateAssets = async () => {
      const portfolioWithReevaluatedValues = await toast.updatingPortfolioData(
        server.reevaluateAssets(currentPortfolioId)
      );
      setCurrentPortfolio(portfolioWithReevaluatedValues);
    };
    reevaluateAssets();
  }, [updatePortfolioData]);

  const sellAssetHandler = (id: string) => {
    navigate(`sell?id=${id}`, { state: { background: location } });
  };

  return (
    <div className="flex-grow bg-white flex flex-col  ">
      <div className="flex w-full h-full">
        {showPortfolioSidebar ? <PortfolioSidebar /> : null}

        <div className="h-full w-full shadow-lg overflow-auto">
          <div className=" text-2xl font-semibold flex flex-col flex-grow   max-w-screen-xl mx-auto ">
            <div className="flex justify-between p-6 ">
              <span className="flex space-x-2">{currentPortfolio?.title} </span>


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
                    Operations
                  </Link>
                </Button>

                <Button asChild>
                  <Link to="history" state={{ background: location }}>
                    History
                  </Link>
                </Button>

              </div>
            </div>
            <div className="w-11/12 mx-auto h-[1px] bg-gray-200" />

            <div className="w-full mx-auto lg:p-6 px-2 ">
              {isManageView ? (
                <PortfolioManageView portfolio={currentPortfolio} />
              ) : (
                <div className="  w-full mx-auto pt-6 xl:p-6 ">
                  <PortfolioPieChart
                    totalValueLabel={formatCurrency(
                      currencyToIntlZone[
                        currentPortfolio?.currency as CurrencyType
                      ],
                      currentPortfolio?.totalValue || 0,
                      currentPortfolio?.currency || "PLN"
                    )}
                    data={
                      currentPortfolio
                        ? [
                            {
                              category: "cash",
                              value: currentPortfolio.freeCash,
                            },
                            ...currentPortfolio?.categories,
                          ]
                        : []
                    }
                    currency={
                      currentPortfolio?.currency || ("PLN" as CurrencyType)
                    }
                    freeCash={currentPortfolio?.freeCash || 0}
                    assets={assets || []}
                  />

                  <PortfolioTable
                    data={assets || []}
                    portfolioColumns={getPortfolioColumns(
                      currentPortfolio?.currency || "PLN",
                      sellAssetHandler
                    )}
                  />


                </div>

                
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export function getFlattenAssets(
//   accounts: { title: string; cash: number; assets: any[] }[]
// ) {
//   const result: any = [];

//   accounts.forEach((account) => {
//     const { title, assets } = account;
//     assets.forEach((asset) => {
//       result.push({ ...asset, account: title });
//     });
//   });

//   return result;
// }
