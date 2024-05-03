import { PortfolioPieChart } from "@/components/portfolio/PortfolioPieChart";
import { PortfolioSidebar } from "@/components/portfolio/PortfolioSidebar";
import { PortfolioTable } from "@/components/portfolio/PortfolioTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { EXAMPLE_PORTFOLIO, PORTFOLIOS } from "@/data/example_data";
import { BuyAssetModal } from "@/features/BuyAssetModal";
import { useActions, useTypedSelector } from "@/hooks/use-redux";
import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
} from "@/utils/formatters";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const PortfolioPage = () => {
  const data = EXAMPLE_PORTFOLIO;
  const assets = getFlattenAssets(data.accounts);
  let location = useLocation();

  const [portfolioId,setPortfolioId] = useState<string>('')
  const [portfolioData,setPortfolioData] = useState()

  // useTypedSelector(state => state.portfolio)

  const {setAvailablePortfolios,setCurrentPortfolioId,setCurrency,setCategories,setAccounts} = useActions()


  const [portfolios, setPortfolios] = useState<any[]>([])
  //todo create routes



  useEffect(() => {
    setPortfolios(PORTFOLIOS)//fetch
  }, [])


  useEffect(() => {
    setCurrentPortfolioId(data.id)
    setCurrency(data.currency)
    setCategories(data.categories)
    setAccounts(data.accounts)
  }, [portfolioId])
  

  return (
    <div className="flex-grow bg-white flex flex-col  ">
      <div className="flex w-full h-full">
        
        <PortfolioSidebar portfolios={PORTFOLIOS} setPortfolioId={setPortfolioId} />
        {/* <div className="max-w-60 xl:w-full w-52 bg-neutral-50 hidden md:block p-4 ">
          <div className="flex justify-between">
            <p className="text-lg font-semibold my-auto">Portfolios</p>
            <Button variant="ghost" size="icon">
              <PlusCircle />
            </Button>
          </div>

          <div className="h-[1px]  my-1 w-full bg-gray-200" />

          <ul className="flex flex-col py-2 font-semibold">
            {portfolios.map(item => <li onClick={()=>{setPortfolioId(item.id)}}    key={item.id}>{item.title}</li>)}
          </ul>
        </div> */}

<div className="h-full w-full shadow-lg">

        <div className="p-4 text-2xl font-semibold flex flex-col flex-grow   max-w-screen-xl mx-auto ">
          <div className="flex justify-between p-6 ">
            <span>{data.title}</span>
            <div className="flex space-x-2 md:space-x-4">
              <Button asChild >
              <Link to='buy' state={{background:location}}>

              Buy
              </Link>
              </Button>
              <Button asChild><Link to='sell' state={{background:location}}>

Sell
</Link></Button>
              <div className="w-[1px] my-auto h-4/5 bg-gray-200" />
              <Button>Manage</Button>
              <Button>History</Button>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          </div> */}
          <div className="w-11/12 mx-auto h-[1px] bg-gray-200" />

          <div className="w-full mx-auto p-6 ">
            {/* <p>Total value: { ,)}</p> */}

            <div className="  w-full mx-auto px-6 ">
              <PortfolioPieChart
                totalValueLabel={formatCurrency(
                  currencyToIntlZone[data.currency as CurrencyType],
                  data.totalValue,
                  data.currency
                )}
                data={data.categories}
                currency={data.currency as CurrencyType}
              />
            </div>
          </div>

          <PortfolioTable
            data={assets}
            currency={data.currency} //todo
          />
        </div>
        </div>


      </div>
    </div>
  );
};

export function getFlattenAssets(data: any) {
  const result: any = [];

  data.forEach((account: any) => {
    const { title, assets } = account;
    assets.forEach((asset: any) => {
      result.push({ ...asset, account: title });
    });
  });

  return result;
}

