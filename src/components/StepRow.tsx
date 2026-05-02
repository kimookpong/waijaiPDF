import Icon from './Icon'

interface StepRowProps {
  steps: string[];
  active: number;
  color: string;
}

export default function StepRow({ steps, active, color }: StepRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 12, color: 'var(--text3)' }}>
      {steps.map((s, i) => (
        <>
          {i > 0 && <div key={`line-${i}`} style={{ flex: 1, height: 1, background: 'var(--border)' }} />}
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: i <= active ? color : 'var(--bg3)',
              border: `1.5px solid ${i <= active ? color : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
              color: i <= active ? 'white' : 'var(--text3)',
            }}>
              {i < active ? <Icon name="check" size={9} color="white" sw={3} /> : i + 1}
            </div>
            <span style={{ color: i === active ? 'var(--text)' : 'var(--text3)', fontWeight: i === active ? 500 : 400 }}>{s}</span>
          </div>
        </>
      ))}
    </div>
  );
}
