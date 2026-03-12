// ══════════════════════════════════════════════════════════
//  Card rendering — flat → scale approach
//  Inner div is always 1063×638 px, CSS transform scales it.
// ══════════════════════════════════════════════════════════

function scaleCard(wrapperId, nativeId) {
    const wrapper = document.getElementById(wrapperId);
    const native  = document.getElementById(nativeId);
    if (!wrapper || !native) return;
    const scale = wrapper.offsetWidth / CARD_W;
    const nativeH = parseInt(native.style.height) || CARD_H;
    native.style.transform = `scale(${scale})`;
    wrapper.style.height   = (nativeH * scale) + 'px';
}

function applyFontFamilies(overlayId) {
    document.querySelectorAll('#' + overlayId + ' .card-text-label').forEach(el => {
        el.style.fontFamily = FONT_CSS[el.dataset.font] || FONT_CSS.NotoSansTC;
    });
}

function syncHandleSizes() {
    document.querySelectorAll('#dTextOverlay .card-text-label').forEach(lbl => {
        const key = lbl.dataset.key;
        const hdl = document.querySelector(`#dHandleOverlay .field-handle[data-key="${key}"]`);
        if (!hdl) return;
        const w = lbl.offsetWidth;
        const h = lbl.offsetHeight;
        hdl.style.width  = (w + 20) + 'px';
        hdl.style.height = (h + 12) + 'px';
    });
}

function initCards() {
    scaleCard('dCardWrapper', 'dCardNative');
    scaleCard('lCardWrapper', 'lCardNative');
    applyFontFamilies('dTextOverlay');
    applyFontFamilies('lTextOverlay');
    setTimeout(syncHandleSizes, 100);
}
