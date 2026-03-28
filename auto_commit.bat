@echo off
cd /d "D:\VIBE CODING\Routine_Trigger"

git add -A

git diff --cached --quiet
if %errorlevel% == 0 (
    echo No changes to commit.
    exit /b 0
)

for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set DATE=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set TIME=%%a:%%b

git commit -m "Auto commit: %DATE% %TIME%"
git push origin main

echo Done.
