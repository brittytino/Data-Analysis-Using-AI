import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WandIcon, Sparkles, Binary, FilterX } from "lucide-react";
import { DataRow } from "@/lib/fileProcessing";
import { cleanMissingValues, normalizeData, removeDuplicates } from "@/lib/transformations";
import { useToast } from "@/components/ui/use-toast";

interface TransformPanelProps {
  data: DataRow[];
  onDataTransformed: (newData: DataRow[]) => void;
}

const TransformPanel = ({ data, onDataTransformed }: TransformPanelProps) => {
  const { toast } = useToast();

  const handleTransform = (
    operation: 'clean' | 'normalize' | 'deduplicate',
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
      </CardContent>
    </Card>
  );
};

export default TransformPanel;