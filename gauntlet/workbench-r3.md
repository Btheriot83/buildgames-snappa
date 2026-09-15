# Gauntlet workbench R3 — Forge Ink (snappa)

**Identity locked:** Night Press (`docs/IDENTITY.md`) — **no reseed**.  
**Bar:** https://snappa.com/ · **Demo:** https://buildgames-snappa.vercel.app  
**Phase B1:** 5 · **B2:** 10 · **B3:** 20 rounds (this file)

Hard bar: flat chrome (no decorative gradients / glass / glow). Craft focus: **fonts, contrast, buttons**, close A/B vs live Snappa.

## Job (≤3s)
Compose fixed-size social graphic → edit type → **Export PDF / SVG**.

## Bar notes (live Snappa screenshots)
| Shot | Path |
| --- | --- |
| Snappa home | `gauntlet/shots/b3-bar-snappa-home.png` (+ cli twin) |
| Snappa create | `gauntlet/shots/b3-bar-snappa-create.png` |
| Ours before | `gauntlet/shots/b3-before-gallery.png` |
| Ours after gallery | `gauntlet/shots/b3-r20-gallery.png` |
| Ours editor | `gauntlet/shots/b3-r20-editor.png` |
| Ours blank | `gauntlet/shots/b3-r20-blank.png` |
| Hours editor | `gauntlet/shots/b3-r20-hours-editor.png` |

Snappa craft tells we chased (without stealing white marketing identity): high-contrast headline/body, one solid primary CTA, secondary actions with real weight, readable UI type (≥11–14px), no washed grey-on-grey.

## Rounds (20)

### R1 — Baseline A/B capture
- **Piece:** Need pixels of bar + our live B2.
- **Fix:** Shot snappa.com home/create + live demo gallery before changes.
- **Critic:** Original wins marketing polish/contrast; candidate washes muted chrome. Gap named: type micro + washed pairs + weak buttons.
- **Verdict:** Baseline locked for B3.

### R2 — Contrast tokens (within Night Press)
- **Piece:** `#8b958d` muted on `#161c18` washed; soft borders `#2c352f`.
- **Fix:** Lift `--ink-muted` → `#a4ada6`, add `--ink-label` `#c8d0c9`, strengthen borders, brighten text/lime/amber slightly (same family).
- **Critic:** Labels/body hold better on charcoal. Spottable ≤3s vs before.
- **Verdict:** Keep.

### R3 — Type ladder
- **Piece:** 9–10px mono everywhere; no UI scale.
- **Fix:** `.ui-label` 11px, `.ui-caption` 12px, `.ui-body` 14px, `.ui-title` 22px; kill microtype on chrome.
- **Critic:** Gallery intro + panels readable; still denser than Snappa marketing (OK — editor).
- **Verdict:** Keep.

### R4 — Archivo discipline
- **Piece:** Card titles used `.mark-word` (Archivo) → AI display-font soup.
- **Fix:** `.card-title` = IBM Plex Sans 600; Archivo only mark + canvas posters.
- **Critic:** Gallery cards read as product UI, not poster farm. Matches IDENTITY mark-only rule.
- **Verdict:** Keep.

### R5 — Primary button system
- **Piece:** Export PDF looked like another chip.
- **Fix:** `.btn-primary` solid lime, min-height 36px, 13px semibold — toolbar + export dock.
- **Critic:** Blind vs Snappa teal CTA: same *role* clarity on dark chrome. Clear win.
- **Verdict:** Keep.

### R6 — Secondary button system
- **Piece:** SVG / Close / Templates lacked weight.
- **Fix:** `.btn-secondary` flat panel + strong border; Templates lime-bordered secondary; Close secondary.
- **Critic:** Primary/secondary hierarchy readable in toolbar + gallery footer.
- **Verdict:** Keep.

### R7 — Ghost + chip controls
- **Piece:** Undo/Import/.JSON and size chips either invisible or competing with primary.
- **Fix:** `.btn-ghost` + `.btn-chip` with active solid lime; blank size chips use chip.
- **Critic:** Tertiary actions demoted; chips still tappable. Gap: Fit uses secondary — OK.
- **Verdict:** Keep.

### R8 — Tool rail active state
- **Piece:** Active tool lime fill OK but inactive too ghostly; inconsistent border.
- **Fix:** Strengthen `.tool-btn` size/weight; active = solid lime + border.
- **Critic:** Select/Text tools read as Snappa-like tool chrome density.
- **Verdict:** Keep.

