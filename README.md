# CardForge — Batch Business Card Generator from Excel

**CardForge** is a free, open-source, self-hosted business card generator that converts Excel spreadsheets into print-ready PDF and JPEG name cards in seconds — no design software required.

> 免費開源的批次名片生成工具，把 Excel 員工名單一鍵轉換為印刷級 PDF 名片，不需要任何設計軟體。

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

## Features / 功能特色

| | English | 中文 |
|---|---------|------|
| 📥 | **Excel Import** — Upload `.xlsx`, columns auto-mapped to card fields | **Excel 匯入** — 上傳 `.xlsx`，欄位自動對應 |
| 🎨 | **Live Visual Editor** — Drag fields, adjust font, color, alignment in real time | **即時視覺化編輯** — 拖曳欄位、即時調整字型大小與顏色 |
| 📄 | **Batch Export** — PDF + JPEG for every row, 300 DPI print quality | **批次匯出** — 每位員工各一份 PDF + JPEG，300 DPI |
| 🖼️ | **Custom Templates** — Upload your own front & back backgrounds | **自訂底圖** — 自由替換正面、背面名片背景 |
| 📁 | **Multi-Session** — Keep departments or designs as separate projects | **多專案管理** — 不同部門各自獨立儲存 |
| 💻 | **Cross-platform** — macOS, Windows, Linux | **跨平台** — macOS、Windows、Linux |

---

## Quick Start / 安裝教學

> **First-time setup takes about 5–10 minutes. After that, just double-click to start.**
>
> 第一次安裝大約 5–10 分鐘，之後每次只要雙擊啟動。

### Step 1 — Download / 下載

