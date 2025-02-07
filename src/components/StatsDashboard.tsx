import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, FileText, Table as TableIcon } from "lucide-react";
import { DataRow, calculateStats } from "@/lib/fileProcessing";

interface StatsDashboardProps {
  data: DataRow[];
}

const StatsDashboard = ({ data }: StatsDashboardProps) => {
  const stats = data.length ? calculateStats(data) : null;

  const numericColumns = stats?.columns.filter(col => col.type === 'numeric').length || 0;
  const categoricalColumns = stats?.columns.filter(col => col.type === 'categorical').length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
          <TableIcon className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalRows || 0}</div>
          <p className="text-xs text-muted-foreground">
            Ready for processing
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Columns</CardTitle>
          <FileText className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.columns.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            {numericColumns} numeric, {categoricalColumns} categorical
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missing Values</CardTitle>
          <BarChart className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats ? `${stats.missingValuesPercentage.toFixed(1)}%` : '0%'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.missingValuesPercentage <= 5 
              ? 'Well below threshold (5%)'
              : 'Above recommended threshold'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;