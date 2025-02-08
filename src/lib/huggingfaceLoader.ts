
import { pipeline } from '@huggingface/transformers';

export interface HuggingFaceDataset {
  id: string;
  name: string;
  data: any[];
}

export const loadHuggingFaceDataset = async (
  datasetId: string,
  options = { streaming: false }
): Promise<HuggingFaceDataset> => {
  try {
    // Initialize the pipeline for dataset loading
    const extractor = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');
    
    // This is a simplified example - in a real implementation,
    // you would need to handle the actual dataset loading through the HF API
    const response = await fetch(`https://huggingface.co/api/datasets/${datasetId}`);
    const data = await response.json();
    
    return {
      id: datasetId,
      name: data.name || datasetId,
      data: data.data || []
    };
  } catch (error) {
    console.error('Error loading HuggingFace dataset:', error);
    throw error;
  }
};

export const processHuggingFaceDataset = async (dataset: HuggingFaceDataset) => {
  try {
    const extractor = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');
    
    // Process text data if available
    if (dataset.data.some(item => typeof item === 'string')) {
      const embeddings = await extractor(dataset.data, {
        pooling: 'mean',
        normalize: true
      });
      
      return embeddings;
    }
    
    return dataset.data;
  } catch (error) {
    console.error('Error processing dataset:', error);
    throw error;
  }
};
