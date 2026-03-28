$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-WindowStyle Hidden -ExecutionPolicy Bypass -File "D:\VIBE CODING\Routine_Trigger\watch_and_commit.ps1"'
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 0) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName 'RoutineTrigger_FileWatcher' -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest -Force
Write-Host "Task registered successfully."
