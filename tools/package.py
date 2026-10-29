"""Build and verify a versioned installable source package; no AE runtime implied."""
from pathlib import Path
import argparse
import datetime
import hashlib
import json
import os
import re
import subprocess
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED = {'.git', 'node_modules', '__pycache__', 'artifacts', 'downloads'}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def files():
    return sorted(p for p in ROOT.rglob('*') if p.is_file()
                  and not EXCLUDED.intersection(p.relative_to(ROOT).parts))


def run(*args):
    result = subprocess.run(args, cwd=ROOT, text=True, capture_output=True,
                            encoding='utf-8', errors='strict')
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    return result.stdout + result.stderr


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', default='artifacts')
    args = parser.parse_args()
    output = Path(args.output_dir)
    if not output.is_absolute():
        output = ROOT / output
    output = output.resolve()
    # Output must be excluded from the source set, including custom directories.
    if output == ROOT or output in ROOT.parents:
        raise ValueError('Choose a separate output directory, not the source root or its parent.')
    output.mkdir(parents=True, exist_ok=True)
    version = json.loads((ROOT / 'package.json').read_text())['version']
    assert re.fullmatch(r'\d+\.\d+\.\d+', version)
    log = run('node', 'tools/check.cjs')
    (ROOT / 'docs/verification.log').write_text(log, encoding='utf-8')
    test_summary = {key: int(re.search(r'(?m)^# ' + key + r' (\d+)\s*$', log).group(1))
                    for key in ('tests', 'pass', 'fail', 'skipped', 'cancelled')}
    assert test_summary['fail'] == test_summary['skipped'] == test_summary['cancelled'] == 0
    assert test_summary['tests'] == test_summary['pass'] > 0
    syntax, _ = json.JSONDecoder().raw_decode(log[log.index('{'):])
    assert all(report['status'] == 'pass' for report in syntax['reports'])
    assert all(not report['directives'] for report in syntax['reports'])
    run('node', 'tools/preview.cjs')
    run('bash', '-n', 'install/Install-macOS.command')
    manifest = ET.parse(ROOT / 'extension/CSXS/manifest.xml').getroot()
    assert manifest.attrib['ExtensionBundleVersion'] == version
    assert manifest.find('.//ScriptPath') is None
    assert (ROOT / 'extension' / manifest.find('.//MainPath').text).is_file()
    html = (ROOT / 'extension/index.html').read_text(encoding='utf-8')
    for resource in re.findall(r'(?:src|href)="((?:js|css)/[^"]+)"', html):
        assert (ROOT / 'extension' / resource).is_file(), resource
    selected = [p for p in files() if output not in p.parents]
    source_hashes = {str(p.relative_to(ROOT)): digest(p.read_bytes()) for p in selected
                     if p.name not in {'CHECKSUMS.sha256', 'VERIFICATION.json'}}
    browser_path = Path(os.environ.get('FRAMEFLOW_BROWSER_RESULT', str(ROOT / 'artifacts/browser-result.json')))
    browser_evidence = 'not_run for this build'
    if browser_path.is_file():
        browser_evidence = json.loads(browser_path.read_text(encoding='utf-8'))
        assert browser_evidence['status'] == 'pass'
        assert browser_evidence['version'] == version
        assert browser_evidence['sourceHashes']
        for relative, expected in browser_evidence['sourceHashes'].items():
            assert digest((ROOT / relative).read_bytes()) == expected, 'Stale browser evidence: ' + relative
    report = {
        'product': 'FrameFlow AE', 'version': version,
        'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'sourceRef': os.environ.get('GITHUB_SHA', 'local working tree before publication'),
        'target': 'After Effects 25.x–26.x / CEP 12 / Windows and macOS',
        'checks': {
            'tests': test_summary,
            'testScope': 'strict ES3; catalogue/module extension contracts; pure timing; simulated AE/CEP/DOM; scoped evalFile; RPC; clipboard and connection recovery',
            'hostSyntax': syntax['reports'],
            'frontendSyntax': 'node --check for all extension/js files passed',
            'manifestAndLocalPaths': 'passed', 'macOSInstallerSyntax': 'bash -n passed',
            'actualAE_CEP': 'not_run: no actual AE connection',
            'actualClipboard': 'not_run: DOM/API simulations only',
            'actualWindowsMacOSInstallers': 'not_run: source and shell syntax only',
            'realBrowserLayout': browser_evidence, 'review': 'self-review only'
        },
        'sourceFiles': source_hashes
    }
    (ROOT / 'VERIFICATION.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    selected = [p for p in files() if output not in p.parents and p.name != 'CHECKSUMS.sha256']
    checksums = ''.join(digest(p.read_bytes()) + '  ' + str(p.relative_to(ROOT)) + '\n' for p in selected)
    (ROOT / 'CHECKSUMS.sha256').write_text(checksums, encoding='utf-8')
    prefix = 'FrameFlow_AE_' + version
    archive = output / (prefix + '.zip')
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in files():
            if output not in p.parents:
                z.write(p, prefix + '/' + str(p.relative_to(ROOT)))
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        for line in checksums.splitlines():
            expected, relative = line.split('  ', 1)
            assert digest(z.read(prefix + '/' + relative)) == expected, relative
        assert all(n.startswith(prefix + '/') for n in z.namelist())
    archive_sha = digest(archive.read_bytes())
    (output / (archive.name + '.sha256')).write_text(archive_sha + '  ' + archive.name + '\n', encoding='utf-8')
    print(json.dumps({'archive': str(archive), 'bytes': archive.stat().st_size,
                      'sha256': archive_sha, 'passed': test_summary['pass']}, indent=2))


if __name__ == '__main__':
    main()
