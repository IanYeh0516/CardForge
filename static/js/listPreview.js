// ══════════════════════════════════════════════════════════
//  List Tab — live preview
// ══════════════════════════════════════════════════════════
let listSide = 'back';

function setListSide(side) {
    listSide = side;
    const img = document.getElementById('lTplImg');
    if (img) img.src = `/template/raw/${SESSION_ID}/${side}?t=${Date.now()}`;
    document.getElementById('lTextOverlay').style.display = side === 'back' ? '' : 'none';
}

function syncListPreviewFromRow(tr) {
    if (!tr) return;
    document.querySelectorAll('#empTable tbody tr').forEach(r => r.classList.remove('table-primary'));
    tr.classList.add('table-primary');
    const data = {};
    tr.querySelectorAll('td[data-key]').forEach(td => data[td.dataset.key] = td.textContent.trim());
    document.querySelectorAll('#lTextOverlay .card-text-label').forEach(el => {
        const tmpl = el.dataset.template;
        if (tmpl) {
            el.textContent = tmpl.replace(/\{([^}]+)\}/g, (_, k) => data[k] || '');
        } else {
            el.textContent = data[el.dataset.key] || '';
        }
    });
    applyFontFamilies('lTextOverlay');
}

function liveListPreview(cell) {
    const tr = cell.closest('tr');
    if (tr) syncListPreviewFromRow(tr);
}

function selectListRow(btn) {
    const tr = btn.closest('tr');
    if (tr) syncListPreviewFromRow(tr);
}
