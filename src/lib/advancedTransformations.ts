
import { DataRow } from './fileProcessing';

export const standardizeColumn = (data: DataRow[], column: string): DataRow[] => {
  const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  );

  return data.map(row => ({
    ...row,
    [column]: typeof row[column] === 'number' 
      ? ((row[column] as number) - mean) / stdDev
      : row[column]
  }));
};

export const oneHotEncode = (data: DataRow[], column: string): DataRow[] => {
  const uniqueValues = [...new Set(data.map(row => row[column]))];
  
  return data.map(row => {
    const newRow = { ...row };
    uniqueValues.forEach(value => {
      newRow[`${column}_${value}`] = row[column] === value ? 1 : 0;
    });
    delete newRow[column];
    return newRow;
  });
};

export const detectOutliers = (data: DataRow[], column: string): number[] => {
  const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  );
  
  return data.map((_, index) => {
    const value = Number(data[index][column]);
    return Math.abs(value - mean) > 2 * stdDev ? index : -1;
  }).filter(index => index !== -1);
};
