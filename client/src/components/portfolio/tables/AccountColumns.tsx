import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { portfolioActions } from "@/store/portfolioSlice";
import { store } from "@/store/store";
import {
  formatCurrency
} from "@/utils/formatters";
import { AccountsTableItem } from "./AccountsTable";

interface Props {
  addPaymentHandler: (accountName: string) => void;
  deleteAccountHandler: () => void;
}
export const accountColumns = ({
  addPaymentHandler,
  deleteAccountHandler,
}: Props): ColumnDef<AccountsTableItem>[] => {
  return [
    {
      accessorKey: "title",
      enableHiding: false,
      header: "Title",
      cell: ({ row }) => <div className="">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "cash",
      header: "Free cash",
      cell: ({ row }) => (
        <div className="">
          {formatCurrency("PL-pl", row.getValue("cash"), "PLN")}
        </div>
      ),
    },
 //todo
    // {
    //   accessorKey: "assets",
    //   header: "Assets",
    //   cell: ({ row }) => (
    //     <div className="">{row.getValue("assets").length}</div>
    //   ),
    // },

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
                <div className="cursor-pointer w-full">Assets</div>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <div className="cursor-pointer w-full">Operations</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  onClick={() => {
                    store.dispatch(portfolioActions.setCurrentAccount(item));
                    addPaymentHandler(item.title);
                  }}
                  className="cursor-pointer w-full"
                >
                  Add payment
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div
                  onClick={() => {
                    store.dispatch(portfolioActions.setCurrentAccount(item));
                    deleteAccountHandler();
                  }}
                  className="cursor-pointer w-full"
                >
                  Delete account
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
