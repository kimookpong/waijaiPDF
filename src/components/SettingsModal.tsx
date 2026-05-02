import Icon from './Icon'

interface SettingsModalProps {
  onClose: () => void;
}

const rows = [
  { label: 'ขนาดไฟล์สูงสุด', value: '100 MB' },
  { label: 'เก็บไฟล์ชั่วคราว', value: '24 ชั่วโมง' },
  { label: 'เวอร์ชัน',         value: 'v2.0.0-beta' },
];

export default function SettingsModal({ onClose }: SettingsModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,.38)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'fadeIn .2s ease both',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', borderRadius: 20, padding: '26px',
        width: '100%', maxWidth: 360,
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
        animation: 'scaleIn .2s ease both',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>ตั้งค่า</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', padding: 4 }}>
            <Icon name="x" size={17} />
          </button>
        </div>
        {rows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text)' }}>{row.value}</span>
          </div>
        ))}
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 16, lineHeight: 1.6 }}>
          ไฟล์จะถูกประมวลผลและลบอัตโนมัติหลังการใช้งาน
        </p>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 12 }}>
          made by{' '}
          <a href="https://kimookpong.github.io/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text2)', fontWeight: 500, textDecoration: 'none' }}>
            kimookpong
          </a>
        </p>
      </div>
    </div>
  );
}
