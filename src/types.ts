export type Screen =
  | 'home'
  | 'analyzing'
  | 'analyzed'
  | 'compress'
  | 'convert'
  | 'processing'
  | 'done';

export type ActionId = 'compress' | 'convert';

export interface Analysis {
  pages: number;
  type: 'text' | 'image';
  size: number;
}

// Options chosen in the options screens
export interface CompressOptions {
  quality: number;   // 0–100
  stripMeta: boolean;
}

export interface ConvertOptions {
  format: 'docx' | 'jpg' | 'png' | 'txt' | 'html';
}

export type ProcessOptions = CompressOptions | ConvertOptions;

// Produced by actual processing
export interface ProcessResult {
  blob: Blob;
  filename: string;
  outputSize: number;
}

export interface TweakValues {
  accentColor: string;
  brandName: string;
}
