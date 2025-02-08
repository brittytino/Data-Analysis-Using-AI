
import { Button } from "@/components/ui/button";
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
import { WandIcon, Sparkles, Binary, FilterX, ArrowUpDown, Table } from "lucide-react";
import { DataRow } from "@/lib/fileProcessing";
import { cleanMissingValues, normalizeData, removeDuplicates } from "@/lib/transformations";
import { standardizeColumn, oneHotEncode, detectOutliers } from "@/lib/advancedTransformations";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface TransformPanelProps {
  data: DataRow[];
  onDataTransformed: (newData: DataRow[]) => void;
}

const TransformPanel = ({ data, onDataTransformed }: TransformPanelProps) => {
  const { toast } = useToast();
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const columns = data.length ? Object.keys(data[0]) : [];

  const handleTransform = (
    operation: 'clean' | 'normalize' | 'deduplicate' | 'standardize' | 'onehot' | 'outliers',
    label: string
  ) => {
    try {
      let transformedData: DataRow[];
      
      switch (operation) {
        case 'clean':
          transformedData = cleanMissingValues(data);
          break;
        case 'normalize':
          transformedData = normalizeData(data);
          break;
        case 'deduplicate':
          transformedData = removeDuplicates(data);
          break;
        case 'standardize':
          if (!selectedColumn) {
            toast({
              title: "Column required",
              description: "Please select a column to standardize.",
              variant: "destructive",
            });
            return;
          }
          transformedData = standardizeColumn(data, selectedColumn);
          break;
        case 'onehot':
          if (!selectedColumn) {
            toast({
              title: "Column required",
              description: "Please select a column for one-hot encoding.",
              variant: "destructive",
            });
            return;
          }
          transformedData = oneHotEncode(data, selectedColumn);
          break;
        case 'outliers':
          if (!selectedColumn) {
            toast({
              title: "Column required",
              description: "Please select a column for outlier detection.",
              variant: "destructive",
            });
            return;
          }
          const outlierIndices = detectOutliers(data, selectedColumn);
          toast({
            title: "Outliers detected",
            description: `Found ${outlierIndices.length} outliers in column ${selectedColumn}.`,
          });
          return;
        default:
          return;
      }

      onDataTransformed(transformedData);
      toast({
        title: "Transformation complete",
        description: `Successfully applied ${label.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Transformation failed",
        description: "An error occurred during transformation.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <WandIcon className="h-5 w-5 text-accent" />
          Transform Data
        </CardTitle>
        <CardDescription>Apply transformations to your dataset</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select column for transformation" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Basic Transformations</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => handleTransform('clean', 'Clean Missing Values')}
              disabled={!data.length}
            >
              <Sparkles className="h-4 w-4" />
              Clean Missing Values
            </Button>
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => handleTransform('normalize', 'Normalize Data')}
              disabled={!data.length}
            >
              <Binary className="h-4 w-4" />
              Normalize Data
            </Button>
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => handleTransform('deduplicate', 'Remove Duplicates')}
              disabled={!data.length}
            >
              <FilterX className="h-4 w-4" />
              Remove Duplicates
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Advanced Transformations</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => handleTransform('standardize', 'Standardize Column')}
              disabled={!data.length || !selectedColumn}
            >
              <ArrowUpDown className="h-4 w-4" />
              Standardize Column
            </Button>
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => handleTransform('onehot', 'One-Hot Encode')}
              disabled={!data.length || !selectedColumn}
            >
              <Table className="h-4 w-4" />
              One-Hot Encode
            </Button>
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => handleTransform('outliers', 'Detect Outliers')}
              disabled={!data.length || !selectedColumn}
            >
              <FilterX className="h-4 w-4" />
              Detect Outliers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformPanel;
