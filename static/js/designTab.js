// ══════════════════════════════════════════════════════════
//  Design Tab — side toggle, template upload, drag, selection, properties
// ══════════════════════════════════════════════════════════

// ── Side toggle & template upload ───────────────────────
let designSide = 'back';

function setDesignSide(side) {
    designSide = side;
    const img = document.getElementById('dTplImg');
    if (img) img.src = `/template/raw/${SESSION_ID}/${side}?t=${Date.now()}`;
    const show = side === 'back';
    document.getElementById('dTextOverlay').style.display  = show ? '' : 'none';
    document.getElementById('dHandleOverlay').style.display = show ? '' : 'none';
    const lbl = document.getElementById('dSideLabel');
    if (lbl) lbl.textContent = side === 'back' ? t('design.back') : t('design.front');
}

function uploadTemplate(input, side) {
    if (!input.files.length) return;
    const fd = new FormData();
    fd.append('file', input.files[0]);
    fd.append('session_id', SESSION_ID);
    fd.append('side', side);
    fetch('/template/upload', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(d => {
            if (d.ok) {
                setDesignSide(side);
                const inputId = side === 'front' ? 'defaultFrontName' : 'defaultBackName';
                const el = document.getElementById(inputId);
                if (el) el.value = d.filename;
            } else alert(d.error || t('msg.uploadFail'));
        });
}

function loadDefaultTemplate(side) {
    const inputId = side === 'front' ? 'defaultFrontName' : 'defaultBackName';
    const filename = (document.getElementById(inputId)?.value || '').trim();
    fetch(`/template/default/${SESSION_ID}/${side}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
    }).then(r => r.json()).then(d => {
        if (d.ok) setDesignSide(side);
        else alert(d.error || t('msg.loadFail'));
    });
}


// ── Drag handles ────────────────────────────────────────
function initDragHandles() {
    const overlay = document.getElementById('dHandleOverlay');
    const native  = document.getElementById('dCardNative');
    if (!overlay || !native) return;

    let active = null, startMouse = {}, startPos = {};

    const startDrag = (h, e) => {
        e.preventDefault(); e.stopPropagation();
        active = h;
        h.classList.add('dragging');
        startMouse = { x: e.clientX, y: e.clientY };
        startPos   = { x: parseFloat(h.style.left), y: parseFloat(h.style.top) };
        active._moved = false;
    };

    overlay.querySelectorAll('.field-handle').forEach(h => {
        h.addEventListener('mousedown', e => startDrag(h, e));
        const lbl = h.querySelector('.fh-label');
        if (lbl) lbl.addEventListener('mousedown', e => startDrag(h, e));
    });

    document.addEventListener('mousemove', e => {
        if (!active) return;
        if (!active._moved) {
            const dx = e.clientX - startMouse.x;
            const dy = e.clientY - startMouse.y;
            if (Math.sqrt(dx * dx + dy * dy) < 4) return;
        }
        active._moved = true;
        const rect = native.getBoundingClientRect();
        const nx = Math.min(100, Math.max(0, startPos.x + (e.clientX - startMouse.x) / rect.width  * 100));
        const ny = Math.min(100, Math.max(0, startPos.y + (e.clientY - startMouse.y) / rect.height * 100));
        active.style.left = nx + '%';
        active.style.top  = ny + '%';
        const lbl = document.querySelector(`#dTextOverlay .card-text-label[data-key="${active.dataset.key}"]`);
        if (lbl) { lbl.style.left = nx + '%'; lbl.style.top = ny + '%'; }
    });

    document.addEventListener('mouseup', e => {
        if (!active && selectedKeys.size > 0) {
            const onCard   = !!e.target.closest('#dCardNative');
            const onHandle = !!e.target.closest('.field-handle');
            const onPanel  = !!e.target.closest('#propPanel');
            if (onCard && !onHandle && !onPanel) {
                clearSelection();
            }
        }
        if (!active) return;
        const moved = active._moved;
        const key   = active.dataset.key;
        const x = Math.round(parseFloat(active.style.left) * 10) / 10;
        const y = Math.round(parseFloat(active.style.top)  * 10) / 10;

        if (moved) {
            _pushUndo();
            const field = fieldLayout.find(f => f.key === key);
            if (field) { field.x = x; field.y = y; }
            if (selectedKey === key) { document.getElementById('ppX').value = x; document.getElementById('ppY').value = y; }
            saveLayoutSilent();
        } else {
            selectField(key, _shiftHeld);
        }

        active.classList.remove('dragging');
        active = null;
    });
}


// ── Selection (single + multi) ──────────────────────────
let selectedKey  = null;
const selectedKeys = new Set();

