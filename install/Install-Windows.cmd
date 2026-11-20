@echo off
setlocal
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-Windows.ps1"
set "frameflow_status=%errorlevel%"
if not "%frameflow_status%"=="0" (echo Installation failed. Read the message above.) else (echo Installation complete. Restart After Effects.)
pause
exit /b %frameflow_status%
