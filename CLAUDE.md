# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # preview production build locally
```

## Architecture

Vite + React 18 + TypeScript. All styles are CSS custom properties (`src/index.css`) with inline `style` props on components — no CSS modules or styled-components.

### Source layout

```
src/
  App.tsx            # state machine — owns all screen transitions
  main.tsx           # entry point
  index.css          # global CSS variables, keyframes, range input reset
  types.ts           # Screen, ActionId, Analysis, ProcessResult, TweakValues
  utils.ts           # fmtSize(), estCompressed()
  components/        # reusable UI primitives
    Icon.tsx          # single SVG icon component, all icons defined inline
    Nav.tsx
    DropZone.tsx
    FileChip.tsx      # compact file name + size row
    StepRow.tsx       # horizontal step indicator
    Btn.tsx           # full-width primary button
    CheckRow.tsx      # labeled checkbox
    SettingsModal.tsx
  screens/           # one file per screen, each receives only what it needs
    HomeScreen.tsx
    AnalyzingScreen.tsx
    AnalysisScreen.tsx   # also contains ActionCard (co-located, only used here)
    CompressScreen.tsx
    ConvertScreen.tsx
    ProcessingScreen.tsx
    DownloadScreen.tsx
```

### Screen state machine (`App.tsx`)

```
home → analyzing → analyzed → compress → processing → done
                            → convert  → processing → done
```

- `home` — Drop zone landing page
- `analyzing` — Auto-runs after file drop; simulates the Analyze module (page count, text vs scanned, size)
- `analyzed` — Shows analysis results + action picker; marks the suggested action with "แนะนำ"
- `compress` / `convert` — Module options (quality slider or format picker)
- `processing` — Segmented animated progress bar; calls `onDone` when complete
- `done` — Download screen with before/after stats (compress) or filename (convert)

### Key types (`src/types.ts`)

- `ProcessResult = CompressResult | ConvertResult` — what options screens pass to `handleSubmit`
- `Analysis` — `{ pages, type: 'text'|'image', size }` — drives the "แนะนำ" badge and OCR notice
- `TweakValues` — `{ accentColor, brandName, animationSpeed }` — passed as `t` prop to every screen

### Design tokens (`src/index.css`)

- `--accent` (`#7a0006`) — compress red; also set at runtime via `document.documentElement.style.setProperty`
- `--convert` (`oklch(52% 0.18 240)`) — convert blue
- `--success` (`oklch(56% 0.18 150)`) — download green
- `--r` / `--rl` — border radii (12px / 20px)

### Adding a new module

1. Add the action to `AnalysisScreen.tsx`'s `actions` array: `{ id, icon, label, sub, color, suggested }`.
2. Add the new id to the `Screen` union in `src/types.ts`.
3. Create `src/screens/<Name>Screen.tsx` — props: `{ t, file, analysis?, onSubmit, onBack }`, call `onSubmit(result)`.
4. Wire it in `App.tsx`: add a `handlePick` case, render the screen in the JSX block.

### File processing

All processing is currently **simulated** — `ProcessingScreen` runs a fake timer and `DownloadScreen` shows a fake download button. Real implementation will replace this with API calls.

## Project context

See `context.md` for full system requirements, planned modules, and architecture decisions.
`waijaiPDF.html` is the original single-file prototype — kept as reference.
