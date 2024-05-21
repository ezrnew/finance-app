import {
  CurrencyType,
  currencyToIntlZone,
  formatCurrency,
} from "@/utils/formatters";
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
  assets: any[];
  freeCash: number;
}

export const PortfolioPieChart = ({
  totalValueLabel,
  data,
  currency,
  assets,
  freeCash,
}: Props) => {
  return (
    <ResponsiveContainer height={400}>
      <PieChart>
        <Pie
          style={{ outline: "none" }}
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={90}
          cornerRadius={4}
          paddingAngle={1}
          startAngle={-268}
          endAngle={90}
          label={(data) => renderCustomizedLabel(data)}
        >
          <Label
            className={"text-2xl font-semibold"}
            value={totalValueLabel}
            position="center"
            fill="#374151"
          />

          {data.map(
            (item: { category: string; value: number }, index: number) => {
              return (
                <Cell
                  key={index}
                  fill={
                    item.category === "cash"
                      ? "#FFBB28"
                      : colors[index % colors.length]
                  }
                />
              );
            }
          )}
        </Pie>

        <Tooltip
          content={<CustomTooltip currency={currency} assets={assets} />}
        />
        <Legend
          content={(item) => {
            return renderLegend(item.payload, freeCash);
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

function renderLegend(legendItems: Payload[] | undefined, cash: number) {
  if (legendItems === undefined) return <div />;

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

      {cash > 0 ? (
        <>
          <div className="w-[1px] h-6 bg-gray-300"></div>

          <div className="border p-1 pr-3  flex rounded-md ">
            <div
              style={{ background: "#FFBB28" }}
              className="size-4 mx-2 rounded my-auto"
            />
            <span>cash</span>
          </div>
        </>
      ) : null}
    </div>
  );
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
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

type TooltipProps = {
  currency: CurrencyType;
  assets: any[];
  active: boolean;
  payload: any[];
};

const CustomTooltip = ({ currency, assets, active, payload }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-gray-400 p-4 rounded-md flex flex-col text-xl">
      <p>
        {payload[0].name}:{" "}
        {formatCurrency(
          currencyToIntlZone[currency],
          payload[0].value,
          currency
        )}
      </p>

      {assets ? (
        <>
          <div className="h-[1px] mx-auto w-4/5 my-1 bg-gray-300" />
          <ul>
            {assets
              .filter((item) => item.category === payload[0].name)
              .map((item) => (
                <li key={item.id}>
                  {item.name}:{" "}
                  {formatCurrency(
                    currencyToIntlZone[currency],
                    item.price * item.quantity,
                    currency
                  )}
                </li>
              ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};
