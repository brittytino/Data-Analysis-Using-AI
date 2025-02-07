import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileJson, FileSpreadsheet, Brain } from "lucide-react";
import { DataRow } from "@/lib/fileProcessing";
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/export";
import { useToast } from "@/components/ui/use-toast";

interface ExportPanelProps {
  data: DataRow[];
}

const ExportPanel = ({ data }: ExportPanelProps) => {
  const { toast } = useToast();

  const handleExport = (format: 'csv' | 'json' | 'ai') => {
    try {
      let content: string;
      let filename: string;

      switch (format) {
        case 'csv':
          content = exportToCSV(data);
          filename = 'dataset.csv';
          break;
        case 'json':
          content = exportToJSON(data);
          filename = 'dataset.json';
          break;
        case 'ai':
          content = exportToJSON(data);
          filename = 'dataset_ai.json';
          break;
        default:
          return;
      }

      downloadFile(content, filename);
      toast({
        title: "Export successful",
        description: `File exported as ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred during export.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-accent" />
          Export Options
        </CardTitle>
        <CardDescription>Export your processed dataset</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full gap-2"
          variant="outline"
          onClick={() => handleExport('csv')}
          disabled={!data.length}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </Button>
        <Button
          className="w-full gap-2"
          variant="outline"
          onClick={() => handleExport('json')}
          disabled={!data.length}
        >
          <FileJson className="h-4 w-4" />
          Export as JSON
        </Button>
        <Button
          className="w-full gap-2 bg-accent text-white hover:bg-accent/90"
          onClick={() => handleExport('ai')}
          disabled={!data.length}
        >
          <Brain className="h-4 w-4" />
          Export for AI Training
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;