function selectField(key, addToSelection = false) {
    if (addToSelection) {
        selectedKeys.has(key) ? selectedKeys.delete(key) : selectedKeys.add(key);
    } else {
        selectedKeys.clear();
        selectedKeys.add(key);
    }
    selectedKey = selectedKeys.size === 1 ? [...selectedKeys][0] : null;

    document.querySelectorAll('.field-handle').forEach(h => {
        h.classList.toggle('active', selectedKeys.has(h.dataset.key));
    });
    document.querySelectorAll('.field-list-item').forEach(i => {
        i.style.fontWeight = selectedKeys.has(i.dataset.key) ? 'bold' : '';
    });

    if (selectedKeys.size === 1 && selectedKey) {
        _fillPropPanel(selectedKey);
    } else if (selectedKeys.size > 1) {
        const body = document.getElementById('ppBody');
        body.style.opacity = '1';
        body.style.pointerEvents = 'auto';
        document.getElementById('ppClose').style.display = '';
        document.getElementById('ppTitle').textContent = t('msg.selectedFields', { n: selectedKeys.size });
        document.getElementById('ppCard').style.borderLeftColor = '#0d6efd';
    }

    _updateAlignToolbar();
}

function _fillPropPanel(key) {
    const field = fieldLayout.find(f => f.key === key);
    if (!field) return;
    document.getElementById('ppTitle').textContent = field.label || key;
    document.getElementById('ppFont').value     = field.font      || 'NotoSansTC';
    document.getElementById('ppFontSize').value = field.font_size || 14;
    document.getElementById('ppColor').value    = field.color     || '#333333';
    document.getElementById('ppColorHex').value = field.color     || '#333333';
    document.getElementById('ppAlign').value    = field.align     || 'left';
    document.getElementById('ppBold').checked   = !!field.bold;
    document.getElementById('ppX').value        = (field.x ?? 50).toFixed(1);
    document.getElementById('ppY').value        = (field.y ?? 50).toFixed(1);
    const body = document.getElementById('ppBody');
    body.style.opacity = '1';
    body.style.pointerEvents = 'auto';
    document.getElementById('ppClose').style.display = '';
    document.getElementById('ppCard').style.borderLeftColor = field.color || '#6c757d';
}

function clearSelection() {
    if (selectedKeys.size > 0) _pushUndo();
    selectedKeys.clear();
    selectedKey = null;
    document.querySelectorAll('.field-handle').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.field-list-item').forEach(i => i.style.fontWeight = '');
    closePropPanel();
    _updateAlignToolbar();
}

function _updateAlignToolbar() {
    const tb = document.getElementById('alignToolbar');
    const sc = document.getElementById('selCount');
    if (!tb) return;
    if (selectedKeys.size >= 2) {
        tb.classList.remove('d-none');
        if (sc) sc.textContent = t('msg.selectedCount', { n: selectedKeys.size });
    } else {
        tb.classList.add('d-none');
    }
}


// ── Align & Distribute ──────────────────────────────────
function _applyLayoutToDOM() {
    fieldLayout.forEach(field => {
        const lbl = document.querySelector(`#dTextOverlay .card-text-label[data-key="${field.key}"]`);
        const hdl = document.querySelector(`#dHandleOverlay .field-handle[data-key="${field.key}"]`);
        if (lbl) { lbl.style.left = field.x + '%'; lbl.style.top = field.y + '%'; }
        if (hdl) { hdl.style.left = field.x + '%'; hdl.style.top = field.y + '%'; }
        if (selectedKey === field.key) {
            document.getElementById('ppX').value = field.x.toFixed(1);
            document.getElementById('ppY').value = field.y.toFixed(1);
        }
    });
    setTimeout(syncHandleSizes, 50);
    saveLayoutSilent();
}

function alignFields(type) {
    const sel = fieldLayout.filter(f => selectedKeys.has(f.key));
    if (sel.length < 2) return;
    _pushUndo();
    const xs = sel.map(f => f.x), ys = sel.map(f => f.y);
    switch (type) {
        case 'left':    sel.forEach(f => f.x = Math.min(...xs)); break;
        case 'centerX': sel.forEach(f => f.x = xs.reduce((a,v)=>a+v,0)/xs.length); break;
        case 'right':   sel.forEach(f => f.x = Math.max(...xs)); break;
        case 'top':     sel.forEach(f => f.y = Math.min(...ys)); break;
        case 'middleY': sel.forEach(f => f.y = ys.reduce((a,v)=>a+v,0)/ys.length); break;
        case 'bottom':  sel.forEach(f => f.y = Math.max(...ys)); break;
    }
    _applyLayoutToDOM();
}

