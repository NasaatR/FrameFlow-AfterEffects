$ErrorActionPreference = 'Stop'
$backupRoot = Join-Path $env:APPDATA 'FrameFlow\backups'
$last = Get-ChildItem -LiteralPath $backupRoot -Directory -ErrorAction SilentlyContinue | Where-Object { (Test-Path (Join-Path $_.FullName 'install-state.json')) -and (Test-Path (Join-Path $_.FullName 'install-complete.txt')) } | Sort-Object Name -Descending | Select-Object -First 1
if (!$last) { throw 'No FrameFlow installation backup found.' }
$state = Get-Content -LiteralPath (Join-Path $last.FullName 'install-state.json') -Raw | ConvertFrom-Json
$destination = Join-Path $env:APPDATA 'Adobe\CEP\extensions\com.frameflow.ae'
$regPath = 'HKCU:\Software\Adobe\CSXS.12'
if (Test-Path $destination) {
    [xml]$manifest = Get-Content -LiteralPath (Join-Path $destination 'CSXS\manifest.xml') -Raw
    if ($manifest.ExtensionManifest.ExtensionBundleVersion -ne $state.version) { throw 'Installed FrameFlow changed. Automatic restore stopped to preserve it.' }
}
if ($state.hadExtension -and !(Test-Path -LiteralPath (Join-Path $last.FullName 'extension') -PathType Container)) {
    throw 'The previous extension is missing from the backup. Restore stopped.'
}
Write-Host 'Restoring the latest FrameFlow backup. Close After Effects first.'
if (Test-Path $destination) { Move-Item -LiteralPath $destination -Destination (Join-Path $last.FullName ('removed-' + $state.version + '-' + (Get-Date -Format 'HHmmss-fff'))) }
if ($state.hadExtension) { Move-Item -LiteralPath (Join-Path $last.FullName 'extension') -Destination $destination }
$current = Get-ItemProperty -Path $regPath -Name PlayerDebugMode -ErrorAction SilentlyContinue
if ($null -ne $current -and $current.PlayerDebugMode -eq '1') {
    if ($state.hadValue) { New-ItemProperty -Path $regPath -Name PlayerDebugMode -Value $state.priorValue -PropertyType $state.priorKind -Force | Out-Null }
    else { Remove-ItemProperty -Path $regPath -Name PlayerDebugMode }
}
Rename-Item -LiteralPath (Join-Path $last.FullName 'install-state.json') -NewName 'restored-state.json'
Write-Host 'Previous installation restored. User preferences and projects were preserved.'
