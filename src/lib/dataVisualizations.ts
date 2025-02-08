
import { DataRow } from './fileProcessing';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

export const generateDistributionChart = (data: DataRow[], column: string): ChartData => {
  const values = data.map(row => row[column]);
  const uniqueValues = [...new Set(values)];
  const counts = uniqueValues.map(value => 
    values.filter(v => v === value).length
  );

  const colors = [
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(153, 102, 255, 0.5)',
  ];

  return {
    labels: uniqueValues.map(v => v.toString()),
    datasets: [{
      label: `Distribution of ${column}`,
      data: counts,
      backgroundColor: colors.slice(0, uniqueValues.length),
    }]
  };
};

export const generateTemporalChart = (
  data: DataRow[],
  xColumn: string,
  yColumn: string
): ChartData => {
  const sortedData = [...data].sort((a, b) => 
    new Date(a[xColumn].toString()).getTime() - new Date(b[xColumn].toString()).getTime()
  );

  return {
    labels: sortedData.map(row => row[xColumn].toString()),
    datasets: [{
      label: `${yColumn} over time`,
      data: sortedData.map(row => Number(row[yColumn])),
      backgroundColor: ['rgba(54, 162, 235, 0.5)'],
    }]
  };
};
