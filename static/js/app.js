// ══════════════════════════════════════════════════════════
//  App initialization — orchestrates all modules
// ══════════════════════════════════════════════════════════

window.addEventListener('resize', initCards);

document.addEventListener('DOMContentLoaded', () => {
    // Restore active tab after reload
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
        sessionStorage.removeItem('activeTab');
        const btn = document.querySelector(`[data-bs-target="${savedTab}"]`);
        if (btn) bootstrap.Tab.getOrCreateInstance(btn).show();
    }

    initCards();

    // Re-scale when switching to list tab (was hidden, so offsetWidth was 0)
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(btn => {
        btn.addEventListener('shown.bs.tab', initCards);
    });

    initDragHandles();

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.key === 'Shift') _setMultiSelectMode(true);
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'Shift') _setMultiSelectMode(false);
    });

    // Load first employee into list preview
    const firstTr = document.querySelector('#empTable tbody tr');
    if (firstTr) syncListPreviewFromRow(firstTr);
    _updateCheckCount();

    // Setup paste handler for table
    _initTablePaste();
});
