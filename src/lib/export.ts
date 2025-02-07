import { DataRow } from './fileProcessing';

export const exportToCSV = (data: DataRow[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => row[header]).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

export const exportToJSON = (data: DataRow[]): string => {
  return JSON.stringify(data, null, 2);
};

export const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};