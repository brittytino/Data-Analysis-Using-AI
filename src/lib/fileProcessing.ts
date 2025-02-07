export interface DataRow {
  [key: string]: string | number;
}

export interface DatasetStats {
  totalRows: number;
  columns: {
    name: string;
    type: 'numeric' | 'categorical';
    missingValues: number;
  }[];
  missingValuesPercentage: number;
}

export const parseCSV = (content: string): DataRow[] => {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: DataRow = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });
    return row;
  });
};

export const calculateStats = (data: DataRow[]): DatasetStats => {
  const columns = Object.keys(data[0] || {}).map(colName => {
    const values = data.map(row => row[colName]);
    const missingValues = values.filter(v => v === undefined || v === '').length;
    const type: 'numeric' | 'categorical' = values.some(v => typeof v === 'number') ? 'numeric' : 'categorical';
    
    return {
      name: colName,
      type,
      missingValues,
    };
  });

  const totalMissing = columns.reduce((sum, col) => sum + col.missingValues, 0);
  const totalPossibleValues = data.length * columns.length;
  
  return {
    totalRows: data.length,
    columns,
    missingValuesPercentage: (totalMissing / totalPossibleValues) * 100,
  };
};