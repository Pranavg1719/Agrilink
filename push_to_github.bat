@echo off
title AgriLink - Push to GitHub
color 0A
cd /d "C:\Users\Pranav\Documents\Kick to Tech"
echo ====================================================================
echo                 AGRILINK - PUSHING ALL FILES TO GITHUB
echo ====================================================================
echo.
echo Repo: https://github.com/Pranavg1719/Agrilink.git
echo.
echo If a GitHub popup appears in your browser, click "Authorize/Sign In".
echo.
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ====================================================================
    echo SUCCESS! All files have been pushed to GitHub!
    echo Check: https://github.com/Pranavg1719/Agrilink
    echo ====================================================================
) else (
    echo ====================================================================
    echo Push could not complete.
    echo If GitHub asks for credentials, please sign in.
    echo ====================================================================
)
echo.
pause
