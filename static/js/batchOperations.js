// ══════════════════════════════════════════════════════════
//  Batch row operations + table paste handler
// ══════════════════════════════════════════════════════════
const selectedRowIds = new Set();

function _updateBatchToolbar() {
    const tb = document.getElementById('batchRowToolbar');
    const ct = document.getElementById('batchRowCount');
    if (!tb) return;
    if (selectedRowIds.size > 0) {
        tb.classList.remove('d-none');
        if (ct) ct.textContent = t('msg.selectedRows', { n: selectedRowIds.size });
    } else {
        tb.classList.add('d-none');
    }
}

function _toggleRowSelection(tr) {
    const id = parseInt(tr.dataset.id);
    if (!id) return;
    if (selectedRowIds.has(id)) {
        selectedRowIds.delete(id);
        tr.classList.remove('row-selected');
    } else {
        selectedRowIds.add(id);
        tr.classList.add('row-selected');
    }
    _updateBatchToolbar();
}

function clearRowSelection() {
    selectedRowIds.clear();
    document.querySelectorAll('#empTable tbody tr.row-selected').forEach(r => r.classList.remove('row-selected'));
    _updateBatchToolbar();
}

document.addEventListener('click', e => {
    const td = e.target.closest('#empTable tbody td.row-select-handle');
    if (!td) return;
    const tr = td.closest('tr');
    if (!tr) return;
    e.preventDefault();
    _toggleRowSelection(tr);
});

document.addEventListener('mousedown', e => {
    if (selectedRowIds.size === 0) return;
    if (e.target.closest('#empTable')) return;
    if (e.target.closest('#batchRowToolbar')) return;
    clearRowSelection();
});

function batchDeleteRows() {
    const ids = [...selectedRowIds];
    const promises = ids.map(id =>
        fetch(`/employee/${id}`, { method: 'DELETE' }).then(() => {
            const tr = document.querySelector(`#empTable tbody tr[data-id="${id}"]`);
            if (tr) tr.remove();
        })
    );
    Promise.all(promises).then(() => {
        selectedRowIds.clear();
        _updateBatchToolbar();
        _renumberRows();
        _updateCheckCount();
    });
}

function batchCopyRows() {
    const rows = [...selectedRowIds].map(id => {
        const tr = document.querySelector(`#empTable tbody tr[data-id="${id}"]`);
        return tr ? collectRowData(tr) : null;
    }).filter(Boolean);

    const promises = rows.map(fieldData =>
        fetch(`/session/${SESSION_ID}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field_data: fieldData })
        }).then(r => r.json())
    );

    Promise.all(promises).then(results => {
        const tbody = document.querySelector('#empTable tbody');
        if (!tbody) return;
        results.forEach((d, i) => {
            const rowCount = tbody.querySelectorAll('tr').length + 1;
            const tr = _createEmployeeRow(d.id, rows[i], rowCount);
            tbody.appendChild(tr);
        });
        clearRowSelection();
        _updateCheckCount();
    });
}


// ── Table paste handler — paste multi-cell data from Excel ──
function _initTablePaste() {
    const table = document.getElementById('empTable');
    if (!table) return;

    table.addEventListener('paste', e => {
        const activeCell = document.activeElement;
        if (!activeCell || !activeCell.matches('td[contenteditable][data-key]')) return;

        const clipText = (e.clipboardData || window.clipboardData).getData('text');
        if (!clipText) return;

        const pasteRows = clipText.split('\n').filter(r => r.trim());
        if (pasteRows.length === 0) return;

        const pasteCells = pasteRows.map(r => r.split('\t'));

        if (pasteCells.length === 1 && pasteCells[0].length === 1) return;

        e.preventDefault();

        const startTr = activeCell.closest('tr');
        const allTrs = [...table.querySelectorAll('tbody tr')];
        const startRowIdx = allTrs.indexOf(startTr);

        const rowDataCells = [...startTr.querySelectorAll('td[data-key]')];
        const startColIdx = rowDataCells.indexOf(activeCell);

        for (let ri = 0; ri < pasteCells.length; ri++) {
            const rowIdx = startRowIdx + ri;
            if (rowIdx >= allTrs.length) break;
            const tr = allTrs[rowIdx];
            const tds = [...tr.querySelectorAll('td[data-key]')];

            for (let ci = 0; ci < pasteCells[ri].length; ci++) {
                const colIdx = startColIdx + ci;
                if (colIdx >= tds.length) break;
                tds[colIdx].textContent = pasteCells[ri][ci].trim();
            }

            liveListPreview(tr.querySelector('td[data-key]'));
        }
    });
}
