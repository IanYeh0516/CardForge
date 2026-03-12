// ══════════════════════════════════════════════════════════
//  i18n — bilingual UI (zh-TW / en)
// ══════════════════════════════════════════════════════════
const I18N = {
    'zh-TW': {
        // Navbar
        'nav.brand': 'NamePage 名片產生器',

        // Index page
        'index.title': '工作階段',
        'index.import': '匯入 Excel',
        'index.create': '手動建立',
        'index.col.name': '名稱',
        'index.col.source': '來源檔案',
        'index.col.count': '人數',
        'index.col.created': '建立時間',
        'index.empty': '尚未建立任何工作階段',
        'index.empty.hint': '請匯入 Excel 檔案或手動建立',
        'index.modal.title': '匯入 Excel 檔案',
        'index.modal.choose': '選擇 .xlsx 檔案',
        'index.modal.hint': '第一列為欄位標題，之後的列為員工資料。',
        'index.modal.cancel': '取消',
        'index.modal.upload': '上傳',

        // Editor — tabs
        'tab.list': '員工清單',
        'tab.design': '模板設計',

        // Editor — list tab toolbar
        'btn.import': '匯入 Excel',
        'btn.exportPdf': '匯出 PDF',
        'btn.exportJpg': '匯出 JPG',
        'btn.exportExcel': '匯出 Excel',
        'mode.combined': '合併',
        'mode.separate': '分開',
        'btn.openFolder': '開啟匯出資料夾',
        'btn.save': '儲存',
        'btn.add': '新增',
        'check.label': '勾選：',
        'check.all': '全選',
        'check.none': '全取消',
        'check.hint': '| 點擊列號可批量選取 · 支援 Excel 複製貼上',
        'col.ops': '操作',

        // Batch toolbar
        'batch.delete': '刪除選取',
        'batch.copy': '複製選取',
        'batch.cancel': '取消',

        // List preview
        'preview.label': '即時預覽',
        'side.combined': '合',
        'side.back': '背',
        'side.front': '正',

        // Design tab
        'design.current': '目前預覽：',
        'design.back': '背面',
        'design.front': '正面',
        'design.multiHint': '複選模式 — 點擊欄位加入選取，放開 Shift 結束',
        'align.left': '靠左',
        'align.centerX': '水平置中',
        'align.right': '靠右',
        'align.top': '靠上',
        'align.middleY': '垂直置中',
        'align.bottom': '靠下',
        'align.distribute': '均分',
        'align.distH': '水平均分',
        'align.distV': '垂直均分',
        'align.deselect': '取消選取',
        'design.dragHint': '拖拉移動 · 點擊選取 · {shift}+點擊複選',

        // Property panel
        'pp.setPreset': '設為預設版型',
        'pp.settings': '環境設定',
        'pp.backTpl': '背面模板',
        'pp.frontTpl': '正面模板',
        'pp.preview': '預覽',
        'pp.loadDefault': '預設讀取',
        'pp.upload': '上傳',
        'pp.placeholder': '點擊標籤選取欄位',
        'pp.dataColumn': '資料欄位',
        'pp.template': '模板',
        'pp.templateHint': '{欄位1} | {欄位2}',
        'pp.templateHelp': '留空則直接讀取資料欄位值。可用 {欄位名} 語法。',
        'pp.pickColumn': '選擇資料欄位',
        'pp.customOption': '自訂...',
        'pp.customFieldName': '自訂欄位名稱',
        'pp.addConfirm': '確認',
        'pp.addCancel': '取消',
        'pp.font': '字型',
        'pp.fontSize': '字號 (pt)',
        'pp.color': '顏色',
        'pp.align': '對齊',
        'pp.alignLeft': '左對齊',
        'pp.alignCenter': '置中',
        'pp.alignRight': '右對齊',
        'pp.bold': '粗體',
        'pp.saveConfig': '儲存設定',
        'pp.fieldList': '欄位清單',
        'pp.presetSection': '樣式預設',
        'pp.presetSave': '儲存',
        'pp.presetLoad': '讀取',

        // JS messages
        'msg.saved': '已儲存',
        'msg.deleteSession': '確定要刪除此工作階段？',
        'msg.noData': '沒有員工資料',
        'msg.exportFail': '匯出失敗',
        'msg.uploadFail': '上傳失敗',
        'msg.loadFail': '載入失敗',
        'msg.saveFail': '儲存失敗',
        'msg.readFail': '讀取失敗',
        'msg.savedFiles': '已儲存 {n} 個檔案',
        'msg.downloadedFiles': '已下載 {n} 個檔案',
        'msg.selectedFields': '已選取 {n} 個欄位（批量）',
        'msg.selectedCount': '已選 {n} 個',
        'msg.selectedRows': '已選 {n} 列',
        'msg.checkCount': '已選 {checked} / {total} 人',
        'msg.pathLabel': '路徑: ',
        'msg.newFieldName': '新欄位名稱',
        'msg.deleteField': '刪除欄位「{name}」？',
        'msg.confirmLoadPreset': '讀取樣式將覆蓋目前欄位設定，確定嗎？',
        'msg.distributeMin': '均分需要至少選取 3 個欄位',
        'msg.presetNotFound': '找不到預設樣式檔案',

        // Preview page
        'preview.title': '名片預覽',
        'preview.front': '正面',
        'preview.back': '背面',
        'preview.downloadPdf': '下載 PDF',
        'preview.goBack': '返回',

        // Import mapping modal
        'import.title': '欄位對應',
        'import.excelCol': 'Excel 欄位',
        'import.layoutField': '名片欄位',
        'import.skip': '— 不使用 —',
        'import.cancel': '取消',
        'import.confirm': '確認匯入',
        'import.rowCount': '共 {n} 筆資料',
        'import.autoMatched': '已自動對應 {n} 個欄位',

        // Tooltips
        'tip.preview': '預覽',
        'tip.delete': '刪除',
    },

    'en': {
        'nav.brand': 'NamePage Card Generator',

        'index.title': 'Sessions',
        'index.import': 'Import Excel',
        'index.create': 'Create Manually',
        'index.col.name': 'Name',
        'index.col.source': 'Source File',
        'index.col.count': 'Count',
        'index.col.created': 'Created',
        'index.empty': 'No sessions yet',
        'index.empty.hint': 'Import an Excel file or create one manually',
        'index.modal.title': 'Import Excel File',
        'index.modal.choose': 'Choose .xlsx file',
        'index.modal.hint': 'Row 1 = column headers. Remaining rows = employee data.',
        'index.modal.cancel': 'Cancel',
        'index.modal.upload': 'Upload',

        'tab.list': 'Employee List',
        'tab.design': 'Template Design',

        'btn.import': 'Import Excel',
        'btn.exportPdf': 'Export PDF',
        'btn.exportJpg': 'Export JPG',
        'btn.exportExcel': 'Export Excel',
        'mode.combined': 'Combined',
        'mode.separate': 'Separate',
        'btn.openFolder': 'Open export folder',
        'btn.save': 'Save',
        'btn.add': 'Add',
        'check.label': 'Select:',
        'check.all': 'All',
        'check.none': 'None',
        'check.hint': '| Click row # to batch select · Supports Excel copy-paste',
        'col.ops': 'Actions',

        'batch.delete': 'Delete Selected',
        'batch.copy': 'Copy Selected',
        'batch.cancel': 'Cancel',

        'preview.label': 'Live Preview',
        'side.combined': 'C',
        'side.back': 'B',
        'side.front': 'F',

        'design.current': 'Previewing: ',
        'design.back': 'Back',
        'design.front': 'Front',
        'design.multiHint': 'Multi-select — click fields to add, release Shift to finish',
        'align.left': 'Left',
        'align.centerX': 'Center X',
        'align.right': 'Right',
        'align.top': 'Top',
        'align.middleY': 'Center Y',
        'align.bottom': 'Bottom',
        'align.distribute': 'Distribute',
        'align.distH': 'Horizontal',
        'align.distV': 'Vertical',
        'align.deselect': 'Deselect',
        'design.dragHint': 'Drag to move · Click to select · {shift}+click for multi-select',

        'pp.setPreset': 'Set as Default Layout',
        'pp.settings': 'Settings',
        'pp.backTpl': 'Back Template',
        'pp.frontTpl': 'Front Template',
        'pp.preview': 'Preview',
        'pp.loadDefault': 'Load Default',
        'pp.upload': 'Upload',
        'pp.placeholder': 'Click a label to select',
        'pp.dataColumn': 'Data Column',
        'pp.template': 'Template',
        'pp.templateHint': '{Column1} | {Column2}',
        'pp.templateHelp': 'Leave empty to use column value directly. Use {ColumnName} syntax.',
        'pp.pickColumn': 'Pick data column',
        'pp.customOption': 'Custom...',
        'pp.customFieldName': 'Custom field name',
        'pp.addConfirm': 'Confirm',
        'pp.addCancel': 'Cancel',
        'pp.font': 'Font',
        'pp.fontSize': 'Size (pt)',
        'pp.color': 'Color',
        'pp.align': 'Align',
        'pp.alignLeft': 'Left',
        'pp.alignCenter': 'Center',
        'pp.alignRight': 'Right',
        'pp.bold': 'Bold',
        'pp.saveConfig': 'Save Config',
        'pp.fieldList': 'Field List',
        'pp.presetSection': 'Style Preset',
        'pp.presetSave': 'Save',
        'pp.presetLoad': 'Load',

        'msg.saved': 'Saved',
        'msg.deleteSession': 'Delete this session?',
        'msg.noData': 'No employee data',
        'msg.exportFail': 'Export failed',
        'msg.uploadFail': 'Upload failed',
        'msg.loadFail': 'Load failed',
        'msg.saveFail': 'Save failed',
        'msg.readFail': 'Read failed',
        'msg.savedFiles': 'Saved {n} files',
        'msg.downloadedFiles': 'Downloaded {n} files',
        'msg.selectedFields': '{n} fields selected (batch)',
        'msg.selectedCount': '{n} selected',
        'msg.selectedRows': '{n} rows selected',
        'msg.checkCount': '{checked} / {total} selected',
        'msg.pathLabel': 'Path: ',
        'msg.newFieldName': 'New field name',
        'msg.deleteField': 'Delete field "{name}"?',
        'msg.confirmLoadPreset': 'Loading preset will overwrite current layout. Continue?',
        'msg.distributeMin': 'Distribute requires at least 3 fields',
        'msg.presetNotFound': 'Preset file not found',

        'preview.title': 'Card Preview',
        'preview.front': 'Front',
        'preview.back': 'Back',
        'preview.downloadPdf': 'Download PDF',
        'preview.goBack': 'Go Back',

        'import.title': 'Column Mapping',
        'import.excelCol': 'Excel Column',
        'import.layoutField': 'Card Field',
        'import.skip': '— Skip —',
        'import.cancel': 'Cancel',
        'import.confirm': 'Confirm Import',
        'import.rowCount': '{n} rows',
        'import.autoMatched': '{n} columns auto-matched',

        'tip.preview': 'Preview',
        'tip.delete': 'Delete',
    }
};

