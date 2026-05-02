import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import type { Analysis, CompressOptions, ConvertOptions } from '../types';

const isTextItem = (item: TextItem | TextMarkedContent): item is TextItem => 'str' in item;

// Vite resolves this URL and copies the worker to the build output
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href;

export type ProgressFn = (pct: number, phase: string) => void;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function loadDoc(file: File, onProgress: ProgressFn) {
  const buf = await file.arrayBuffer();
  const task = pdfjsLib.getDocument({ data: new Uint8Array(buf) });
  task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
    if (total > 0) onProgress(Math.round((loaded / total) * 40), 'โหลดไฟล์…');
  };
  return task.promise;
}

async function renderPage(
  page: pdfjsLib.PDFPageProxy,
  scale: number,
): Promise<HTMLCanvasElement> {
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(vp.width);
  canvas.height = Math.round(vp.height);
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((res, rej) => {
    canvas.toBlob(
      b => (b ? res(b) : rej(new Error('canvas toBlob failed'))),
      mime,
      quality,
    );
  });
}

// ─── Analyze ──────────────────────────────────────────────────────────────────

export async function analyzePDF(file: File, onProgress: ProgressFn): Promise<Analysis> {
  onProgress(5, 'อ่านโครงสร้างไฟล์…');
  const pdf = await loadDoc(file, onProgress);
  onProgress(50, 'ตรวจสอบประเภทเนื้อหา…');

  // Sample up to 3 pages for text detection to keep it fast
  const pagesToCheck = Math.min(3, pdf.numPages);
  let hasText = false;
  for (let i = 1; i <= pagesToCheck; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    if (content.items.filter(isTextItem).some(item => item.str.trim().length > 0)) {
      hasText = true;
      break;
    }
  }

  onProgress(100, 'เสร็จสิ้น');
  return { pages: pdf.numPages, type: hasText ? 'text' : 'image', size: file.size };
}

// ─── Compress ─────────────────────────────────────────────────────────────────
// Re-renders every page as JPEG at reduced resolution and reassembles the PDF.
// Effective on image-heavy PDFs; always reduces file size significantly.

export async function compressPDF(
  file: File,
  opts: CompressOptions,
  onProgress: ProgressFn,
): Promise<Blob> {
  onProgress(2, 'โหลดไฟล์…');
  const src = await loadDoc(file, onProgress);
  const n = src.numPages;

  // Map quality 0-100 → render scale 0.6-2.0, JPEG quality 0.25-0.95
  const scale   = 0.6 + (opts.quality / 100) * 1.4;
  const jpegQ   = 0.25 + (opts.quality / 100) * 0.7;

  onProgress(42, 'บีบอัดรูปภาพ…');
  const out = await PDFDocument.create();

  for (let i = 1; i <= n; i++) {
    const page    = await src.getPage(i);
    const nativeVp = page.getViewport({ scale: 1 });
    const canvas  = await renderPage(page, scale);
    const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', jpegQ);
    const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
    const img     = await out.embedJpg(jpegBytes);
    const pdfPage = out.addPage([nativeVp.width, nativeVp.height]);
    pdfPage.drawImage(img, { x: 0, y: 0, width: nativeVp.width, height: nativeVp.height });

    onProgress(42 + Math.round((i / n) * 48), 'บีบอัดรูปภาพ…');
  }

  onProgress(93, 'บันทึกผล…');
  const bytes = await out.save({ useObjectStreams: true });
  onProgress(100, 'เสร็จสิ้น');
  return new Blob([bytes], { type: 'application/pdf' });
}

// ─── Convert ──────────────────────────────────────────────────────────────────

export async function convertPDF(
  file: File,
  opts: ConvertOptions,
  onProgress: ProgressFn,
): Promise<Blob> {
  switch (opts.format) {
    case 'jpg':  return convertToImages(file, 'jpg',  onProgress);
    case 'png':  return convertToImages(file, 'png',  onProgress);
    case 'txt':  return convertToText(file, onProgress);
    case 'docx': return convertToDocx(file, onProgress);
    case 'html': return convertToHtml(file, onProgress);
  }
}

