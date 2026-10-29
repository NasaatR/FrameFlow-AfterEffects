# FrameFlow maintenance

- Product source and release state: `ROADMAP_RU.md`, `docs/STATUS.md`. Extension recipes: `docs/EXTENDING.md`.
- Add UI commands in `extension/js/commands.js`; reuse `extension/js/ui.js` and semantic tokens in `extension/css/panel.css`. Default UI is English with explicit Russian localization. Keep the primary panel compact.
- Plan-only AE handlers live in `src/commands/*.jsxinc`. The build inserts them into the private CEP dispatcher. Preserve the existing loader, RPC version checks, captured-plan application, readback, Undo/recovery and uncertain-write no-replay behavior.
- Host JSX is conservative ES3; browser JavaScript is a separate runtime. Never edit generated `extension/jsx/host.jsx` or `PREVIEW.html` directly. Generate them with `node tools/build.cjs` and `node tools/preview.cjs`.
- `node tools/check.cjs` runs source/ES3 and simulated AE/CEP/DOM checks. `node tools/browser-check.cjs` needs isolated Playwright/Chromium; CI provides it. `python3 tools/package.py --output-dir artifacts` verifies and packages the current source. Passing mocks/build/browser checks does not establish actual AE execution or native Undo/Redo.
- Preserve settings schema compatibility, zero/false values and protected/colliding storage. Appearance reset must not change artist data. Issued ZIPs remain immutable; publish a new version and preserve concurrent repository changes.

- The user explicitly authorized routine verified updates directly to `main` of `NasaatR/FrameFlow-AfterEffects` on 2026-10-29. Preserve existing public identity/visibility, recheck the head and use expected-SHA fast-forward updates; no routine PR or repeated stage confirmation is required. This record does not grant access to other repositories or bypass tool approval controls.