**[⬇ Download CardForge (ZIP)](https://github.com/IanYeh0516/CardForge/archive/refs/heads/master.zip)**

Download the ZIP file, then extract it:
- **Windows**: Right-click the ZIP → "Extract All"
- **macOS**: Double-click the ZIP

下載 ZIP 檔案後解壓縮。Windows 按右鍵選「解壓縮全部」，macOS 直接雙擊。

---

### Step 2 — Install Python (first time only) / 安裝 Python（第一次才需要）

CardForge needs **Python 3.10+** to run. If you've never installed it:

**[➡ Download Python](https://www.python.org/downloads/)**

CardForge 需要一個叫「Python」的免費程式來執行，如果你從沒裝過，請先下載安裝。

<details>
<summary><strong>Windows 安裝注意事項</strong></summary>

1. 下載後雙擊安裝檔
2. **安裝畫面最下方有一個勾選框「Add Python to PATH」，一定要打勾！** 沒勾的話 CardForge 會無法啟動
3. 點「Install Now」，等待安裝完成

</details>

<details>
<summary><strong>macOS 安裝注意事項</strong></summary>

1. 下載後雙擊 `.pkg` 檔案
2. 按照畫面指示一路點「繼續」直到安裝完成
3. 如果系統詢問是否安裝「開發者工具」，請點「安裝」

</details>

---

### Step 3 — Start CardForge / 啟動

#### Windows

Open the extracted folder, find **`start.bat`**, and double-click it.

打開解壓縮後的資料夾，找到 `start.bat`，雙擊它。

> **Windows 可能會跳出安全性警告**（藍色畫面「Windows 已保護您的電腦」），這是正常的。點「更多資訊」→「仍要執行」即可。
>
> A black window will appear — this is normal, don't close it. Your browser will open automatically after a few seconds.

#### macOS

Open **Terminal** (press `Command + Space`, type "Terminal", press Enter), then run:

打開終端機（按 `Command + 空白鍵`，輸入「終端機」，按 Enter），然後貼上以下指令：

```bash
cd ~/Downloads/CardForge-master && bash start.sh
```

> Your browser will open automatically. If it doesn't, go to `http://localhost:5001` manually.
>
> 瀏覽器會自動開啟。如果沒有，請手動在網址列輸入 `localhost:5001`。

---

### Step 4 — Start making cards / 開始做名片

1. Click **"Import Excel"** / 點「匯入 Excel」
2. Upload your `.xlsx` employee list / 上傳員工名單
3. Customize in the visual editor / 在編輯器裡拖拉調整
4. Click **"Export All"** / 點「匯出全部」

> You can try with the included `example.xlsx` file first.
>
> 可以先用資料夾裡的 `example.xlsx` 試試看。

---

## Excel Format / Excel 格式

Create an `.xlsx` file with one employee per row. Use `example.xlsx` as a reference.

以 `example.xlsx` 為範本，每列填入一位員工資料。

| Column 欄位 | Field 對應 | Example 範例 |
|-------------|-----------|-------------|
| 欄位1 | Employee ID 員工編號 | `001` |
| 欄位2 | Chinese Name 中文姓名 | `王小明` |
| 欄位3 | English Name 英文姓名 | `Ming Wang` |
| 欄位4 | Department 部門 | `Engineering` |
| 欄位5 | Title 職稱 | `Engineer` |
| 欄位6 | Department (EN) 部門英文 | `Engineering Dept.` |
| 欄位7 | Title (EN) 職稱英文 | `Software Engineer` |
| 欄位8 | Email 電子信箱 | `ming@company.com` |
| 欄位9 | Mobile 手機 | `+886-912-345-678` |
| 欄位10 | Extension 分機 | `#201` |

---

## Card Specifications / 名片規格

- **Size 尺寸:** 90 × 54 mm (standard business card)
- **Print DPI 印刷解析度:** 300
- **Preview DPI 預覽解析度:** 150
- **Export formats 匯出格式:** PDF, JPEG

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

## FAQ / 常見問題

<details>
<summary><strong>How do I import my Excel file? / 怎麼匯入 Excel？</strong></summary>

1. Make sure your file is saved as `.xlsx` (not `.xls` or `.csv`)
2. Open the app at `http://localhost:5001`
3. Click **New Session** → **Upload File**
4. The app reads the first row as column headers and imports all remaining rows

確認檔案格式為 `.xlsx`，點擊「匯入 Excel」→「上傳檔案」，系統自動讀取第一列為欄位標題，其餘列為員工資料。

</details>

<details>
<summary><strong>How do I export cards? / 怎麼匯出名片？</strong></summary>

After customizing in the editor, click **Export All** in the top toolbar.

- Each employee gets their own `name.pdf` (300 DPI) and `name.jpg` (preview)
- Files are saved to `data/exports/` and bundled for download

完成編輯後點「匯出全部」，每位員工各自生成 PDF 與 JPEG，儲存於 `data/exports/`。

</details>

<details>
<summary><strong>How do I add a new field to the card? / 怎麼在名片上新增欄位？</strong></summary>

1. **Add a column** to your Excel (e.g. `Line ID`) / 在 Excel 新增一欄
2. **Re-upload** the file to create a new session / 重新上傳建立新 Session
3. **Click "Add Field"** in the editor — the dropdown lists all your Excel columns automatically / 點「新增欄位」，下拉選單自動抓取所有 Excel 欄位
4. **Drag** the new field to position it / 拖曳到名片上的位置

> CardForge reads your Excel headers directly. Any column you add immediately appears as an option — no config files needed.
>
> CardForge 直接讀取 Excel 表頭。加了什麼欄位，編輯器裡就會出現什麼選項，不需要改任何設定檔。

</details>

<details>
<summary><strong>Can I use my own card background? / 可以用自己的名片底圖嗎？</strong></summary>

Yes. Click **"Change Template"** to upload your own PNG or JPEG for front and back. Recommended resolution: **4083 × 2450 px** at 300 DPI.

可以。點擊「更換模板」，分別上傳正面與背面底圖。建議解析度：**4083 × 2450 像素**，300 DPI。

</details>

<details>
<summary><strong>Does it work offline? / 可以離線使用嗎？</strong></summary>

Yes, completely. CardForge runs entirely on your local machine. No internet connection is required after the initial setup.

可以，完全離線。初次安裝後不需要網路連線。

</details>

<details>
<summary><strong>What about Chinese + English text? / 名片同時有中英文怎麼辦？</strong></summary>

CardForge ships with two font families:

- **Noto Sans TC** — CJK support (Chinese, Japanese, Korean)
- **Maven Pro** — clean Latin typeface for English

You can assign a different font to each field individually. Mix and match freely.

內建 Noto Sans TC（中文）與 Maven Pro（英文），每個欄位可以分別指定字型。

</details>

<details>
<summary><strong>start.bat doesn't work / start.bat 無法執行？</strong></summary>

**Windows security warning**: If you see "Windows protected your PC" (blue screen), click "More info" → "Run anyway". This is normal for downloaded scripts.

**Python not found**: Make sure Python is installed and you checked "Add Python to PATH" during installation. If you missed it, reinstall Python and check the box this time.

**Windows 安全性警告**：看到藍色畫面「Windows 已保護您的電腦」，點「更多資訊」→「仍要執行」。

**找不到 Python**：確認安裝時有勾選「Add Python to PATH」。如果漏了，重新安裝 Python 並勾選。

</details>

---

## License

MIT License — free to use, modify, and distribute.

---

If CardForge saved you hours of tedious work, a star would mean a lot.

如果 CardForge 幫你省了大量時間，給個 ⭐ 就是最好的支持。
