# Changelog

## 2.4.2

- Publish the extensible command/module foundation after explicit authorization to continue direct main updates. Preserve the issued prepared 2.4.1 archive.
- Avoid appearance recalculation during frame/context edits and redundant preference writes. Prepare command indexes once; preserve scope/mode DOM nodes and skip identical text/attribute writes.
- Respect dismissed/replaced preview dialogs when slow read-only results arrive. Host calls are not cancelled or replayed by this UI behavior.
- Add regression/browser checks for retained DOM nodes, avoided style writes, coalesced saves and delayed previews. Wait for UI readiness in the DOM harness instead of a fixed startup delay.

## 2.4.1 — prepared preview (issued bytes preserved)

- Move all 11 timing commands into a validated catalogue; generate toolbar/menu surfaces and localized labels through shared UI components. Preserve compact controls, themes, preferences and native timing semantics.
- Split plan preparation into build-time AE modules with one common registration/preview/apply lifecycle. Validate handler links, duplicate operations, UI ID conflicts and icons; keep strict final ES3, stale-target protection and no-replay RPC.
- Add project navigation and an extension recipe for future agents. Document composite actions, inspection contracts and generic forms as planned extensions rather than implemented features.
- Keep frame-independent Plan actions available during invalid frame drafts, skip unavailable menu items in keyboard traversal and reuse one eligibility snapshot per render. Repair the standalone demo title to follow the package version.
- Add module/catalogue extension regressions and a separate Chromium fixture proving new buttons/groups inherit layout and behavior without panel edits. Native AE acceptance remains separate.

## 2.4.0

- Add Align In/Out to Cursor, Stagger and Sequence with mandatory captured-plan preview, explicit stack/time order and cursor/first-layer anchors. Sequence accepts a zero-frame gap. Preserve subframes, durations, native animation, selection and composition markers.
- Reuse native whole-layer translation and bounded recovery; validate all targets before writing, including scope, ordering, source/stretch/timing and keyed-property changes. Keep one-shot application and no-replay transport.
- Show per-target signed shifts, chosen order and composition-boundary counts. Cap browser details without truncating the native plan. Skip property scans and Undo groups for unchanged layouts.
- Reset dialog scrolling on open and keep preview/apply actions in a separate visible footer, including keyboard focus traversal.
- Keep the compact bilingual panel; add Arrange to the existing action strip, with wrapping at narrow widths and large type. Expand regression/browser coverage and refresh the roadmap and stale status document.
- Real AE execution, Undo/Redo, installers and performance on artist projects remain separately unverified.

## 2.3.0

- Compact the panel to 360 × 290: Auto scope dropdown, smaller mode dropdown and arrow/count buttons. Remove duplicate direction/step labels, scope hint, CTI readout and preview-first toggle; preview any command through Plan.
- Default to English and add immediate persisted English/Russian switching, including own diagnostics, while preserving artist names. Migrate v1–v3 preferences to v4.
- Add Insert/Remove Time with mandatory checked preview and explicit Keep / Retime Animation crossing policy. Preserve composition duration and never delete layers or keys. Require a manual AE split for unsupported footage/audio/precomp/Remap crossings.
- Guard removed-interval keys/boundaries, duration markers, source limits, native keyed-property structure and stale plans. Preserve strict checks, no-replay transport and bounded recovery. Shift later native layers only once.
- Cover intervals, fractional timing, markers, language migration, compact menus and both languages in regression/browser checks. Native AE/Undo/Redo acceptance remains separate.

## 2.2.0

