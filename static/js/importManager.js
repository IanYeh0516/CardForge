// ══════════════════════════════════════════════════════════
//  Import Manager — Excel column mapping
// ══════════════════════════════════════════════════════════

let _importMapping = {};   // {excelHeader: layoutKey|null}
let _importMatchType = {}; // {excelHeader: "name"|"position"|null}
let _importLayoutKeys = [];
let _importModal = null;

function startImport(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`/upload/${SESSION_ID}/preview`, { method: 'POST', body: formData })
        .then(r => r.json())
        .then(data => {
            if (data.error) { alert(data.error); return; }
            _importMapping = data.auto_map;
            _importMatchType = data.match_type;
            _importLayoutKeys = data.layout_keys;
            _showMappingModal(data.headers, data.layout_keys, data.row_count);
        })
        .catch(err => alert(t('msg.uploadFail') + ': ' + err));

    // Reset file input so same file can be re-selected
    document.getElementById('excelFileInput').value = '';
}

function _showMappingModal(headers, layoutKeys, rowCount) {
    const autoCount = Object.values(_importMatchType).filter(v => v === 'name').length;
    document.getElementById('importRowCount').textContent =
        t('import.rowCount', { n: rowCount }) + '  ·  ' +
        t('import.autoMatched', { n: autoCount });

    const tbody = document.querySelector('#mappingTable tbody');
    tbody.innerHTML = '';

    headers.forEach(h => {
        const tr = document.createElement('tr');
        const mapped = _importMapping[h];
        const mtype = _importMatchType[h];

        // Excel header cell
        const tdExcel = document.createElement('td');
        tdExcel.textContent = h;
        tdExcel.className = 'align-middle';
        tr.appendChild(tdExcel);

        // Arrow
        const tdArrow = document.createElement('td');
        tdArrow.className = 'text-center align-middle text-muted';
        tdArrow.innerHTML = '&rarr;';
        tr.appendChild(tdArrow);

        // Dropdown
        const tdSelect = document.createElement('td');
        const sel = document.createElement('select');
        sel.className = 'form-select form-select-sm';
        sel.dataset.excelHeader = h;
        sel.onchange = function() { _onMappingChange(h, this.value); };

        // "Skip" option
        const optSkip = document.createElement('option');
        optSkip.value = '';
        optSkip.textContent = t('import.skip');
        sel.appendChild(optSkip);

        layoutKeys.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (mapped === k) opt.selected = true;
            sel.appendChild(opt);
        });

        tdSelect.appendChild(sel);
        tr.appendChild(tdSelect);

        // Match indicator
        const tdBadge = document.createElement('td');
        tdBadge.className = 'align-middle';
        tdBadge.dataset.excelHeader = h;
        if (mtype === 'name') {
            tdBadge.innerHTML = '<span class="badge bg-success">&#10003;</span>';
        } else if (mtype === 'position') {
            tdBadge.innerHTML = '<span class="badge bg-warning text-dark">&#8693;</span>';
        }
        tr.appendChild(tdBadge);

        tbody.appendChild(tr);
    });

    // Disable already-taken options in all dropdowns
    _syncDropdownOptions();

    if (!_importModal) {
        _importModal = new bootstrap.Modal(document.getElementById('importMappingModal'));
    }
    _importModal.show();
}

function _onMappingChange(excelHeader, newValue) {
    _importMapping[excelHeader] = newValue || null;
    _importMatchType[excelHeader] = newValue ? 'manual' : null;
    _syncDropdownOptions();
}

/** Disable layout key options that are already used by another dropdown */
function _syncDropdownOptions() {
    const selects = document.querySelectorAll('#mappingTable select');
    // Collect which layout keys are taken and by whom
    const taken = {};  // {layoutKey: excelHeader}
    selects.forEach(sel => {
        if (sel.value) taken[sel.value] = sel.dataset.excelHeader;
    });
    // For each dropdown, disable options taken by OTHER dropdowns
    selects.forEach(sel => {
        sel.querySelectorAll('option').forEach(opt => {
            if (!opt.value) return; // skip the "— Skip —" option
            const takenBy = taken[opt.value];
            opt.disabled = takenBy && takenBy !== sel.dataset.excelHeader;
        });
    });
}

function confirmImport() {
    const mapping = {};
    document.querySelectorAll('#mappingTable select').forEach(sel => {
        mapping[sel.dataset.excelHeader] = sel.value || null;
    });

    fetch(`/upload/${SESSION_ID}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapping })
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) { alert(data.error); return; }
        if (_importModal) _importModal.hide();
        // Reload page to show new data
        location.reload();
    })
    .catch(err => alert(t('msg.uploadFail') + ': ' + err));
}
