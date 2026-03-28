$startupFolder = [Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startupFolder 'RoutineTrigger_Watcher.lnk'
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = 'powershell.exe'
$shortcut.Arguments = '-WindowStyle Hidden -ExecutionPolicy Bypass -File "D:\VIBE CODING\Routine_Trigger\watch_and_commit.ps1"'
$shortcut.WorkingDirectory = 'D:\VIBE CODING\Routine_Trigger'
$shortcut.Save()
Write-Host "Shortcut created at: $shortcutPath"
