import { useState } from 'react'
import FileChip from '../components/FileChip'
import StepRow from '../components/StepRow'
import Btn from '../components/Btn'
import Icon from '../components/Icon'
import type { Analysis, ConvertOptions, TweakValues } from '../types'

interface ConvertScreenProps {
  t: TweakValues;
  file: File;
  analysis: Analysis;
  onSubmit: (opts: ConvertOptions) => void;
  onBack: () => void;
}

const FORMATS: { id: ConvertOptions['format']; label: string; desc: string; color: string }[] = [
  { id: 'docx', label: 'DOCX', desc: 'Microsoft Word',    color: 'oklch(52% 0.18 240)' },
  { id: 'jpg',  label: 'JPG',  desc: 'รูปภาพ (ต่อหน้า)', color: 'oklch(58% 0.18 55)'  },
  { id: 'png',  label: 'PNG',  desc: 'มี transparency',   color: 'oklch(54% 0.16 150)' },
  { id: 'txt',  label: 'TXT',  desc: 'ข้อความ / OCR',    color: 'oklch(50% 0.12 260)' },
  { id: 'html', label: 'HTML', desc: 'เว็บเพจ',           color: 'oklch(56% 0.18 20)'  },
];

export default function ConvertScreen({ t, file, analysis, onSubmit, onBack }: ConvertScreenProps) {
  const [format, setFormat] = useState<ConvertOptions['format'] | null>(null);
  const convertColor = 'var(--convert)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '88px 24px 60px', animation: 'fadeUp .3s ease both' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <StepRow steps={['วิเคราะห์', 'เลือกรูปแบบ', 'ดาวน์โหลด']} active={1} color={convertColor} />
        <FileChip file={file} color={convertColor} onRemove={onBack} />

        {analysis.type === 'image' && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
            background: 'oklch(58% 0.18 55 / .08)', border: '1px solid oklch(58% 0.18 55 / .3)',
            borderRadius: 'var(--r)', marginBottom: 16, fontSize: 12, color: 'oklch(40% 0.12 55)',
          }}>
            <Icon name="scan" size={15} color="oklch(58% 0.18 55)" sw={1.5} />
            <span>ไฟล์นี้เป็น Scanned PDF — ระบบจะใช้ OCR เพื่อดึงข้อความอัตโนมัติ</span>
          </div>
        )}

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>เลือกรูปแบบที่ต้องการ</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {FORMATS.map(f => {
                const sel = format === f.id;
                return (
                  <button key={f.id} onClick={() => setFormat(f.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px',
                    background: sel ? f.color + '10' : 'var(--bg)',
                    border: `1.5px solid ${sel ? f.color : 'var(--border)'}`,
                    borderRadius: 'var(--r)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: sel ? f.color : 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: sel ? 'white' : 'var(--text3)', letterSpacing: '0.04em' }}>{f.label}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: sel ? f.color : 'var(--text)' }}>{f.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text3)' }}>{f.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: '0 20px 18px' }}>
            <Btn
              label={format ? `แปลงเป็น ${format.toUpperCase()}` : 'กรุณาเลือกรูปแบบ'}
              color={convertColor}
              disabled={!format}
              onClick={() => format && onSubmit({ format })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
