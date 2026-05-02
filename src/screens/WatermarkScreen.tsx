import { useState } from 'react'
import FileChip from '../components/FileChip'
import StepRow from '../components/StepRow'
import Btn from '../components/Btn'
import type { WatermarkOptions, TweakValues } from '../types'

interface WatermarkScreenProps {
  t: TweakValues;
  file: File;
  onSubmit: (opts: WatermarkOptions) => void;
  onBack: () => void;
}

const WM_COLOR = 'var(--watermark)';

const PRESETS = ['CONFIDENTIAL', 'DRAFT', 'SAMPLE', 'COPY', 'VOID'];

const PALETTE: { hex: string; label: string }[] = [
  { hex: '#6b7280', label: 'เทา'       },
  { hex: '#991b1b', label: 'แดง'       },
  { hex: '#1e40af', label: 'น้ำเงิน'   },
  { hex: '#065f46', label: 'เขียว'     },
  { hex: '#92400e', label: 'น้ำตาล'    },
];

export default function WatermarkScreen({ t, file, onSubmit, onBack }: WatermarkScreenProps) {
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(25);
  const [rotation, setRotation] = useState<'diagonal' | 'horizontal'>('diagonal');
  const [color, setColor] = useState('#6b7280');

  const canSubmit = text.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '88px 24px 60px', animation: 'fadeUp .3s ease both' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <StepRow steps={['วิเคราะห์', 'ตั้งค่า', 'ดาวน์โหลด']} active={1} color={WM_COLOR} />
        <FileChip file={file} color={WM_COLOR} onRemove={onBack} />

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

          {/* Preview */}
          <div style={{
            padding: '20px 22px 16px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 200, height: 130,
              border: '1.5px solid var(--border)',
              borderRadius: 6,
              background: 'white',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 6,
            }}>
              {/* Fake content lines */}
              {[100, 100, 80, 100, 60].map((w, i) => (
                <div key={i} style={{ height: 4, width: `${w * 0.55}%`, background: 'var(--bg3)', borderRadius: 100 }} />
              ))}
              {/* Watermark overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontSize: Math.max(10, Math.min(22, 180 / Math.max(text.length, 1))),
                  fontWeight: 700,
                  fontFamily: 'var(--mono)',
                  color,
                  opacity: opacity / 100,
                  transform: rotation === 'diagonal' ? 'rotate(-30deg)' : 'none',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.05em',
                  transition: 'all .2s',
                  userSelect: 'none',
                }}>
                  {text || 'WATERMARK'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Text input */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>ข้อความ Watermark</p>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value.toUpperCase())}
                placeholder="พิมพ์ข้อความ..."
                maxLength={40}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1.5px solid ${text ? 'var(--border)' : 'oklch(70% 0.12 25)'}`,
                  borderRadius: 'var(--r)',
                  fontSize: 14,
                  fontFamily: 'var(--mono)',
                  fontWeight: 500,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  outline: 'none',
                  letterSpacing: '0.05em',
                  transition: 'border-color .15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = WM_COLOR)}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              {/* Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => setText(p)}
                    style={{
                      padding: '3px 10px',
                      fontSize: 11,
                      fontFamily: 'var(--mono)',
                      fontWeight: 500,
                      border: `1px solid ${text === p ? WM_COLOR : 'var(--border)'}`,
                      borderRadius: 100,
                      background: text === p ? WM_COLOR + '12' : 'var(--bg2)',
                      color: text === p ? WM_COLOR : 'var(--text2)',
                      cursor: 'pointer',
                      transition: 'all .15s',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>ทิศทาง</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['diagonal', 'horizontal'] as const).map(r => {
                  const active = rotation === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setRotation(r)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: `1.5px solid ${active ? WM_COLOR : 'var(--border)'}`,
                        borderRadius: 'var(--r)',
                        background: active ? WM_COLOR + '10' : 'var(--bg)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all .15s',
                      }}
                    >
                      <span style={{
                        fontSize: 11,
                        fontWeight: 500,
                        display: 'inline-block',
                        transform: r === 'diagonal' ? 'rotate(-30deg)' : 'none',
                        color: active ? WM_COLOR : 'var(--text2)',
                        fontFamily: 'var(--mono)',
                        transition: 'color .15s',
                      }}>
                        W
                      </span>
                      <span style={{ fontSize: 13, color: active ? WM_COLOR : 'var(--text2)', fontWeight: active ? 600 : 400, transition: 'all .15s' }}>
                        {r === 'diagonal' ? 'เฉียง 45°' : 'แนวนอน'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>ความโปร่งแสง</p>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500,
                  color: WM_COLOR, background: WM_COLOR + '12',
                  borderRadius: 6, padding: '2px 8px',
                }}>{opacity}%</span>
              </div>
              <input
                type="range" min="5" max="70" value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: `linear-gradient(to right, ${WM_COLOR} ${(opacity / 70) * 100}%, var(--bg3) ${(opacity / 70) * 100}%)`,
                  accentColor: WM_COLOR,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                <span>จางมาก</span>
                <span>เห็นชัด</span>
              </div>
            </div>

            {/* Color */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>สี</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {PALETTE.map(p => (
                  <button
                    key={p.hex}
                    title={p.label}
                    onClick={() => setColor(p.hex)}
                    style={{
                      width: 32, height: 32,
                      borderRadius: '50%',
                      background: p.hex,
                      border: `3px solid ${color === p.hex ? 'var(--text)' : 'transparent'}`,
                      outline: color === p.hex ? `2px solid ${p.hex}` : 'none',
                      outlineOffset: 2,
                      cursor: 'pointer',
                      transition: 'all .15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {color === p.hex && (
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: '0 22px 20px', borderTop: '1px solid var(--border)', paddingTop: 18 }}>
            <Btn
              label="ใส่ Watermark"
              color={canSubmit ? WM_COLOR : 'var(--text3)'}
              onClick={() => {
                if (canSubmit) onSubmit({ text: text.trim(), opacity, rotation, color });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
