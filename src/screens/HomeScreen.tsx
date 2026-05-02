import { useEffect, useState } from 'react'
import DropZone from '../components/DropZone'
import Icon from '../components/Icon'
import type { TweakValues } from '../types'

interface HomeScreenProps {
  t: TweakValues;
  onFile: (file: File) => void;
}

export default function HomeScreen({ t, onFile }: HomeScreenProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '80px 24px',
    }}>
      <div style={{
        maxWidth: 480, width: '100%',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)',
        transition: 'opacity .4s ease, transform .4s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 600,
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 12,
          }}>
            จัดการไฟล์ PDF<br />
            <span style={{ color: t.accentColor }}>ง่ายและรวดเร็ว</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 300, lineHeight: 1.65 }}>
            อัปโหลดไฟล์ ระบบจะวิเคราะห์และแนะนำวิธีที่เหมาะสม
          </p>
        </div>

        <DropZone t={t} onFile={onFile} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
          {([['compress', 'บีบอัดไฟล์'], ['convert', 'แปลงรูปแบบ'], ['doc', 'วิเคราะห์ PDF']] as const).map(([icon, lbl]) => (
            <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
              <Icon name={icon} size={13} color="var(--text3)" sw={1.5} />
              {lbl}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: 'var(--text3)' }}>
          made by{' '}
          <a href="https://kimookpong.github.io/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text2)', fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = t.accentColor)}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
          >
            kimookpong
          </a>
        </p>
      </div>
    </div>
  );
}
