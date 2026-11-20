$ErrorActionPreference = 'Stop'
# User-level install, no elevation. Enables Adobe's unsigned CEP 12 development mode.
$extensionSource = Join-Path $PSScriptRoot '..\extension'
$manifestPath = Join-Path $extensionSource 'CSXS\manifest.xml'
$requiredFiles = 'CSXS\manifest.xml', 'index.html', 'js\bridge.js', 'jsx\host.jsx'
foreach ($relativePath in $requiredFiles) {
    if (!(Test-Path -LiteralPath (Join-Path $extensionSource $relativePath) -PathType Leaf)) {
        throw "Incomplete package: $relativePath is missing. Extract the entire ZIP and run the installer again."
    }
}
[xml]$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8
$bundle = $manifest.ExtensionManifest
$hostRange = $manifest.SelectSingleNode('/ExtensionManifest/ExecutionEnvironment/HostList/Host[@Name="AEFT"]')
$runtime = $manifest.SelectSingleNode('/ExtensionManifest/ExecutionEnvironment/RequiredRuntimeList/RequiredRuntime[@Name="CSXS"]')
$menu = $manifest.SelectSingleNode('/ExtensionManifest/DispatchInfoList/Extension/DispatchInfo/UI/Menu')
if ($bundle.ExtensionBundleId -ne 'com.frameflow.ae' -or !$hostRange -or !$runtime -or !$menu) {
    throw 'Invalid FrameFlow CEP manifest. Extract a fresh copy of the complete ZIP.'
}
$version = $bundle.ExtensionBundleVersion
$extensionsRoot = Join-Path $env:APPDATA 'Adobe\CEP\extensions'
$destination = Join-Path $extensionsRoot 'com.frameflow.ae'
$backupRoot = Join-Path $env:APPDATA 'FrameFlow\backups'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$backup = Join-Path $backupRoot $stamp
$staging = Join-Path $env:APPDATA ('FrameFlow\staging-' + $stamp)
$regPath = 'HKCU:\Software\Adobe\CSXS.12'
$prior = Get-ItemProperty -Path $regPath -Name PlayerDebugMode -ErrorAction SilentlyContinue
$hadValue = $null -ne $prior
$priorValue = if ($hadValue) { $prior.PlayerDebugMode } else { $null }
$priorKind = if ($hadValue) { (Get-Item $regPath).GetValueKind('PlayerDebugMode').ToString() } else { $null }
Write-Host ("FrameFlow {0} / AEFT {1} / CEP {2}" -f $version, $hostRange.Version, $runtime.Version)
Write-Host 'Restart After Effects after installation so it rescans extensions.'
Write-Host 'Installs for this Windows account and enables unsigned CEP 12 panels.'
Write-Host 'Existing FrameFlow and the prior development setting are backed up.'
New-Item -ItemType Directory -Force -Path $extensionsRoot, $backup | Out-Null
@{version=$version;hadValue=$hadValue;priorValue=$priorValue;priorKind=$priorKind;hadExtension=(Test-Path $destination)} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $backup 'install-state.json') -Encoding UTF8
$movedOld = $false
$placedNew = $false
$debugSettingChanged = $false
try {
    Copy-Item -LiteralPath $extensionSource -Destination $staging -Recurse
    if (Test-Path $destination) { Move-Item -LiteralPath $destination -Destination (Join-Path $backup 'extension'); $movedOld = $true }
    Move-Item -LiteralPath $staging -Destination $destination
    $placedNew = $true
    foreach ($relativePath in $requiredFiles) {
        $sourceHash = (Get-FileHash -LiteralPath (Join-Path $extensionSource $relativePath)).Hash
        $installedHash = (Get-FileHash -LiteralPath (Join-Path $destination $relativePath)).Hash
        if ($sourceHash -ne $installedHash) { throw "Installed file verification failed: $relativePath" }
    }
    if (!(Test-Path -LiteralPath $regPath)) { New-Item -Path $regPath | Out-Null }
    New-ItemProperty -Path $regPath -Name PlayerDebugMode -Value '1' -PropertyType String -Force | Out-Null
    $debugSettingChanged = $true
    if ((Get-ItemProperty -LiteralPath $regPath -Name PlayerDebugMode).PlayerDebugMode -ne '1') { throw 'CEP development setting was not acknowledged.' }
    New-Item -ItemType File -Path (Join-Path $backup 'install-complete.txt') | Out-Null
    Write-Host ('Installed: ' + $destination)
    Write-Host ('Backup: ' + $backup)
    Write-Host ('After restarting AE, open Window > Extensions (Legacy) > ' + $menu.InnerText + '.')
} catch {
    $originalError = $_
    try {
        if ($placedNew -and (Test-Path $destination)) { Move-Item -LiteralPath $destination -Destination (Join-Path $backup 'failed-new-extension') }
        if ($movedOld -and (Test-Path (Join-Path $backup 'extension'))) { Move-Item -LiteralPath (Join-Path $backup 'extension') -Destination $destination }
        if ($debugSettingChanged) {
            if ($hadValue) { New-ItemProperty -Path $regPath -Name PlayerDebugMode -Value $priorValue -PropertyType $priorKind -Force | Out-Null }
            else { Remove-ItemProperty -LiteralPath $regPath -Name PlayerDebugMode }
        }
    } catch { Write-Warning ('Recovery error: ' + $_.Exception.Message) }
    throw $originalError
}
