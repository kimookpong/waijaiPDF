import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { analyzePDF } from '../lib/pdfProcessor'
import type { Analysis } from '../types'

interface AnalyzingScreenProps {
  file: File;
  onDone: (result: Analysis) => void;
  onError: (msg: string) => void;
}

export default function AnalyzingScreen({ file, onDone, onError }: AnalyzingScreenProps) {
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState('โหลดไฟล์…');
  const done = useRef(false);

  useEffect(() => {
    done.current = false;
    analyzePDF(file, (pct, ph) => {
      if (done.current) return;
      setProg(pct);
      setPhase(ph);
    }).then(result => {
      if (done.current) return;
      onDone(result);
    }).catch(err => {
      if (done.current) return;
      onError(err instanceof Error ? err.message : 'ไม่สามารถอ่านไฟล์ได้');
    });
    return () => { done.current = true; };
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', animation: 'fadeIn .3s ease both',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--rl)', padding: '44px 40px',
        maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, margin: '0 auto 24px', borderRadius: 16,
          background: 'oklch(97% 0.02 25)', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            border: '2px solid var(--accent)', borderTopColor: 'transparent',
            animation: 'spin .85s linear infinite',
          }} />
          <Icon name="file" size={26} color="var(--accent)" sw={1.4} />
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.02em' }}>
          กำลังวิเคราะห์ไฟล์
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 28 }}>
          {file.name}
        </p>

        <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            height: '100%', borderRadius: 100, background: 'var(--accent)',
            width: `${prog}%`, transition: 'width .3s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: 'var(--text3)' }}>{phase}</span>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 500 }}>{prog}%</span>
        </div>
      </div>
    </div>
  );
}