let _currentLang = localStorage.getItem('lang') || 'zh-TW';

function t(key, params) {
    let str = (I18N[_currentLang] && I18N[_currentLang][key]) || (I18N['zh-TW'][key]) || key;
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, v);
        });
    }
    return str;
}

function getCurrentLang() {
    return _currentLang;
}

function toggleLang() {
    _currentLang = _currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    localStorage.setItem('lang', _currentLang);
    _applyI18n();
    _updateLangBtn();
}

function _updateLangBtn() {
    const btn = document.getElementById('langToggleBtn');
    if (btn) {
        btn.textContent = _currentLang === 'zh-TW' ? 'EN' : '中文';
    }
}

function _applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const val = t(key);
        const attr = el.dataset.i18nAttr;

        if (attr === 'title') {
            el.title = val;
            return;
        }
        if (attr === 'placeholder') {
            el.placeholder = val;
            return;
        }
        if (el.tagName === 'OPTION') {
            el.textContent = val;
            return;
        }
        if (el.tagName === 'INPUT' && el.type !== 'checkbox') {
            el.value = val;
            return;
        }

        // Preserve inner <i> icons
        const icon = el.querySelector('i, kbd');
        if (icon && key === 'design.dragHint') {
            const parts = val.split('{shift}');
            el.innerHTML = `<i class="bi bi-arrows-move"></i> ${parts[0]}<kbd>Shift</kbd>${parts[1] || ''}`;
        } else if (icon) {
            const iconHtml = icon.outerHTML;
            el.innerHTML = iconHtml + ' ' + val;
        } else {
            el.textContent = val;
        }
    });
    // Update page title
    const titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) document.title = t(titleEl.dataset.i18nTitle);
}

// Auto-apply on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    _applyI18n();
    _updateLangBtn();
});
