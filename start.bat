@echo off
chcp 65001 >nul

:: 檢查 Python 是否已安裝
python --version >nul 2>&1
if errorlevel 1 (
    echo [0/3] Python 未安裝，正在自動下載安裝...
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.13.2/python-3.13.2-amd64.exe' -OutFile '%TEMP%\python_installer.exe'"
    if errorlevel 1 (
        echo ERROR: 下載 Python 失敗，請手動前往 https://www.python.org 安裝後再執行
        pause
        exit /b 1
    )
    echo 安裝 Python 中（請勿關閉視窗）...
    "%TEMP%\python_installer.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_launcher=0
    if errorlevel 1 (
        echo ERROR: Python 安裝失敗，請手動安裝後再執行
        pause
        exit /b 1
    )
    echo Python 安裝完成！
    set PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python313\python.exe
) else (
    set PYTHON_EXE=python
)

if not exist venv (
    echo [1/3] Creating virtual environment...
    "%PYTHON_EXE%" -m venv venv
    if errorlevel 1 (
        echo ERROR: 建立虛擬環境失敗
        pause
        exit /b 1
    )
)

echo [2/3] Installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q

echo [3/3] Starting CardForge server...
start http://localhost:5001
"%PYTHON_EXE%" app.py
pause
