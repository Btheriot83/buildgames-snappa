# Gauntlet workbench R2 — Forge Ink (snappa)

**Identity locked:** Night Press (`docs/IDENTITY.md`) — **no reseed**.  
**Bar:** https://snappa.com/ · **Demo:** https://buildgames-snappa.vercel.app  
**Phase B1:** 5 rounds complete · **Phase B2:** 10 rounds (this file)

Hard bar (Brandon / Inkwell): **no decorative gradients, glass blur, or glow** on chrome — flat materials + real photos only.

## Job (≤3s)
Compose a fixed-size social graphic → edit type on the sheet → **Export PDF / SVG**.

## Rounds

### R1 — Job clarity billboard
- **Piece:** First paint didn’t scream compose→export.
- **Fix:** Lime job tape `Compose graphic → Fixed size → Export SVG / PDF`; gallery H2 **Compose. Export.**; materials tape under chrome.
- **Visible:** Full-width lime tape + new H2. Spottable ≤3s.

### R2 — Template cards show the job
- **Piece:** Thumbs were texture-only; sizes buried.
- **Fix:** Size badge (`1080×1080` etc.) + real headline overlay on each card; tall/wide aspect hints.
- **Visible:** Cards read as finished graphics, not stock textures.

### R3 — Real-looking copy (no SAMPLE)
- **Piece:** Abstract “SHIP LOUD” / “Studio notes”.
- **Fix:** Mesa / Roosevelt Row / AZ Mobile Diesel flavor — `MESA BAY OPEN`, `R. Castillo · Mesa`, `2140 E Apache Blvd`, `$89` diagnostic.
- **Visible:** Believable shop graphics on first template pick.

### R4 — Library depth
- **Piece:** Only five starters vs Snappa breadth gap.
- **Fix:** +`shop-hours` (Bay Hours Card) +`story-offer` (Lot Special Story).
- **Visible:** Seven cards; hours + offer stories.

### R5 — Export dock / path
- **Piece:** Export lived only in toolbar; easy to miss after compose.
- **Fix:** Sticky **Export dock** (`Ready to pull` + SVG + Export PDF) when elements exist; load status “edit type, then Export PDF”.
- **Visible:** Dock bottom-right; CTA renamed **Export PDF**.

### R6 — Mistake / density fixes
- **Piece:** Size rail without px; weak default text; thin handles.
- **Fix:** Size rail shows `W×H`; default text “Your headline”; thicker lime handles; status idle = job path copy.
- **Visible:** Rail badges with dimensions; clearer selection chrome.

### R7 — Blank path
- **Piece:** Blank was a quiet link.
- **Fix:** Gallery footer **Blank + size** chips; blank sheet CTA; press video caption with Open templates.
- **Visible:** Size chips + blank CTA in gallery footer.

### R8 — Assist OpenRouter + real briefs
- **Piece:** Assist 502 (key sent to openai/xAI); placeholders generic.
- **Fix:** `assist.ts` → OpenRouter per `gauntlet/LLM.md`; canvas WxH in assist header; Mesa/Roosevelt brief chips.
- **Visible:** Brief chips; honest API status; (deploy needs `LLM_BASE_URL` if not already).

### R9 — Hierarchy cut
- **Piece:** Import/.JSON competed with Export.
- **Fix:** Demote Import/.JSON; Templates lime-bordered; ink drops muted; Export PDF primary.
- **Visible:** Export cluster dominates toolbar right.

### R10 — Flat anti-slop + coherence
- **Piece:** Brandon bar — gradients / glass / glow = AI slop.
- **Fix:** Strip chrome linear/radial/mesh gradients; kill tilt glare + backdrop blur; flat paper well; flat template scrim plate; GrainShader = speckles only (no blob gradients); hard offset shadows only.
- **Visible:** Flat Night Press chrome; photo thumbs without gradient washes; no glass dock.

## Shots
| | Path |
| --- | --- |
| Before (live B1) | `gauntlet/shots/b2-before-gallery.png` |
| After gallery | `gauntlet/shots/b2-r10-gallery.png` |
| After editor | `gauntlet/shots/b2-r10-editor.png` |
| Blank | `gauntlet/shots/b2-r10-blank.png` |
| Hours template | `gauntlet/shots/b2-r10-hours.png` |

## Blind note vs snappa.com
Original still wins marketing/stock library breadth. Forge Ink wins Night Press identity + local compose→export job clarity with real AZ shop templates. Ready for walkthrough video (core loop ≤90s).
