
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import TransformPanel from "@/components/TransformPanel";
import ExportPanel from "@/components/ExportPanel";
import StatsDashboard from "@/components/StatsDashboard";
import DataVisualization from "@/components/DataVisualization";
import { Database, BrainCircuit } from "lucide-react";
import { DataRow } from "@/lib/fileProcessing";

const Index = () => {
  const [data, setData] = useState<DataRow[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Database className="h-10 w-10 text-accent" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Ready Dataset Creator
            </h1>
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your unstructured data into AI-ready datasets with our intuitive tools
          </p>
        </div>

        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <FileUpload onDataLoaded={setData} />
        </div>

        <div className="mb-8">
          <StatsDashboard data={data} />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Data Preview</h2>
                <DataPreview data={data} />
              </div>
            </div>
            <DataVisualization data={data} />
          </div>
          <div className="space-y-8">
            <TransformPanel data={data} onDataTransformed={setData} />
            <ExportPanel data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
