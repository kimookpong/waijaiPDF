import { useState } from 'react'
import FileChip from '../components/FileChip'
import StepRow from '../components/StepRow'
import CheckRow from '../components/CheckRow'
import Btn from '../components/Btn'
import { fmtSize, estCompressed } from '../utils'
import type { CompressOptions, TweakValues } from '../types'

interface CompressScreenProps {
  t: TweakValues;
  file: File;
  onSubmit: (opts: CompressOptions) => void;
  onBack: () => void;
}

export default function CompressScreen({ t, file, onSubmit, onBack }: CompressScreenProps) {
  const [quality, setQuality] = useState(60);
  const [stripMeta, setStripMeta] = useState(true);

  const estimated = estCompressed(file.size, quality);
  const savings   = file.size - estimated;
  const pct       = Math.round((savings / file.size) * 100);
  const qColor    = quality < 35 ? t.accentColor : quality < 70 ? 'oklch(54% 0.18 150)' : 'oklch(52% 0.14 240)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '88px 24px 60px', animation: 'fadeUp .3s ease both' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <StepRow steps={['วิเคราะห์', 'ตั้งค่า', 'ดาวน์โหลด']} active={1} color={t.accentColor} />
        <FileChip file={file} color={t.accentColor} onRemove={onBack} />

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

          {/* Size preview */}
          <div style={{ padding: '22px 22px 18px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>ขนาดเดิม</p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500 }}>{fmtSize(file.size)}</p>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: qColor, background: qColor + '15', borderRadius: 100, padding: '3px 10px', transition: 'all .25s' }}>
                −{pct}%
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>ประมาณหลังบีบ</p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500, color: qColor, transition: 'color .25s' }}>{fmtSize(estimated)}</p>
              </div>
            </div>
            <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 100, overflow: 'hidden', marginBottom: 5 }}>
              <div style={{ height: '100%', borderRadius: 100, background: qColor, width: `${(estimated / file.size) * 100}%`, transition: 'width .3s ease, background .3s ease' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)' }}>ประมาณการ · ผลลัพธ์จริงขึ้นอยู่กับเนื้อหา PDF</p>
          </div>

          {/* Slider */}
          <div style={{ padding: '22px 22px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 500 }}>ระดับคุณภาพ</p>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500, color: qColor, background: qColor + '12', borderRadius: 6, padding: '2px 8px', transition: 'all .25s' }}>{quality}</span>
            </div>
            <input type="range" min="0" max="100" value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              style={{ width: '100%', marginBottom: 10, background: `linear-gradient(to right, ${qColor} ${quality}%, var(--bg3) ${quality}%)`, accentColor: qColor }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)' }}>
              <span>บีบอัดสูงสุด<br /><span style={{ color: 'var(--text2)', fontWeight: 500 }}>ขนาดเล็กที่สุด</span></span>
              <span style={{ textAlign: 'center' }}>สมดุล<br /><span style={{ color: t.accentColor, fontWeight: 500 }}>แนะนำ</span></span>
              <span style={{ textAlign: 'right' }}>คุณภาพดี<br /><span style={{ color: 'var(--text2)', fontWeight: 500 }}>บีบอัดน้อย</span></span>
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <CheckRow label="ลบ metadata ที่ไม่จำเป็น" checked={stripMeta} onChange={setStripMeta} color={t.accentColor} />
          </div>

          <div style={{ padding: '18px 22px' }}>
            <Btn label="บีบอัดไฟล์ PDF" color={t.accentColor} onClick={() => onSubmit({ quality, stripMeta })} />
          </div>
        </div>
      </div>
    </div>
  );
}
