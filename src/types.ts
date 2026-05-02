export type Screen =
  | 'home'
  | 'analyzing'
  | 'analyzed'
  | 'compress'
  | 'convert'
  | 'rotate'
  | 'processing'
  | 'done';

export type ActionId = 'compress' | 'convert' | 'rotate';

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

export interface RotateOptions {
  orientation: 'portrait' | 'landscape';
}

export type ProcessOptions = CompressOptions | ConvertOptions | RotateOptions;

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
