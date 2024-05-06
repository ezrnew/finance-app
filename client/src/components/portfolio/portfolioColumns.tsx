import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PortfolioTableItem } from "./PortfolioTable";
import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
  formatDateShort,
} from "@/utils/formatters";

export const getPortfolioColumns = (
  currency: CurrencyType
): ColumnDef<PortfolioTableItem>[] => {
  return [
    {
      accessorKey: "name",
      enableHiding: false,
      header: "Asset",
      cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },

    {
      accessorKey: "value",
      header: () => <div className="">Value</div>,
      cell: ({ row }) => {
        const item = row.original;

        const amount = parseFloat(item.price*item.quantity);

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
      accessorKey: "buyDate",
      header: "Buy Date",
      cell: ({ row }) => (
        <div className="">
          {formatDateShort(
            currencyToIntlZone[currency],
            row.getValue("buyDate")
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
              <DropdownMenuItem
              >
                <div className="cursor-pointer w-full">History</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><div className="cursor-pointer w-full">Buy</div></DropdownMenuItem>
              <DropdownMenuItem><div className="cursor-pointer w-full">Sell</div></DropdownMenuItem>
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
