/* ========================================
   Tyrimai Page — Interactive Map Explorer
   SVG Map, Filters, Rankings, Detail Panel
   ======================================== */

(function () {
  'use strict';

  // ============================================================
  //  DATA
  // ============================================================

  var countries = {
    IS: {
      name: 'Islandija', rank: '5 / 116', aui: 3.50, aug: 68,
      tasks: [
        ['Kodo derinimas ir refaktoringas', '5.8%'],
        ['Mokslinių tekstų redagavimas', '4.2%'],
        ['Duomenų analizė ir vizualizacija', '3.5%']
      ]
    },
    CH: {
      name: 'Šveicarija', rank: '9 / 116', aui: 3.10, aug: 65,
      tasks: [
        ['Programinės įrangos kūrimas ir derinimas', '5.5%'],
        ['Finansinių duomenų analizė', '4.1%'],
        ['Teksto vertimas ir redagavimas', '3.3%']
      ]
    },
    IE: {
      name: 'Airija', rank: '10 / 116', aui: 2.90, aug: 64,
      tasks: [
        ['Programinės įrangos modifikavimas', '6.1%'],
        ['Turinio kūrimas ir redagavimas', '4.3%'],
        ['Svetainių kūrimas', '3.7%']
      ]
    },
    NL: {
      name: 'Nyderlandai', rank: '11 / 116', aui: 2.80, aug: 63,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.6%'],
        ['Duomenų mokslas ir analizė', '4.0%'],
        ['Verslo dokumentų kūrimas', '3.4%']
      ]
    },
    UK: {
      name: 'Jungtinė Karalystė', rank: '12 / 116', aui: 2.67, aug: 63,
      tasks: [
        ['Programinės įrangos kūrimas ir derinimas', '5.9%'],
        ['Turinio kūrimas ir redagavimas', '4.5%'],
        ['Svetainių ir aplikacijų kūrimas', '3.8%']
      ]
    },
    NO: {
      name: 'Norvegija', rank: '14 / 116', aui: 2.60, aug: 62,
      tasks: [
        ['Kodo derinimas ir refaktoringas', '5.4%'],
        ['Duomenų analizė', '3.9%'],
        ['Techninė dokumentacija', '3.2%']
      ]
    },
    SE: {
      name: 'Švedija', rank: '16 / 116', aui: 2.50, aug: 61,
      tasks: [
        ['Programinės įrangos kūrimas', '5.7%'],
        ['Svetainių ir aplikacijų kūrimas', '4.1%'],
        ['Duomenų analizė ir vizualizacija', '3.4%']
      ]
    },
    FI: {
      name: 'Suomija', rank: '18 / 116', aui: 2.35, aug: 60,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.3%'],
        ['Mokslinė analizė ir tyrimai', '3.8%'],
        ['Turinio kūrimas', '3.1%']
      ]
    },
    EE: {
      name: 'Estija', rank: '19 / 116', aui: 2.30, aug: 60,
      tasks: [
        ['Programinės įrangos kūrimas', '6.5%'],
        ['Svetainių kūrimas ir dizainas', '4.4%'],
        ['Sistemos administravimas', '3.6%']
      ]
    },
    DE: {
      name: 'Vokietija', rank: '17 / 116', aui: 2.30, aug: 60,
      tasks: [
        ['Programinės įrangos modifikavimas', '5.2%'],
        ['Techninė dokumentacija', '3.8%'],
        ['Duomenų analizė', '3.3%']
      ]
    },
    BE: {
      name: 'Belgija', rank: '20 / 116', aui: 2.20, aug: 59,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.0%'],
        ['Dokumentų redagavimas', '3.7%'],
        ['Verslo procesų analizė', '3.1%']
      ]
    },
    FR: {
      name: 'Prancūzija', rank: '19 / 116', aui: 2.20, aug: 59,
      tasks: [
        ['Programinės įrangos kūrimas', '5.1%'],
        ['Turinio kūrimas ir redagavimas', '4.2%'],
        ['Mokymasis ir tyrinėjimas', '3.5%']
      ]
    },
    DK: {
      name: 'Danija', rank: '22 / 116', aui: 2.10, aug: 59,
      tasks: [
        ['Kodo derinimas ir refaktoringas', '5.5%'],
        ['Svetainių kūrimas', '3.8%'],
        ['Verslo dokumentų kūrimas', '3.0%']
      ]
    },
    LT: {
      name: 'Lietuva', rank: '23 / 116', aui: 2.09, aug: 59,
      tasks: [
        ['Kodo derinimas, taisymas ir refaktoringas', '6.3%'],
        ['Produktų paieška ir palyginimas', '4.6%'],
        ['Svetainių ir aplikacijų kūrimas', '3.9%']
      ]
    },
    AT: {
      name: 'Austrija', rank: '25 / 116', aui: 2.00, aug: 58,
      tasks: [
        ['Programinės įrangos kūrimas', '5.0%'],
        ['Duomenų analizė', '3.6%'],
        ['Techninė dokumentacija', '3.0%']
      ]
    },
    LV: {
      name: 'Latvija', rank: '30 / 116', aui: 1.80, aug: 57,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.8%'],
        ['Svetainių kūrimas', '4.0%'],
        ['Mokymasis ir tyrinėjimas', '3.5%']
      ]
    },
    SI: {
      name: 'Slovėnija', rank: '34 / 116', aui: 1.70, aug: 56,
      tasks: [
        ['Programinės įrangos kūrimas', '5.2%'],
        ['Duomenų analizė', '3.5%'],
        ['Mokymasis ir tyrinėjimas', '3.2%']
      ]
    },
    CZ: {
      name: 'Čekija', rank: '38 / 116', aui: 1.60, aug: 56,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.4%'],
        ['Svetainių kūrimas', '3.8%'],
        ['Sistemos administravimas', '3.1%']
      ]
    },
    PT: {
      name: 'Portugalija', rank: '42 / 116', aui: 1.50, aug: 55,
      tasks: [
        ['Programinės įrangos kūrimas', '5.0%'],
        ['Turinio kūrimas ir redagavimas', '3.8%'],
        ['Svetainių kūrimas', '3.3%']
      ]
    },
    SK: {
      name: 'Slovakija', rank: '44 / 116', aui: 1.45, aug: 55,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.5%'],
        ['Svetainių kūrimas', '3.7%'],
        ['Mokymasis ir tyrinėjimas', '3.2%']
      ]
    },
    ES: {
      name: 'Ispanija', rank: '45 / 116', aui: 1.40, aug: 54,
      tasks: [
        ['Programinės įrangos kūrimas', '4.8%'],
        ['Turinio kūrimas ir redagavimas', '4.0%'],
        ['Mokymasis ir tyrinėjimas', '3.5%']
      ]
    },
    IT: {
      name: 'Italija', rank: '48 / 116', aui: 1.30, aug: 54,
      tasks: [
        ['Kodo derinimas ir taisymas', '4.6%'],
        ['Turinio kūrimas', '3.8%'],
        ['Mokymasis ir studijos', '3.5%']
      ]
    },
    PL: {
      name: 'Lenkija', rank: '52 / 116', aui: 1.20, aug: 53,
      tasks: [
        ['Programinės įrangos kūrimas', '5.2%'],
        ['Svetainių kūrimas', '3.9%'],
        ['Mokymasis ir tyrinėjimas', '3.6%']
      ]
    },
    HU: {
      name: 'Vengrija', rank: '55 / 116', aui: 1.10, aug: 52,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.3%'],
        ['Mokymasis ir tyrinėjimas', '4.0%'],
        ['Svetainių kūrimas', '3.4%']
      ]
    },
    RS: {
      name: 'Serbija', rank: '56 / 116', aui: 1.05, aug: 52,
      tasks: [
        ['Programinės įrangos kūrimas', '5.5%'],
        ['Svetainių kūrimas', '4.0%'],
        ['Mokymasis ir tyrinėjimas', '3.6%']
      ]
    },
    HR: {
      name: 'Kroatija', rank: '58 / 116', aui: 1.00, aug: 52,
      tasks: [
        ['Programinės įrangos kūrimas', '5.0%'],
        ['Mokymasis ir tyrinėjimas', '4.2%'],
        ['Turinio kūrimas', '3.3%']
      ]
    },
    GR: {
      name: 'Graikija', rank: '60 / 116', aui: 1.00, aug: 52,
      tasks: [
        ['Kodo derinimas ir taisymas', '4.8%'],
        ['Mokymasis ir studijos', '4.5%'],
        ['Turinio kūrimas', '3.2%']
      ]
    },
    RO: {
      name: 'Rumunija', rank: '65 / 116', aui: 0.80, aug: 50,
      tasks: [
        ['Programinės įrangos kūrimas', '5.6%'],
        ['Svetainių kūrimas', '4.2%'],
        ['Mokymasis ir tyrinėjimas', '3.8%']
      ]
    },
    BG: {
      name: 'Bulgarija', rank: '72 / 116', aui: 0.65, aug: 49,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.4%'],
        ['Mokymasis ir tyrinėjimas', '4.5%'],
        ['Svetainių kūrimas', '3.8%']
      ]
    }
  };

  var jobCategories = {
    computer: {
      title: 'Kompiuteriai ir matematika', pct: '37.2%',
      desc: 'Didžiausia AI naudojimo kategorija. Apima programinės įrangos kūrimą, derinimą, duomenų mokslą, tinklų administravimą ir matematinę analizę.',
      tasks: [
        ['Programinės įrangos modifikavimas ir klaidų taisymas', '4.79%'],
        ['Klaidų tikrinimas ir derinimas', '3.00%'],
        ['Sistemos administravimas ir trikčių šalinimas', '1.81%'],
        ['Naujų programų kūrimas pagal reikalavimus', '1.46%'],
        ['Svetainių projektavimas ir kūrimas', '1.19%']
      ]
    },
    education: {
      title: 'Švietimas ir bibliotekos', pct: '12.0%',
      desc: 'Sparčiausiai auganti kategorija. AI naudojamas mokomosios medžiagos kūrimui, studentų konsultavimui, mokymosi pritaikymui ir akademiniam rašymui.',
      tasks: [
        ['Mokymo medžiagos pritaikymas skirtingiems lygiams', '0.13%'],
        ['Mokymo metodų pritaikymas studentų poreikiams', '0.10%'],
        ['Medžiagos peržiūra su studentais', '0.08%'],
        ['Standartizuotų testų administravimas', '0.07%'],
        ['Studentų organizacijų konsultavimas', '0.05%']
      ]
    },
    arts: {
      title: 'Menas, dizainas, medija', pct: '10.3%',
      desc: 'Antra pagal dydį kategorija. Apima teksto kūrimą ir redagavimą, turinio rašymą, kūrybinį dizainą ir medijos produkciją.',
      tasks: [
        ['Dokumentų redagavimas ir publikavimas', '1.41%'],
        ['Teksto perrašymas ir skaitymo gerinimas', '1.00%'],
        ['Teksto redagavimas ir patvirtinimas', '0.85%'],
        ['Teksto redagavimas ir pateikimas tvirtinti', '0.76%'],
        ['Scenarijų ir tekstų adaptavimas', '0.22%']
      ]
    },
    management: {
      title: 'Valdymas', pct: '7.8%',
      desc: 'Vadovai naudoja AI strateginiam planavimui, ataskaitų analizei, komunikacijai ir sprendimų priėmimui. Vidutinė automatizacijos tikimybė — tik 15.8%.',
      tasks: [
        ['Operacijų analizė ir efektyvumo vertinimas', '0.08%'],
        ['Biudžetų rengimas ir tvirtinimas', '0.06%'],
        ['Personalo veiklos koordinavimas', '0.05%'],
        ['Ataskaitų peržiūra ir rekomendacijos', '0.04%'],
        ['Politikų ir tikslų įgyvendinimas', '0.04%']
      ]
    },
    business: {
      title: 'Verslas ir finansai', pct: '6.2%',
      desc: 'Finansinė analizė, apskaita, auditas, verslo konsultavimas ir rinkos tyrimai. Vidutinė automatizacijos tikimybė — 56.1%.',
      tasks: [
        ['Finansinių ataskaitų rengimas', '0.06%'],
        ['Rinkos tyrimų analizė', '0.05%'],
        ['Sutarčių peržiūra ir derybos', '0.04%'],
        ['Verslo planų rengimas', '0.04%'],
        ['Mokesčių dokumentų tvarkymas', '0.03%']
      ]
    },
    science: {
      title: 'Mokslas', pct: '5.1%',
      desc: 'Moksliniai tyrimai, laboratorinė analizė, duomenų apdorojimas ir mokslinių publikacijų rengimas.',
      tasks: [
        ['Matematinė ir statistinė analizė', '0.20%'],
        ['Tyrimų planavimas ir duomenų rinkimas', '0.08%'],
        ['Mokslinių rezultatų interpretavimas', '0.06%'],
        ['Laboratorinės įrangos priežiūra', '0.04%'],
        ['Mokslinių tekstų rengimas', '0.03%']
      ]
    },
    legal: {
      title: 'Teisė', pct: '4.5%',
      desc: 'Teisinių dokumentų analizė, sutarčių peržiūra, teisės aktų interpretavimas ir teisinių konsultacijų rengimas.',
      tasks: [
        ['Teisinių dokumentų analizė ir peržiūra', '0.06%'],
        ['Sutarčių rengimas ir derybos', '0.05%'],
        ['Teisės aktų interpretavimas', '0.04%'],
        ['Teisinių konsultacijų rengimas', '0.03%'],
        ['Bylų tyrimas ir analizė', '0.03%']
      ]
    },
    office: {
      title: 'Biuro administracija', pct: '3.7%',
      desc: 'Administracinės užduotys, dokumentų tvarkymas, duomenų įvedimas ir biuro procesų valdymas. Aukščiausia automatizacijos tikimybė — 83.9%.',
      tasks: [
        ['Dokumentų ir sistemų prieigos valdymas', '0.03%'],
        ['Administracinių sistemų priežiūra', '0.02%'],
        ['Duomenų įvedimas ir tvarkymas', '0.02%'],
        ['Susirašinėjimo ir korespondencijos valdymas', '0.02%'],
        ['Ataskaitų generavimas', '0.01%']
      ]
    },
    healthcare: {
      title: 'Sveikatos apsauga', pct: '3.4%',
      desc: 'Medicininė dokumentacija, pacientų konsultavimas, sveikatos duomenų analizė. Žema automatizacijos tikimybė — 18.8%.',
      tasks: [
        ['Medicininės dokumentacijos tvarkymas', '0.04%'],
        ['Pacientų konsultavimas', '0.03%'],
        ['Sveikatos duomenų analizė', '0.02%'],
        ['Gydymo planų rengimas', '0.02%'],
        ['Mokslinės literatūros apžvalga', '0.02%']
      ]
    },
    sales: {
      title: 'Pardavimai', pct: '2.8%',
      desc: 'Pardavimų strategijos, klientų komunikacija, pasiūlymų rengimas ir rinkos analizė.',
      tasks: [
        ['Pardavimų scenarijų pritaikymas klientams', '0.03%'],
        ['Komercinių pasiūlymų rengimas', '0.02%'],
        ['Rinkos analizė ir konkurentų stebėjimas', '0.02%'],
        ['Klientų komunikacija', '0.01%'],
        ['Pardavimų ataskaitų rengimas', '0.01%']
      ]
    },
    other: {
      title: 'Kitos kategorijos', pct: '7.0%',
      desc: 'Apima gamybą, transportą, statybą, žemės ūkį, asmenines paslaugas ir kitas sritis su mažesniu AI naudojimo lygiu.',
      tasks: [
        ['Gamybos procesų dokumentavimas', '0.02%'],
        ['Transporto logistikos planavimas', '0.02%'],
        ['Statybos projektų dokumentacija', '0.01%'],
        ['Aplinkosaugos ataskaitų rengimas', '0.01%'],
        ['Saugos instrukcijų kūrimas', '0.01%']
      ]
    }
  };

  // ============================================================
  //  COLOR SCALES
  // ============================================================

  var usageScale = [
    { min: 2.8, fill: '#1a7f6d', text: '#fff' },
    { min: 2.2, fill: '#3a9e8b', text: '#fff' },
    { min: 1.6, fill: '#5cb8a5', text: '#0a3d33' },
    { min: 1.2, fill: '#8ad0c0', text: '#0a3d33' },
    { min: 0.8, fill: '#b3e2d6', text: '#0a3d33' },
    { min: 0,   fill: '#d6f0e8', text: '#3a6b5e' }
  ];

  var augScale = [
    { min: 64, fill: '#1a7f6d', text: '#fff' },
    { min: 60, fill: '#3a9e8b', text: '#fff' },
    { min: 57, fill: '#6bb5a3', text: '#0a3d33' },
    { min: 54, fill: '#c4b896', text: '#3a3d1a' },
    { min: 51, fill: '#d4a574', text: '#3a2a1a' },
    { min: 0,  fill: '#d97757', text: '#fff' }
  ];

  function getTier(value, scale) {
    for (var i = 0; i < scale.length; i++) {
      if (value >= scale[i].min) return scale[i];
    }
    return scale[scale.length - 1];
  }

  // ============================================================
  //  STATE
  // ============================================================

  var activeFilter = 'usage';
  var activeCountry = 'LT';

  // ============================================================
  //  DOM REFERENCES
  // ============================================================

  var tiles = document.querySelectorAll('.geo-tile');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var detailPanel = document.getElementById('explorer-detail');
  var infoPanel = document.getElementById('explorer-info');
  var rankingGrid = document.getElementById('ranking-grid');
  var rankingTitle = document.getElementById('ranking-title');
  var legendEl = document.getElementById('map-legend');
  var contextAug = document.getElementById('context-augmentation');
  var contextJobs = document.getElementById('context-jobs');

  // ============================================================
  //  UPDATE MAP COLORS
  // ============================================================

  function updateMapColors() {
    tiles.forEach(function (tile) {
      var code = tile.getAttribute('data-country');
      var data = countries[code];
      if (!data) return;

      var rect = tile.querySelector('rect');
      var text = tile.querySelector('text');
      var tier;

      if (activeFilter === 'augmentation') {
        tier = getTier(data.aug, augScale);
      } else {
        tier = getTier(data.aui, usageScale);
      }

      rect.setAttribute('fill', tier.fill);
      text.setAttribute('fill', tier.text);
    });
  }

  // ============================================================
  //  UPDATE DETAIL PANEL
  // ============================================================

  function updateDetail() {
    var data = countries[activeCountry];
    if (!data) return;

    var html = '';

    if (activeFilter === 'usage' || activeFilter === 'jobs') {
      var barWidth = Math.min(data.aui / 4.0 * 100, 100);
      html =
        '<h2 class="detail__name">' + data.name + '</h2>' +
        '<div class="detail__stats">' +
          '<div class="detail__stat">' +
            '<span class="detail__stat-value">' + data.rank + '</span>' +
            '<span class="detail__stat-label">Naudojimo reitingas</span>' +
          '</div>' +
          '<div class="detail__stat">' +
            '<span class="detail__stat-value">' + data.aui.toFixed(2) + 'x</span>' +
            '<span class="detail__stat-label">Naudojimo indeksas</span>' +
          '</div>' +
        '</div>' +
        '<div class="detail__bar">' +
          '<div class="detail__bar-label">AI naudojimo indeksas (AUI)</div>' +
          '<div class="detail__bar-track">' +
            '<div class="detail__bar-fill" style="width:' + barWidth + '%"></div>' +
            '<div class="detail__bar-marker"></div>' +
          '</div>' +
        '</div>' +
        '<div class="detail__tasks">' +
          '<h3 class="detail__tasks-title">Populiariausios užduotys</h3>';

      data.tasks.forEach(function (task, i) {
        html +=
          '<div class="detail__task">' +
            '<span class="detail__task-num">' + (i + 1) + '.</span>' +
            '<span class="detail__task-text">' + task[0] + '</span>' +
            '<span class="detail__task-pct">' + task[1] + '</span>' +
          '</div>';
      });
      html += '</div>';

    } else if (activeFilter === 'augmentation') {
      var autoP = 100 - data.aug;
      var note;
      if (data.aug >= 60) {
        note = 'Ši šalis rodo stiprų augmentacijos modelį — AI daugiau naudojamas kaip pagalbininkas nei kaip pakaitininkas.';
      } else if (data.aug >= 54) {
        note = 'Mišrus naudojimo modelis — tiek augmentacija, tiek automatizacija yra svarbios šioje rinkoje.';
      } else {
        note = 'Šioje šalyje dominuoja automatizacinis naudojimas — AI dažniau naudojamas užduotims atlikti savarankiškai.';
      }

      html =
        '<h2 class="detail__name">' + data.name + '</h2>' +
        '<div class="detail__aug-split">' +
          '<div class="detail__aug-bar">' +
            '<div class="detail__aug-seg detail__aug-seg--aug" style="flex:' + data.aug + '">' +
              '<span>' + data.aug + '%</span>' +
            '</div>' +
            '<div class="detail__aug-seg detail__aug-seg--auto" style="flex:' + autoP + '">' +
              '<span>' + autoP + '%</span>' +
            '</div>' +
          '</div>' +
          '<div class="detail__aug-labels">' +
            '<span>Augmentacija</span>' +
            '<span>Automatizacija</span>' +
          '</div>' +
        '</div>' +
        '<div class="detail__stats">' +
          '<div class="detail__stat">' +
            '<span class="detail__stat-value">' + data.aui.toFixed(2) + 'x</span>' +
            '<span class="detail__stat-label">Naudojimo indeksas</span>' +
          '</div>' +
          '<div class="detail__stat">' +
            '<span class="detail__stat-value">' + data.rank + '</span>' +
            '<span class="detail__stat-label">Reitingas</span>' +
          '</div>' +
        '</div>' +
        '<p class="detail__aug-note">' + note + '</p>';
    }

    html +=
      '<p class="detail__source">' +
        'Šaltiniai: <a href="https://www.anthropic.com/economic-index" target="_blank" rel="noopener">Anthropic</a>, O*NET, BLS' +
      '</p>';

    detailPanel.innerHTML = html;
  }

  // ============================================================
  //  UPDATE RANKING LIST
  // ============================================================

  function updateRanking() {
    var sorted = Object.keys(countries).map(function (code) {
      return { code: code, data: countries[code] };
    });

    if (activeFilter === 'augmentation') {
      sorted.sort(function (a, b) { return b.data.aug - a.data.aug; });
      rankingTitle.textContent = 'Šalių reitingas pagal augmentaciją';
    } else {
      sorted.sort(function (a, b) { return b.data.aui - a.data.aui; });
      rankingTitle.textContent = 'Šalių reitingas pagal AI naudojimą';
    }

    var html = '';
    sorted.forEach(function (item) {
      var value, barWidth, tier;

      if (activeFilter === 'augmentation') {
        value = item.data.aug + '%';
        barWidth = Math.max(((item.data.aug - 45) / 25) * 100, 5);
        tier = getTier(item.data.aug, augScale);
      } else {
        value = item.data.aui.toFixed(2);
        barWidth = Math.max((item.data.aui / 3.5) * 100, 5);
        tier = getTier(item.data.aui, usageScale);
      }

      html +=
        '<div class="ranking-item' + (item.code === activeCountry ? ' ranking-item--active' : '') + '" data-country="' + item.code + '">' +
          '<span class="ranking-name">' + item.data.name + '</span>' +
          '<div class="ranking-bar">' +
            '<div class="ranking-bar__fill" style="width:' + barWidth + '%;background:' + tier.fill + '"></div>' +
          '</div>' +
          '<span class="ranking-value">' + value + '</span>' +
        '</div>';
    });

    rankingGrid.innerHTML = html;

    // Attach click handlers
    var items = rankingGrid.querySelectorAll('.ranking-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        selectCountry(this.getAttribute('data-country'));
      });
    });
  }

  // ============================================================
  //  FILTER INFO / LEGEND / CONTEXT
  // ============================================================

  var filterMeta = {
    usage: {
      title: 'AI naudojimo indeksas',
      desc: 'Matuoja, ar šalis naudoja AI daugiau (>1) ar mažiau (<1) nei tikėtina pagal populiaciją. Kuo didesnis skaičius, tuo aktyviau šalis naudoja AI.',
      legendEnd: 'Daugiau AI naudojimo'
    },
    augmentation: {
      title: 'Augmentacija vs. Automatizacija',
      desc: 'Augmentacija — AI padeda žmogui dirbti efektyviau. Automatizacija — AI atlieka užduotį savarankiškai. Šalys su didesniu naudojimu dažniau renkasi augmentaciją.',
      legendEnd: 'Daugiau augmentacijos'
    },
    jobs: {
      title: 'Profesijų naudojimas',
      desc: 'Kuriose profesijose AI naudojamas daugiausiai? Paspauskite ant šalies žemėlapyje ir peržiūrėkite profesijų kategorijas žemiau.',
      legendEnd: 'Daugiau AI naudojimo'
    }
  };

  function updateFilterInfo() {
    var meta = filterMeta[activeFilter];
    infoPanel.innerHTML =
      '<h2 class="explorer__info-title">' + meta.title + '</h2>' +
      '<p class="explorer__info-desc">' + meta.desc + '</p>';
  }

  function updateLegend() {
    var scale = activeFilter === 'augmentation' ? augScale : usageScale;
    var meta = filterMeta[activeFilter];
    var html = '<span>Mažiau</span><div class="legend-scale">';
    for (var i = scale.length - 1; i >= 0; i--) {
      html += '<div class="legend-swatch" style="background:' + scale[i].fill + '"></div>';
    }
    html += '</div><span>' + meta.legendEnd + '</span>';
    legendEl.innerHTML = html;
  }

  function updateContextPanels() {
    contextAug.style.display = activeFilter === 'augmentation' ? 'block' : 'none';
    contextJobs.style.display = activeFilter === 'jobs' ? 'block' : 'none';
  }

  // ============================================================
  //  SELECT COUNTRY / SWITCH FILTER
  // ============================================================

  function selectCountry(code) {
    activeCountry = code;
    tiles.forEach(function (t) { t.classList.remove('active'); });
    var tile = document.querySelector('.geo-tile[data-country="' + code + '"]');
    if (tile) tile.classList.add('active');
    updateDetail();
    updateRanking();
  }

  function switchFilter(filter) {
    activeFilter = filter;
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('filter-btn--active', btn.getAttribute('data-filter') === filter);
    });
    updateMapColors();
    updateDetail();
    updateRanking();
    updateFilterInfo();
    updateLegend();
    updateContextPanels();
  }

  // ============================================================
  //  JOB EXPLORER (treemap interaction)
  // ============================================================

  var treemapItems = document.querySelectorAll('.treemap__item');
  var jobDetailTitle = document.getElementById('job-detail-title');
  var jobDetailPct = document.getElementById('job-detail-pct');
  var jobDetailDesc = document.getElementById('job-detail-desc');
  var jobDetailTasks = document.getElementById('job-detail-tasks');

  function selectJob(jobKey) {
    var data = jobCategories[jobKey];
    if (!data) return;

    treemapItems.forEach(function (item) { item.classList.remove('active'); });
    var el = document.querySelector('[data-job="' + jobKey + '"]');
    if (el) el.classList.add('active');

    jobDetailTitle.textContent = data.title;
    jobDetailPct.textContent = data.pct;
    jobDetailDesc.textContent = data.desc;

    var tasksHtml = '';
    data.tasks.forEach(function (task) {
      tasksHtml +=
        '<li>' +
          '<span class="task-text">' + task[0] + '</span>' +
          '<span class="task-pct">' + task[1] + '</span>' +
        '</li>';
    });
    jobDetailTasks.innerHTML = tasksHtml;
  }

  treemapItems.forEach(function (item) {
    item.addEventListener('click', function () {
      selectJob(this.getAttribute('data-job'));
    });
  });

  // ============================================================
  //  EVENT LISTENERS
  // ============================================================

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchFilter(this.getAttribute('data-filter'));
    });
  });

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      selectCountry(this.getAttribute('data-country'));
    });
  });

  // ============================================================
  //  INIT
  // ============================================================

  updateMapColors();
  updateFilterInfo();
  updateLegend();
  updateContextPanels();
  selectCountry('LT');

})();
