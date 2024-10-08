import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Tooltip } from "react-tooltip";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
  formatDateShort,
} from "@/utils/formatters";
import { Asset } from "@/store/portfolioSlice";

export const getPortfolioColumns = (
  currency: CurrencyType,
  sellAssetHandler: (id: string) => void,
): ColumnDef<Asset>[] => {
  return [
    {
      accessorKey: "name",
      enableHiding: false,
      header: "Asset",
      cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
    },

    {
      accessorKey: "value",
      header: () => <div className="">Value</div>,
      cell: ({ row }) => {
        const item = row.original;

        const amount = item.price * item.quantity;

        return (
          <div className=" font-medium">
            {formatCurrency(currencyToIntlZone[currency], amount, currency)}
          </div>
        );
      },
    },

    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("quantity")}</div>
      ),
    },

    {
      accessorKey: "originalCurrencyPrice",
      header: "Price",
      cell: ({ row }) => {
        //? cannot start with number
        const id = "a" + row.original.id;
        return (
          <div
            id={id}
            className={cn(
              row.original.originalCurrencyPrice >
                row.original.originalCurrencyBuyPrice && "text-green-500 ",
              row.original.originalCurrencyPrice <
                row.original.originalCurrencyBuyPrice && "text-red-500",
            )}
          >
            {formatCurrency(
              currencyToIntlZone[row.original.currency],
              row.getValue("originalCurrencyPrice"),
              row.original.currency,
            )}
            <Tooltip anchorSelect={"#" + id} place={"bottom"}>
              <p
                className={cn(
                  row.original.originalCurrencyPrice >
                    row.original.originalCurrencyBuyPrice && "text-green-500 ",
                  row.original.originalCurrencyPrice <
                    row.original.originalCurrencyBuyPrice && "text-red-500",
                )}
              >
                {" "}
                {(
                  (row.original.originalCurrencyPrice /
                    row.original.originalCurrencyBuyPrice -
                    1) *
                  100
                ).toFixed(2) + "%"}
              </p>
            </Tooltip>
          </div>
        );
      },
    },
    {
      accessorKey: "originalCurrencyBuyPrice",
      header: "Buy Price",
      cell: ({ row }) => (
        <div className="">
          {formatCurrency(
            currencyToIntlZone[row.original.currency],
            row.getValue("originalCurrencyBuyPrice"),
            row.original.currency,
          )}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Buy Date",
      cell: ({ row }) => (
        <div className="">
          {formatDateShort(
            currencyToIntlZone[currency],
            new Date(row.getValue("date")),
          )}
        </div>
      ),
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => <div className="">{row.getValue("account")}</div>,
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <button className="cursor-pointer w-full text-left">
                  History
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="cursor-pointer w-full text-left">Buy</button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => {
                    sellAssetHandler(item.id);
                  }}
                  className="cursor-pointer w-full text-left"
                >
                  Sell
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

/*
{ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Asset
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            }
*/
