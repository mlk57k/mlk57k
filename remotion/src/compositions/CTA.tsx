import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { GLOWY, FONTS } from '../theme';

const SOCIAL_PROOF = ['23 847 analyses', '4,9 ★ (2 100+ avis)', '🇫🇷 Made in France'];

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring  = spring({ frame,            fps, config: { damping: 14, stiffness: 70 } });
  const titleSpring = spring({ frame: frame - 8,  fps, config: { damping: 14, stiffness: 65 } });
  const subSpring   = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 65 } });
  const btnSpring   = spring({ frame: frame - 26, fps, config: { damping: 12, stiffness: 80 } });
  const proofSpring = spring({ frame: frame - 36, fps, config: { damping: 14, stiffness: 75 } });

  // Pulse du glow de fond
  const glowScale = interpolate(frame, [0, 30, 60], [0.85, 1.08, 0.85]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #200A28 0%, ${GLOWY.bgDark} 65%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.body,
        padding: '80px 72px',
        gap: 36,
        overflow: 'hidden',
      }}
    >
      {/* Glow ambiant pulsé */}
      <div style={{
        position: 'absolute',
        width: 900, height: 900,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,92,108,0.18) 0%, transparent 65%)`,
        top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${glowScale})`,
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        opacity: logoSpring,
        transform: `scale(${logoSpring})`,
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: FONTS.display,
          fontSize: 72, fontWeight: 400,
          color: GLOWY.white,
          letterSpacing: '-0.01em',
        }}>
          ✨ glowy
        </span>
      </div>

      {/* Headline */}
      <div style={{
        opacity: titleSpring,
        transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 84, fontWeight: 400,
          color: GLOWY.white,
          lineHeight: 1.05, margin: 0,
        }}>
          Découvre ta routine parfaite
        </h2>
      </div>

      {/* Sous-titre */}
      <div style={{
        opacity: subSpring,
        transform: `translateY(${interpolate(subSpring, [0, 1], [30, 0])}px)`,
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: 34, color: GLOWY.textLight,
          margin: 0, lineHeight: 1.4,
        }}>
          Analyse gratuite · Résultats en 30 secondes
        </p>
      </div>

      {/* Bouton CTA */}
      <div style={{
        opacity: btnSpring,
        transform: `scale(${btnSpring})`,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${GLOWY.accent} 0%, #FF8FA3 100%)`,
          borderRadius: 36,
          padding: '30px 72px',
          textAlign: 'center',
          boxShadow: `0 24px 64px rgba(255,92,108,0.45)`,
        }}>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: 44, fontWeight: 700,
            color: GLOWY.white, lineHeight: 1,
          }}>
            Analyser ma peau →
          </div>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: 26,
            color: 'rgba(255,255,255,0.75)',
            marginTop: 10,
            letterSpacing: '0.04em',
          }}>
            glowy.beauty
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div style={{
        opacity: proofSpring,
        transform: `translateY(${interpolate(proofSpring, [0, 1], [20, 0])}px)`,
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {SOCIAL_PROOF.map((item) => (
          <div key={item} style={{
            background: GLOWY.glass,
            border: `1px solid ${GLOWY.border}`,
            borderRadius: 20,
            padding: '12px 24px',
            fontFamily: FONTS.body,
            fontSize: 22, fontWeight: 600,
            color: GLOWY.textLight,
            whiteSpace: 'nowrap',
          }}>
            {item}
          </div>
        ))}
      </div>

      {/* Prix bas de page */}
      <div style={{
        opacity: interpolate(frame, [42, 56], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: FONTS.body,
          fontSize: 26, color: GLOWY.textLight,
        }}>
          Analyse gratuite →&nbsp;
          <span style={{ color: GLOWY.accent, fontWeight: 700 }}>Routine complète dès 4,99€</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
