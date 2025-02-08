
import { DataRow } from './fileProcessing';

export interface DatasetVersion {
  id: string;
  timestamp: number;
  data: DataRow[];
  description: string;
  transformations: string[];
}

export class DatasetVersionManager {
  private versions: DatasetVersion[] = [];
  private currentVersionIndex: number = -1;

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedVersions = localStorage.getItem('dataset_versions');
    if (savedVersions) {
      this.versions = JSON.parse(savedVersions);
      this.currentVersionIndex = this.versions.length - 1;
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('dataset_versions', JSON.stringify(this.versions));
  }

  createVersion(data: DataRow[], description: string, transformations: string[] = []) {
    const version: DatasetVersion = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data,
      description,
      transformations
    };

    // Remove any versions after the current one if we're not at the latest version
    if (this.currentVersionIndex < this.versions.length - 1) {
      this.versions = this.versions.slice(0, this.currentVersionIndex + 1);
    }

    this.versions.push(version);
    this.currentVersionIndex = this.versions.length - 1;
    this.saveToLocalStorage();
    return version;
  }

  getCurrentVersion(): DatasetVersion | null {
    return this.currentVersionIndex >= 0 ? this.versions[this.currentVersionIndex] : null;
  }

  getAllVersions(): DatasetVersion[] {
    return this.versions;
  }

  revertToVersion(versionId: string): DatasetVersion | null {
    const index = this.versions.findIndex(v => v.id === versionId);
    if (index >= 0) {
      this.currentVersionIndex = index;
      return this.versions[index];
    }
    return null;
  }

  clear() {
    this.versions = [];
    this.currentVersionIndex = -1;
    localStorage.removeItem('dataset_versions');
  }
}
