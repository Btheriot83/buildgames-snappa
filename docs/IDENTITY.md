# IDENTITY LOCK — Forge Ink / Night Press

**Frozen:** 2026-09-14 PT  
**Do not re-seed or rename this aesthetic in gauntlet rounds.**

## Name
**Night Press** — late-night printshop bench for fixed-size social graphics.

## Feel
Cold steel rulers on warm cream paper; lamp cutting a hard edge; ink smell; quiet confidence. Selecting a template = sliding a screenprint into registration. Export = pulling a wet sheet off the press.

## Palette (locked)
| Token | Hex | Role |
| --- | --- | --- |
| Chrome bg | `#0e1210` | App shell |
| Surface / panel | `#161c18` / `#1b221d` | Sidebars, chrome |
| Lime | `#a8e86a` | Registration / primary action |
| Amber | `#e0a045` | Secondary / assist |
| Paper well | `#e7e1d4` | Canvas stage (NOT perma-dark body) |
| Text | `#eceee9` / muted `#8b958d` | UI copy |

## Type (locked)
- **Mark only:** Archivo Black
- **UI:** IBM Plex Sans + IBM Plex Mono
- **Canvas quotes:** Playfair Display
- Syne allowed only as an optional *canvas* font — never UI default

## Materials
- Real GenerateImage textures: `public/assets/texture-*.jpg`, `empty-desk.jpg`
- Press-loop video: `public/assets/press-loop.mp4` (poster = empty-desk)
- No CSS-blob-only empty states

## Motion rules
- `press-ink-settle` on blank sheet reveal
- Registration mark pulse on empty well
- Existing export splash / panel-reveal OK
- Do **not** swap to a new motion language in gauntlet unless critic names a concrete gap

## Copy voice
Press-floor, short, concrete. "Pressman assist," not "AI Magic." See `docs/HAND_COPY.md`.

## Core job (unchanged)
Fixed-size social graphic composition + real AI layout/copy assist via API.

## Will NOT change in Phase B
- Aesthetic name / seed / palette family
- Paper-well + dark chrome split
- Archivo-as-mark-only rule
- Local-first IndexedDB / no accounts
