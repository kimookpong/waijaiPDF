import { useState } from 'react'
import Icon from '../components/Icon'
import { fmtSize } from '../utils'
import type { ActionId, ProcessResult, TweakValues } from '../types'

interface DownloadScreenProps {
  t: TweakValues;
  file: File;
  result: ProcessResult;
  action: ActionId;
  onReset: () => void;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DownloadScreen({ t, file, result, action, onReset }: DownloadScreenProps) {
  const [clicked, setClicked] = useState(false);
  const isCompress   = action === 'compress';
  const isRotate     = action === 'rotate';
  const isWatermark  = action === 'watermark';
  const savedPct   = isCompress
    ? Math.max(0, Math.round(((file.size - result.outputSize) / file.size) * 100))
    : null;

  const handleDownload = () => {
    triggerDownload(result.blob, result.filename);
    setClicked(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '88px 24px 40px', animation: 'scaleIn .3s ease both' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>

        {/* Success */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--success-light)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <polyline points="5,15 12,22 25,8" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 4 }}>
            {isCompress ? 'บีบอัดสำเร็จ!' : isRotate ? 'หมุนหน้าสำเร็จ!' : isWatermark ? 'ใส่ Watermark สำเร็จ!' : 'แปลงไฟล์สำเร็จ!'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>ไฟล์พร้อมสำหรับดาวน์โหลด</p>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 12 }}>

          {/* Stats (compress only) */}
          {isCompress && savedPct !== null && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              {[
                { lbl: 'ขนาดเดิม',   val: fmtSize(file.size),         mono: true,  green: false },
                { lbl: 'ขนาดใหม่',   val: fmtSize(result.outputSize), mono: true,  green: true  },
                { lbl: 'ประหยัดได้', val: `${savedPct}%`,             mono: false, green: true  },
              ].map((s, i) => (
                <div key={s.lbl} style={{ padding: '14px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.lbl}</p>
                  <p style={{ fontFamily: s.mono ? 'var(--mono)' : 'inherit', fontSize: 15, fontWeight: 600, color: s.green ? 'var(--success)' : 'var(--text)' }}>{s.val}</p>
                </div>
              ))}
            </div>
          )}

          {/* File row */}
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="file" size={17} color="var(--success)" sw={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.filename}</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{fmtSize(result.outputSize)}</p>
            </div>
          </div>

          <div style={{ padding: '14px 18px' }}>
            <button onClick={handleDownload} style={{
              width: '100%', padding: '13px',
              background: clicked ? 'var(--success)' : t.accentColor,
              border: 'none', borderRadius: 'var(--r)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all .2s',
              boxShadow: clicked ? '0 4px 16px oklch(56% 0.18 150 / .35)' : `0 4px 16px ${t.accentColor}40`,
            }}>
              <Icon name={clicked ? 'check' : 'download'} size={17} color="white" sw={2} />
              {clicked ? 'ดาวน์โหลดแล้ว' : 'ดาวน์โหลดไฟล์'}
            </button>
          </div>
        </div>

        <button onClick={onReset} style={{
          width: '100%', padding: '11px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--r)',
          color: 'var(--text2)', fontSize: 13, cursor: 'pointer', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentColor; e.currentTarget.style.color = t.accentColor; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
        >
          + อัปโหลดไฟล์ใหม่
        </button>
      </div>
    </div>
  );
}
