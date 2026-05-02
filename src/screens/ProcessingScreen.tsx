import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { compressPDF, convertPDF, rotatePDF, watermarkPDF } from '../lib/pdfProcessor'
import type { ActionId, ProcessOptions, ProcessResult, TweakValues } from '../types'

interface ProcessingScreenProps {
  t: TweakValues;
  file: File;
  action: ActionId;
  options: ProcessOptions;
  onDone: (result: ProcessResult) => void;
  onError: (msg: string) => void;
}

function outputFilename(file: File, action: ActionId, options: ProcessOptions): string {
  const base = file.name.replace(/\.pdf$/i, '');
  if (action === 'compress')   return `${base}_compressed.pdf`;
  if (action === 'rotate')     return `${base}_rotated.pdf`;
  if (action === 'watermark')  return `${base}_watermarked.pdf`;
  const fmt = (options as { format: string }).format;
  const n = ('' + (options as unknown as { pages?: number }).pages);
  // JPG/PNG with multiple pages → ZIP
  if ((fmt === 'jpg' || fmt === 'png') && n !== '1') return `${base}_pages.zip`;
  return `${base}.${fmt}`;
}

export default function ProcessingScreen({ t, file, action, options, onDone, onError }: ProcessingScreenProps) {
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState('กำลังเริ่มต้น…');
  const done = useRef(false);

  const isCompress   = action === 'compress';
  const isRotate     = action === 'rotate';
  const isWatermark  = action === 'watermark';
  const color = isCompress ? t.accentColor
    : isRotate    ? 'var(--rotate)'
    : isWatermark ? 'var(--watermark)'
    : 'var(--convert)';

  useEffect(() => {
    done.current = false;

    const onProgress = (pct: number, ph: string) => {
      if (done.current) return;
      setProg(Math.round(pct));
      setPhase(ph);
    };

    const run = async () => {
      let blob: Blob;
      if (action === 'compress') {
        blob = await compressPDF(file, options as import('../types').CompressOptions, onProgress);
      } else if (action === 'rotate') {
        blob = await rotatePDF(file, options as import('../types').RotateOptions, onProgress);
      } else if (action === 'watermark') {
        blob = await watermarkPDF(file, options as import('../types').WatermarkOptions, onProgress);
      } else {
        blob = await convertPDF(file, options as import('../types').ConvertOptions, onProgress);
      }
      if (done.current) return;
      const filename = outputFilename(file, action, options);
      onDone({ blob, filename, outputSize: blob.size });
    };

    run().catch(err => {
      if (done.current) return;
      onError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    });

    return () => { done.current = true; };
  }, []);

  const phases = isCompress
    ? ['โหลดไฟล์…', 'บีบอัดรูปภาพ…', 'บันทึกผล…']
    : isRotate
    ? ['โหลดไฟล์…', 'หมุนหน้า…', 'บันทึกผล…']
    : isWatermark
    ? ['โหลดไฟล์…', 'เพิ่ม watermark…', 'บันทึกผล…']
    : ['โหลดไฟล์…', 'แปลงเนื้อหา…', 'บันทึกผล…'];

  // Map progress to segment index
  const segIdx = prog < 42 ? 0 : prog < 90 ? 1 : 2;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn .3s ease both' }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: '44px 40px', maxWidth: 440, width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, margin: '0 auto 22px', borderRadius: 15, background: color + '12', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 15, border: `2px solid ${color}`, borderTopColor: 'transparent', animation: 'spin .9s linear infinite' }} />
          <Icon name={isCompress ? 'compress' : isRotate ? 'rotate' : isWatermark ? 'watermark' : 'convert'} size={24} color={color} sw={1.4} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.02em' }}>
          {isCompress ? 'กำลังบีบอัดไฟล์' : isRotate ? 'กำลังหมุนหน้า PDF' : isWatermark ? 'กำลังใส่ Watermark' : 'กำลังแปลงไฟล์'}
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 28, fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>

        {/* Segmented bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {phases.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i < segIdx ? color : 'var(--bg3)', overflow: i === segIdx ? 'hidden' : 'visible', position: 'relative' }}>
              {i === segIdx && (
                <div style={{ position: 'absolute', inset: 0, background: color, width: `${prog}%`, transition: 'width .3s ease' }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: 'var(--text3)' }}>{phase}</span>
          <span style={{ color, fontFamily: 'var(--mono)', fontWeight: 500 }}>{prog}%</span>
        </div>
      </div>
    </div>
  );
}
