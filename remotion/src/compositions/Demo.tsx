import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { GLOWY, FONTS } from '../theme';

// ─── Phases (en frames) ───────────────────────────────────────────────────
const P1_END = 50;    // fin upload → début scan
const P2_END = 100;   // fin scan  → début score
const P3_END = 150;   // fin score (= fin compo)

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase1 = frame < P1_END;
  const isPhase2 = frame >= P1_END && frame < P2_END;
  const isPhase3 = frame >= P2_END;

  // Score animé 0 → 67
  const score = Math.round(
    interpolate(frame, [P2_END + 5, P3_END - 10], [0, 67], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const scoreAngle = score * 3.6; // pour conic-gradient

  // Barre de progression (phase 2)
  const progressPct = interpolate(frame, [P1_END, P2_END], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ligne de scan qui boucle verticalement (phase 2)
  const SCAN_HEIGHT = 200;
  const localScanFrame = (frame - P1_END) % 30;
  const scanY = interpolate(localScanFrame, [0, 30], [0, SCAN_HEIGHT]);

  // Entrée du téléphone
  const phoneEnter = spring({ frame, fps, config: { damping: 16, stiffness: 60 } });
  const phonePulse  = interpolate(frame, [0, 15, 30, 45, 60], [0.96, 1, 0.96, 1, 0.96]);

  // Label haut
  const statusLabel = isPhase1
    ? '📸  Photo uploadée'
    : isPhase2
    ? '🔬  Scan IA en cours…'
    : '✅  Analyse terminée';

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(150deg, #F5EEF8 0%, ${GLOWY.bg} 60%, #EEF5FF 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTS.body,
        padding: '80px 60px',
        gap: 48,
        overflow: 'hidden',
      }}
    >
      {/* Status label */}
      <div style={{
        background: GLOWY.bgDark,
        borderRadius: 32,
        padding: '18px 40px',
        fontFamily: FONTS.body,
        fontSize: 30,
        fontWeight: 600,
        color: GLOWY.white,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
        letterSpacing: '0.02em',
      }}>
        {statusLabel}
      </div>

      {/* ── Téléphone ───────────────────────────────────────────────────── */}
      <div style={{
        width: 360,
        height: 720,
        borderRadius: 52,
        background: GLOWY.bgDark,
        boxShadow: '0 48px 120px rgba(13,9,18,0.35), 0 0 0 2px rgba(255,255,255,0.08)',
        padding: '18px 14px',
        transform: `scale(${phoneEnter * phonePulse})`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{
          width: 100, height: 22,
          background: '#1A1020',
          borderRadius: 11,
          margin: '0 auto 12px',
          border: '1.5px solid rgba(255,255,255,0.08)',
        }} />

        {/* Écran */}
        <div style={{
          flex: 1,
          borderRadius: 36,
          background: GLOWY.bg,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 20,
        }}>

          {/* ── Phase 1 : Upload ─────────────────────────────────────── */}
          {isPhase1 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              opacity: interpolate(frame, [P1_END - 10, P1_END], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}>
              {/* Avatar photo */}
              <div style={{
                width: 140, height: 160,
                borderRadius: 28,
                background: 'linear-gradient(135deg, #FFDDD2, #FFBBA4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 72,
                boxShadow: `0 12px 32px rgba(255,92,108,0.20)`,
                transform: `scale(${spring({ frame, fps, config: { damping: 12, stiffness: 80 } })})`,
              }}>
                👤
              </div>
              <div style={{
                fontFamily: FONTS.body, fontSize: 16, fontWeight: 700,
                color: GLOWY.text, textAlign: 'center',
              }}>
                Photo chargée
              </div>
              <div style={{
                fontFamily: FONTS.body, fontSize: 12,
                color: GLOWY.textLight, textAlign: 'center',
              }}>
                Lumière naturelle · Portrait
              </div>
              {/* Check badge */}
              <div style={{
                background: GLOWY.accent,
                borderRadius: 12,
                padding: '6px 16px',
                fontFamily: FONTS.body,
                fontSize: 13, fontWeight: 700, color: GLOWY.white,
              }}>
                ✓ Qualité optimale
              </div>
            </div>
          )}

          {/* ── Phase 2 : Scan ───────────────────────────────────────── */}
          {isPhase2 && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 16, width: '100%',
              opacity: interpolate(frame, [P2_END - 8, P2_END], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}>
              {/* Face + scan line */}
              <div style={{
                width: 160, height: SCAN_HEIGHT,
                borderRadius: 24,
                background: 'linear-gradient(135deg, #FFDDD2, #FFBBA4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 80,
                position: 'relative',
                overflow: 'hidden',
              }}>
                👤
                {/* Scan line */}
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  height: 3,
                  top: scanY,
                  background: `linear-gradient(90deg, transparent, ${GLOWY.accent}, transparent)`,
                  boxShadow: `0 0 16px ${GLOWY.accent}`,
                }} />
                {/* Grid overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(255,92,108,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,92,108,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }} />
              </div>

              {/* Barre progression */}
              <div style={{
                width: '100%', height: 6,
                borderRadius: 3,
                background: GLOWY.accentLight,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progressPct}%`, height: '100%',
                  background: `linear-gradient(90deg, ${GLOWY.accent}, #FF8FA3)`,
                  borderRadius: 3,
                }} />
              </div>

              {/* Items en cours */}
              {['Texture cutanée', 'Hydratation', 'Pores', 'Éclat'].map((item, i) => {
                const itemProgress = interpolate(
                  frame - P1_END,
                  [i * 10, i * 10 + 8],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10, width: '100%',
                    opacity: itemProgress,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: GLOWY.accent, flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: FONTS.body, fontSize: 13,
                      color: GLOWY.textLight,
                    }}>
                      Analyse {item}…
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Phase 3 : Score ──────────────────────────────────────── */}
          {isPhase3 && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 16,
              opacity: interpolate(frame - P2_END, [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <span style={{
                fontFamily: FONTS.body, fontSize: 11,
                fontWeight: 700, letterSpacing: '0.12em',
                color: GLOWY.accent, textTransform: 'uppercase',
              }}>
                Skin Score
              </span>

              {/* Score ring */}
              <div style={{
                width: 150, height: 150,
                borderRadius: '50%',
                background: `conic-gradient(${GLOWY.accent} ${scoreAngle}deg, ${GLOWY.accentLight} 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 32px rgba(255,92,108,0.30)`,
              }}>
                <div style={{
                  width: 118, height: 118,
                  borderRadius: '50%',
                  background: GLOWY.bg,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: FONTS.mono,
                    fontSize: 42, fontWeight: 700,
                    color: GLOWY.score, lineHeight: 1,
                  }}>
                    {score}
                  </span>
                  <span style={{
                    fontFamily: FONTS.body,
                    fontSize: 13, color: GLOWY.textLight,
                  }}>
                    /100
                  </span>
                </div>
              </div>

              <div style={{
                fontFamily: FONTS.body, fontSize: 15, fontWeight: 600,
                color: GLOWY.text, textAlign: 'center',
              }}>
                Peau normale · légèrement mixte
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Légende bas */}
      <div style={{
        textAlign: 'center',
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <span style={{
          fontFamily: FONTS.body, fontSize: 26,
          color: GLOWY.textLight,
        }}>
          Propulsé par Claude AI · Vision multimodale
        </span>
      </div>
    </AbsoluteFill>
  );
};
