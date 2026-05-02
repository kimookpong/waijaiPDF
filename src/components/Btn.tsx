interface BtnProps {
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Btn({ label, color, onClick, disabled = false }: BtnProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '14px',
      background: disabled ? 'var(--bg3)' : color,
      border: 'none', borderRadius: 'var(--r)',
      color: disabled ? 'var(--text3)' : 'white',
      fontSize: 15, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      letterSpacing: '-0.01em', transition: 'all .15s',
      boxShadow: disabled ? 'none' : `0 4px 16px ${color}40`,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
    onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
    >{label}</button>
  );
}
