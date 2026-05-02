interface CheckRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color: string;
}

export default function CheckRow({ label, checked, onChange, color }: CheckRowProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ accentColor: color, width: 14, height: 14, cursor: 'pointer' }} />
      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
    </label>
  );
}