function distributeFields(type) {
    const sel = fieldLayout.filter(f => selectedKeys.has(f.key));
    if (sel.length < 3) { alert(t('msg.distributeMin')); return; }
    _pushUndo();
    if (type === 'horizontal') {
        const sorted = [...sel].sort((a, b) => a.x - b.x);
        const step = (sorted.at(-1).x - sorted[0].x) / (sorted.length - 1);
        sorted.forEach((f, i) => f.x = sorted[0].x + step * i);
    } else {
        const sorted = [...sel].sort((a, b) => a.y - b.y);
        const step = (sorted.at(-1).y - sorted[0].y) / (sorted.length - 1);
        sorted.forEach((f, i) => f.y = sorted[0].y + step * i);
    }
    _applyLayoutToDOM();
}

function closePropPanel() {
    selectedKey = null;
    document.getElementById('ppBody').style.opacity       = '.4';
    document.getElementById('ppBody').style.pointerEvents = 'none';
    document.getElementById('ppClose').style.display      = 'none';
    document.getElementById('ppTitle').textContent        = t('pp.placeholder');
    document.getElementById('ppCard').style.borderLeftColor = '#6c757d';
    document.querySelectorAll('.field-handle').forEach(h => h.classList.remove('active'));
}

function syncColorHex(val) {
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        document.getElementById('ppColor').value = val;
        applyProp('color', val);
    }
}

function applyProp(prop, value) {
    _pushUndo();
    const targets = selectedKeys.size > 0
        ? fieldLayout.filter(f => selectedKeys.has(f.key))
        : (selectedKey ? [fieldLayout.find(f => f.key === selectedKey)].filter(Boolean) : []);
    if (!targets.length) return;

    targets.forEach(field => {
        field[prop] = value;
        const lbl = document.querySelector(`#dTextOverlay .card-text-label[data-key="${field.key}"]`);
        const hdl = document.querySelector(`#dHandleOverlay .field-handle[data-key="${field.key}"]`);
        if (lbl) {
            if (prop === 'color')     lbl.style.color      = value;
            if (prop === 'font_size') lbl.style.fontSize   = (value * PT_TO_PX) + 'px';
            if (prop === 'bold')      lbl.style.fontWeight = value ? 'bold' : 'normal';
            if (prop === 'align')     lbl.style.textAlign  = value;
            if (prop === 'font')      { lbl.dataset.font = value; lbl.style.fontFamily = FONT_CSS[value] || FONT_CSS.NotoSansTC; }
            if (prop === 'x')         lbl.style.left = value + '%';
            if (prop === 'y')         lbl.style.top  = value + '%';
        }
        if (hdl) {
            if (prop === 'color') {
                hdl.style.setProperty('--fh-color', value);
                hdl.style.borderColor = value;
            }
            if (prop === 'x') hdl.style.left = value + '%';
            if (prop === 'y') hdl.style.top  = value + '%';
        }
    });

    if (selectedKeys.size === 1 && prop === 'color') {
        document.getElementById('ppCard').style.borderLeftColor = value;
    }

    clearTimeout(applyProp._t);
    applyProp._t = setTimeout(() => { syncHandleSizes(); saveLayoutSilent(); }, 300);
}

function addField() {
    const key = prompt(t('msg.newFieldName'));
    if (!key || !key.trim()) return;
    fieldLayout.push({ key: key.trim(), label: key.trim(), x: 50, y: 50, font_size: 14, color: '#333333', align: 'left', bold: false, font: 'NotoSansTC' });
    _saveTabAndReload();
}

function removeField(key, e) {
    e.stopPropagation();
    if (!confirm(t('msg.deleteField', { name: key }))) return;
    fieldLayout = fieldLayout.filter(f => f.key !== key);
    _saveTabAndReload();
}

function savePreset() {
    fetch(`/preset/save/${SESSION_ID}`, { method: 'POST' })
        .then(r => r.json())
        .then(d => {
            if (d.ok) {
                const btn = document.querySelector('[onclick="savePreset()"]');
                if (btn) { const orig = btn.innerHTML; btn.innerHTML = '<i class="bi bi-check-lg"></i> ' + t('msg.saved'); setTimeout(() => btn.innerHTML = orig, 1800); }
            } else alert(d.error || t('msg.saveFail'));
        });
}

function loadPreset() {
    if (!confirm(t('msg.confirmLoadPreset'))) return;
    fetch(`/preset/load/${SESSION_ID}`, { method: 'POST' })
        .then(r => r.json())
        .then(d => {
            if (d.ok) {
                fieldLayout = d.field_layout;
                _saveTabAndReload();
            } else alert(d.error || t('msg.readFail'));
        });
}

function _saveTabAndReload() {
    const activeBtn = document.querySelector('[data-bs-toggle="tab"].active');
    if (activeBtn) sessionStorage.setItem('activeTab', activeBtn.dataset.bsTarget);
    saveLayoutSilent(() => location.reload());
}

function saveLayoutSilent(cb) {
    fetch(`/config/${SESSION_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field_layout: fieldLayout })
    }).then(() => cb && cb());
}
