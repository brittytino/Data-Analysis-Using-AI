
export interface DetectedFormat {
  type: 'date' | 'number' | 'text' | 'categorical' | 'boolean';
  confidence: number;
}

export const detectColumnFormat = (values: any[]): DetectedFormat => {
  const sampleSize = Math.min(values.length, 100);
  const samples = values.slice(0, sampleSize);

  // Date detection
  const dateRegex = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/;
  const dateMatches = samples.filter(v => dateRegex.test(String(v))).length;
  if (dateMatches / sampleSize > 0.8) {
    return { type: 'date', confidence: dateMatches / sampleSize };
  }

  // Number detection
  const numberMatches = samples.filter(v => !isNaN(Number(v))).length;
  if (numberMatches / sampleSize > 0.8) {
    return { type: 'number', confidence: numberMatches / sampleSize };
  }

  // Boolean detection
  const booleanValues = new Set(['true', 'false', '0', '1', 'yes', 'no']);
  const booleanMatches = samples.filter(v => 
    booleanValues.has(String(v).toLowerCase())
  ).length;
  if (booleanMatches / sampleSize > 0.8) {
    return { type: 'boolean', confidence: booleanMatches / sampleSize };
  }

  // Categorical detection (if there are few unique values relative to sample size)
  const uniqueValues = new Set(samples.map(String));
  if (uniqueValues.size <= Math.sqrt(sampleSize)) {
    return { type: 'categorical', confidence: 0.9 };
  }

  // Default to text
  return { type: 'text', confidence: 0.7 };
};

export const detectDateFormat = (value: string): string | null => {
  const formats = [
    { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'YYYY-MM-DD' },
    { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: 'DD/MM/YYYY' },
    { regex: /^\d{2}-\d{2}-\d{4}$/, format: 'DD-MM-YYYY' }
  ];

  for (const { regex, format } of formats) {
    if (regex.test(value)) {
      return format;
    }
  }
  return null;
};
