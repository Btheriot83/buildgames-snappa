# Forge Ink — Snappa replacement

Local-first social graphics studio. Compose fixed-size canvases from text, shapes, images, and starter layouts — then export **SVG** or print-ready **PDF**. All project data stays in your browser by default.

**Aesthetic:** Forge Ink (charcoal + electric lime + amber). No accounts, billing, telemetry, multiplayer, or stock library.

## One command (local)

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pick a template on first visit, edit on the canvas, export SVG/PDF from the toolbar.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Next.js 15 dev server |
| `npm test` | Vitest unit tests (transforms) + Playwright e2e happy path |
| `npm run test:unit` | Vitest only |
| `npm run test:e2e` | Playwright e2e only |
| `npm run build` | Production build |
| `npm start` | Serve production build |

## Architecture

```
src/
  app/                 # Next.js App Router shell + fonts
  components/editor/   # Canvas, toolbar, layers, properties, templates
  lib/
    transforms.ts      # Snap, align, hit-test, coords (unit-tested)
    export/            # SVG string builder + jsPDF vector-ish PDF
    storage/           # IndexedDB (idb) autosave
    templates/         # Starter social layouts + procedural ink washes
  store/editorStore.ts # Zustand + immer: undo/redo, document, gamification
```

- **Canvas:** fixed-size SVG with zoom, pan, selection, alignment guides, grid/peer snapping.
- **Elements:** text, rect, circle, image, group; layers panel; reusable starter “components” as templates.
- **Persistence:** IndexedDB database `forgeink-snappa`. Portable `.json` import/export.
- **Export:** SVG keeps text as `<text>`; PDF draws vector text/shapes via jsPDF (SVG image fills may be skipped in PDF — use SVG export for full fidelity).

## Permissions

- No camera/mic/geo required.
- File picker for local images and project JSON.
- Downloads for SVG / PDF / JSON exports.
- IndexedDB for autosave (fails gracefully with a recoverable error if unavailable).

## Data location

- **Browser IndexedDB:** `forgeink-snappa` → stores `projects`, `assets`, `meta` (last project id, ink drops).
- Cleared when you wipe site data for this origin.
- Nothing is uploaded to a server by this app.

## Backup

1. Toolbar → **.JSON** to download a portable project file.
2. Optionally export **SVG** / **PDF** for delivery archives.
3. To restore: **Import** the `.json` file.

## Environment

Copy `.env.example` to `.env` if you add optional flags. No secrets are required for the core loop.

```bash
cp .env.example .env
```

## Design notes (Lenny process)

- Seed-derived **Forge Ink** palette (never shown in UI).
- Motion: ambient canvas grain shader, template entrance, export ink splash.
- Light gamification: **ink drops** for templates + exports.
- Deliberately omitted: accounts, multiplayer, stock assets, brand approval workflows.

## Vercel

Connect the GitHub repo and deploy. Static/SSR Next.js 15 app with no server secrets required. Client-only IndexedDB means each visitor’s data is local to their browser (expected).

## License

Personal / contest build for Brandon Theriot.
