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

        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span>
            made by{' '}
            <a href="https://kimookpong.github.io/" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text2)', fontWeight: 500, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = t.accentColor)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
            >
              kimookpong
            </a>
          </span>
          <span style={{ opacity: 0.3 }}>·</span>
          <a href="https://github.com/kimookpong/waijaiPDF" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = t.accentColor)}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            waijaiPDF
          </a>
        </div>
      </div>
    </div>
  );
}
