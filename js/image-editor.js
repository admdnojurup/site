/* ========================================
   Image Size Editor Panel  v2
   Toggle: Ctrl + Shift + E

   Two tabs:
     Global  — group-level CSS-variable controls
     Per-image — individual width, height, object-fit, crop position
   Persists to localStorage, enforces min/max, highlights on hover.
   ======================================== */

(function () {
  'use strict';

  /* ===== constants ===== */
  var STORAGE_KEY   = 'nclaude-img-sizes';
  var STORAGE_KEY_I = 'nclaude-img-individual';

  /* ===== group controls (Global tab) ===== */
  var groupControls = [
    { varName: '--img-logo-max-h',  label: 'Client logos — height',  def: 40,  min: 16,  max: 80,  step: 1, unit: 'px', group: 'client-logos' },
    { varName: '--img-logo-max-w',  label: 'Client logos — width',   def: 140, min: 40,  max: 200, step: 1, unit: 'px', group: 'client-logos' },
    { varName: '--img-case-h',      label: 'Case images — height',   def: 180, min: 80,  max: 400, step: 1, unit: 'px', group: 'case-images' },
    { varName: '--img-nav-logo',    label: 'Nav logo size',          def: 32,  min: 20,  max: 56,  step: 1, unit: 'px', group: 'nav-logo' },
    { varName: '--img-footer-logo', label: 'Footer logo size',       def: 28,  min: 18,  max: 48,  step: 1, unit: 'px', group: 'footer-logo' },
  ];

  /* ===== per-image bounds by group ===== */
  var imgBounds = {
    'client-logos':  { w: { min: 20,  max: 220, def: null }, h: { min: 12,  max: 100, def: null } },
    'case-images':   { w: { min: 100, max: 800, def: null }, h: { min: 60,  max: 500, def: null } },
    'nav-logo':      { w: { min: 16,  max: 64,  def: 32  }, h: { min: 16,  max: 64,  def: 32  } },
    'footer-logo':   { w: { min: 14,  max: 56,  def: 28  }, h: { min: 14,  max: 56,  def: 28  } },
  };

  var fitOptions  = ['contain', 'cover', 'fill', 'scale-down', 'none'];
  var posOptions  = [
    'center', 'top', 'bottom', 'left', 'right',
    'top left', 'top right', 'bottom left', 'bottom right',
  ];

  /* ===== helpers ===== */
  function clamp(val, lo, hi) {
    var n = parseFloat(val);
    if (isNaN(n)) return null;
    return Math.min(hi, Math.max(lo, n));
  }

  function loadJSON(key) {
    try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : {}; } catch (_) { return {}; }
  }
  function saveJSON(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (_) { /* quota */ }
  }

  function applyVar(name, val, unit) {
    document.documentElement.style.setProperty(name, val + unit);
  }

  function highlightImg(img, on) {
    if (on) {
      img.style.outline = '2px dashed #d97757';
      img.style.outlineOffset = '3px';
    } else {
      img.style.outline = '';
      img.style.outlineOffset = '';
    }
  }
  function highlightGroup(group, on) {
    document.querySelectorAll('[data-img-group="' + group + '"]').forEach(function (i) { highlightImg(i, on); });
  }

  /* ===== apply per-image overrides ===== */
  function applyIndividual(img, props) {
    if (!props) return;
    var g  = img.getAttribute('data-img-group') || '';
    var b  = imgBounds[g] || { w: { min: 10, max: 1000 }, h: { min: 10, max: 1000 } };

    if (props.width  != null) img.style.width     = clamp(props.width,  b.w.min, b.w.max)  + 'px';
    if (props.height != null) img.style.height    = clamp(props.height, b.h.min, b.h.max) + 'px';
    if (props.fit)            img.style.objectFit      = props.fit;
    if (props.pos)            img.style.objectPosition  = props.pos;
    if (props.scale != null) {
      var s = clamp(props.scale, 10, 300);
      img.style.transform      = 'scale(' + (s / 100) + ')';
      img.style.transformOrigin = props.pos || 'center';
    }
  }

  function applyAllSaved() {
    var gSaved = loadJSON(STORAGE_KEY);
    groupControls.forEach(function (c) {
      if (gSaved[c.varName] !== undefined) {
        var v = clamp(gSaved[c.varName], c.min, c.max);
        if (v != null) applyVar(c.varName, v, c.unit);
      }
    });

    var iSaved = loadJSON(STORAGE_KEY_I);
    Object.keys(iSaved).forEach(function (id) {
      var img = document.querySelector('[data-img-id="' + id + '"]');
      if (img) applyIndividual(img, iSaved[id]);
    });
  }

  /* ===== shared UI helpers ===== */
  var S = {  // reusable style fragments
    input: 'width:58px;background:#141413;color:#faf9f5;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 6px;font-size:12px;text-align:center;font-family:Poppins,sans-serif;',
    select: 'background:#141413;color:#faf9f5;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 6px;font-size:12px;font-family:Poppins,sans-serif;flex:1;',
    label: 'font-size:11px;color:#b0aea5;',
    hint: 'font-size:10px;color:#555550;margin-top:2px;',
    btn: 'padding:8px 0;border-radius:8px;font-size:12px;cursor:pointer;font-family:Poppins,sans-serif;',
    row: 'display:flex;align-items:center;gap:8px;',
    sectionTitle: 'font-size:11px;font-weight:600;color:#d97757;text-transform:uppercase;letter-spacing:0.05em;margin:12px 0 6px;',
  };

  function makeSliderRow(min, max, step, value, onChange) {
    var wrap = document.createElement('div');
    wrap.style.cssText = S.row;

    var range = document.createElement('input');
    range.type = 'range'; range.min = min; range.max = max; range.step = step; range.value = value;
    range.style.cssText = 'flex:1;accent-color:#d97757;cursor:pointer;';

    var num = document.createElement('input');
    num.type = 'number'; num.min = min; num.max = max; num.step = step; num.value = value;
    num.style.cssText = S.input;

    function sync(src) {
      var v = clamp(parseFloat(src), min, max);
      if (v == null) v = value;
      range.value = v; num.value = v;
      onChange(v);
    }
    range.addEventListener('input', function () { sync(range.value); });
    num.addEventListener('input', function ()   { sync(num.value); });
    num.addEventListener('blur', function ()    { sync(num.value); });

    wrap.appendChild(range);
    wrap.appendChild(num);
    return { el: wrap, range: range, num: num, sync: sync };
  }

  function makeSelect(options, value, onChange) {
    var sel = document.createElement('select');
    sel.style.cssText = S.select;
    options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      if (opt === value) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () { onChange(sel.value); });
    return sel;
  }

  function makeLabel(text) {
    var l = document.createElement('div');
    l.style.cssText = S.label;
    l.textContent = text;
    return l;
  }

  function makeSep() {
    var hr = document.createElement('hr');
    hr.style.cssText = 'border:none;border-top:1px solid rgba(255,255,255,0.08);margin:14px 0 10px;';
    return hr;
  }

  /* ===== build panel ===== */
  function buildPanel() {
    var gSaved = loadJSON(STORAGE_KEY);
    var iSaved = loadJSON(STORAGE_KEY_I);

    /* -- overlay -- */
    var overlay = document.createElement('div');
    overlay.id = 'img-editor-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:9998;';

    /* -- panel -- */
    var panel = document.createElement('div');
    panel.id = 'img-editor-panel';
    panel.style.cssText = [
      'display:none', 'position:fixed', 'top:50%', 'right:24px',
      'transform:translateY(-50%)', 'z-index:9999',
      'width:340px', 'max-height:85vh', 'overflow-y:auto',
      'background:#1e1e1d', 'color:#faf9f5',
      'border:1px solid rgba(255,255,255,0.12)', 'border-radius:12px',
      'padding:20px', 'font-family:Poppins,sans-serif', 'font-size:13px',
      'box-shadow:0 8px 40px rgba(0,0,0,0.4)',
    ].join(';');

    /* -- header -- */
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;';
    header.innerHTML = '<span style="font-weight:600;font-size:14px;">Image Size Editor</span>';
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00d7';
    closeBtn.title = 'Close (Ctrl+Shift+E)';
    closeBtn.style.cssText = 'background:none;border:none;color:#faf9f5;font-size:20px;cursor:pointer;padding:0 4px;';
    closeBtn.addEventListener('click', togglePanel);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    /* -- tabs -- */
    var tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;gap:0;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);';

    var tabGlobal = document.createElement('button');
    var tabIndiv  = document.createElement('button');
    var tabStyle  = 'flex:1;padding:8px 0;border:none;background:transparent;font-size:12px;font-family:Poppins,sans-serif;cursor:pointer;color:#b0aea5;border-bottom:2px solid transparent;transition:all .15s;';
    tabGlobal.style.cssText = tabStyle;
    tabIndiv.style.cssText  = tabStyle;
    tabGlobal.textContent = 'Global';
    tabIndiv.textContent  = 'Per Image';

    var contentGlobal = document.createElement('div');
    var contentIndiv  = document.createElement('div');
    contentIndiv.style.display = 'none';

    function setTab(active) {
      var isG = active === 'global';
      contentGlobal.style.display = isG ? 'block' : 'none';
      contentIndiv.style.display  = isG ? 'none'  : 'block';
      tabGlobal.style.color = isG ? '#faf9f5' : '#b0aea5';
      tabGlobal.style.borderBottomColor = isG ? '#d97757' : 'transparent';
      tabIndiv.style.color  = isG ? '#b0aea5' : '#faf9f5';
      tabIndiv.style.borderBottomColor  = isG ? 'transparent' : '#d97757';
    }
    tabGlobal.addEventListener('click', function () { setTab('global'); });
    tabIndiv.addEventListener('click',  function () { setTab('indiv'); });
    setTab('global');

    tabBar.appendChild(tabGlobal);
    tabBar.appendChild(tabIndiv);
    panel.appendChild(tabBar);

    /* ======== GLOBAL TAB ======== */
    var gRefs = {};

    groupControls.forEach(function (ctrl) {
      var cur = gSaved[ctrl.varName] !== undefined ? clamp(gSaved[ctrl.varName], ctrl.min, ctrl.max) : ctrl.def;
      if (cur == null) cur = ctrl.def;

      var block = document.createElement('div');
      block.style.cssText = 'margin-bottom:12px;';

      var lRow = document.createElement('div');
      lRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;';
      var lbl = document.createElement('span');
      lbl.style.cssText = S.label;
      lbl.textContent = ctrl.label;
      var valSpan = document.createElement('span');
      valSpan.style.cssText = 'font-size:12px;color:#d97757;font-weight:600;min-width:52px;text-align:right;';
      valSpan.textContent = cur + ctrl.unit;
      lRow.appendChild(lbl);
      lRow.appendChild(valSpan);
      block.appendChild(lRow);

      var slider = makeSliderRow(ctrl.min, ctrl.max, ctrl.step, cur, function (v) {
        valSpan.textContent = v + ctrl.unit;
        applyVar(ctrl.varName, v, ctrl.unit);
        gSaved[ctrl.varName] = v;
        saveJSON(STORAGE_KEY, gSaved);
      });
      block.appendChild(slider.el);

      var hint = document.createElement('div');
      hint.style.cssText = S.hint;
      hint.textContent = 'bounds: ' + ctrl.min + ctrl.unit + ' \u2013 ' + ctrl.max + ctrl.unit;
      block.appendChild(hint);

      block.addEventListener('mouseenter', function () { highlightGroup(ctrl.group, true); });
      block.addEventListener('mouseleave', function () { highlightGroup(ctrl.group, false); });

      gRefs[ctrl.varName] = { slider: slider, valSpan: valSpan };
      contentGlobal.appendChild(block);
    });

    /* global action buttons */
    contentGlobal.appendChild(makeSep());
    var gBtnRow = document.createElement('div');
    gBtnRow.style.cssText = 'display:flex;gap:8px;';

    var gResetBtn = document.createElement('button');
    gResetBtn.textContent = 'Reset defaults';
    gResetBtn.style.cssText = S.btn + 'flex:1;background:transparent;color:#b0aea5;border:1px solid rgba(255,255,255,0.12);';
    gResetBtn.addEventListener('click', function () {
      groupControls.forEach(function (c) {
        applyVar(c.varName, c.def, c.unit);
        gSaved[c.varName] = c.def;
        var r = gRefs[c.varName];
        r.slider.sync(c.def);
        r.valSpan.textContent = c.def + c.unit;
      });
      saveJSON(STORAGE_KEY, gSaved);
    });

    var gCopyBtn = document.createElement('button');
    gCopyBtn.textContent = 'Copy CSS';
    gCopyBtn.style.cssText = S.btn + 'flex:1;background:#d97757;color:#fff;border:none;font-weight:600;';
    gCopyBtn.addEventListener('click', function () {
      var lines = [':root {'];
      groupControls.forEach(function (c) {
        var v = gSaved[c.varName] !== undefined ? gSaved[c.varName] : c.def;
        lines.push('  ' + c.varName + ': ' + v + c.unit + ';');
      });
      lines.push('}');
      copyText(lines.join('\n'), gCopyBtn);
    });

    gBtnRow.appendChild(gResetBtn);
    gBtnRow.appendChild(gCopyBtn);
    contentGlobal.appendChild(gBtnRow);

    /* ======== PER-IMAGE TAB ======== */
    var allImgs = document.querySelectorAll('[data-img-id]');
    var iRefs   = {};

    if (allImgs.length === 0) {
      var msg = document.createElement('p');
      msg.style.cssText = 'color:#555550;font-size:12px;';
      msg.textContent = 'No images with data-img-id found.';
      contentIndiv.appendChild(msg);
    }

    allImgs.forEach(function (img) {
      var id = img.getAttribute('data-img-id');
      var g  = img.getAttribute('data-img-group') || '';
      var b  = imgBounds[g] || { w: { min: 10, max: 1000 }, h: { min: 10, max: 1000 } };
      var saved = iSaved[id] || {};

      // Compute displayed (natural) dimensions for defaults
      var natW = img.naturalWidth  || img.offsetWidth  || b.w.def || 100;
      var natH = img.naturalHeight || img.offsetHeight || b.h.def || 100;
      var curW = saved.width  != null ? clamp(saved.width,  b.w.min, b.w.max) : null;
      var curH = saved.height != null ? clamp(saved.height, b.h.min, b.h.max) : null;
      var curFit = saved.fit || '';
      var curPos = saved.pos || 'center';
      var curScale = saved.scale != null ? clamp(saved.scale, 10, 300) : 100;

      /* card wrapper */
      var card = document.createElement('div');
      card.style.cssText = 'margin-bottom:14px;padding:10px;border:1px solid rgba(255,255,255,0.06);border-radius:8px;background:rgba(255,255,255,0.02);';

      /* image label: filename extracted from src */
      var filename = (img.getAttribute('src') || id).split('/').pop();
      var title = document.createElement('div');
      title.style.cssText = 'font-size:12px;font-weight:600;color:#faf9f5;margin-bottom:8px;display:flex;align-items:center;gap:6px;';

      var thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.style.cssText = 'width:24px;height:24px;object-fit:contain;border-radius:4px;background:#141413;';
      title.appendChild(thumb);

      var nameSpan = document.createElement('span');
      nameSpan.textContent = filename;
      title.appendChild(nameSpan);
      card.appendChild(title);

      /* width */
      card.appendChild(makeLabel('Width (px)  \u2014  bounds: ' + b.w.min + ' \u2013 ' + b.w.max));
      var wSlider = makeSliderRow(b.w.min, b.w.max, 1, curW != null ? curW : Math.round(Math.min(b.w.max, Math.max(b.w.min, natW))), function (v) {
        if (!iSaved[id]) iSaved[id] = {};
        iSaved[id].width = v;
        img.style.width = v + 'px';
        saveJSON(STORAGE_KEY_I, iSaved);
      });
      card.appendChild(wSlider.el);

      /* height */
      card.appendChild(makeLabel('Height (px)  \u2014  bounds: ' + b.h.min + ' \u2013 ' + b.h.max));
      var hSlider = makeSliderRow(b.h.min, b.h.max, 1, curH != null ? curH : Math.round(Math.min(b.h.max, Math.max(b.h.min, natH))), function (v) {
        if (!iSaved[id]) iSaved[id] = {};
        iSaved[id].height = v;
        img.style.height = v + 'px';
        saveJSON(STORAGE_KEY_I, iSaved);
      });
      card.appendChild(hSlider.el);

      /* scale (%) */
      card.appendChild(makeLabel('Scale (%)  \u2014  bounds: 10 \u2013 300'));
      var scaleSlider = makeSliderRow(10, 300, 1, curScale, function (v) {
        if (!iSaved[id]) iSaved[id] = {};
        iSaved[id].scale = v;
        img.style.transform = 'scale(' + (v / 100) + ')';
        img.style.transformOrigin = iSaved[id].pos || 'center';
        saveJSON(STORAGE_KEY_I, iSaved);
      });
      card.appendChild(scaleSlider.el);

      /* object-fit */
      var fitRow = document.createElement('div');
      fitRow.style.cssText = S.row + 'margin-top:6px;';
      fitRow.appendChild(makeLabel('Fit'));
      fitRow.appendChild(makeSelect(['', ...fitOptions], curFit, function (v) {
        if (!iSaved[id]) iSaved[id] = {};
        iSaved[id].fit = v;
        img.style.objectFit = v;
        saveJSON(STORAGE_KEY_I, iSaved);
      }));
      card.appendChild(fitRow);

      /* object-position (crop anchor) */
      var posRow = document.createElement('div');
      posRow.style.cssText = S.row + 'margin-top:6px;';
      posRow.appendChild(makeLabel('Crop'));
      posRow.appendChild(makeSelect(posOptions, curPos, function (v) {
        if (!iSaved[id]) iSaved[id] = {};
        iSaved[id].pos = v;
        img.style.objectPosition = v;
        img.style.transformOrigin = v;
        saveJSON(STORAGE_KEY_I, iSaved);
      }));
      card.appendChild(posRow);

      /* per-image reset */
      var iResetBtn = document.createElement('button');
      iResetBtn.textContent = 'Reset this image';
      iResetBtn.style.cssText = S.btn + 'width:100%;margin-top:8px;background:transparent;color:#b0aea5;border:1px solid rgba(255,255,255,0.1);font-size:11px;';
      iResetBtn.addEventListener('click', function () {
        delete iSaved[id];
        saveJSON(STORAGE_KEY_I, iSaved);
        img.style.width = '';
        img.style.height = '';
        img.style.objectFit = '';
        img.style.objectPosition = '';
        img.style.transform = '';
        img.style.transformOrigin = '';
        // Reset sliders to natural/default
        var dw = Math.round(Math.min(b.w.max, Math.max(b.w.min, natW)));
        var dh = Math.round(Math.min(b.h.max, Math.max(b.h.min, natH)));
        wSlider.sync(dw);
        hSlider.sync(dh);
        scaleSlider.sync(100);
      });
      card.appendChild(iResetBtn);

      /* highlight on hover */
      card.addEventListener('mouseenter', function () { highlightImg(img, true); });
      card.addEventListener('mouseleave', function () { highlightImg(img, false); });

      iRefs[id] = { wSlider: wSlider, hSlider: hSlider, scaleSlider: scaleSlider };
      contentIndiv.appendChild(card);
    });

    /* per-image: reset all + copy all */
    contentIndiv.appendChild(makeSep());
    var iBtnRow = document.createElement('div');
    iBtnRow.style.cssText = 'display:flex;gap:8px;';

    var iResetAllBtn = document.createElement('button');
    iResetAllBtn.textContent = 'Reset all';
    iResetAllBtn.style.cssText = S.btn + 'flex:1;background:transparent;color:#b0aea5;border:1px solid rgba(255,255,255,0.12);';
    iResetAllBtn.addEventListener('click', function () {
      allImgs.forEach(function (img) {
        img.style.width = '';
        img.style.height = '';
        img.style.objectFit = '';
        img.style.objectPosition = '';
        img.style.transform = '';
        img.style.transformOrigin = '';
      });
      iSaved = {};
      saveJSON(STORAGE_KEY_I, iSaved);
      // Reset all sliders
      allImgs.forEach(function (img) {
        var id = img.getAttribute('data-img-id');
        var g  = img.getAttribute('data-img-group') || '';
        var b  = imgBounds[g] || { w: { min: 10, max: 1000 }, h: { min: 10, max: 1000 } };
        var natW = img.naturalWidth || img.offsetWidth || 100;
        var natH = img.naturalHeight || img.offsetHeight || 100;
        if (iRefs[id]) {
          iRefs[id].wSlider.sync(Math.round(Math.min(b.w.max, Math.max(b.w.min, natW))));
          iRefs[id].hSlider.sync(Math.round(Math.min(b.h.max, Math.max(b.h.min, natH))));
          iRefs[id].scaleSlider.sync(100);
        }
      });
    });

    var iCopyBtn = document.createElement('button');
    iCopyBtn.textContent = 'Copy CSS';
    iCopyBtn.style.cssText = S.btn + 'flex:1;background:#d97757;color:#fff;border:none;font-weight:600;';
    iCopyBtn.addEventListener('click', function () {
      var lines = [];
      Object.keys(iSaved).forEach(function (id) {
        var p = iSaved[id];
        if (!p) return;
        var rules = [];
        if (p.width  != null) rules.push('  width: '           + p.width  + 'px;');
        if (p.height != null) rules.push('  height: '          + p.height + 'px;');
        if (p.fit)            rules.push('  object-fit: '      + p.fit    + ';');
        if (p.pos)            rules.push('  object-position: ' + p.pos    + ';');
        if (p.scale != null && p.scale !== 100) {
          rules.push('  transform: scale(' + (p.scale / 100) + ');');
          rules.push('  transform-origin: ' + (p.pos || 'center') + ';');
        }
        if (rules.length) {
          lines.push('[data-img-id="' + id + '"] {');
          lines = lines.concat(rules);
          lines.push('}');
          lines.push('');
        }
      });
      copyText(lines.join('\n').trim() || '/* no per-image overrides */', iCopyBtn);
    });

    iBtnRow.appendChild(iResetAllBtn);
    iBtnRow.appendChild(iCopyBtn);
    contentIndiv.appendChild(iBtnRow);

    /* ======== assemble ======== */
    panel.appendChild(contentGlobal);
    panel.appendChild(contentIndiv);

    var shortcut = document.createElement('div');
    shortcut.style.cssText = 'text-align:center;font-size:10px;color:#555550;margin-top:12px;';
    shortcut.textContent = 'Toggle: Ctrl + Shift + E';
    panel.appendChild(shortcut);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    overlay.addEventListener('click', togglePanel);

    return { panel: panel, overlay: overlay };
  }

  /* ===== clipboard helper ===== */
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
  var els = null, isOpen = false;
  function togglePanel() {
    if (!els) els = buildPanel();
    isOpen = !isOpen;
    els.panel.style.display   = isOpen ? 'block' : 'none';
    els.overlay.style.display = isOpen ? 'block' : 'none';
  }

  /* ===== keyboard shortcut ===== */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') { e.preventDefault(); togglePanel(); }
  });

  /* ===== on load ===== */
  applyAllSaved();
})();
