import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
} from "@/utils/formatters";
import React from "react";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

const colors = ["#0088FE", "#00C49F", "#0088FE"];

interface Props {
  totalValueLabel: string;
  data: { category: string; value: number }[];
  currency: CurrencyType;
}

export const PortfolioPieChart = ({
  totalValueLabel,
  data,
  currency,
}: Props) => {
  return (
    // <div className="mx-auto">
    <ResponsiveContainer height={400}>
      <PieChart>
        <Pie
          style={{ outline: "none" }}
          // data={(()=>{const newData =data.filter(item => item.category!=="cash");newData.push(data[0]);return newData})()}
          data={data}
          dataKey="value"
          nameKey="category"
          // cx="50%"
          // cy="50%"
          innerRadius={90}
          cornerRadius={4}
          paddingAngle={1}
          startAngle={-268}
          endAngle={90}
          // outerRadius={90}
          // fill="#8884d8"
          label={(data) => renderCustomizedLabel(data)}
        >
          <Label
            className={"text-2xl font-semibold"}
            value={totalValueLabel}
            position="center"
            fill="#374151"
          />
{     ( ()=>{

// console.log("ciasto data",data.filter(item=>item.category!=='cash'));
return <div/>
})()}
          {
      
          data.map(
            (item: { category: string; value: number }, index: number) => {
              // console.log("items",item,colors[index % colors.length])


              return <Cell key={index} fill={item.category==="cash"?'#FFBB28': colors[index % colors.length]} />;
              
              
            }
          )}
        </Pie>
        {/* //todo */}
        <Tooltip
          formatter={(value) =>
            formatCurrency(
              currencyToIntlZone[currency],
              Number(value),
              currency
            )
          }
        />
        <Legend
          content={(item) => {
            return renderLegend(item.payload);
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    // </div>
  );
};

function renderLegend(legendItems: Payload[] | undefined) {
  if (legendItems === undefined) return <div />;

  // console.log("LEGEND ITEMS", legendItems);

  return (
    <div className="flex space-x-2 text-base justify-center text-gray-700 items-center h-full">
      {legendItems
        .filter((item) => item.value !== "cash")
        .map((item) => (
          <div key={item.value} className="border p-1 pr-3  flex rounded-md ">
            <div
              style={{ background: item.color }}
              className="size-4 mx-2 rounded my-auto"
            />

            <span>{item.payload?.category}</span>
          </div>
        ))}
      <div className="w-[1px] h-6 bg-gray-300"></div>

      <div className="border p-1 pr-3  flex rounded-md ">
        <div
          style={{ background: "#FFBB28" }}
          className="size-4 mx-2 rounded my-auto"
        />
        <span>cash</span>
      </div>
    </div>
  );
}

const renderCustomizedLabel = ({
  // @ts-ignore
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  if (percent === 0) return;

  return (
    <text
      className="text-lg   drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
