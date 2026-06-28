import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { GLOWY, FONTS } from '../theme';

const PROBLEMS = [
  { emoji: '😤', label: 'Pores dilatés',    detail: 'Zone T et joues',         color: '#FF5C6C' },
  { emoji: '🔴', label: 'Rougeurs',          detail: 'Sensibilité réactive',    color: '#FF8C42' },
  { emoji: '💧', label: 'Déshydratation',    detail: 'Tiraillements fréquents', color: '#5C9EFF' },
  { emoji: '🌫️', label: 'Teint terne',       detail: 'Éclat irrégulier',        color: '#A788FF' },
];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: GLOWY.bgDark,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONTS.body,
        padding: '100px 72px',
        justifyContent: 'center',
        gap: 48,
        overflow: 'hidden',
      }}
    >
      {/* Glow de fond */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,92,108,0.08) 0%, transparent 65%)',
        top: '30%',
        right: '-15%',
        pointerEvents: 'none',
      }} />

      {/* Titre */}
      <div style={{
        opacity: titleProgress,
        transform: `translateY(${interpolate(titleProgress, [0, 1], [-40, 0])}px)`,
      }}>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 72,
          fontWeight: 400,
          color: GLOWY.white,
          margin: 0,
          lineHeight: 1.1,
        }}>
          Ton teint te parle.
        </h2>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: 34,
          color: GLOWY.textLight,
          margin: '16px 0 0',
        }}>
          Tu l'écoutes ?
        </p>
      </div>

      {/* Cards problèmes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {PROBLEMS.map((p, i) => {
          const cardSpring = spring({
            frame: frame - 10 - i * 7,
            fps,
            config: { damping: 20, stiffness: 120 },
          });
          return (
            <div
              key={p.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                background: GLOWY.glass,
                border: `1px solid ${GLOWY.border}`,
                borderRadius: 28,
                padding: '28px 36px',
                opacity: cardSpring,
                transform: `translateX(${interpolate(cardSpring, [0, 1], [-100, 0])}px)`,
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: `${p.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, flexShrink: 0,
              }}>
                {p.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 34, fontWeight: 700, color: GLOWY.white, lineHeight: 1 }}>
                  {p.label}
                </div>
                <div style={{ fontFamily: FONTS.body, fontSize: 24, color: GLOWY.textLight, marginTop: 6 }}>
                  {p.detail}
                </div>
              </div>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: p.color, flexShrink: 0,
                boxShadow: `0 0 12px ${p.color}88`,
              }} />
            </div>
          );
        })}
      </div>

      {/* Bottom hint */}
      <div style={{
        opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        textAlign: 'center',
      }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 28, color: GLOWY.accent, fontWeight: 600 }}>
          L'IA Glowy analyse tout ça en 30s →
        </span>
      </div>
    </AbsoluteFill>
  );
};
