import Icon from './Icon'
import type { TweakValues } from '../types'

interface NavProps {
  t: TweakValues;
  onHome: () => void;
  onSettings: () => void;
  showBack?: boolean;
}

export default function Nav({ t, onHome, onSettings, showBack = false }: NavProps) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 56, background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
    }}>
      {showBack ? (
        <button onClick={onHome} style={{
          background: 'none', border: '1px solid var(--border)', borderRadius: 8,
          padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--text2)', fontSize: 13, cursor: 'pointer', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentColor; e.currentTarget.style.color = t.accentColor; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
        >
          <Icon name="back" size={14} /> กลับ
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={onHome}>
          <img src="/logo.png" alt="waijaiPDF" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} />
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>{t.brandName}</span>
        </div>
      )}
      <div style={{ flex: 1 }} />
      <button onClick={onSettings} style={{
        background: 'none', border: '1px solid var(--border)', borderRadius: 8,
        padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 6,
        color: 'var(--text2)', fontSize: 13, cursor: 'pointer', transition: 'all .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentColor; e.currentTarget.style.color = t.accentColor; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
      >
        <Icon name="settings" size={14} />
      </button>
    </nav>
  );
}
