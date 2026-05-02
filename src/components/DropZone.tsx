import { useId, useState } from 'react'
import Icon from './Icon'
import type { TweakValues } from '../types'

interface DropZoneProps {
  t: TweakValues;
  onFile: (file: File) => void;
}

export default function DropZone({ t, onFile }: DropZoneProps) {
  const [drag, setDrag] = useState(false);
  const id = useId();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFile(e.target.files[0]);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => (document.getElementById(id) as HTMLInputElement)?.click()}
      style={{
        border: `2px dashed ${drag ? t.accentColor : 'var(--border)'}`,
        borderRadius: 'var(--rl)', background: drag ? t.accentColor + '08' : 'var(--surface)',
        padding: '48px 24px', cursor: 'pointer', transition: 'all .2s ease',
        textAlign: 'center', boxShadow: drag ? `0 0 0 4px ${t.accentColor}14` : 'var(--shadow-sm)',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: drag ? t.accentColor : 'var(--bg2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', transition: 'all .2s',
      }}>
        <Icon name="upload" size={24} color={drag ? 'white' : 'var(--text3)'} sw={1.5} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 500, color: drag ? t.accentColor : 'var(--text)', marginBottom: 6 }}>
        {drag ? 'วางไฟล์ที่นี่' : 'วางหรือคลิกเพื่ออัปโหลด PDF'}
      </p>
      <p style={{ fontSize: 12, color: 'var(--text3)' }}>PDF เท่านั้น · สูงสุด 100 MB</p>
      <input id={id} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handleChange} />
    </div>
  );
}
