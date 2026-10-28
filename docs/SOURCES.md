# Primary implementation references

Inspected 2026-10-18 for this delivery. The user supplied Development Playbook 1.9.0 and AE Reference 2.1.0 were read in the task workspace.

- Adobe CEP 12 HTML Extension Cookbook: https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_12.x/Documentation/CEP%2012%20HTML%20Extension%20Cookbook.md — AE 25.0 / CEP 12 mapping; host JSX/evalScript threading; manifest and unsigned panel development mode.
- Adobe CEP manifest sample: https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_12.x/Samples/CEP_HTML_Test_Extension-12.0/CSXS/manifest.xml
- AE scripting Layer: https://ae-scripting.docsforadobe.dev/layer/layer/ — persistent IDs, Start/In/Out, native Duplicate. This is the community-maintained scripting API reference, not evidence of execution in a particular AE build.
- AE scripting AVLayer: https://ae-scripting.docsforadobe.dev/layer/avlayer/ — layer/media flags and matte relationships.

No Bolt CEP code or CSInterface distribution was copied. The panel uses a small original wrapper around CEP's native evalScript transport; both ends are included. This choice avoids a build/runtime dependency stack for this bounded panel. The inspected sources do not establish host test coverage or a signed package.

## 2.0.1 startup/clipboard patch

Read the actual Adobe CEP 12 `CSInterface.js` and Cookbook source on 2026-10-18 through the GitHub connection:

- https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_12.x/CSInterface.js — native `evalScript` signature, `getSystemPath('extension')`, URI decoding and OS file-URI handling.
- Cookbook above, “Load Multiple JSX files” — documented `$.evalFile` loading route. Removing `#target` and automatic ScriptPath is an implementation decision to remove an observed failure boundary, not an Adobe statement that all ScriptPath directives fail.

Clipboard paths are checked with DOM/API simulations; no source was sent to an external browser for this patch. Development Playbook 2.0.0 and AE Reference 2.1.0 were read from the conversation workspace.

## 2.0.2 explicit registration

- https://extendscript.docsforadobe.dev/extendscript-tools-features/dollar-object/#global — `$.global` exposes the JavaScript global namespace. This is the community-maintained Adobe scripting guide; it is not evidence of the user's actual execution context.
- The supplied 2.0.1 loader and host were inspected together. A function-scoped file evaluator reproduces the reported mismatch; the new explicit export works in both local and global loader simulations. The original test fixture had assumed global file evaluation.
- GitHub's official actions/checkout, actions/setup-node and actions/upload-artifact action.yml and release refs were inspected for the pinned PR workflow. Tests use Node 24; no npm or installed-panel dependencies are introduced.

## 2.3.0 intervals and compact UI

Rechecked 2026-10-18: https://ae-scripting.docsforadobe.dev/layer/layer/ (Start/In/Out in composition seconds and native layer movement) and https://ae-scripting.docsforadobe.dev/property/property/ (key times, values and native key metadata). These references do not prove actual AE execution. Interval policies are project design decisions: no automatic Split/deletion or duration change. Browser checks use a simulated host.


## 2.4.0 whole-layer arrangement

Rechecked 2026-10-29: https://ae-scripting.docsforadobe.dev/layer/layer/ — persistent project-scoped layer IDs, layer index and composition-time Start/In/Out, plus stretch bounds. The implementation reuses the project's existing native startTime translation and verification; no third-party sequencing code or dependency is copied. Explicit order, zero-gap policy and preview requirements are project decisions. Native animation/Undo and actual AE performance still require host execution. The supplied Development Playbook 2.3.1 was read for the strict final ES3 gate and publication rules.
