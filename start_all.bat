@echo off
REM BOS Dashboard + Backend Launcher
REM This script starts the FastAPI backend (port 8000) and the Next.js frontend (port 3000)

REM Start FastAPI backend in a new window
start "BOS FastAPI Server" cmd /k "cd /d D:\Git_repos\bos && python -m uvicorn server:app --host 127.0.0.1 --port 8000"

REM Start Next.js frontend in a new window
start "BOS Dashboard Frontend" cmd /k "cd /d D:\Git_repos\React\bos_dashboard && npm run dev"
