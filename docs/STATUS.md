# FrameFlow status

## 2.4.7

The reproduced case uses a 24 fps timeline, cursor at frame 141 and After −5. The expected result on a crossing animated layer is that only later keys move five frames earlier. Nested previews, marker-reference timing, key-label options, session timing tools and KBar are covered by the packaged verification suite. After Effects 27.0x78, native Undo/Redo, installed KBar and both OS installers still require a workstation check.

## 2.4.6

Compared the Time OFFSET 1.4 controls and timing features with FrameFlow. Added separated-axis resolution and capability-based discrete-key handling. New automated cases cover 2D, 3D, overlapping discovery, and key labels. Native AE validation remains pending.

## 2.4.5

The user confirmed composition reads in 2.4.4 on AE 27.0x78. Offset now preserves crossing-layer bounds between keys. Regression coverage uses frame 141 at 24 fps and a five-frame shift. Native validation of this new behavior remains pending.

## 2.4.4

Baseline: 844317f52f2acc2d1d2315134019852444e04f0e. On AE 27.0x78, FrameFlow 2.4.3 loaded successfully but repeated reads failed with `Object is invalid` at the cached native identity comparison. Track the current project's root item and composition, validate cached references before comparison, and clear the pending preview when a read fails or the referenced target changes. Mutations use the composition resolved during the current request. Host simulations cover wrapper replacement, invalid references, and recovery after no active composition. The affected After Effects build still requires a native smoke test.

## 2.4.3

Baseline: 93e2c166017018464f1520bcfb90614e9163af82. The 2.4.2 manifest excluded After Effects 2027 (27.0). The CEP host range now admits 25.x through 27.x with the same bundle, extension ID and menu. Windows installation displays manifest metadata, verifies critical installed files and records the actual installed version for rollback. The package validates manifest coverage. Run the cold-launch check in AE 27.0 to confirm menu visibility and the host handshake.

## 2.4.2

Baseline main: 36dc13bf04f2b666add606179a376bf242d3ef46, NasaatR/FrameFlow-AfterEffects. User requested an updated plan and a practical extensible foundation for future buttons/functions with consistent design. Direct expected-head fast-forward updates to main and versioned checked packages remain authorized. Work uses a separate copy of the checked 2.4.0 package; prior workspace edits and issued archives are preserved.

The command catalogue owns all 11 existing UI actions, labels, placement, argument/context mappings and preview policy. Shared FFUI components render toolbar buttons, menu groups and menu items. Existing fixed shifts keep their compact markup. Eligibility shares one render snapshot; invalid frame drafts disable frame-based commands while frame-independent Plan actions remain available. Settings schema and native timing algorithms are unchanged.

Plan handlers now live in src/commands/*.jsxinc. Deterministic build-time inclusion registers them in the private CEP scope. The dispatcher retains common preview/apply, staleness checks, reports, one-shot RPC, Undo/readback and bounded recovery. Host validation remains independent of UI metadata. Missing/duplicate handlers, unresolved insertion markers and UI ID/icon conflicts fail the build. Strict ES3 covers modules plus the exact generated host.

Extension contracts and a complete recipe are in docs/EXTENDING.md; AGENTS.md provides project navigation. Tests demonstrate adding a button/group without panel edits and a native plan module without dispatcher edits, including locked/stale/no-replay behavior. Composite commands, generic parameter-form registration and read-only inspection commands are planned; no arbitrary runtime plugin/script loader is introduced. Next feature stage remains read-only nested-composition analysis.

Exact executed checks/source hashes belong to generated VERIFICATION.json. Browser tests use a simulated AE transport, including a separate test-only extended catalogue fixture. Review is self-review. Actual AE execution, native Undo/Redo, installer execution and performance on artist projects remain unverified.

## Current authorization and optimization

On 2026-10-29 the user explicitly confirmed continuing authorization to update main directly in NasaatR/FrameFlow-AfterEffects, resolving the previous automatic-review boundary. Recheck main and use an expected SHA without force; do not request routine branch/PR approval again.

2.4.2 retains the command/module foundation from the prepared 2.4.1 package, whose issued bytes remain unchanged. Frame/context edits no longer reapply appearance; repeated preference values do not cause new storage writes. Command/group indexes are prepared once, shared text/attribute updates avoid identical writes and scope/mode DOM nodes remain stable. A dialog revision prevents a dismissed/replaced preview from reopening over a newer dialog; this does not cancel an AE host call or retry a mutation.

A DOM-fixture comparison of 20 frame edits observed 140 CSS property writes and 40 dropdown HTML replacements in 2.4.1, versus zero and zero in 2.4.2. This measures simulated DOM work, not real AE speed or frame rate. Source/ES3 and 229 tests currently pass; exact final browser/CI evidence belongs to VERIFICATION.json and the resulting SHA workflow. UI tests now wait for readiness instead of relying on a 100 ms startup delay.
