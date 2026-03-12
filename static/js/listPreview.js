// ══════════════════════════════════════════════════════════
//  List Tab — live preview
// ══════════════════════════════════════════════════════════
let listSide = 'combined';

function setListSide(side) {
    listSide = side;
    const frontImg    = document.getElementById('lTplImgFront');
    const backImg     = document.getElementById('lTplImg');
    const backSection = document.getElementById('lBackSection');
    const overlay     = document.getElementById('lTextOverlay');
    const native      = document.getElementById('lCardNative');
    const ts = Date.now();

    if (side === 'combined') {
        frontImg.style.display = 'block';
        frontImg.src = `/template/raw/${SESSION_ID}/front?t=${ts}`;
        backImg.src  = `/template/raw/${SESSION_ID}/back?t=${ts}`;
        backSection.style.display = '';
        overlay.style.display = '';
        native.style.height = (CARD_H * 2) + 'px';
    } else if (side === 'front') {
        frontImg.style.display = 'block';
        frontImg.src = `/template/raw/${SESSION_ID}/front?t=${ts}`;
        backSection.style.display = 'none';
        native.style.height = CARD_H + 'px';
    } else {
        frontImg.style.display = 'none';
        backImg.src = `/template/raw/${SESSION_ID}/back?t=${ts}`;
        backSection.style.display = '';
        overlay.style.display = '';
        native.style.height = CARD_H + 'px';
    }
    scaleCard('lCardWrapper', 'lCardNative');
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
