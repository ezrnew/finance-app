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
import { formatCurrency } from "@/utils/formatters";
import { toast } from "@/utils/toasts";
import { CategoriesTableItem } from "./CategoriesTable";

interface Props {
  deleteCategory: (category: string) => void;
}

export const categoriesColumns = ({
  deleteCategory,
}: Props): ColumnDef<CategoriesTableItem>[] => {
  return [
    {
      accessorKey: "category",
      enableHiding: false,
      header: "Category",
      cell: ({ row }) => <div className="">{row.getValue("category")}</div>,
    },
    {
      accessorKey: "value",
      header: "Total value",
      cell: ({ row }) => (
        <div className="">
          {formatCurrency("PL-pl", row.getValue("value"), "PLN")}
        </div>
      ),
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
                <div className="cursor-pointer w-full">Assets</div>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <div className="cursor-pointer w-full">Operations</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  className="cursor-pointer w-full"
                  onClick={() => {
                    if (item.category === "cash") {
                      toast.cantDeleteCashCategory();
                      return;
                    }
                    if (item.value !== 0) {
                      toast.cantDeleteNonEmptyCategory();
                      return;
                    }

                    deleteCategory(item.category);
                  }}
                >
                  Delete category
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
