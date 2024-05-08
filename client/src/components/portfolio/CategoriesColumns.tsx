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
import {
  formatCurrency
} from "@/utils/formatters";
import { CategoriesTableItem } from "./CategoriesTable";


  export const categoriesColumns:ColumnDef<CategoriesTableItem>[]= [
    {
      accessorKey: "category",
      enableHiding: false,
      header: "Category",
      cell: ({ row }) => <div className="">{row.getValue("category")}</div>,
    },
{
          accessorKey: "value",
      header: "Total value",
      cell: ({ row }) => <div className="">{formatCurrency('PL-pl',row.getValue("value"),'PLN')}</div>,
    },
//TODO tooltip with asssets preview

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


              <DropdownMenuItem
              >
                <div className="cursor-pointer w-full">Operations</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><div className="cursor-pointer w-full">Add payment</div></DropdownMenuItem>
              <DropdownMenuItem><div className="cursor-pointer w-full">Delete account</div></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