### R9 — Gallery headline hierarchy
- **Piece:** H2 competing with job tape; body washed.
- **Fix:** Larger mark H2 (3xl/4xl), ui-body intro, stronger Close.
- **Critic:** ≤3s job still obvious; type hierarchy closer to Snappa home headline craft.
- **Verdict:** Keep.

### R10 — Mid A/B vs Snappa
- **Piece:** Re-check after type/button pass.
- **Fix:** Re-open bar shots; compare gallery after.
- **Critic:** Original still wins stock/library breadth + light theme marketing. Candidate wins Night Press editor craft + compose→export weight. Biggest remaining gap: properties density vs Snappa inspector polish.
- **Verdict:** Continue properties/contrast.

### R11 — Properties panel labels + inputs
- **Piece:** 10px washed labels; soft input borders.
- **Fix:** `.ui-label` + `.field-input` strong border; panel-head; align/group/delete use btn system.
- **Critic:** Inspector readable; inputs hold contrast. Gap: still denser than Snappa — OK.
- **Verdict:** Keep.

### R12 — Layers selection contrast
- **Piece:** `bg-ink-lime/15` washed active row.
- **Fix:** Flat `.layer-row[data-active]` solid `#24301f` + lime-dim border (no opacity wash).
- **Critic:** Active layer obvious without glow/gradient.
- **Verdict:** Keep.

### R13 — Size rail readability
- **Piece:** 9px SIZE + opacity-50 px dims.
- **Fix:** ui-label SIZE; btn-chip presets; Fit secondary; dim text uses ink-muted not opacity.
- **Critic:** Active size chip matches Snappa preset-clarity vibe.
- **Verdict:** Keep.

### R14 — Export dock weight
- **Piece:** Dock CTAs undersized vs job importance.
- **Fix:** Ready-to-pull label + body; SVG secondary; Export PDF primary.
- **Critic:** Job CTA dominates bottom-right; matches Snappa “one primary action” craft.
- **Verdict:** Keep.

### R15 — Assist amber vs Export lime roles
- **Piece:** Amber assist looked like a second primary.
- **Fix:** `.btn-amber` reserved for Pressman; Export stays lime primary; brief chips = btn-chip.
- **Critic:** Role split clear: assist suggests, Export ships.
- **Verdict:** Keep.

### R16 — Kill washed opacity chrome
- **Piece:** `text-ink-muted/70`, `border-ink-lime/25`, `bg-ink-surface/95`.
- **Fix:** Solid surfaces; strong borders; job tape uses border-strong not lime/25.
- **Critic:** No washed pairs on chrome. Flat bar holds.
- **Verdict:** Keep.

### R17 — Materials / job tape type
- **Piece:** 9px tape hard to read.
- **Fix:** h-8, 11px mono, tracking 0.12em.
- **Critic:** Night Press / Fixed size / Compose→Export readable without squint.
- **Verdict:** Keep.

### R18 — Blank path buttons
- **Piece:** Blank sheet + Open templates weak vs Snappa Get Started weight.
- **Fix:** Blank sheet = secondary lime-border; blank press card uses btn-primary Open templates; caption 15px semibold on paper.
- **Critic:** Blank path CTAs earn weight; paper well stays flat cream.
- **Verdict:** Keep.

### R19 — Anti-slop audit
- **Piece:** Risk of reintroducing gradients/glass while polishing buttons.
- **Fix:** Audit: no decorative gradients; tilt glare still display:none; GrainShader speckles only; hard offset shadows only.
- **Critic:** Flat bar intact. Pass.
- **Verdict:** Keep.

### R20 — Coherence + final A/B shots
- **Piece:** Status/panel heads, editor + hours template proof.
- **Fix:** Status bar h-9 + label contrast; final gallery/editor/blank/hours shots; workbench + status-r3.
- **Critic:** Blind: Snappa still wins marketing site; Forge Ink closer on editor craft (type, contrast, button weight) under Night Press. Ready for walkthrough after all apps finish B3.
- **Verdict:** B3 complete · identity frozen.

## Blind stance vs snappa.com
Original wins: light marketing polish, stock library, brand familiarity.  
Candidate wins: Night Press identity, local compose→export job clarity, primary/secondary button craft, contrast that holds on dark chrome, Archivo-as-mark-only.  
No reseed without Brandon.
