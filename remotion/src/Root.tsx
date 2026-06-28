import React from 'react';
import { Composition, Series } from 'remotion';
import { Hook }    from './compositions/Hook';
import { Problem } from './compositions/Problem';
import { Demo }    from './compositions/Demo';
import { Result }  from './compositions/Result';
import { CTA }     from './compositions/CTA';

// ─── Séquence maître (15s @ 30fps = 450 frames) ───────────────────────────
const GlowyTikTok: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={60}>
      <Hook />
    </Series.Sequence>
    <Series.Sequence durationInFrames={60}>
      <Problem />
    </Series.Sequence>
    <Series.Sequence durationInFrames={150}>
      <Demo />
    </Series.Sequence>
    <Series.Sequence durationInFrames={120}>
      <Result />
    </Series.Sequence>
    <Series.Sequence durationInFrames={60}>
      <CTA />
    </Series.Sequence>
  </Series>
);

// ─── Config 9:16 TikTok ───────────────────────────────────────────────────
const W = 1080;
const H = 1920;
const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="GlowyTikTok"
      component={GlowyTikTok}
      durationInFrames={450}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition id="Hook"    component={Hook}    durationInFrames={60}  fps={FPS} width={W} height={H} />
    <Composition id="Problem" component={Problem} durationInFrames={60}  fps={FPS} width={W} height={H} />
    <Composition id="Demo"    component={Demo}    durationInFrames={150} fps={FPS} width={W} height={H} />
    <Composition id="Result"  component={Result}  durationInFrames={120} fps={FPS} width={W} height={H} />
    <Composition id="CTA"     component={CTA}     durationInFrames={60}  fps={FPS} width={W} height={H} />
  </>
);
