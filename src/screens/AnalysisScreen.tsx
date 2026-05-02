import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { fmtSize } from '../utils'
import type { Analysis, ActionId, TweakValues } from '../types'

interface AnalysisScreenProps {
  t: TweakValues;
  file: File;
  analysis: Analysis;
  onPick: (id: ActionId) => void;
  onReset: () => void;
}

interface ActionDef {
  id: ActionId;
  icon: 'compress' | 'convert' | 'rotate';
  label: string;
  sub: string;
  color: string;
  suggested: boolean;
}

export default function AnalysisScreen({ t, file, analysis, onPick, onReset }: AnalysisScreenProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  const suggestCompress = analysis.size > 500_000;
  const suggestConvert  = analysis.type === 'image';

  const actions: ActionDef[] = [
    {
      id: 'compress', icon: 'compress', label: 'บีบอัดไฟล์ PDF', sub: 'ลดขนาดไฟล์ด้วย slider คุณภาพ',
      color: t.accentColor, suggested: suggestCompress && !suggestConvert,
    },
    {
      id: 'convert', icon: 'convert', label: 'แปลงไฟล์ PDF', sub: 'ส่งออกเป็น DOCX, JPG, PNG, TXT, HTML',
      color: 'var(--convert)', suggested: suggestConvert,
    },
    {
      id: 'rotate', icon: 'rotate', label: 'หมุนหน้า PDF', sub: 'บังคับทุกหน้าให้เป็น Portrait หรือ Landscape',
      color: 'var(--rotate)', suggested: false,
    },
  ];

  const metrics = [
    { lbl: 'จำนวนหน้า', val: `${analysis.pages} หน้า`, mono: true, warn: false },
    { lbl: 'ประเภท', val: analysis.type === 'text' ? 'Text PDF' : 'Scanned', mono: false, warn: analysis.type === 'image' },
    { lbl: 'ขนาดไฟล์', val: fmtSize(analysis.size), mono: true, warn: false },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '88px 24px 60px',
    }}>
      <div style={{
        maxWidth: 480, width: '100%',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(16px)',
        transition: 'opacity .35s ease, transform .35s ease',
      }}>
        {/* Analysis card */}
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--rl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          marginBottom: 20, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: t.accentColor + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="file" size={17} color={t.accentColor} sw={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 1 }}>{fmtSize(analysis.size)}</p>
            </div>
            <button onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: 4, borderRadius: 6 }}
              onMouseEnter={e => (e.currentTarget.style.color = t.accentColor)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
            ><Icon name="x" size={15} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {metrics.map((m, i) => (
              <div key={m.lbl} style={{ padding: '14px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{m.lbl}</p>
                <p style={{ fontSize: 13, fontWeight: 600, fontFamily: m.mono ? 'var(--mono)' : 'inherit', color: m.warn ? 'oklch(58% 0.18 55)' : 'var(--text)' }}>{m.val}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          เลือกการดำเนินการ
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {actions.map(a => <ActionCard key={a.id} action={a} onPick={onPick} />)}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ action: a, onPick }: { action: ActionDef; onPick: (id: ActionId) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onPick(a.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
        background: 'var(--surface)',
        border: `1.5px solid ${hov ? a.color + '80' : a.suggested ? a.color + '40' : 'var(--border)'}`,
        borderRadius: 'var(--rl)', cursor: 'pointer', textAlign: 'left', width: '100%',
        boxShadow: hov ? `var(--shadow-md), 0 0 0 3px ${a.color}10` : a.suggested ? `var(--shadow-sm), 0 0 0 1px ${a.color}20` : 'var(--shadow-sm)',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'all .18s ease', position: 'relative', overflow: 'hidden',
      }}
    >
      {a.suggested && (
        <div style={{ position: 'absolute', top: 10, right: 14, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: a.color, background: a.color + '14', borderRadius: 100, padding: '2px 8px' }}>แนะนำ</div>
      )}
      <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: hov ? a.color : a.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}>
        <Icon name={a.icon} size={20} color={hov ? 'white' : a.color} sw={1.7} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 3, color: hov ? a.color : 'var(--text)', transition: 'color .18s' }}>{a.label}</p>
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>{a.sub}</p>
      </div>
      <div style={{ opacity: hov ? 1 : 0.25, transform: hov ? 'translateX(2px)' : 'none', transition: 'all .18s', flexShrink: 0 }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={a.color}
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: 'rotate(180deg)' }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
    </button>
  );
}
