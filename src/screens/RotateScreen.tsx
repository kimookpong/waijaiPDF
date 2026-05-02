import { useState } from 'react'
import FileChip from '../components/FileChip'
import StepRow from '../components/StepRow'
import Btn from '../components/Btn'
import type { RotateOptions, TweakValues } from '../types'

interface RotateScreenProps {
  t: TweakValues;
  file: File;
  onSubmit: (opts: RotateOptions) => void;
  onBack: () => void;
}

const ROTATE_COLOR = 'var(--rotate)';

function OrientCard({
  orientation,
  selected,
  onSelect,
}: {
  orientation: 'portrait' | 'landscape';
  selected: boolean;
  onSelect: () => void;
}) {
  const [hov, setHov] = useState(false);
  const isPortrait = orientation === 'portrait';
  const active = selected || hov;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        padding: '24px 16px 20px',
        background: selected ? 'var(--rotate)' + '08' : 'var(--surface)',
        border: `2px solid ${selected ? ROTATE_COLOR : hov ? 'var(--rotate)' + '50' : 'var(--border)'}`,
        borderRadius: 'var(--rl)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        transition: 'all .18s ease',
        boxShadow: selected
          ? `var(--shadow-md), 0 0 0 3px ${'var(--rotate)'}18`
          : hov ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {/* Page shape */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 76 }}>
        <div style={{
          width: isPortrait ? 44 : 68,
          height: isPortrait ? 60 : 44,
          borderRadius: 5,
          border: `2px solid ${active ? ROTATE_COLOR : 'var(--border)'}`,
          background: active ? 'var(--rotate)' + '08' : 'var(--bg2)',
          transition: 'all .18s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '6px 5px',
          gap: 4,
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 3,
              borderRadius: 100,
              background: active ? ROTATE_COLOR : 'var(--bg3)',
              width: i === 3 ? '60%' : '100%',
              transition: 'background .18s',
            }} />
          ))}
        </div>
        {selected && (
          <div style={{
            position: 'absolute', top: -6, right: -6,
            width: 20, height: 20, borderRadius: '50%',
            background: ROTATE_COLOR,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em',
          color: active ? ROTATE_COLOR : 'var(--text)',
          transition: 'color .18s',
          marginBottom: 3,
        }}>
          {isPortrait ? 'Portrait' : 'Landscape'}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text3)' }}>
          {isPortrait ? 'แนวตั้ง' : 'แนวนอน'}
        </p>
      </div>
    </button>
  );
}

export default function RotateScreen({ t, file, onSubmit, onBack }: RotateScreenProps) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '88px 24px 60px', animation: 'fadeUp .3s ease both' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <StepRow steps={['วิเคราะห์', 'ตั้งค่า', 'ดาวน์โหลด']} active={1} color={ROTATE_COLOR} />
        <FileChip file={file} color={ROTATE_COLOR} onRemove={onBack} />

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

          <div style={{ padding: '22px 22px 0' }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>เลือกทิศทางที่ต้องการ</p>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 18 }}>
              ทุกหน้าใน PDF จะถูกหมุนให้ตรงกับทิศทางที่เลือก
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
              <OrientCard orientation="portrait" selected={orientation === 'portrait'} onSelect={() => setOrientation('portrait')} />
              <OrientCard orientation="landscape" selected={orientation === 'landscape'} onSelect={() => setOrientation('landscape')} />
            </div>
          </div>

          <div style={{ padding: '0 22px 18px', borderTop: '1px solid var(--border)', paddingTop: 18 }}>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px', borderRadius: 'var(--r)',
              background: 'var(--rotate)' + '08',
              border: '1px solid ' + 'var(--rotate)' + '20',
              marginBottom: 18,
            }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--rotate)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>
                หน้าที่มีทิศทางถูกต้องแล้วจะไม่ถูกเปลี่ยน · หน้าที่หมุนผิดจะถูกหมุน 90°
              </p>
            </div>
            <Btn
              label={`หมุนเป็น ${orientation === 'portrait' ? 'Portrait (แนวตั้ง)' : 'Landscape (แนวนอน)'}`}
              color={ROTATE_COLOR}
              onClick={() => onSubmit({ orientation })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
