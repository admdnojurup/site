/* ========================================
   Text Editor Panel  v1
   Toggle: Ctrl + Shift + T

   Makes all [data-text-id] elements editable inline.
   Persists changes to localStorage.
   Panel with: list of edited fields, Copy Changes, Reset.
   ======================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'nclaude-text-edits';
  var isActive = false;
  var panelEls = null;

  function loadSaved() {
    try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch (_) { return {}; }
  }
  function saveToDisk(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (_) { /* quota */ }
  }

  function getAllEditable() {
    return document.querySelectorAll('[data-text-id]');
  }

  /* Apply saved text on page load */
  function restoreSaved() {
    var saved = loadSaved();
    var keys = Object.keys(saved);
    if (!keys.length) return;
    keys.forEach(function (id) {
      var el = document.querySelector('[data-text-id="' + id + '"]');
      if (el) el.innerHTML = saved[id];
    });
  }

  /* Visual indicator for editable elements */
  function setEditableStyle(el, on) {
    if (on) {
      el.setAttribute('contenteditable', 'true');
      el.style.outline = '2px dashed #d97757';
      el.style.outlineOffset = '4px';
      el.style.cursor = 'text';
    } else {
      el.removeAttribute('contenteditable');
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.cursor = '';
    }
  }

  /* Save handler for a single element */
  function onInput(e) {
    var el = e.target.closest('[data-text-id]');
    if (!el) return;
    var id = el.getAttribute('data-text-id');
    var saved = loadSaved();
    saved[id] = el.innerHTML;
    saveToDisk(saved);
    updatePanelList();
  }

  /* Activate / deactivate editing */
  function activateEditing() {
    isActive = true;
    getAllEditable().forEach(function (el) { setEditableStyle(el, true); });
    document.addEventListener('input', onInput);
  }
  function deactivateEditing() {
    isActive = false;
    getAllEditable().forEach(function (el) { setEditableStyle(el, false); });
    document.removeEventListener('input', onInput);
  }

  /* ===== Panel UI ===== */
  var S = {
    btn: 'padding:8px 0;border-radius:8px;font-size:12px;cursor:pointer;font-family:Poppins,sans-serif;',
  };

  var listContainer = null;

  function updatePanelList() {
    if (!listContainer) return;
    var saved = loadSaved();
    var keys = Object.keys(saved);
    listContainer.innerHTML = '';

    if (keys.length === 0) {
      var empty = document.createElement('p');
      empty.style.cssText = 'color:#555550;font-size:12px;margin:8px 0;';
      empty.textContent = 'No text changes yet. Click any text on the page to edit.';
      listContainer.appendChild(empty);
      return;
    }

    keys.forEach(function (id) {
      var row = document.createElement('div');
      row.style.cssText = 'padding:8px 10px;margin-bottom:4px;border-radius:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);';

      var label = document.createElement('div');
      label.style.cssText = 'font-size:11px;color:#d97757;font-weight:600;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;';
      var nameSpan = document.createElement('span');
      nameSpan.textContent = id;

      var scrollBtn = document.createElement('button');
      scrollBtn.textContent = 'show';
      scrollBtn.style.cssText = 'background:none;border:none;color:#b0aea5;font-size:10px;cursor:pointer;font-family:Poppins,sans-serif;text-decoration:underline;';
      scrollBtn.addEventListener('click', (function (textId) {
        return function () {
          var el = document.querySelector('[data-text-id="' + textId + '"]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
      })(id));

      label.appendChild(nameSpan);
      label.appendChild(scrollBtn);

      var preview = document.createElement('div');
      preview.style.cssText = 'font-size:11px;color:#b0aea5;max-height:40px;overflow:hidden;line-height:1.4;';
      // Show plain text preview
      var tmp = document.createElement('div');
      tmp.innerHTML = saved[id];
      preview.textContent = (tmp.textContent || '').substring(0, 120);

      row.appendChild(label);
      row.appendChild(preview);
      listContainer.appendChild(row);
    });
  }

  function buildPanel() {
    /* overlay */
    var overlay = document.createElement('div');
    overlay.id = 'text-editor-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:9996;';

    /* panel */
    var panel = document.createElement('div');
    panel.id = 'text-editor-panel';
    panel.style.cssText = [
      'display:none', 'position:fixed', 'top:50%', 'left:24px',
      'transform:translateY(-50%)', 'z-index:9997',
      'width:320px', 'max-height:85vh', 'overflow-y:auto',
      'background:#1e1e1d', 'color:#faf9f5',
      'border:1px solid rgba(255,255,255,0.12)', 'border-radius:12px',
      'padding:20px', 'font-family:Poppins,sans-serif', 'font-size:13px',
      'box-shadow:0 8px 40px rgba(0,0,0,0.4)',
    ].join(';');

    /* header */
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;';
    header.innerHTML = '<span style="font-weight:600;font-size:14px;">Text Editor</span>';
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00d7';
    closeBtn.title = 'Close (Ctrl+Shift+T)';
    closeBtn.style.cssText = 'background:none;border:none;color:#faf9f5;font-size:20px;cursor:pointer;padding:0 4px;';
    closeBtn.addEventListener('click', togglePanel);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    /* status indicator */
    var status = document.createElement('div');
    status.style.cssText = 'padding:8px 12px;border-radius:8px;background:rgba(217,119,87,0.12);color:#d97757;font-size:12px;margin-bottom:14px;text-align:center;';
    status.textContent = 'Editing active — click any text on the page to edit';
    panel.appendChild(status);

    /* changes list */
    var listTitle = document.createElement('div');
    listTitle.style.cssText = 'font-size:11px;font-weight:600;color:#b0aea5;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;';
    listTitle.textContent = 'Changed fields';
    panel.appendChild(listTitle);

    listContainer = document.createElement('div');
    listContainer.style.cssText = 'margin-bottom:14px;max-height:40vh;overflow-y:auto;';
    panel.appendChild(listContainer);
    updatePanelList();

    /* separator */
    var sep = document.createElement('hr');
    sep.style.cssText = 'border:none;border-top:1px solid rgba(255,255,255,0.08);margin:14px 0 10px;';
    panel.appendChild(sep);

    /* action buttons */
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;';

    var resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset all';
    resetBtn.style.cssText = S.btn + 'flex:1;background:transparent;color:#b0aea5;border:1px solid rgba(255,255,255,0.12);';
    resetBtn.addEventListener('click', function () {
      if (!confirm('Reset all text changes? This will reload the page.')) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    var copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy changes';
    copyBtn.style.cssText = S.btn + 'flex:1;background:#d97757;color:#fff;border:none;font-weight:600;';
    copyBtn.addEventListener('click', function () {
      var saved = loadSaved();
      var keys = Object.keys(saved);
      if (!keys.length) {
        copyText('/* no text changes */', copyBtn);
        return;
      }
      var lines = [];
      keys.forEach(function (id) {
        var tmp = document.createElement('div');
        tmp.innerHTML = saved[id];
        var text = (tmp.textContent || '').trim();
        lines.push(id + ': ' + text);
      });
      copyText(lines.join('\n\n'), copyBtn);
    });

    btnRow.appendChild(resetBtn);
    btnRow.appendChild(copyBtn);
    panel.appendChild(btnRow);

    /* shortcut hint */
    var shortcut = document.createElement('div');
    shortcut.style.cssText = 'text-align:center;font-size:10px;color:#555550;margin-top:12px;';
    shortcut.textContent = 'Toggle: Ctrl + Shift + T';
    panel.appendChild(shortcut);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    overlay.addEventListener('click', togglePanel);

    return { panel: panel, overlay: overlay };
  }

  function copyText(text, btn) {
    var orig = btn.textContent;
    function done() { btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = orig; }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); done();
    }
  }

  /* ===== toggle ===== */
  var isOpen = false;
  function togglePanel() {
    if (!panelEls) panelEls = buildPanel();
    isOpen = !isOpen;
    panelEls.panel.style.display   = isOpen ? 'block' : 'none';
    panelEls.overlay.style.display = isOpen ? 'block' : 'none';

    if (isOpen) {
      activateEditing();
      updatePanelList();
    } else {
      deactivateEditing();
    }
  }

  /* keyboard shortcut */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') { e.preventDefault(); togglePanel(); }
  });

  /* on load — restore saved text */
  restoreSaved();
})();
