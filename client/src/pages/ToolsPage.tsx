import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { cn } from "@/lib/utils";
import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
  formatDateFull,
} from "@/utils/formatters";
import { toast } from "@/utils/toasts";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const ToolsPage = () => {
  const [tickerSearch, setTickerSearch] = useState("");
  const [tickerData, setTickerData] = useState<{
    name: string;
    price: number;
    currency: CurrencyType;
    date: string;
    stockMarket?: string;
  } | null>(null);

  const submitFindTicker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTickerData(null);
    const promise = new Promise(async (res, rej) => {
      const result = await server.findTicker(tickerSearch);
      if (!result) rej("invalid request");
      setTickerData(result.data);
      if (result.new === true) res("isNew");
      else rej("isNotNew");
    });

    await toast.scrappingNewTicker(promise);
  };

  return (
    <div className="flex-grow bg-neutral-50 flex flex-col  ">
      <form
        onSubmit={submitFindTicker}
        className="flex flex-col m-auto rounded-md p-4"
      >
        <p className="mx-auto text-lg font-semibold pb-4">Add a listed asset</p>
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              className="pl-10"
              placeholder="Search for ticker..."
              value={tickerSearch}
              onChange={(e) => {
                setTickerSearch(e.target.value);
              }}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-700 peer-focus:text-gray-900"
            />
          </div>
          <Button>Submit</Button>
        </div>
        <div></div>
        <div
          className={cn(
            "flex flex-col h-52 p-6 border rounded-lg my-10",
            !tickerData && " invisible",
          )}
        >
          {tickerData ? (
            <>
              <p className="text-center text-2xl font-semibold">
                {tickerData.name && tickerData.name.toUpperCase()}
              </p>
              <p className="text-xl pb-4 mx-auto">
                {formatDateFull(
                  currencyToIntlZone[tickerData?.currency],
                  new Date(tickerData?.date),
                )}
              </p>
              <p className="text-xl">
                Price: ‎
                {formatCurrency(
                  currencyToIntlZone[tickerData.currency],
                  tickerData.price,
                  tickerData?.currency,
                )}
              </p>
              <p className="text-xl">Currency: {tickerData?.currency}</p>
              <p className="text-xl">Stock Market: {tickerData?.stockMarket}</p>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
};
