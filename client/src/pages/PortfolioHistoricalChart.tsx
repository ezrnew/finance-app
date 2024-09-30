import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { InputDropdown } from "@/components/ui/input-dropdown";
import { server } from "@/connection/backend/backendConnectorSingleton";
import { useTypedSelector } from "@/hooks/use-redux";
import React, { useEffect, useState } from "react";
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
  timestamp: string;
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
const benchmarkData: {value:string,name:string}[] = [
    { value: "cpi-polish", name: "Polish Inflation" },
  ];

  const modifiersData: {value:string,name:string}[] = [
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
  const [newBenchmark, setNewBenchmark] = useState<{value:string,name:string}|null>(null);
  const [newModifier, setNewModifier] = useState<{value:string,name:string}|null>(null);


  const { currentPortfolioId } = useTypedSelector((state) => state.portfolio);

  const formatXAxis = (item: string) => {
    const utcDate = new Date(item);

    const day = utcDate.getUTCDate().toString().padStart(2, "0");
    const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = utcDate.getUTCFullYear().toString();

    const hours = utcDate.getUTCHours().toString().padStart(2, "0");
    const minutes = utcDate.getUTCMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

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
        new Date(Date.now() - 24 * 60 * 60 * 1000) || new Date(Date.now()),
        new Date(Date.now())
      );

      console.log("dane", data);
      const formattedData: PortfolioTimeseries[] = [];
      data.forEach((item: any) => {
        formattedData.push({
          timestamp: item.timestamp,
          value: item.value,
          ownContribution: item.ownContribution,
        });
      });

      setData(formattedData);
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
        <Button disabled={!newBenchmark} className=""> Add </Button>
        
      </div>

      <ResponsiveContainer 
        className={"p-6"}
        width="100%"
        height="95%"
      >
        <LineChart data={data}>
          {renderLines()}
          <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
          <YAxis />

          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