async function convertToImages(
  file: File,
  format: 'jpg' | 'png',
  onProgress: ProgressFn,
): Promise<Blob> {
  onProgress(2, 'โหลดไฟล์…');
  const pdf = await loadDoc(file, onProgress);
  const n   = pdf.numPages;
  const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';

  onProgress(42, `แปลง ${format.toUpperCase()}…`);

  if (n === 1) {
    const page   = await pdf.getPage(1);
    const canvas = await renderPage(page, 2.0);
    const blob   = await canvasToBlob(canvas, mime, 0.92);
    onProgress(100, 'เสร็จสิ้น');
    return blob;
  }

  // Multiple pages → ZIP
  const zip = new JSZip();
  for (let i = 1; i <= n; i++) {
    const page    = await pdf.getPage(i);
    const canvas  = await renderPage(page, 2.0);
    const imgBlob = await canvasToBlob(canvas, mime, 0.92);
    zip.file(`page-${String(i).padStart(3, '0')}.${format}`, imgBlob);
    onProgress(42 + Math.round((i / n) * 48), `แปลง ${format.toUpperCase()}…`);
  }

  onProgress(93, 'บีบอัดไฟล์…');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress(100, 'เสร็จสิ้น');
  return zipBlob;
}

async function convertToText(file: File, onProgress: ProgressFn): Promise<Blob> {
  onProgress(2, 'โหลดไฟล์…');
  const pdf = await loadDoc(file, onProgress);
  const n   = pdf.numPages;
  const parts: string[] = [];

  onProgress(42, 'ดึงข้อความ…');
  for (let i = 1; i <= n; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text    = content.items
      .filter(isTextItem)
      .map(item => item.str)
      .join(' ');
    parts.push(`--- หน้า ${i} ---\n${text}`);
    onProgress(42 + Math.round((i / n) * 54), 'ดึงข้อความ…');
  }

  onProgress(100, 'เสร็จสิ้น');
  return new Blob([parts.join('\n\n')], { type: 'text/plain;charset=utf-8' });
}

async function convertToDocx(file: File, onProgress: ProgressFn): Promise<Blob> {
  onProgress(2, 'โหลดไฟล์…');
  const { Document, Packer, Paragraph, TextRun } = await import('docx');
  const pdf = await loadDoc(file, onProgress);
  const n   = pdf.numPages;

  onProgress(42, 'แปลง DOCX…');
  const children: InstanceType<typeof Paragraph>[] = [];

  for (let i = 1; i <= n; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text    = content.items
      .filter(isTextItem)
      .map(item => item.str)
      .join(' ');
    if (i > 1) children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    children.push(new Paragraph({ children: [new TextRun({ text })] }));
    onProgress(42 + Math.round((i / n) * 44), 'แปลง DOCX…');
  }

  const doc  = new Document({ sections: [{ children }] });
  onProgress(90, 'บันทึกผล…');
  const blob = await Packer.toBlob(doc);
  onProgress(100, 'เสร็จสิ้น');
  return blob;
}

async function convertToHtml(file: File, onProgress: ProgressFn): Promise<Blob> {
  onProgress(2, 'โหลดไฟล์…');
  const pdf   = await loadDoc(file, onProgress);
  const n     = pdf.numPages;
  const pages: string[] = [];

  onProgress(42, 'แปลง HTML…');
  for (let i = 1; i <= n; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text    = content.items
      .filter(isTextItem)
      .map(item => item.str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
      .join(' ');
    pages.push(`<section class="page"><p>${text}</p></section>`);
    onProgress(42 + Math.round((i / n) * 50), 'แปลง HTML…');
  }

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>PDF Export</title>
<style>body{font-family:sans-serif;max-width:820px;margin:0 auto;padding:2rem;line-height:1.7}
.page{margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid #e5e5e5}</style>
</head>
<body>${pages.join('\n')}</body>
</html>`;

  onProgress(100, 'เสร็จสิ้น');
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}
