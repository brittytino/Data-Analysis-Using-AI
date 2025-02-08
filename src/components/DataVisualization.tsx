
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { DataRow } from "@/lib/fileProcessing";
import { generateDistributionChart, generateTemporalChart } from "@/lib/dataVisualizations";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import { detectColumnFormat } from "@/lib/formatDetection";

interface DataVisualizationProps {
  data: DataRow[];
}

const DataVisualization = ({ data }: DataVisualizationProps) => {
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  
  const columns = data.length ? Object.keys(data[0]) : [];
  const columnFormat = selectedColumn ? detectColumnFormat(data.map(row => row[selectedColumn])) : null;
  
  const chartData = selectedColumn 
    ? (columnFormat?.type === 'date' 
        ? generateTemporalChart(data, selectedColumn, columns[1]) 
        : generateDistributionChart(data, selectedColumn))
    : null;

  if (!data.length) return null;

  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-accent" />
          Data Visualization
        </CardTitle>
        <CardDescription>Visualize your dataset distributions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>
                  {column}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded ${
                chartType === "bar" ? "bg-accent text-white" : "bg-gray-100"
              }`}
            >
              <BarChart className="h-5 w-5" />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-2 rounded ${
                chartType === "line" ? "bg-accent text-white" : "bg-gray-100"
              }`}
            >
              <LineChart className="h-5 w-5" />
            </button>
          </div>
        </div>
        {chartData && (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <RechartsBarChart
                  data={chartData.labels.map((label, index) => ({
                    name: label,
                    value: chartData.datasets[0].data[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    name={chartData.datasets[0].label}
                  />
                </RechartsBarChart>
              ) : (
                <RechartsLineChart
                  data={chartData.labels.map((label, index) => ({
                    name: label,
                    value: chartData.datasets[0].data[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    name={chartData.datasets[0].label}
                  />
                </RechartsLineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
