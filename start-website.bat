@echo off
title Levarech AI Website
cd /d "%~dp0"

echo Starting Levarech AI website...
echo.
echo If the browser does not open automatically, go to:
echo http://localhost:5500
echo.
echo Keep this window open while you preview the website.
echo Press Ctrl+C in this window when you want to stop the server.
echo.

start "" "http://localhost:5500"

py -m http.server 5500 --bind 127.0.0.1

if errorlevel 1 (
  echo.
  echo Python launcher failed. Trying direct Python path...
  C:\Python314\python.exe -m http.server 5500 --bind 127.0.0.1
)
