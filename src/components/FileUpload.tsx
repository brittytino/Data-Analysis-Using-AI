import { useState } from "react";
import { Upload, FileUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parseCSV } from "@/lib/fileProcessing";
import { DataRow } from "@/lib/fileProcessing";

interface FileUploadProps {
  onDataLoaded: (data: DataRow[]) => void;
}

const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = parseCSV(content);
      onDataLoaded(data);
      
      toast({
        title: "File processed successfully",
        description: `Loaded ${data.length} rows of data.`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please ensure the file is in CSV format.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-6">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-accent bg-accent/5 scale-[0.99]"
            : "border-gray-200 hover:border-accent/50 hover:bg-gray-50/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-accent/10 rounded-full">
            <FileUp className="h-12 w-12 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Drag and drop your files
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse from your computer
            </p>
          </div>
          <label className="mt-4 inline-flex cursor-pointer items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors">
            Browse Files
            <Upload className="ml-2 h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            Supported format: CSV
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;