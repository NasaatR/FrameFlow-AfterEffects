'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Host adapters share the installed bundle and the command-extension test harness.
function runtimeSources(root) {
  const dir = path.join(root, 'src');
  const adapters = fs.readdirSync(dir).filter(name =>
    name.endsWith('.jsxinc') && name !== 'core.jsxinc' && name !== 'panel-host.jsxinc').sort();
  const files = ['extension/js/i18n.js', 'src/core.jsxinc', ...adapters.map(name => 'src/' + name)];
  return files.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
}
module.exports = {runtimeSources};
