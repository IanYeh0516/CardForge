// ══════════════════════════════════════════════════════════
//  Export — PDF, JPG, Excel (shared logic extracted)
// ══════════════════════════════════════════════════════════

function _getExportIds() {
    const allRows = [...document.querySelectorAll('#empTable tbody tr')];
    const checked = allRows
        .filter(tr => tr.querySelector('.emp-check')?.checked)
        .map(tr => parseInt(tr.dataset.id));
    if (checked.length === 0) {
        return allRows.map(tr => parseInt(tr.dataset.id)).filter(id => !isNaN(id));
    }
    return checked;
}

function _showToast(msg) {
    const toastEl = document.getElementById('exportToast');
    const msgEl   = document.getElementById('exportToastMsg');
    if (!toastEl || !msgEl) return;
    msgEl.textContent = msg;
    const t = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 5000 });
    t.show();
}

function openExportFolder() {
    fetch('/export/open-folder', { method: 'POST' })
        .then(r => r.json())
        .then(d => {
            if (!d.ok) _showToast(t('msg.pathLabel') + d.exports_dir);
        });
}

function showExportFolder() {
    fetch('/export/info').then(r => r.json()).then(d => {
        const el = document.getElementById('exportPathDisplay');
        if (el) {
            el.textContent = d.exports_dir;
            el.title = d.exports_dir;
        }
    });
}

function _saveAllBeforeExport() {
    const rows = document.querySelectorAll('#empTable tbody tr');
    const promises = [];
    rows.forEach(tr => {
        const id = tr.dataset.id;
        if (!id) return;
        promises.push(fetch(`/employee/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field_data: collectRowData(tr) })
        }));
    });
    return Promise.all(promises);
}

async function _pickFolderAndWriteFiles(files) {
    if (window.showDirectoryPicker) {
        try {
            const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
            for (const f of files) {
                const fileHandle = await dirHandle.getFileHandle(f.name, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(f.blob);
                await writable.close();
            }
            _showToast(t('msg.savedFiles', { n: files.length }));
            return;
        } catch (e) {
            if (e.name === 'AbortError') return;
        }
    }
    for (const f of files) {
        const url = URL.createObjectURL(f.blob);
        const a = document.createElement('a');
        a.href = url; a.download = f.name; a.click();
        URL.revokeObjectURL(url);
        await new Promise(r => setTimeout(r, 200));
    }
    _showToast(t('msg.downloadedFiles', { n: files.length }));
}

// Shared export flow: save → POST → fetch files → pick folder
async function _exportMultiFile(endpoint) {
    const ids = _getExportIds();
    if (!ids.length) { alert(t('msg.noData')); return; }

    await _saveAllBeforeExport();

    const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ids })
    });
    const data = await resp.json();
    if (!data.ok) { alert(data.error || t('msg.exportFail')); return; }

    const files = [];
    for (const fname of data.files) {
        const r = await fetch(`/export/file/${encodeURIComponent(fname)}`);
        const blob = await r.blob();
        files.push({ name: fname, blob });
    }

    await _pickFolderAndWriteFiles(files);
}

async function exportPDF() {
    await _exportMultiFile(`/export/pdf/${SESSION_ID}`);
}

async function exportJPG() {
    await _exportMultiFile(`/export/jpg/${SESSION_ID}`);
}

async function exportExcel() {
    const ids = _getExportIds();
    if (!ids.length) { alert(t('msg.noData')); return; }

    await _saveAllBeforeExport();

    const resp = await fetch(`/export/excel/${SESSION_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ids })
    });
    if (!resp.ok) { alert(t('msg.exportFail')); return; }

    const blob = await resp.blob();
    const disposition = resp.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?(.+?)"?$/);
    const fname = match ? match[1] : 'employees.xlsx';

    await _pickFolderAndWriteFiles([{ name: fname, blob }]);
}
