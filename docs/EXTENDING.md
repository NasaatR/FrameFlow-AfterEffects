# Adding commands to FrameFlow

FrameFlow is a command panel for the native AE timeline. Keep the main controls compact; use an existing menu for secondary commands. This is an internal source extension contract, not a runtime plugin loader or an arbitrary-script feature.

## Owners and boundaries

| Area | Owner | Add/change here |
|---|---|---|
| Command ID, English/Russian label, placement, arguments | `extension/js/commands.js` | One descriptor in `commands` before `create(groups, commands)` |
| A new menu group | `groups` in the same file | Unique `id`, unique DOM `element`, English/Russian `title` |
| Shared button/menu appearance and accessibility | `extension/js/ui.js`, `extension/css/panel.css` | Reuse `FFUI.actionButton` / `menuItem` and existing tokenized variants |
| Parameter forms | `showInterval` / `showArrange` in `extension/js/panel.js` | Reuse existing forms; a new input family needs a focused renderer and UI tests |
| Host request validation and plan preparation | `src/commands/<name>.jsxinc` | One `registerPlan` call in the format below |
| Timing calculations and native mutation/recovery | `FFCore` / `FFHost` in `src/core.jsxinc` | Extend these only when the new operation needs a new calculation, target kind or host API |
| Common execution lifecycle | `src/panel-host.jsxinc` | Leave generic routing, plan cache, Apply, reports and one-shot transport shared |

Toolbar and menu entries are generated automatically from the catalogue. Standard commands do not require new HTML, CSS or a dispatcher branch. The four fixed shift surfaces keep their existing markup. An operation can be exposed by several differently configured descriptors without duplicating the native implementation.

## Example: one button for an existing capability

Add this descriptor to the catalogue before it is instantiated. It exposes an existing host operation and needs no new host module:

```js
commands.push({
  id:'alignTailShortcut', op:'arrange',
  surface:'menu', group:'arrange', form:'none',
  title:['Align tail', 'Конец к курсору'],
  args:{action:'alignOut', order:'top', anchor:'cursor', frames:1},
  context:['scope'], parameters:[], preview:'required'
});
```

Use `surface:'toolbar'` without `group` only for a frequent action. It inherits the same secondary button as Close Gap. `icon:'gap'` is an optional existing SVG symbol name; text-only buttons are supported. Add a new SVG symbol deliberately; never put supplied HTML in labels or icon names.

The descriptor declares exactly which preferences become request context. Do not spread the full settings object or send document values to the browser. `args` contains fixed JSON data. `parameters` lists form fields that may be supplied; unknown/missing fields, functions, non-finite numbers and transport-field overrides are rejected. Parameterized changes require preview. The host independently validates every payload; metadata and disabled controls are not an authorization or validation boundary.

`FFCommands.create(groups, commands)` validates a catalogue and returns isolated copies. Production reads this catalogue once at startup. There is no late runtime registration, imported executable code, network dependency or user-path code discovery.

## Example: a new plan operation

For a distinct operation, point a descriptor at `op:'alignTail'` and add `src/commands/align-tail.jsxinc`:

```js
/* Plan-only handler. The build includes it in the private CEP scope. */
registerPlan("alignTail", function (c,r) {
    schema(r,"|op||token||scope||preview|");
    return FFHost.prepareArrange({
        scope:r.scope, action:"alignOut", order:"top", anchor:"cursor", frames:1
    });
}, false);
```

Keep the declaration format shown above: exactly one registration per regular `.jsxinc` file, with a lowercase kebab-case filename. Files are discovered in deterministic filename order **at build time** and inlined into the installed ES3 host. The final flag must be explicit: `false` requires preview at the trusted dispatcher; `true` is reserved for intentionally supported direct actions such as the existing shifts. Do not enable direct application merely for convenience.

Helpers available in that private scope include `schema`, `number`, `bool`, `targets`, `fail`, `FFCore` and `FFHost`. Use them to resolve and validate the actual active composition/selection. A handler only calculates and captures a native plan: no top-level AE calls, scene writes, file/network effects, `eval`, new undo group or unbounded scans. Do not serialize native key values through JSON.

The shared dispatcher caches one captured plan, rejects stale metadata/keys and expired plans, applies exactly those targets, verifies writes, preserves selection, closes its own Undo scope and attempts bounded recovery. Never simulate a new command by replaying UI clicks or mutating a scene inside the preview handler. A new host API or plan target kind still needs an explicit adapter, recovery policy and host validation; registration cannot make an unsupported API safe.

## One button with several actions

Composite commands are planned, not implemented in this release. They must prepare **one combined native plan** and show one preview before one explicit Apply. Define dependencies, ordering and partial recovery first; an Undo group alone is not rollback. Do not chain several independent `request(...)` mutations, open nested undo groups or automatically retry a failed/uncertain step. Filesystem/render effects need separate recovery and are outside this plan-only contract.

Read-only analysis commands and generic parameter-form registration are separate planned extensions. Do not put inspection into a fake scene-mutation plan merely to fit the current API.

## Verify and deliver

1. Add the descriptor/module and a meaningful scenario for its behavior, scope and failure boundary. `tests/commands.cjs` demonstrates a new module without dispatcher edits; `tests/ui-dom.cjs` demonstrates a new toolbar command and menu group without panel edits.
2. Run `node tools/check.cjs`. Build checks reject missing/duplicate handlers, unresolved insertion markers, fixed-UI ID collisions and unknown icons. The strict ES3 gate checks every source module and the complete generated host; registration discovery is a structural check, not a substitute for that parser.
3. For UI changes, run the Chromium checker or the established GitHub workflow. It exercises a separate catalogue-only extension fixture, themes, English/Russian, narrow panels, focus and captured-plan application. Inspect the screenshots. Test fixture code never enters the installable ZIP.
4. In actual AE, verify an ordinary scene, no/changed selection, fractional timing, relevant locked targets, repeat run and Undo/Redo. Report any unavailable host test honestly.
5. Update the product version, aligned runtime/manifest metadata, README/download link, changelog and roadmap. Regenerate the preview and build the ZIP with `python3 tools/package.py --output-dir artifacts`. Use the checked bytes, verify publication and preserve issued downloads and concurrent changes.

## Efficient UI updates

Use `FFUI.html` for owned stable fragments, `FFUI.text` / `attribute` for updates and the common action components. Do not replace whole controls on metadata polls. `change` applies appearance only for appearance/language keys and skips saving unchanged preferences; preserve invalid input drafts when updating UI. Preview responses must respect the current dialog revision. Dismissing a dialog does not cancel JSX execution or make a timed-out mutation safe to replay.
