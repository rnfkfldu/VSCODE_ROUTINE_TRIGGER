$repoPath = "D:\VIBE CODING\Routine_Trigger"
$gitExe = "git"

Write-Host "Watching for changes in: $repoPath" -ForegroundColor Cyan

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::DirectoryName

# Ignore .git folder
$watcher.Filter = "*"

$debounceTimer = $null
$commitPending = $false

function Invoke-Commit {
    Set-Location $repoPath

    # Check if there are actual changes
    $status = & $gitExe status --porcelain 2>&1
    if (-not $status) {
        return
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Changes detected, committing..." -ForegroundColor Yellow

    & $gitExe add -A
    & $gitExe commit -m "Auto commit: $timestamp"
    & $gitExe push origin main

    Write-Host "[$timestamp] Pushed to GitHub." -ForegroundColor Green
}

$action = {
    $path = $Event.SourceEventArgs.FullPath

    # Skip .git folder and the watcher script itself
    if ($path -like "*\.git\*" -or $path -like "*watch_and_commit*" -or $path -like "*auto_commit*") {
        return
    }

    # Debounce: wait 3 seconds after last change before committing
    $global:commitPending = $true
}

Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null

Write-Host "Watcher started. Press Ctrl+C to stop." -ForegroundColor Green

try {
    while ($true) {
        Start-Sleep -Seconds 3

        if ($global:commitPending) {
            $global:commitPending = $false
            Invoke-Commit
        }
    }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "Watcher stopped." -ForegroundColor Red
}
