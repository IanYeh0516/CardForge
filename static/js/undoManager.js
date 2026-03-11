// ══════════════════════════════════════════════════════════
//  Undo stack (saves layout + selection together)
// ══════════════════════════════════════════════════════════
const _undoStack = [];
const _UNDO_LIMIT = 50;

function _pushUndo() {
    _undoStack.push({
        layout:    JSON.stringify(fieldLayout),
        selection: [...selectedKeys]
    });
    if (_undoStack.length > _UNDO_LIMIT) _undoStack.shift();
}

function undo() {
    if (_undoStack.length === 0) return;
    const prev = _undoStack.pop();
    fieldLayout = JSON.parse(prev.layout);

    selectedKeys.clear();
    prev.selection.forEach(k => selectedKeys.add(k));
    selectedKey = selectedKeys.size === 1 ? [...selectedKeys][0] : null;

    _applyLayoutToDOM();
    document.querySelectorAll('.field-handle').forEach(h => {
        h.classList.toggle('active', selectedKeys.has(h.dataset.key));
    });
    document.querySelectorAll('.field-list-item').forEach(i => {
        i.style.fontWeight = selectedKeys.has(i.dataset.key) ? 'bold' : '';
    });
    if (selectedKey) _fillPropPanel(selectedKey);
    else if (selectedKeys.size > 1) {
        document.getElementById('ppBody').style.opacity = '1';
        document.getElementById('ppBody').style.pointerEvents = 'auto';
        document.getElementById('ppTitle').textContent = t('msg.selectedFields', { n: selectedKeys.size });
    } else {
        closePropPanel();
    }
    _updateAlignToolbar();
    saveLayoutSilent();
}

let _shiftHeld = false;

function _setMultiSelectMode(on) {
    _shiftHeld = on;
    const overlay = document.getElementById('dHandleOverlay');
    const hint    = document.getElementById('multiSelectHint');
    if (overlay) overlay.classList.toggle('multi-select-mode', on);
    if (hint)    hint.classList.toggle('d-none', !on);
}
