import { Button } from "@/components/ui/button";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useTypedSelector } from "@/hooks/use-redux";
import { useEffect, useState } from "react";
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface PortfolioTimeseries {
  timestamp: number;
  value: number;
  ownContribution: number;
}

interface RechartsLines {
  dataKey: string;
  color: string;
}

const intialLines: RechartsLines[] = [
  { dataKey: "value", color: "#8884d8" },
  { dataKey: "ownContribution", color: "#82ca9d" },
];

// todo fetch available benchmarks from db
const benchmarkData: { value: string; name: string }[] = [
  { value: "cpi-polish", name: "Polish Inflation" },
];

const modifiersData: { value: string; name: string }[] = [
  { value: "-3", name: "- 3 percentage points" },
  { value: "-2", name: "- 2 percentage points" },
  { value: "-1", name: "- 1 percentage point" },
  { value: "1", name: "+ 1 percentage point" },
  { value: "2", name: "+ 2 percentage points" },
  { value: "3", name: "+ 3 percentage points" },
  { value: "4", name: "+ 4 percentage points" },
  { value: "5", name: "+ 5 percentage points" },
];

export const PortfolioHistoricalChart = () => {
  const [data, setData] = useState<PortfolioTimeseries[]>([]);
  const [lines, setLines] = useState<RechartsLines[]>(intialLines);
  const [newBenchmark, setNewBenchmark] = useState<{
    value: string;
    name: string;
  } | null>(null);
  const [newModifier, setNewModifier] = useState<{
    value: string;
    name: string;
  } | null>(null);

  const { currentPortfolioId, currentPortfolio } = useTypedSelector(
    (state) => state.portfolio
  );

  //todo memo lines
  const renderLines = () => {
    return lines.map((line) => (
      <Line
        key={line.dataKey}
        type={"monotone"}
        dataKey={line.dataKey}
        stroke={line.color}
        dot={false}
      />
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await server.getPortfolioTimeseries(
        currentPortfolioId,
        currentPortfolio?.createdAt || new Date(),
        new Date(Date.now())
      );

      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col space-y-6 ">
      <div className=" flex border rounded-md p-4 justify-between mx-auto space-x-4">
        <div className="flex ">
          <InputDropdown
            label="New Benchmark"
            data={benchmarkData}
            value={newBenchmark}
            setValue={setNewBenchmark}
          />

          <div className="w-4"></div>

          <InputDropdown
            label="Modifier"
            data={modifiersData}
            value={newModifier}
            setValue={setNewModifier}
          />
        </div>
        <Button disabled={!newBenchmark} className="">
          {" "}
          Add{" "}
        </Button>
      </div>

      <ResponsiveContainer className={"p-6"} width="100%" height="95%">
        <LineChart data={[...data]}>
          {renderLines()}
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            interval={"equidistantPreserveStart"}
            tickCount={10}
          />
          <YAxis />

          <Tooltip content={<CustomTooltip />} />

          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
//@ts-ignore
const CustomTooltip = ({ active, payload, label }: any) => {
  console.log("payoload", payload);
  console.log("label", label);

  if (active && payload && payload.length) {
    const difference = (payload[0].value / payload[1].value) * 100 - 100;

    console.log("difference", difference);

    const differenceColorClass =
      difference > 0 ? "text-green-500" : "text-red-500";

    return (
      <div className="px-3 w-60 bg-white rounded-md border border-stone-400 flex flex-col">
        <p className="mx-auto text-xs my-2">{`${new Date(
          label
        ).toLocaleDateString()} `}</p>

        <p className="xd">{`Total Value: ${payload[0].value}`}</p>
        <p className="xd">{`Base: ${payload[1].value}`}</p>

        <p className={differenceColorClass}>{`Difference: ${difference.toFixed(
          2
        )} %`}</p>
      </div>
    );
  }

  return null;
};
