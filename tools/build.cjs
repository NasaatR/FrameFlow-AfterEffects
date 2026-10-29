'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const core = fs.readFileSync(path.join(root, 'src/core.jsxinc'), 'utf8');
const {compileHost}=require('./command-modules.cjs');
const host = compileHost(root);
// CEP already selects the host. Ship plain ES3, including the first byte:
// ScriptPath/string evaluation must not depend on preprocessing #target.
// evalFile may inherit a function scope. Register the completed API explicitly;
// a top-level `var` in the loaded file is not a cross-request export contract.
fs.writeFileSync(path.join(root, 'extension/jsx/host.jsx'), '$.global.FrameFlowCEP = (function () {\n' + fs.readFileSync(path.join(root,'extension/js/i18n.js'),'utf8') + '\n' + core + '\n' + host + '\nreturn FFCEP;\n}());\n');
console.log('Built extension/jsx/host.jsx');
