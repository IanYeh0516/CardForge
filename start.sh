#!/bin/bash
echo "CardForge 名片產生器"
echo "======================"

if ! command -v python3 &> /dev/null; then
    echo "錯誤：找不到 Python3，請先安裝"
    exit 1
fi

if [ ! -d "venv" ]; then
    echo "建立虛擬環境..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet

echo "啟動伺服器..."
open http://localhost:5001 2>/dev/null || xdg-open http://localhost:5001 2>/dev/null &
python app.py
