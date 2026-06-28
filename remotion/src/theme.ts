// ─── Glowy Design Tokens ───────────────────────────────────────────────────
// Installer les fonts : npm install @remotion/google-fonts
// Puis remplacer les valeurs FONTS par les fontFamily chargées via loadFont()

export const GLOWY = {
  bg:          '#FBF6F0',               // crème chaud
  bgDark:      '#0D0912',               // violet quasi-noir
  accent:      '#FF5C6C',               // rouge-rosé vif
  accentLight: '#FFE8EC',               // rose pastel
  accentDim:   'rgba(255,92,108,0.15)', // pour backgrounds
  text:        '#0D0912',               // texte sur fond clair
  textLight:   '#9B8FA0',               // sous-titres / captions
  score:       '#FF3D5A',               // couleur du score
  white:       '#FFFFFF',
  glass:       'rgba(255,255,255,0.08)',
  border:      'rgba(255,255,255,0.10)',
} as const;

// Police sans @remotion/google-fonts — remplacer si tu ajoutes le package
export const FONTS = {
  display: '"Georgia", "Times New Roman", serif',        // → DM Serif Display
  body:    '"Helvetica Neue", "Arial", sans-serif',      // → DM Sans
  mono:    '"Courier New", monospace',                   // → Space Grotesk
} as const;

// ─── Guide de remplacement avec Google Fonts ───────────────────────────────
// import { loadFont as loadDMSans }           from '@remotion/google-fonts/DM-Sans';
// import { loadFont as loadDMSerif }          from '@remotion/google-fonts/DM-Serif-Display';
// import { loadFont as loadSpaceGrotesk }    from '@remotion/google-fonts/Space-Grotesk';
//
// const { fontFamily: DM_SANS }       = loadDMSans();
// const { fontFamily: DM_SERIF }      = loadDMSerif();
// const { fontFamily: SPACE_GROTESK } = loadSpaceGrotesk();
//
// export const FONTS = {
//   display: DM_SERIF,
//   body:    DM_SANS,
//   mono:    SPACE_GROTESK,
// } as const;