- Reorganize timing controls and label Earlier/Later directions with arrows, frame counts and words; align themes, spacing, settings and text-size behavior.
- Add bounded human-readable preview details: target layers, native-plan bounds, key counts, media skips and blockers. Keep diagnostics separate.
- Add preview-first for offset and gap removal, and apply a single cached native plan with a two-minute lifetime. Reject stale metadata/keys, expired/replaced plans and repeated application; keep no-replay transport and Undo/recovery.
- Add real Chromium layout/interaction CI through an isolated pinned browser dependency and include matching source hashes in build evidence. This still uses a simulated AE transport.
- Update the roadmap around the compact command panel, deferring interval operations and nested-comp analysis to their own stages.
- Publish routine updates directly to main with expected-head fast-forward, preserving prior downloads. Allow closing only the panel for update, with AE restart as a recovery step.


## 2.1.1

- Keep a finite-media crossing layer and all its keys unchanged when its source handles are exhausted; move other valid targets and report the count. Optional stop-all media policy; other strict checks remain atomic.
- Start Auto / Layers and Keys on every open by default, including upgrades. Add explicit opt-in to remember a different scope/mode; preserve timing and appearance.
- Compact the default panel to 420 × 360, reduce controls and spacing, combine composition/CTI and shorten inline descriptions. Keep full details in menu/help.
- Migrate settings to v3, compact previous default density and retain customized density/zero/false values.
- Include media-limit counts in preview, visible warning status, diagnostics and history; round diagnostic FPS.
- Reproduce the supplied ten-layer / five-frame / 24 fps case in both directions; verify media-only no-op, stop-all, relevant lock and unsupported-key blockers, preview and recovery after an injected write failure.

User confirmed 2.1.0 startup and Close Gap in AE 25.6.4x3. New 2.1.1 changes require an actual AE smoke test.

## 2.1.0

- Remove the duplicate timeline, layer list, drag editing, trim/split inspector and keyboard commands that moved the whole region.
- Always expose Before − / Before + / After − / After + in every mode. Restore Auto scope throughout the UI, offset adapter and Close Gap.
- Read current AE state before each action while preserving host stale-state and no-replay protections.
- Add persistent frame presets, stepper/Shift/wheel, quick slider and rounded half/one-second shortcuts, plus clear mode descriptions and scope feedback.
- Migrate v1 preferences to v2 without resetting explicit scope/mode/appearance. Preserve invalid input drafts and zero/false values.
- Exclude locked layers that have no targets on the requested side; keep strict failure for relevant locked targets and key collisions.

2.0.2 connection was confirmed by the user in AE 25.6.4. New 2.1 behavior still requires a real host smoke test.

## 2.0.2

- Explicitly export the completed host to `$.global.FrameFlowCEP` and dispatch RPC through the same qualified namespace, fixing the reproduced handshake failure with function-scoped `$.evalFile`.
- Capture AE/build/OS before loading and retain them on startup failure. Separate file loading from registration/version/dispatch verification.
- Preserve numeric engine script IDs separately from source filenames; report observed namespace and expected/actual host versions.
- Make scoped file evaluation the default host fixture, with detached-global, shadowing, construction-failure and end-to-end UI regressions.
- Add a reproducible package command, checked GitHub download, and read-only PR validation/build workflow.

Actual AE 25.6.4 execution remains to be confirmed.

## 2.0.1

- Replace implicit CEP ScriptPath startup with a version-checked, read-only host bootstrap using the installed extension path and `$.evalFile`.
- Generate plain ES3 host code without `#target`; test complete installed bytes without stripping directives.
- Surface bootstrap stage, original error message, source line and filename; retain AE environment diagnostics independently of active composition data.
- Pause automatic polling and focus retries after connection failures; allow explicit Refresh and prevent automatic edit replay.
- Distinguish read/bootstrap timeouts from uncertain writes. Reuse loaded matching hosts and retain RPC replay protection.
- Copy the report when the user opens it. Prefer synchronous CEP-compatible copy, fall back to Clipboard API, and report blocked copying accurately.
- Preserve extension ID, installation location, settings, timeline behavior and timing/editing algorithms from 2.0.0.

Host execution in real After Effects remains unverified; local checks use simulated AE/CEP/DOM.

