import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  currencyToIntlZone,
  formatCurrency,
  formatDateShort,
} from "@/utils/formatters";

interface Props {
  data: any[];
  currency: "PLN" | "GBP"; //todo
}

export const PortfolioTable = ({ data, currency }: Props) => {
  console.log("ASSETY", data);

  return (
    <div className=" max-w-screen-xl mx-auto">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="">Quantity</TableHead>
            <TableHead className="">Account</TableHead>
            <TableHead className="text-right">Buy Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((asset) => (
            <TableRow key={asset.title}>
              <TableCell className="font-medium">{asset.title}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>
                {formatCurrency(
                  currencyToIntlZone[currency],
                  asset.value,
                  currency
                )}
              </TableCell>
              <TableCell className="">{asset.quantity}</TableCell>
              <TableCell className="">{asset.account}</TableCell>
              <TableCell className="text-right">
                {formatDateShort(currencyToIntlZone[currency], asset.buyDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
