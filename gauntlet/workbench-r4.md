# Gauntlet workbench R4 — Forge Ink (snappa) INTEGRITY re-run

**Identity locked:** Night Press (`docs/IDENTITY.md`) — **no reseed**.  
**Bar:** https://snappa.com/ · **Demo:** https://buildgames-snappa.vercel.app  
**Gate:** `/workspace/build-games/gauntlet/INTEGRITY_GATE.md`  
**Dream-loop:** `.dream-loop/target.png` (gitignored); refs `gauntlet/shots-r4/dream-baseline.png`, `dream-target-ref.png`.

## Transitions.dev → real actions
| Recipe | Fires on |
| --- | --- |
| success-check | Export PDF/SVG success (`SuccessSplash`) |
| toast | Export/load confirmation (`SuccessSplash`) |
| error-state-shake | Editor error banner + Assist brief validation fail |
| panel-reveal | Template gallery open/close |
| card-tilt | Template cards pointer track (`TiltCard`) |
| number-pop-in | Ink drop / export counters (`InkDropCounter`) |
| texts-reveal | Gallery kicker/headline/body on open (r16) |
| skeleton-reveal | IndexedDB hydrate overlay (r16) |

## Rounds (20 counted)

## r1 — bar gap
- files: src/components/editor/TemplateGallery.tsx, src/app/globals.css
- shot: gauntlet/shots-r4/r1-*.png (+ bar A/B)
- verdict: Snappa still wins marketing light/contrast; our lime job tape denser, still Night Press.
- commit: 304d52f

## r2 — fonts
- files: src/app/globals.css, src/components/editor/Toolbar.tsx
- shot: gauntlet/shots-r4/r2-*.png
- verdict: Mark reads tighter like a press stamp; Snappa softer marketing display.
- commit: db2903d

## r3 — contrast
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r3-*.png
- verdict: Panel seams hold better on charcoal; still darker than Snappa white UI.
- commit: 8e2fabd

## r4 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r4-*.png
- verdict: Primary Export weight clearer; role parity improved on dark chrome.
- commit: 4da8023

## r5 — bar gap
- files: src/components/editor/TemplateGallery.tsx
- shot: gauntlet/shots-r4/r5-*.png (+ bar A/B)
- verdict: Headline scale closer to Snappa punch; original wins stock breadth.
- commit: 77b8d48

## r6 — contrast
- files: src/components/editor/AssistPanel.tsx, src/app/globals.css
- shot: gauntlet/shots-r4/r6-*.png
- verdict: Error shake fires on real assist fail; danger holds better.
- commit: 5902fea

## r7 — fonts
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r7-*.png
- verdict: Type ladder more readable; still denser than Snappa marketing.
- commit: 82ca1e5

## r8 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r8-*.png
- verdict: Secondary Close/Templates read as real chrome; Snappa softer on white.
- commit: dfe4dcb

## r9 — fonts
- files: src/components/editor/TemplateGallery.tsx
- shot: gauntlet/shots-r4/r9-*.png
- verdict: Card titles closer to Snappa template name weight.
- commit: 2a25967

## r10 — bar gap
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r10-*.png (+ bar A/B)
- verdict: Inputs closer to Snappa inspector density; original wins light polish.
- commit: 48801ec

## r11 — buttons
- files: src/app/globals.css, .gitignore, dream refs
- shot: gauntlet/shots-r4/r11-*.png
- verdict: Tool chips closer to dream-target lime Select punch.
- commit: 64a9aea
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r12 — contrast
- files: src/app/globals.css, src/components/editor/LayersPanel.tsx
- shot: gauntlet/shots-r4/r12-*.png
- verdict: LAYERS/PROPERTIES heads match dream lime mono.
- commit: 730cff9
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r13 — fonts
- files: src/components/editor/EditorApp.tsx, src/components/editor/StatusBar.tsx
- shot: gauntlet/shots-r4/r13-*.png
- verdict: Top tape/status denser like dream; Snappa has no press strip.
- commit: f465f4d
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r14 — buttons
- files: src/app/globals.css, src/components/editor/ExportDock.tsx
- shot: gauntlet/shots-r4/r14-*.png
- verdict: Export dock closer to dream primary weight.
- commit: ad86926
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r15 — bar gap
- files: src/components/editor/SizeRail.tsx
- shot: gauntlet/shots-r4/r15-*.png (+ bar A/B)
- verdict: Size chips denser vs dream; Snappa create wins library breadth.
- commit: b228041 / 80355b8
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r16 — fonts
- files: src/app/transitions.css, src/components/editor/TemplateGallery.tsx, src/components/editor/EditorApp.tsx
- shot: gauntlet/shots-r4/r16-*.png
- verdict: Headline reveal on gallery open; Snappa softer fade language.
- commit: 8fd7f9a
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r17 — contrast
- files: src/components/editor/TemplateGallery.tsx (card CSS landed with r18)
- shot: gauntlet/shots-r4/r17-*.png
- verdict: Card borders/badges closer to dream lime registration.
- commit: e2e401e
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r18 — buttons
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r18-*.png
- verdict: Tertiary ghost visible without competing with Export lime.
- commit: d3d901d
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r19 — fonts
- files: src/components/editor/LayersPanel.tsx, src/app/globals.css
- shot: gauntlet/shots-r4/r19-*.png
- verdict: Layer type denser toward dream; harder paper stage edge.
- commit: 4c990bf
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

## r20 — bar gap
- files: src/components/editor/TemplateGallery.tsx, src/app/globals.css
- shot: gauntlet/shots-r4/r20-*.png (+ bar A/B)
- verdict: Blank sheet primary lime; Snappa still wins stock + light marketing. Night Press holds.
- commit: 856ee57
- dream-loop: closing live → `.dream-loop/target.png` while still vs snappa.com

