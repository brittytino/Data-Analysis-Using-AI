import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataRow } from "@/lib/fileProcessing";

interface DataPreviewProps {
  data: DataRow[];
}

const DataPreview = ({ data = [] }: DataPreviewProps) => {
  if (!data?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No data to display. Upload a CSV file to get started.
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const previewRows = data.slice(0, 5); // Show first 5 rows

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="font-mono font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {previewRows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="font-mono text-muted-foreground"
                >
                  {row[header]?.toString()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataPreview;