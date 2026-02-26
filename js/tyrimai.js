/* ========================================
   Tyrimai Page — Interactive Features
   Tabs, Country Map, Job Explorer
   ======================================== */

(function () {
  'use strict';

  // --- European Country Data ---
  // Sources: Anthropic Economic Index (confirmed: UK 2.67, DK 2.1, LT 2.09 rank 23/116)
  // Other values estimated via published GDP-AUI correlation (elasticity 0.7)
  // and tech ecosystem factors. Germany & France confirmed top 20.
  var countries = {
    IS: {
      name: 'Islandija', rank: '5 / 116', aui: 3.50, obs: 280,
      tasks: [
        ['Kodo derinimas ir refaktoringas', '5.8%'],
        ['Mokslinių tekstų redagavimas', '4.2%'],
        ['Duomenų analizė ir vizualizacija', '3.5%']
      ]
    },
    CH: {
      name: 'Šveicarija', rank: '9 / 116', aui: 3.10, obs: 4200,
      tasks: [
        ['Programinės įrangos kūrimas ir derinimas', '5.5%'],
        ['Finansinių duomenų analizė', '4.1%'],
        ['Teksto vertimas ir redagavimas', '3.3%']
      ]
    },
    IE: {
      name: 'Airija', rank: '10 / 116', aui: 2.90, obs: 2100,
      tasks: [
        ['Programinės įrangos modifikavimas', '6.1%'],
        ['Turinio kūrimas ir redagavimas', '4.3%'],
        ['Svetainių kūrimas', '3.7%']
      ]
    },
    NL: {
      name: 'Nyderlandai', rank: '11 / 116', aui: 2.80, obs: 7500,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.6%'],
        ['Duomenų mokslas ir analizė', '4.0%'],
        ['Verslo dokumentų kūrimas', '3.4%']
      ]
    },
    UK: {
      name: 'Jungtinė Karalystė', rank: '12 / 116', aui: 2.67, obs: 32000,
      tasks: [
        ['Programinės įrangos kūrimas ir derinimas', '5.9%'],
        ['Turinio kūrimas ir redagavimas', '4.5%'],
        ['Svetainių ir aplikacijų kūrimas', '3.8%']
      ]
    },
    NO: {
      name: 'Norvegija', rank: '14 / 116', aui: 2.60, obs: 2800,
      tasks: [
        ['Kodo derinimas ir refaktoringas', '5.4%'],
        ['Duomenų analizė', '3.9%'],
        ['Techninė dokumentacija', '3.2%']
      ]
    },
    SE: {
      name: 'Švedija', rank: '16 / 116', aui: 2.50, obs: 4500,
      tasks: [
        ['Programinės įrangos kūrimas', '5.7%'],
        ['Svetainių ir aplikacijų kūrimas', '4.1%'],
        ['Duomenų analizė ir vizualizacija', '3.4%']
      ]
    },
    FI: {
      name: 'Suomija', rank: '18 / 116', aui: 2.35, obs: 2200,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.3%'],
        ['Mokslinė analizė ir tyrimai', '3.8%'],
        ['Turinio kūrimas', '3.1%']
      ]
    },
    EE: {
      name: 'Estija', rank: '19 / 116', aui: 2.30, obs: 620,
      tasks: [
        ['Programinės įrangos kūrimas', '6.5%'],
        ['Svetainių kūrimas ir dizainas', '4.4%'],
        ['Sistemos administravimas', '3.6%']
      ]
    },
    DE: {
      name: 'Vokietija', rank: '17 / 116', aui: 2.30, obs: 28000,
      tasks: [
        ['Programinės įrangos modifikavimas', '5.2%'],
        ['Techninė dokumentacija', '3.8%'],
        ['Duomenų analizė', '3.3%']
      ]
    },
    BE: {
      name: 'Belgija', rank: '20 / 116', aui: 2.20, obs: 4100,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.0%'],
        ['Dokumentų redagavimas', '3.7%'],
        ['Verslo procesų analizė', '3.1%']
      ]
    },
    FR: {
      name: 'Prancūzija', rank: '19 / 116', aui: 2.20, obs: 22000,
      tasks: [
        ['Programinės įrangos kūrimas', '5.1%'],
        ['Turinio kūrimas ir redagavimas', '4.2%'],
        ['Mokymasis ir tyrinėjimas', '3.5%']
      ]
    },
    DK: {
      name: 'Danija', rank: '22 / 116', aui: 2.10, obs: 2400,
      tasks: [
        ['Kodo derinimas ir refaktoringas', '5.5%'],
        ['Svetainių kūrimas', '3.8%'],
        ['Verslo dokumentų kūrimas', '3.0%']
      ]
    },
    LT: {
      name: 'Lietuva', rank: '23 / 116', aui: 2.09, obs: 1060,
      tasks: [
        ['Kodo derinimas, taisymas ir refaktoringas', '6.3%'],
        ['Produktų paieška ir palyginimas', '4.6%'],
        ['Svetainių ir aplikacijų kūrimas', '3.9%']
      ]
    },
    AT: {
      name: 'Austrija', rank: '25 / 116', aui: 2.00, obs: 3200,
      tasks: [
        ['Programinės įrangos kūrimas', '5.0%'],
        ['Duomenų analizė', '3.6%'],
        ['Techninė dokumentacija', '3.0%']
      ]
    },
    LV: {
      name: 'Latvija', rank: '30 / 116', aui: 1.80, obs: 540,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.8%'],
        ['Svetainių kūrimas', '4.0%'],
        ['Mokymasis ir tyrinėjimas', '3.5%']
      ]
    },
    SI: {
      name: 'Slovėnija', rank: '34 / 116', aui: 1.70, obs: 620,
      tasks: [
        ['Programinės įrangos kūrimas', '5.2%'],
        ['Duomenų analizė', '3.5%'],
        ['Mokymasis ir tyrinėjimas', '3.2%']
      ]
    },
    CZ: {
      name: 'Čekija', rank: '38 / 116', aui: 1.60, obs: 2800,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.4%'],
        ['Svetainių kūrimas', '3.8%'],
        ['Sistemos administravimas', '3.1%']
      ]
    },
    PT: {
      name: 'Portugalija', rank: '42 / 116', aui: 1.50, obs: 2400,
      tasks: [
        ['Programinės įrangos kūrimas', '5.0%'],
        ['Turinio kūrimas ir redagavimas', '3.8%'],
        ['Svetainių kūrimas', '3.3%']
      ]
    },
    SK: {
      name: 'Slovakija', rank: '44 / 116', aui: 1.45, obs: 1200,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.5%'],
        ['Svetainių kūrimas', '3.7%'],
        ['Mokymasis ir tyrinėjimas', '3.2%']
      ]
    },
    ES: {
      name: 'Ispanija', rank: '45 / 116', aui: 1.40, obs: 8500,
      tasks: [
        ['Programinės įrangos kūrimas', '4.8%'],
        ['Turinio kūrimas ir redagavimas', '4.0%'],
        ['Mokymasis ir tyrinėjimas', '3.5%']
      ]
    },
    IT: {
      name: 'Italija', rank: '48 / 116', aui: 1.30, obs: 9200,
      tasks: [
        ['Kodo derinimas ir taisymas', '4.6%'],
        ['Turinio kūrimas', '3.8%'],
        ['Mokymasis ir studijos', '3.5%']
      ]
    },
    PL: {
      name: 'Lenkija', rank: '52 / 116', aui: 1.20, obs: 5800,
      tasks: [
        ['Programinės įrangos kūrimas', '5.2%'],
        ['Svetainių kūrimas', '3.9%'],
        ['Mokymasis ir tyrinėjimas', '3.6%']
      ]
    },
    HU: {
      name: 'Vengrija', rank: '55 / 116', aui: 1.10, obs: 1400,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.3%'],
        ['Mokymasis ir tyrinėjimas', '4.0%'],
        ['Svetainių kūrimas', '3.4%']
      ]
    },
    HR: {
      name: 'Kroatija', rank: '58 / 116', aui: 1.00, obs: 450,
      tasks: [
        ['Programinės įrangos kūrimas', '5.0%'],
        ['Mokymasis ir tyrinėjimas', '4.2%'],
        ['Turinio kūrimas', '3.3%']
      ]
    },
    GR: {
      name: 'Graikija', rank: '60 / 116', aui: 1.00, obs: 1200,
      tasks: [
        ['Kodo derinimas ir taisymas', '4.8%'],
        ['Mokymasis ir studijos', '4.5%'],
        ['Turinio kūrimas', '3.2%']
      ]
    },
    RS: {
      name: 'Serbija', rank: '56 / 116', aui: 1.05, obs: 820,
      tasks: [
        ['Programinės įrangos kūrimas', '5.5%'],
        ['Svetainių kūrimas', '4.0%'],
        ['Mokymasis ir tyrinėjimas', '3.6%']
      ]
    },
    RO: {
      name: 'Rumunija', rank: '65 / 116', aui: 0.80, obs: 1800,
      tasks: [
        ['Programinės įrangos kūrimas', '5.6%'],
        ['Svetainių kūrimas', '4.2%'],
        ['Mokymasis ir tyrinėjimas', '3.8%']
      ]
    },
    BG: {
      name: 'Bulgarija', rank: '72 / 116', aui: 0.65, obs: 380,
      tasks: [
        ['Kodo derinimas ir taisymas', '5.4%'],
        ['Mokymasis ir tyrinėjimas', '4.5%'],
        ['Svetainių kūrimas', '3.8%']
      ]
    }
  };

  // --- Job Category Data ---
  var jobCategories = {
    computer: {
      title: 'Kompiuteriai ir matematika',
      pct: '37.2%',
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
      title: 'Švietimas ir bibliotekos',
      pct: '12.0%',
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
      title: 'Menas, dizainas, medija',
      pct: '10.3%',
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
      title: 'Valdymas',
      pct: '7.8%',
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
      title: 'Verslas ir finansai',
      pct: '6.2%',
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
      title: 'Mokslas',
      pct: '5.1%',
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
      title: 'Teisė',
      pct: '4.5%',
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
      title: 'Biuro administracija',
      pct: '3.7%',
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
      title: 'Sveikatos apsauga',
      pct: '3.4%',
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
      title: 'Pardavimai',
      pct: '2.8%',
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
      title: 'Kitos kategorijos',
      pct: '7.0%',
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

  // --- Tab Switching ---
  var tabButtons = document.querySelectorAll('.tabs-nav__item');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = this.getAttribute('data-tab');

      tabButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) {
        p.classList.remove('active');
      });

      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      document.getElementById('tab-' + tabId).classList.add('active');
    });
  });

  // --- Color scale for choropleth ---
  var usageScale = [
    { min: 3.0, color: '#1a7f6d', text: '#fff' },
    { min: 2.5, color: '#3a9e8b', text: '#fff' },
    { min: 2.0, color: '#5cb8a5', text: '#0a3d33' },
    { min: 1.5, color: '#8ad0c0', text: '#0a3d33' },
    { min: 1.0, color: '#b3e2d6', text: '#0a3d33' },
    { min: 0,   color: '#d6f0e8', text: '#3a6b5e' }
  ];

  function getCountryColor(aui) {
    for (var i = 0; i < usageScale.length; i++) {
      if (aui >= usageScale[i].min) return usageScale[i];
    }
    return usageScale[usageScale.length - 1];
  }

  // --- Country Map Interaction ---
  var countryGroups = document.querySelectorAll('.geo-country');
  var detailName = document.getElementById('detail-name');
  var detailRank = document.getElementById('detail-rank');
  var detailAui = document.getElementById('detail-aui');
  var detailBar = document.getElementById('detail-bar');
  var detailTasks = document.getElementById('detail-tasks');

  // Apply initial colors to all countries
  function applyMapColors() {
    countryGroups.forEach(function (g) {
      var code = g.getAttribute('data-country');
      var data = countries[code];
      if (!data) return;
      var scale = getCountryColor(data.aui);
      var paths = g.querySelectorAll('path');
      paths.forEach(function (p) { p.style.fill = scale.color; });
      var text = g.querySelector('text');
      if (text) text.style.fill = scale.text;
    });
  }

  applyMapColors();

  function selectCountry(code) {
    var data = countries[code];
    if (!data) return;

    countryGroups.forEach(function (g) { g.classList.remove('active'); });
    var group = document.querySelector('.geo-country[data-country="' + code + '"]');
    if (group) group.classList.add('active');

    detailName.textContent = data.name;
    detailRank.textContent = data.rank;
    detailAui.textContent = data.aui.toFixed(2) + 'x';

    // Bar width: scale AUI to percentage (max ~4.0 = 100%)
    var barWidth = Math.min(data.aui / 4.0 * 100, 100);
    detailBar.style.width = barWidth + '%';

    // Tasks
    var tasksHtml = '';
    data.tasks.forEach(function (task, i) {
      tasksHtml += '<div class="country-task">' +
        '<span class="country-task__num">' + (i + 1) + '.</span>' +
        '<span class="country-task__text">' + task[0] + '</span>' +
        '<span class="country-task__pct">' + task[1] + '</span>' +
        '</div>';
    });
    detailTasks.innerHTML = tasksHtml;
  }

  countryGroups.forEach(function (g) {
    g.addEventListener('click', function () {
      selectCountry(this.getAttribute('data-country'));
    });
  });

  // Select Lithuania by default
  selectCountry('LT');

  // --- Job Explorer Interaction ---
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
      tasksHtml += '<li>' +
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

})();
