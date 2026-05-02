import Icon from './Icon'
import { fmtSize } from '../utils'

interface FileChipProps {
  file: File;
  color: string;
  onRemove: () => void;
}

export default function FileChip({ file, color, onRemove }: FileChipProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      marginBottom: 16, background: 'var(--surface)', borderRadius: 'var(--r)',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: color + '14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="file" size={16} color={color} sw={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
        <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{fmtSize(file.size)}</p>
      </div>
      <button onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text3)', display: 'flex', padding: 4, borderRadius: 6,
      }}
      onMouseEnter={e => (e.currentTarget.style.color = color)}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
      >
        <Icon name="x" size={15} />
      </button>
    </div>
  );
}
