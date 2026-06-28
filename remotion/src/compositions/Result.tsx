import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { GLOWY, FONTS } from '../theme';

const INSIGHTS = [
  { icon: '🔍', label: 'Pores dilatés',    zone: 'Zone T',  tag: 'Modéré',    tagColor: '#FF8C42' },
  { icon: '💧', label: 'Déshydratation',   zone: 'Joues',   tag: 'Léger',     tagColor: '#5C9EFF' },
  { icon: '☀️', label: 'Sensibilité UV',   zone: 'Global',  tag: 'À surveiller', tagColor: '#A788FF' },
];

const ROUTINE = [
  { step: '1', name: 'Nettoyant doux',     brand: 'La Roche-Posay Toleriane', unlocked: true  },
  { step: '2', name: 'Sérum Niacinamide',  brand: 'The Ordinary 10%',         unlocked: false },
  { step: '3', name: 'Hydratant SPF 50',   brand: 'Bioderma Photoderm',        unlocked: false },
];

export const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Score ring animé
  const scoreRing = interpolate(frame, [0, 45], [0, 67], { extrapolateRight: 'clamp' });

  const headerProgress = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });

  // Apparition paywall button
  const paywallProgress = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: GLOWY.bgDark,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONTS.body,
        padding: '80px 72px',
        gap: 36,
        overflow: 'hidden',
      }}
    >
      {/* Glow ambiant */}
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,92,108,0.10) 0%, transparent 65%)`,
        top: '-10%', left: '-10%',
        pointerEvents: 'none',
      }} />

      {/* ── Header : Score ───────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 36,
        opacity: headerProgress,
        transform: `translateY(${interpolate(headerProgress, [0, 1], [-30, 0])}px)`,
      }}>
        {/* Ring */}
        <div style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: `conic-gradient(${GLOWY.accent} ${scoreRing * 3.6}deg, rgba(255,92,108,0.12) 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 32px rgba(255,92,108,0.25)',
        }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: GLOWY.bgDark,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: FONTS.mono,
              fontSize: 30, fontWeight: 700,
              color: GLOWY.score, lineHeight: 1,
            }}>
              67
            </span>
            <span style={{ fontFamily: FONTS.body, fontSize: 12, color: GLOWY.textLight }}>
              /100
            </span>
          </div>
        </div>

        {/* Texte */}
        <div>
          <div style={{
            fontFamily: FONTS.display,
            fontSize: 52, color: GLOWY.white, lineHeight: 1.1,
          }}>
            Ton Skin Score
          </div>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: 26, color: GLOWY.textLight, marginTop: 10,
          }}>
            Peau normale · mixte légère
          </div>
        </div>
      </div>

      {/* ── Insights ─────────────────────────────────────────────────────── */}
      <div>
        <div style={{
          fontFamily: FONTS.body,
          fontSize: 20, fontWeight: 700,
          letterSpacing: '0.12em', color: GLOWY.accent,
          textTransform: 'uppercase', marginBottom: 18,
          opacity: interpolate(frame, [12, 26], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}>
          Points d'attention
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {INSIGHTS.map((ins, i) => {
            const p = spring({
              frame: frame - 12 - i * 8,
              fps,
              config: { damping: 20, stiffness: 120 },
            });
            return (
              <div key={ins.label} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: 'rgba(255,92,108,0.07)',
                border: '1px solid rgba(255,92,108,0.18)',
                borderRadius: 22,
                padding: '18px 26px',
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [50, 0])}px)`,
              }}>
                <span style={{ fontSize: 32 }}>{ins.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.body, fontSize: 24, fontWeight: 700, color: GLOWY.white }}>
                    {ins.label}
                  </div>
                  <div style={{ fontFamily: FONTS.body, fontSize: 18, color: GLOWY.textLight }}>
                    {ins.zone}
                  </div>
                </div>
                <div style={{
                  background: `${ins.tagColor}22`,
                  borderRadius: 12,
                  padding: '6px 16px',
                  fontFamily: FONTS.body,
                  fontSize: 16, fontWeight: 600,
                  color: ins.tagColor,
                  whiteSpace: 'nowrap',
                }}>
                  {ins.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Routine (avec paywall) ────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div style={{
          fontFamily: FONTS.body,
          fontSize: 20, fontWeight: 700,
          letterSpacing: '0.12em', color: GLOWY.white,
          textTransform: 'uppercase', marginBottom: 18,
          opacity: interpolate(frame, [40, 55], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}>
          Ta routine personnalisée
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ROUTINE.map((step, i) => {
            const p = spring({ frame: frame - 44 - i * 7, fps, config: { damping: 20, stiffness: 120 } });
            const isLocked = !step.unlocked;

            return (
              <div key={step.name} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: isLocked ? GLOWY.glass : 'rgba(255,255,255,0.10)',
                border: `1px solid ${GLOWY.border}`,
                borderRadius: 20,
                padding: '18px 24px',
                opacity: Math.max(0.3, p) * (isLocked ? 0.55 : 1),
                filter: isLocked ? 'blur(5px)' : 'none',
                transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)`,
                pointerEvents: 'none',
              }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: isLocked ? 'rgba(255,255,255,0.08)' : GLOWY.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isLocked ? 18 : 16,
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  color: isLocked ? GLOWY.textLight : GLOWY.white,
                  flexShrink: 0,
                }}>
                  {isLocked ? '🔒' : step.step}
                </div>
                <div>
                  <div style={{ fontFamily: FONTS.body, fontSize: 20, fontWeight: 600, color: GLOWY.white }}>
                    {step.name}
                  </div>
                  <div style={{ fontFamily: FONTS.body, fontSize: 16, color: GLOWY.textLight }}>
                    {step.brand}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fondu + CTA paywall */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 160,
          background: `linear-gradient(to bottom, transparent, ${GLOWY.bgDark} 75%)`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 0,
          opacity: paywallProgress,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${GLOWY.accent}, #FF8FA3)`,
            borderRadius: 28,
            padding: '20px 40px',
            fontFamily: FONTS.body,
            fontSize: 28, fontWeight: 700,
            color: GLOWY.white,
            textAlign: 'center',
            boxShadow: `0 16px 48px rgba(255,92,108,0.40)`,
            transform: `scale(${0.9 + 0.1 * paywallProgress})`,
          }}>
            🔓 Débloquer ma routine — 4,99€
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
