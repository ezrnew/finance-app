import { ColumnDef } from "@tanstack/react-table";

import { OperationHistoryType } from "@/store/portfolioSlice";
import {
  CurrencyType,
  currencyToIntlZone,
  formatDateShort,
} from "@/utils/formatters";

export const getOperationColumns = (
  currency: CurrencyType,
): ColumnDef<OperationHistoryType>[] => {
  return [
    {
      accessorKey: "accountName",
      enableHiding: false,
      header: "Account",
      cell: ({ row }) => <div className="">{row.getValue("accountName")}</div>,
    },
    {
      accessorKey: "type",
      enableHiding: false,
      header: "Type",
      cell: ({ row }) => <div className="">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "amount",
      enableHiding: false,
      header: "Amount",
      cell: ({ row }) => <div className="">{row.getValue("amount")}</div>,
    },
    {
      accessorKey: "date",
      enableHiding: false,
      header: "Date",
      cell: ({ row }) => (
        <div className="">
          {formatDateShort(
            currencyToIntlZone[currency],
            new Date(row.getValue("date")),
          )}
        </div>
      ),
    },
  ];
};
