import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { GLOWY, FONTS } from '../theme';

const BADGES = ['🧴 Skincare', '🔬 IA Analysis', '✨ Glowy'];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrow = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const headline = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 70 } });
  const sub      = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 70 } });

  const glowOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  // Fond pulsé rose très subtil
  const pulse = interpolate(frame, [0, 30, 60], [0.8, 1.05, 0.8]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #FFF5F8 0%, ${GLOWY.bg} 60%, #F5F0FF 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.body,
        padding: '100px 72px',
        overflow: 'hidden',
      }}
    >
      {/* Cercle glow ambiant */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,92,108,0.12) 0%, transparent 70%)`,
          opacity: glowOpacity,
          transform: `scale(${pulse})`,
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
        }}
      />

      {/* Eyebrow */}
      <div
        style={{
          opacity: eyebrow,
          transform: `translateY(${interpolate(eyebrow, [0, 1], [32, 0])}px)`,
          marginBottom: 36,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.body,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: GLOWY.accent,
            textTransform: 'uppercase',
          }}
        >
          ✨ Glowy AI
        </span>
      </div>

      {/* Headline principale */}
      <div
        style={{
          opacity: headline,
          transform: `translateY(${interpolate(headline, [0, 1], [60, 0])}px)`,
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.display,
            fontSize: 100,
            fontWeight: 400,
            color: GLOWY.text,
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Tu connais vraiment ta peau ?
        </h1>
      </div>

      {/* Sous-titre */}
      <div
        style={{
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [30, 0])}px)`,
          textAlign: 'center',
          marginBottom: 80,
        }}
      >
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 36,
            fontWeight: 400,
            color: GLOWY.textLight,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Analyse IA · 30 secondes · Résultat instantané
        </p>
      </div>

      {/* Badges en bas */}
      <div style={{ display: 'flex', gap: 20 }}>
        {BADGES.map((badge, i) => {
          const badgeSpring = spring({
            frame: frame - 28 - i * 8,
            fps,
            config: { damping: 12, stiffness: 110 },
          });
          return (
            <div
              key={badge}
              style={{
                background: GLOWY.accentLight,
                borderRadius: 28,
                padding: '18px 28px',
                fontFamily: FONTS.body,
                fontSize: 24,
                fontWeight: 600,
                color: GLOWY.accent,
                opacity: badgeSpring,
                transform: `scale(${badgeSpring})`,
                whiteSpace: 'nowrap',
              }}
            >
              {badge}
            </div>
          );
        })}
      </div>

      {/* Flèche bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          fontSize: 48,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(frame % 40, [0, 20, 40], [0, 10, 0])}px)`,
        }}
      >
        👇
      </div>
    </AbsoluteFill>
  );
};
