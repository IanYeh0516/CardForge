// ══════════════════════════════════════════════════════════
//  Employee CRUD + row helpers
// ══════════════════════════════════════════════════════════

function collectRowData(tr) {
    const d = {};
    tr.querySelectorAll('td[data-key]').forEach(td => d[td.dataset.key] = td.textContent.trim());
    return d;
}

// Shared factory: build a <tr> for the employee table
function _createEmployeeRow(id, fieldData, rowIndex) {
    const tr = document.createElement('tr');
    tr.dataset.id = id;

    const tdChk = document.createElement('td');
    tdChk.className = 'text-center';
    tdChk.innerHTML = '<input type="checkbox" class="form-check-input emp-check" checked>';
    tr.appendChild(tdChk);

    const tdIdx = document.createElement('td');
    tdIdx.className = 'text-muted small row-select-handle';
    tdIdx.textContent = rowIndex;
    tr.appendChild(tdIdx);

    (FIELD_KEYS || []).forEach(key => {
        const td = document.createElement('td');
        td.contentEditable = 'true';
        td.dataset.key = key;
        td.textContent = fieldData[key] || '';
        td.addEventListener('input', function() { liveListPreview(this); });
        tr.appendChild(td);
    });

    const tdAct = document.createElement('td');
    tdAct.innerHTML = `
        <button class="btn btn-xs btn-outline-primary" onclick="selectListRow(this)" title="${t('tip.preview')}"><i class="bi bi-eye"></i></button>
        <button class="btn btn-xs btn-outline-danger" onclick="deleteEmployee(${id})" title="${t('tip.delete')}"><i class="bi bi-trash"></i></button>`;
    tr.appendChild(tdAct);

    return tr;
}

function saveAll() {
    const rows = document.querySelectorAll('#empTable tbody tr');
    const status = document.getElementById('saveStatus');
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
    Promise.all(promises).then(() => {
        if (status) { status.textContent = t('msg.saved'); setTimeout(() => status.textContent = '', 2500); }
    });
}

function addRow() {
    const fieldData = {};
    (FIELD_KEYS || []).forEach(k => fieldData[k] = '');
    fetch(`/session/${SESSION_ID}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field_data: fieldData })
    }).then(r => r.json()).then(d => {
        const tbody = document.querySelector('#empTable tbody');
        if (!tbody) return;
        const rowCount = tbody.querySelectorAll('tr').length + 1;
        const tr = _createEmployeeRow(d.id, fieldData, rowCount);
        tbody.appendChild(tr);
        tr.scrollIntoView({ behavior: 'smooth', block: 'end' });
        tr.querySelector('td[contenteditable]')?.focus();
    });
}

function deleteEmployee(id) {
    fetch(`/employee/${id}`, { method: 'DELETE' }).then(() => {
        const tr = document.querySelector(`#empTable tbody tr[data-id="${id}"]`);
        if (tr) tr.remove();
        _renumberRows();
    });
}

function _renumberRows() {
    document.querySelectorAll('#empTable tbody tr').forEach((r, i) => {
        const idx = r.querySelector('td.text-muted.small');
        if (idx) idx.textContent = i + 1;
    });
}

function deleteSession(id) {
    if (!confirm(t('msg.deleteSession'))) return;
    fetch(`/session/${id}`, { method: 'DELETE' }).then(() => location.href = '/');
}

// ── Checkbox helpers ────────────────────────────────────
function checkAll(checked) {
    document.querySelectorAll('#empTable .emp-check').forEach(cb => cb.checked = checked);
    const hdr = document.getElementById('checkAll');
    if (hdr) hdr.checked = checked;
    _updateCheckCount();
}

function _updateCheckCount() {
    const total   = document.querySelectorAll('#empTable .emp-check').length;
    const checked = document.querySelectorAll('#empTable .emp-check:checked').length;
    const el = document.getElementById('checkCount');
    if (el) el.textContent = t('msg.checkCount', { checked, total });
}

document.addEventListener('change', e => {
    if (e.target.classList.contains('emp-check')) _updateCheckCount();
});
