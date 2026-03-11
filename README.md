# CardForge — Batch Business Card Generator from Excel

**CardForge** is a free, open-source, self-hosted business card generator that converts Excel spreadsheets into print-ready PDF and JPEG name cards in seconds — no design software required.

> 免費開源的批次名片生成工具，將 Excel 試算表一鍵轉換為印刷級 PDF 名片，無需任何設計軟體。

[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0+-black?logo=flask)](https://flask.palletsprojects.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Why CardForge?

Most teams still handle business cards manually — editing templates one by one, fixing misaligned text, and repeating the same process for every new hire. CardForge eliminates that workflow entirely.

If your employee data is already in a spreadsheet (it always is), your business cards should generate themselves.

- **No Canva. No Adobe. No subscriptions.**
- **100% local — your data never leaves your machine.**
- **One command to start. Works on macOS, Windows, and Linux.**

---

大多數公司還在手動做名片 — 一個一個改範本、修對齊、新人進來再來一次。CardForge 把這個流程整個幹掉。

資料已經在 Excel 裡了，名片就應該自動生出來。

---

## Features

- **Excel Import** — Upload `.xlsx`, columns auto-mapped to card fields
- **Live Visual Editor** — Drag fields, change font size, color, and alignment in real time
- **Batch Export** — Generate PDF + JPEG for every row at once, 300 DPI print quality
- **Front & Back Template Support** — Swap background images freely per session
- **Multi-Session Management** — Keep different departments or designs as separate projects
- **Cross-platform** — macOS, Windows, Linux with a single startup command

---

## 功能特色

- **Excel 匯入** — 上傳 `.xlsx`，自動對應欄位至名片設計
- **即時視覺化編輯器** — 拖曳欄位位置、即時調整字型大小、顏色與對齊
- **批次匯出** — 一次生成所有員工的 PDF + JPEG，300 DPI 印刷品質
- **正背面模板支援** — 自由替換名片背景底圖
- **多專案管理** — 不同部門、不同設計，各自獨立儲存
- **跨平台** — macOS、Windows、Linux 一行指令啟動

---

## Quick Start

### Requirements

- Python 3.10 or higher
- Windows users: Python is installed automatically on first run

### Run the App

```bash
# macOS / Linux
./start.sh

# Windows
start.bat
```

The app opens at `http://localhost:5001` automatically (configurable via `.env`).

---

## How to Use

### Step 1 — Prepare Your Excel File

Create an `.xlsx` file with one employee per row. Use `example.xlsx` in this repo as a reference.

| Column | Field | Example |
|--------|-------|---------|
| 欄位1 | Employee ID | `001` |
| 欄位2 | Chinese Name | `王小明` |
| 欄位3 | English Name | `Ming Wang` |
| 欄位4 | Department | `Engineering` |
| 欄位5 | Title | `Engineer` |
| 欄位6 | Department (EN) | `Engineering Dept.` |
| 欄位7 | Title (EN) | `Software Engineer` |
| 欄位8 | Email | `ming@company.com` |
| 欄位9 | Mobile | `+886-912-345-678` |
| 欄位10 | Extension | `#201` |

### Step 2 — Upload and Create a Session

1. Open `http://localhost:5001`
2. Click **New Session**
3. Upload your `.xlsx` file
4. All employee records are imported automatically

### Step 3 — Customize in the Visual Editor

- Drag text fields to any position on the card preview
- Adjust font size, color, and alignment per field
- Switch fonts: **Noto Sans TC** for Chinese, **Maven Pro** for English
- Upload your own front and back background images
- Preview any individual card before exporting

### Step 4 — Batch Export

Click **Export All** to generate for every employee:

- `name.pdf` — 300 DPI, print-ready
- `name.jpg` — JPEG preview

Download and send directly to your printer.

---

## 操作說明

### 第一步 — 準備 Excel

以 `example.xlsx` 為範本，每列填入一位員工資料，欄位順序如上表。

### 第二步 — 上傳建立專案

1. 開啟 `http://localhost:5001`
2. 點擊「新增專案」
3. 上傳 `.xlsx` 檔案
4. 系統自動匯入所有員工資料

### 第三步 — 視覺化編輯

- 在名片預覽上直接拖曳欄位位置
- 個別調整字型大小、顏色、對齊方式
- 上傳自己的名片底圖（正面 / 背面）
- 即時預覽單張名片效果

### 第四步 — 批次匯出

點擊「匯出全部」，每位員工各自生成 PDF 與 JPEG，直接送印。

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Framework | Flask 3.0 |
| Image Rendering | Pillow |
| PDF Generation | ReportLab |
| Excel Parsing | openpyxl |
| Database | SQLite |
| Typography | Noto Sans TC, Maven Pro |

---

## Card Specifications

- **Size:** 90 × 54 mm (standard business card)
- **Print DPI:** 300
- **Preview DPI:** 150
- **Export formats:** PDF, JPEG

---

## FAQ / 常見問題

### How do I import my Excel file? / 怎麼匯入 Excel？

1. Make sure your file is saved as `.xlsx` (not `.xls` or `.csv`)
2. Open the app at `http://localhost:5001`
3. Click **New Session** → **Upload File**
4. The app reads the first row as column headers and imports all remaining rows as employee records

確認檔案格式為 `.xlsx`，點擊「新增專案」→「上傳檔案」，系統會自動讀取第一列為欄位標題，其餘列為員工資料。

---

### How do I export cards? / 怎麼匯出名片？

After customizing in the editor, click **Export All** in the top toolbar.

- Each employee gets their own `名字.pdf` (print-ready, 300 DPI) and `名字.jpg` (preview)
- Files are saved to `data/exports/` and bundled for download

完成編輯後，點擊工具列的「匯出全部」，每位員工各自生成一份 PDF 與 JPEG，儲存於 `data/exports/` 資料夾。

---

### How do I add a new field to the card layout? / 怎麼在名片上新增欄位？

This is where CardForge shines. Here's the full workflow:

**Step 1 — Add the column to your Excel**

Add a new column header to your `.xlsx` file, for example `Line ID`.

**Step 2 — Re-upload or refresh the session**

Upload the updated file to create a new session (or re-import into an existing one).

**Step 3 — Add a text frame in the editor**

In the visual editor, click **「新增欄位」(Add Field)**. A dropdown will automatically list every column name from your Excel — just select the one you want.

> CardForge reads your Excel headers directly. Any column you add to the spreadsheet immediately appears as an option in the editor — no config file editing needed.

**Step 4 — Position it**

Drag the new text frame to where you want it on the card, then adjust font, size, and color.

---

這是 CardForge 最核心的功能，流程如下：

**第一步** — 在 Excel 新增一欄，填好欄位名稱（例如 `Line ID`）

**第二步** — 重新上傳或建立新的 Session

**第三步** — 在編輯器點擊「新增欄位」，下拉選單會**自動抓取 Excel 的所有欄位名稱**，直接選你要的那個

> CardForge 會直接讀取 Excel 表頭。Excel 加了什麼欄位，編輯器裡就會出現什麼選項，不需要改任何設定檔。

**第四步** — 拖曳到名片上的位置，調整字型與大小

---

### Can I use my own card background? / 可以用自己的名片底圖嗎？

Yes. In the editor, click **「更換模板」(Change Template)** to upload your own PNG or JPEG for the front and back of the card. Recommended resolution: **4083 × 2450 px** at 300 DPI.

可以。在編輯器點擊「更換模板」，分別上傳正面與背面的底圖。建議解析度：**4083 × 2450 像素**，300 DPI。

---

### Does it work offline? / 可以離線使用嗎？

Yes, completely. CardForge runs entirely on your local machine. No internet connection is required after the initial setup.

可以，完全離線。CardForge 在本機執行，初次安裝後不需要網路連線。

---

### What if my card has both Chinese and English text? / 名片同時有中英文怎麼辦？

CardForge ships with two font families:

- **Noto Sans TC** — full CJK support (Chinese, Japanese, Korean)
- **Maven Pro** — clean Latin typeface for English fields

You can assign a different font to each field individually in the editor. Mix and match freely.

CardForge 內建兩套字型：Noto Sans TC（支援中文）與 Maven Pro（英文）。每個欄位可以分別指定字型，中英文混排完全沒問題。

---

## License

MIT License — free to use, modify, and distribute.

---

If CardForge saved you hours of tedious work, a star would mean a lot.

如果 CardForge 幫你省了大量時間，給個 ⭐ 就是最好的支持。
