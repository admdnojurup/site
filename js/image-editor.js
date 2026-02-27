/* ========================================
   Image Size Editor Panel
   Toggle: Ctrl + Shift + E
   Persists to localStorage, enforces min/max bounds,
   highlights affected images on hover.
   ======================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'nclaude-img-sizes';

  // Each control: CSS variable, label, default, min, max, step, unit
  var controls = [
    { varName: '--img-logo-max-h',  label: 'Client logos — height',  def: 40,  min: 16,  max: 80,  step: 1, unit: 'px', group: 'client-logos' },
    { varName: '--img-logo-max-w',  label: 'Client logos — width',   def: 140, min: 40,  max: 200, step: 1, unit: 'px', group: 'client-logos' },
    { varName: '--img-case-h',      label: 'Case images — height',   def: 180, min: 80,  max: 400, step: 1, unit: 'px', group: 'case-images' },
    { varName: '--img-nav-logo',    label: 'Nav logo size',          def: 32,  min: 20,  max: 56,  step: 1, unit: 'px', group: 'nav-logo' },
    { varName: '--img-footer-logo', label: 'Footer logo size',       def: 28,  min: 18,  max: 48,  step: 1, unit: 'px', group: 'footer-logo' },
  ];

  /* ---------- helpers ---------- */

  function clampVal(val, ctrl) {
    var n = parseFloat(val);
    if (isNaN(n)) return ctrl.def;
    return Math.min(ctrl.max, Math.max(ctrl.min, n));
  }

  function loadSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function saveAll(values) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (_) { /* quota etc. */ }
  }

  function applyVar(varName, val, unit) {
    document.documentElement.style.setProperty(varName, val + unit);
  }

  /* ---------- highlight helpers ---------- */

  function highlightGroup(group, on) {
    var imgs = document.querySelectorAll('[data-img-group="' + group + '"]');
    imgs.forEach(function (img) {
      if (on) {
        img.style.outline = '2px dashed #d97757';
        img.style.outlineOffset = '3px';
      } else {
        img.style.outline = '';
        img.style.outlineOffset = '';
      }
    });
  }

  /* ---------- build panel ---------- */

  function buildPanel() {
    var saved = loadSaved();

    // Apply any saved values immediately
    controls.forEach(function (ctrl) {
      if (saved[ctrl.varName] !== undefined) {
        var v = clampVal(saved[ctrl.varName], ctrl);
        applyVar(ctrl.varName, v, ctrl.unit);
      }
    });

    // Overlay backdrop
    var overlay = document.createElement('div');
    overlay.id = 'img-editor-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:9998;';

    // Panel
    var panel = document.createElement('div');
    panel.id = 'img-editor-panel';
    panel.style.cssText = [
      'display:none', 'position:fixed', 'top:50%', 'right:24px',
      'transform:translateY(-50%)', 'z-index:9999',
      'width:320px', 'max-height:80vh', 'overflow-y:auto',
      'background:#1e1e1d', 'color:#faf9f5',
      'border:1px solid rgba(255,255,255,0.12)', 'border-radius:12px',
      'padding:20px', 'font-family:Poppins,sans-serif', 'font-size:13px',
      'box-shadow:0 8px 40px rgba(0,0,0,0.4)',
    ].join(';');

    // Header
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';
    header.innerHTML = '<span style="font-weight:600;font-size:14px;">Image Size Editor</span>';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00d7';
    closeBtn.title = 'Close (Ctrl+Shift+E)';
    closeBtn.style.cssText = 'background:none;border:none;color:#faf9f5;font-size:20px;cursor:pointer;padding:0 4px;';
    closeBtn.addEventListener('click', togglePanel);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Controls
    var inputRefs = {};

    controls.forEach(function (ctrl) {
      var currentVal = saved[ctrl.varName] !== undefined ? clampVal(saved[ctrl.varName], ctrl) : ctrl.def;

      var row = document.createElement('div');
      row.style.cssText = 'margin-bottom:14px;';

      // Label row with value display
      var labelRow = document.createElement('div');
      labelRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';

      var lbl = document.createElement('label');
      lbl.textContent = ctrl.label;
      lbl.style.cssText = 'font-size:12px;color:#b0aea5;cursor:pointer;';

      var valDisplay = document.createElement('span');
      valDisplay.style.cssText = 'font-size:12px;color:#d97757;font-weight:600;min-width:52px;text-align:right;';
      valDisplay.textContent = currentVal + ctrl.unit;

      labelRow.appendChild(lbl);
      labelRow.appendChild(valDisplay);
      row.appendChild(labelRow);

      // Slider + number input row
      var inputRow = document.createElement('div');
      inputRow.style.cssText = 'display:flex;align-items:center;gap:8px;';

      var range = document.createElement('input');
      range.type = 'range';
      range.min = ctrl.min;
      range.max = ctrl.max;
      range.step = ctrl.step;
      range.value = currentVal;
      range.style.cssText = 'flex:1;accent-color:#d97757;cursor:pointer;';

      var numInput = document.createElement('input');
      numInput.type = 'number';
      numInput.min = ctrl.min;
      numInput.max = ctrl.max;
      numInput.step = ctrl.step;
      numInput.value = currentVal;
      numInput.style.cssText = [
        'width:58px', 'background:#141413', 'color:#faf9f5',
        'border:1px solid rgba(255,255,255,0.15)', 'border-radius:6px',
        'padding:4px 6px', 'font-size:12px', 'text-align:center',
        'font-family:Poppins,sans-serif',
      ].join(';');

      inputRefs[ctrl.varName] = { range: range, numInput: numInput, valDisplay: valDisplay };

      function updateFromVal(rawVal) {
        var v = clampVal(rawVal, ctrl);
        range.value = v;
        numInput.value = v;
        valDisplay.textContent = v + ctrl.unit;
        applyVar(ctrl.varName, v, ctrl.unit);
        saved[ctrl.varName] = v;
        saveAll(saved);
      }

      range.addEventListener('input', function () { updateFromVal(range.value); });
      numInput.addEventListener('input', function () { updateFromVal(numInput.value); });
      numInput.addEventListener('blur', function () { updateFromVal(numInput.value); });

      // Highlight images on hover
      row.addEventListener('mouseenter', function () { highlightGroup(ctrl.group, true); });
      row.addEventListener('mouseleave', function () { highlightGroup(ctrl.group, false); });

      inputRow.appendChild(range);
      inputRow.appendChild(numInput);
      row.appendChild(inputRow);

      // Min/max hint
      var hint = document.createElement('div');
      hint.style.cssText = 'font-size:10px;color:#555550;margin-top:3px;';
      hint.textContent = 'bounds: ' + ctrl.min + ctrl.unit + ' – ' + ctrl.max + ctrl.unit;
      row.appendChild(hint);

      panel.appendChild(row);
    });

    // Separator
    var sep = document.createElement('hr');
    sep.style.cssText = 'border:none;border-top:1px solid rgba(255,255,255,0.08);margin:16px 0 12px;';
    panel.appendChild(sep);

    // Action buttons
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;';

    var resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset defaults';
    resetBtn.style.cssText = [
      'flex:1', 'padding:8px 0', 'background:transparent', 'color:#b0aea5',
      'border:1px solid rgba(255,255,255,0.12)', 'border-radius:8px',
      'font-size:12px', 'cursor:pointer', 'font-family:Poppins,sans-serif',
    ].join(';');
    resetBtn.addEventListener('click', function () {
      controls.forEach(function (ctrl) {
        applyVar(ctrl.varName, ctrl.def, ctrl.unit);
        saved[ctrl.varName] = ctrl.def;
        var refs = inputRefs[ctrl.varName];
        refs.range.value = ctrl.def;
        refs.numInput.value = ctrl.def;
        refs.valDisplay.textContent = ctrl.def + ctrl.unit;
      });
      saveAll(saved);
    });

    var copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy CSS';
    copyBtn.style.cssText = [
      'flex:1', 'padding:8px 0', 'background:#d97757', 'color:#fff',
      'border:none', 'border-radius:8px', 'font-size:12px',
      'cursor:pointer', 'font-weight:600', 'font-family:Poppins,sans-serif',
    ].join(';');
    copyBtn.addEventListener('click', function () {
      var lines = [':root {'];
      controls.forEach(function (ctrl) {
        var v = saved[ctrl.varName] !== undefined ? saved[ctrl.varName] : ctrl.def;
        lines.push('  ' + ctrl.varName + ': ' + v + ctrl.unit + ';');
      });
      lines.push('}');
      var css = lines.join('\n');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(css).then(function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy CSS'; }, 1500);
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = css;
        ta.style.cssText = 'position:fixed;left:-9999px;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = 'Copied!';
        setTimeout(function () { copyBtn.textContent = 'Copy CSS'; }, 1500);
      }
    });

    btnRow.appendChild(resetBtn);
    btnRow.appendChild(copyBtn);
    panel.appendChild(btnRow);

    // Shortcut hint
    var shortcut = document.createElement('div');
    shortcut.style.cssText = 'text-align:center;font-size:10px;color:#555550;margin-top:10px;';
    shortcut.textContent = 'Toggle: Ctrl + Shift + E';
    panel.appendChild(shortcut);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    overlay.addEventListener('click', togglePanel);

    return { panel: panel, overlay: overlay };
  }

  /* ---------- toggle ---------- */

  var els = null;
  var isOpen = false;

  function togglePanel() {
    if (!els) els = buildPanel();
    isOpen = !isOpen;
    els.panel.style.display = isOpen ? 'block' : 'none';
    els.overlay.style.display = isOpen ? 'block' : 'none';
  }

  /* ---------- keyboard shortcut ---------- */

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      togglePanel();
    }
  });

  /* ---------- apply saved values on load ---------- */

  var saved = loadSaved();
  controls.forEach(function (ctrl) {
    if (saved[ctrl.varName] !== undefined) {
      var v = clampVal(saved[ctrl.varName], ctrl);
      applyVar(ctrl.varName, v, ctrl.unit);
    }
  });
})();
