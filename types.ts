export interface Dependency {
  id: string;
  source: string;
  type: 'reference' | 'copy' | 'expand' | 'logic'; // Visual tag type
  content: string; // The content of the dependency
  affected: boolean; // If true, this dependency needs review after regeneration
}

export interface TableField {
  id: string;
  key: string;
  value: string;
  dependencies: Dependency[];
}

export interface TableRow {
  id: string;
  [key: string]: any; // Dynamic keys for cell data
  _fields: Record<string, TableField>; // Metadata for each field
}

export interface LearningTask {
  id: string;
  name: string;
  rows: TableRow[];
}

export interface ColumnDef {
  key: string;
  header: string;
  width?: string;
}

export interface GenerateRequest {
  prompt: string;
  context?: any;
  rowId?: string;
  isFullPage?: boolean;
}