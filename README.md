# FrameFlow AE 2.4.0

A compact CEP 12 panel for timing commands around the After Effects playhead.

**[Download installable ZIP — 2.4.0](downloads/FrameFlow_AE_2.4.0.zip)** · **[Инструкция на русском](README_RU.md)** · [Changelog](CHANGELOG.md)

Close the FrameFlow panel, extract the complete ZIP and run `install/Install-Windows.cmd` or `install/Install-macOS.command`. Reopen **Window → Extensions (Legacy) → FrameFlow 2.4**. Target: AE 25.x–26.x / CEP 12. The installer backs up the previous extension and enables unsigned CEP 12 panels for the current account. This is a source distribution, not a signed ZXP or GitHub Release. Installed users need no Node, Python, server or network access from the panel.

## Workflow

The panel starts in **Auto / Layers and Keys**, including after upgrading. Auto uses the selected AE layers, or all composition layers when none are selected. Explicit Selected never expands scope. Enable “Remember scope and mode” in settings to retain a different startup context. Frame step, presets and appearance remain saved independently.

Choose frames with presets, stepper, Shift, wheel, slider or half/one-second shortcuts. Use **Before − / Before + / After − / After +**. Minus moves earlier; plus moves later. In Layers and Keys, layers entirely on that side move together with their keys; crossing layers change the edge and keys on that side. Each command reads current CTI and selection before planning, then checks the host snapshot again before writing. Close Gap uses the same scope independently of step and mode. The **Plan** menu previews any of the four directions or Close Gap without writing. Apply executes that captured plan, with native snapshot checks and a two-minute lifetime. Undo/Redo is native to AE.

**Finite-footage limits:** by default, a crossing layer requiring unavailable source frames stays completely unchanged, including all its keys. Other valid targets proceed. The status, preview, report and event history show the number of layers without source handles. Select “Cancel everything” in settings for the previous all-or-nothing media policy. Relevant locks, unsupported partial-key targets, collisions and runtime verification failures still block or recover the operation. The panel does not extend footage with invented frames.

The default 360 × 290 panel has compact scope/mode dropdowns and arrow + frame-count buttons. Auto is the default scope. Repeated labels, cursor readout and the preview-first toggle have been removed. Settings and help scroll within the panel. The duplicate AE timeline and layer list remain removed.

## Insert / Remove Time

Open **Time → Insert Time / Remove Time**, using the current frame step and scope. A policy dialog and checked preview always precede Apply. Composition duration remains unchanged. These commands never delete layers or keys.

- **Keep** (default): leave crossing layers and all their keys entirely unchanged. Later layers move with all native keys, audio and media by the requested interval.
- **Retime Animation**: for supported crossing animation, adjust Out and move keys after the insertion point / removed interval. Video, audio, precomp, Time Remap and reverse-Stretch crossings need a manual split in AE or Keep.
- Removal uses **[cursor, cursor + frames)**. A key inside that interval, a layer boundary inside it or an overlapping duration marker blocks the applicable operation before writing. A key at the exclusive end may move to the cursor. No automatic layer splitting is performed.
- Composition markers participate only when enabled in Settings. Protected regions, collisions, relevant locks and unsupported partial properties retain strict preflight. Cached plans recheck bounds, scope, keyed-property structure and native values before applying.

## Align / Stagger / Sequence

Open **Arrange**, choose an operation, then **Preview Changes → Apply Plan**. Arrange always moves whole layers with all native keys, regardless of the shift mode. It uses the same Auto / Selected / All scope. Composition markers and composition duration stay unchanged.

- **Align In / Out to Cursor:** move each layer so its visible In or Out meets the AE cursor.
- **Stagger:** space layer starts by a positive whole-frame step; keep each duration intact.
- **Sequence:** place each layer after the previous Out with a nonnegative gap. Zero joins layers end to end.
- **Order:** Top → Bottom, Bottom → Top or Start Time (ties use layer index). Stagger/Sequence start at the cursor or keep the first layer at its original In. This is not selection click order.

The preview lists each layer's actual signed shift and In-point change in the chosen order. Layers outside composition bounds are counted; they are not trimmed. No nested source composition is edited. A changed target, order, scope, key set, key value or timing context rejects the captured plan. Locked moving targets block all writes. No-op layers avoid property scans and new Undo history; runtime failures use the existing bounded recovery. External expressions and actual native behavior still need an AE smoke test.

## Settings and diagnostics

**English is the default language**, including upgrades without a saved language choice. Choose English / Русский in Settings; menus, dialogs, statuses and diagnostics follow it immediately. Artist-authored composition and layer names remain unchanged. Preferences v1/v2/v3 migrate to v4. Existing step, presets, zero/false and customized appearance survive. Previous default density becomes compact. Context starts Auto / Layers and Keys unless explicitly opted into remembering it. Import retains the imported context in the current session; the startup rule applies on the next open. Unknown, corrupt or concurrently changed storage stays protected. Export is JSON.

“Report” opens and copies diagnostics on click, with Clipboard API fallback and selected text if both methods fail. Transport failures pause polling until Refresh; uncertain writes are never automatically replayed.

## Development and validation

`src/core.jsxinc` contains timing and bounded recovery. `src/panel-host.jsxinc` is the data-only AE/RPC adapter. `extension/js/bridge.js` retains explicit global registration and single-flight transport. `extension/js/panel.js` implements the controls and acknowledged settings writes.

- `node tools/build.cjs`: generate the complete ES3 host.
- `node tools/check.cjs`: strict ES3, pure timing and simulated AE/CEP/DOM regressions.
- `node tools/preview.cjs`: regenerate the standalone read-only UI demo.
- `python3 tools/package.py`: checks, preview, local paths, shell syntax and checksum-verified ZIP in `artifacts/`.

Maintainer tools need Node >=20 with Acorn 8.17.0 or bundled Acorn through `--expose-internals`, Python 3 and Bash. Read-only CI runs on main pushes and PRs, checks Chromium layout/interactions with a simulated AE transport, runs packaging and uploads a separate checked build plus browser screenshots. Browser tooling uses isolated Playwright 1.62.1 and is not part of the installed panel. Issued ZIPs remain unchanged under `downloads/`.

The user reports 2.1.1 is working in AE 25.6.4x3. The original finite-media failure is reproduced in the regression suite. **2.4.0 host behavior, native Undo/Redo, clipboard and docking require an actual AE smoke test.** DOM tests simulate wiring; Chromium layout and interaction evidence for this exact build is recorded in the package; their exact browser version, exercised files and source hashes are recorded separately in the verification metadata. See [verification](VERIFICATION.json) and [smoke test](docs/AE_SMOKE_TEST_RU.md).


## Roadmap and updates

See [the updated roadmap](ROADMAP_RU.md): 2.4 adds Align / Stagger / Sequence on top of the compact bilingual UI and interval commands. Next is read-only nested-composition analysis; recursive retiming remains a separate, unimplemented stage. The duplicate timeline stays removed. Updates go directly to main as authorized by the project owner, preserving history with an expected-head fast-forward. There is no manual branch merge required for routine updates.

AE may stay open for an update: finish the current command, close the FrameFlow panel, run the installer and reopen it. Verify matching panel/kernel versions and `ready` in the report. Restart AE if an old version remains, the extension is missing or installation cannot replace files. Hot updating on a specific AE/OS setup still needs practical verification.

