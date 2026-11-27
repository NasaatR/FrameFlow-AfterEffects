'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {runtimeSources} = require('./runtime-sources.cjs');
const {compileHost}=require('./command-modules.cjs');
const {version} = require('../package.json');
if (!/^(0|[1-9]\d*)\.[0-9]\.[0-9]$/.test(version)) {
  throw new Error('Invalid FrameFlow release version ' + version +
    ': minor and patch must be single digits. Carry 2.4.9 to 2.5.0.');
}
const releaseFields = [
  ['extension/CSXS/manifest.xml', /\bExtensionBundleVersion="([^"]+)"/],
  ['extension/CSXS/manifest.xml', /<ExtensionList><Extension[^>]+\bVersion="([^"]+)"/],
  ['extension/index.html', /<span class="version">([^<]+)<\/span>/],
  ['extension/js/bridge.js', /\bVERSION\s*=\s*'([^']+)'/],
  ['extension/js/model.js', /\bVERSION\s*=\s*'([^']+)'/],
  ['src/panel-host.jsxinc', /\bVERSION\s*=\s*"([^"]+)"/],
];
for (const [file, pattern] of releaseFields) {
  const actual = fs.readFileSync(path.join(root, file), 'utf8').match(pattern)?.[1];
  if (actual !== version) {
    throw new Error(file + ': expected release ' + version + ', found ' + (actual || 'no version'));
  }
}
const host = compileHost(root);
// CEP already selects the host. Ship plain ES3, including the first byte:
// ScriptPath/string evaluation must not depend on preprocessing #target.
// evalFile may inherit a function scope. Register the completed API explicitly;
// a top-level `var` in the loaded file is not a cross-request export contract.
fs.writeFileSync(path.join(root, 'extension/jsx/host.jsx'), '$.global.FrameFlowCEP = (function () {\n' + runtimeSources(root) + '\n' + host + '\nreturn FFCEP;\n}());\n');
console.log('Built extension/jsx/host.jsx');
