import { DataRow } from './fileProcessing';

export const cleanMissingValues = (data: DataRow[], strategy: 'mean' | 'remove' = 'mean'): DataRow[] => {
  if (strategy === 'remove') {
    return data.filter(row => 
      Object.values(row).every(value => value !== '' && value !== undefined)
    );
  }

  const numericColumns = Object.keys(data[0] || {}).filter(colName =>
    data.some(row => typeof row[colName] === 'number')
  );

  const means = numericColumns.reduce((acc, colName) => {
    const values = data
      .map(row => row[colName])
      .filter((value): value is number => typeof value === 'number');
    acc[colName] = values.reduce((sum, val) => sum + val, 0) / values.length;
    return acc;
  }, {} as Record<string, number>);

  return data.map(row => {
    const newRow = { ...row };
    numericColumns.forEach(colName => {
      if (newRow[colName] === '' || newRow[colName] === undefined) {
        newRow[colName] = means[colName];
      }
    });
    return newRow;
  });
};

export const normalizeData = (data: DataRow[]): DataRow[] => {
  const numericColumns = Object.keys(data[0] || {}).filter(colName =>
    data.some(row => typeof row[colName] === 'number')
  );

  const stats = numericColumns.reduce((acc, colName) => {
    const values = data
      .map(row => row[colName])
      .filter((value): value is number => typeof value === 'number');
    const min = Math.min(...values);
    const max = Math.max(...values);
    acc[colName] = { min, max };
    return acc;
  }, {} as Record<string, { min: number; max: number }>);

  return data.map(row => {
    const newRow = { ...row };
    numericColumns.forEach(colName => {
      if (typeof newRow[colName] === 'number') {
        const { min, max } = stats[colName];
        newRow[colName] = (newRow[colName] as number - min) / (max - min);
      }
    });
    return newRow;
  });
};

export const removeDuplicates = (data: DataRow[]): DataRow[] => {
  const seen = new Set<string>();
  return data.filter(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};