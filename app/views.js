// Views for Japan by Numbers — one function per section, hash-routed.
// Every control re-renders its own section; nothing is a placeholder.
import { YEARS, POPULATION, PREFECTURES, ECONOMY, EMPLOYMENT, PRICES, EDUCATION, HEALTH, fmt } from './data.js';
import { lineChart, barChart, hbarChart, donutChart } from './charts.js';

const state = {
  popYear: 2024,
  econIndicator: 'gdpUsd',
  econChart: 'bar',
  priceChart: 'line',
  eduChart: 'line',
  compare: ['Tokyo', 'Osaka', 'Hokkaido'],
  compareMetric: 'pop',
};

const NAV = [
  ['#/overview', 'Overview'], ['#/population', 'Population'], ['#/economy', 'Economy'],
  ['#/employment', 'Employment'], ['#/prices', 'Prices'], ['#/education', 'Education'],
  ['#/health', 'Health'], ['#/regions', 'Regions'], ['#/about', 'Sources & methods'],
];

export function navHtml(current) {
  return `<nav class="topnav" aria-label="Sections">${NAV.map(([href, label]) =>
    `<a href="${href}" class="${href.slice(2) === current ? 'active' : ''}">${label}</a>`).join('')}</nav>`;
}

function kpi(label, value, note) {
  return `<div class="kpi"><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div><div class="kpi-note">${note}</div></div>`;
}

function card(title, body, note = '') {
  return `<section class="card"><h2>${title}</h2>${body}${note ? `<p class="source">${note}</p>` : ''}</section>`;
}

function yearSelect(id, selected) {
  return `<label class="ctl">Year <select id="${id}">${YEARS.map((y) =>
    `<option value="${y}" ${y === selected ? 'selected' : ''}>${y}</option>`).join('')}</select></label>`;
}

export function renderOverview() {
  const p = POPULATION.total[2024];
  return `
  <div class="hero"><h1>Japan by the numbers</h1>
  <p>An independent statistics portal for Japan — population, economy, jobs, prices,
  education, health and the regions, each figure with its year and its source.</p></div>
  <div class="kpis">
    ${kpi('Population', `≈ ${fmt(p, 2)} million`, 'Oct 1, 2024 estimate')}
    ${kpi('Nominal GDP', `≈ $${fmt(ECONOMY.gdpUsd[2024], 2)} trillion`, 'IMF, 2024')}
    ${kpi('Unemployment', `${fmt(EMPLOYMENT.unemployment[2024], 1)}%`, '2024 average')}
    ${kpi('CPI inflation', `+${fmt(PRICES.cpi[2024], 1)}%`, '2024, all items')}
    ${kpi('Life expectancy', `≈ ${fmt(HEALTH.lifeExpectancy[2024], 1)} years`, '2024, approx.')}
    ${kpi('Median age', `${fmt(POPULATION.medianAge, 1)} years`, '2024 estimate')}
  </div>
  <div class="grid2">
  ${card('Population is shrinking — slowly', lineChart({
    labels: YEARS.map(String), values: YEARS.map((y) => POPULATION.total[y]),
    unit: 'm', format: (v) => fmt(v, 1),
  }), 'Total population, millions. ' + POPULATION.source)}
  ${card('Nominal GDP, 2020–2024', barChart({
    labels: YEARS.map(String), values: YEARS.map((y) => ECONOMY.gdpUsd[y]),
    unit: ' $tn', format: (v) => fmt(v, 2),
  }), 'Trillion US dollars. ' + ECONOMY.source)}
  </div>
  <div class="grid2">
  ${card('Where to look next',
    `<ul class="links">${NAV.slice(1, 8).map(([href, label]) =>
      `<li><a href="${href}">${label} →</a></li>`).join('')}</ul>
     <p>Every section names its source and year. Figures marked “approx.” are rounded
     from published tables; nothing here is invented.</p>`)}
  ${card('At a glance: 2024',
    `<table class="data"><tbody>
     <tr><th>Births</th><td>≈ 721,000</td><td>Deaths</td><td>≈ 1,618,000</td></tr>
     <tr><th>Total fertility rate</th><td>1.15</td><td>Share aged 65+</td><td>29.3%</td></tr>
     <tr><th>Real GDP growth</th><td>−0.1%</td><td>Govt debt / GDP</td><td>≈ 237%</td></tr>
     <tr><th>Job openings ratio</th><td>1.25</td><td>Health spending / GDP</td><td>≈ 11%</td></tr>
     </tbody></table>`, 'Sources: Statistics Bureau, Cabinet Office, MHLW, IMF, OECD.')}
  </div>`;
}

export function renderPopulation() {
  const y = state.popYear;
  const births = POPULATION.births[y], deaths = POPULATION.deaths[y];
  return `
  <h1>Population</h1>
  <p class="lede">Japan's population peaked in 2008 and has fallen every year since.
  In ${y} it stood at about ${fmt(POPULATION.total[y], 2)} million, with roughly
  ${fmt(deaths - births, 0)} thousand more deaths than births.</p>
  <div class="controls">${yearSelect('pop-year', y)}</div>
  <div class="kpis">
    ${kpi('Total population', `≈ ${fmt(POPULATION.total[y], 2)} million`, `Oct 1, ${y} estimate`)}
    ${kpi('Births', `≈ ${fmt(births, 0)} thousand`, `${y}, MHLW`)}
    ${kpi('Deaths', `≈ ${fmt(deaths, 0)} thousand`, `${y}, MHLW`)}
    ${kpi('Total fertility rate', fmt(POPULATION.fertility[y], 2), `${y}, MHLW`)}
  </div>
  <div class="grid2">
  ${card('Population, 2020–2024', lineChart({
    labels: YEARS.map(String), values: YEARS.map((yy) => POPULATION.total[yy]),
    unit: 'm', format: (v) => fmt(v, 1),
  }), 'Total population, millions. ' + POPULATION.source)}
  ${card('Age structure, 2024', donutChart({ rows: POPULATION.age2024 }),
    'Share of total population. ' + POPULATION.source)}
  </div>
  ${card('Births vs deaths, 2020–2024', barChart({
    labels: YEARS.map(String), values: YEARS.map((yy) => POPULATION.births[yy] - POPULATION.deaths[yy]),
    unit: 'k', color: '#bc002d', format: (v) => fmt(v, 0),
  }), 'Natural change (births minus deaths), thousands. Negative bars mean more deaths than births. ' + POPULATION.source)}
  <p class="source">Median age in 2024: ${fmt(POPULATION.medianAge, 1)} years — among the highest in the world.</p>`;
}

const ECON_INDICATORS = {
  gdpUsd: { title: 'Nominal GDP', unit: ' $tn', format: (v) => fmt(v, 2) },
  gdpPerCapita: { title: 'GDP per capita', unit: ' $', format: (v) => fmt(v, 0) },
  growth: { title: 'Real GDP growth', unit: '%', format: (v) => fmt(v, 1) },
  debtRatio: { title: 'Government debt / GDP', unit: '%', format: (v) => fmt(v, 0) },
};

export function renderEconomy() {
  const ind = ECON_INDICATORS[state.econIndicator];
  const values = YEARS.map((y) => ECONOMY[state.econIndicator][y]);
  const chart = state.econChart === 'line'
    ? lineChart({ labels: YEARS.map(String), values, unit: ind.unit, format: ind.format })
    : barChart({ labels: YEARS.map(String), values, unit: ind.unit, format: ind.format });
  return `
  <h1>Economy</h1>
  <p class="lede">The world's fourth-largest economy in nominal terms, and one of its most indebted
  governments. GDP per head fell in dollar terms as the yen weakened after 2021.</p>
  <div class="controls">
    <label class="ctl">Indicator <select id="econ-ind">${Object.entries(ECON_INDICATORS).map(([k, v]) =>
      `<option value="${k}" ${k === state.econIndicator ? 'selected' : ''}>${v.title}</option>`).join('')}</select></label>
    <label class="ctl">Chart <select id="econ-chart">
      <option value="bar" ${state.econChart === 'bar' ? 'selected' : ''}>Bars</option>
      <option value="line" ${state.econChart === 'line' ? 'selected' : ''}>Line</option>
    </select></label>
  </div>
  <div class="kpis">
    ${kpi('Nominal GDP 2024', `≈ $${fmt(ECONOMY.gdpUsd[2024], 2)} trillion`, 'IMF WEO')}
    ${kpi('GDP per capita 2024', `≈ $${fmt(ECONOMY.gdpPerCapita[2024], 0)}`, 'IMF, approx.')}
    ${kpi('Real growth 2024', `${fmt(ECONOMY.growth[2024], 1)}%`, 'Cabinet Office')}
    ${kpi('Exports 2024', `≈ $${ECONOMY.exports[2024]} bn`, 'Goods, MOF')}
  </div>
  ${card(`${ind.title}, 2020–2024`, chart, ECONOMY.source)}
  ${card('Trade in goods, 2020–2024',
    `<table class="data"><thead><tr><th>Year</th>${YEARS.map((y) => `<th>${y}</th>`).join('')}</tr></thead>
     <tbody><tr><th>Exports ($bn)</th>${YEARS.map((y) => `<td>${ECONOMY.exports[y]}</td>`).join('')}</tr>
     <tr><th>Imports ($bn)</th>${YEARS.map((y) => `<td>${ECONOMY.imports[y]}</td>`).join('')}</tr>
     <tr><th>Balance ($bn)</th>${YEARS.map((y) => `<td>${ECONOMY.exports[y] - ECONOMY.imports[y]}</td>`).join('')}</tr></tbody></table>`,
    'Goods trade, US dollars, approximate. ' + ECONOMY.source)}`;
}

export function renderEmployment() {
  return `
  <h1>Employment</h1>
  <p class="lede">Unemployment has stayed near 2.5% for years — low by international standards —
  while employers report more openings than applicants in most months.</p>
  <div class="kpis">
    ${kpi('Unemployment 2024', `${fmt(EMPLOYMENT.unemployment[2024], 1)}%`, 'Labour Force Survey')}
    ${kpi('Job openings ratio 2024', fmt(EMPLOYMENT.jobRatio[2024], 2), 'Openings per applicant')}
    ${kpi('Nominal wage growth 2024', `+${fmt(EMPLOYMENT.wageGrowth[2024], 1)}%`, 'Monthly cash earnings')}
    ${kpi('Services share of jobs', '72.3%', '2024, approx.')}
  </div>
  <div class="grid2">
  ${card('Unemployment rate, 2020–2024', lineChart({
    labels: YEARS.map(String), values: YEARS.map((y) => EMPLOYMENT.unemployment[y]),
    unit: '%', format: (v) => fmt(v, 1),
  }), 'Seasonally adjusted annual average. ' + EMPLOYMENT.source)}
  ${card('Jobs by sector, 2024', hbarChart({ rows: EMPLOYMENT.sectors2024.map((s) => ({ label: s.label, value: s.share })), unit: '%' }),
    'Share of all employment, approximate. ' + EMPLOYMENT.source)}
  </div>
  ${card('Job openings per applicant, 2020–2024', barChart({
    labels: YEARS.map(String), values: YEARS.map((y) => EMPLOYMENT.jobRatio[y]),
    unit: '', format: (v) => fmt(v, 2),
  }), 'Effective ratio of job openings to applicants. Above 1.0 means more openings than job-seekers. ' + EMPLOYMENT.source)}`;
}

export function renderPrices() {
  const chart = state.priceChart === 'line'
    ? lineChart({ labels: YEARS.map(String), values: YEARS.map((y) => PRICES.cpi[y]), unit: '%', format: (v) => fmt(v, 1) })
    : barChart({ labels: YEARS.map(String), values: YEARS.map((y) => PRICES.cpi[y]), unit: '%', format: (v) => fmt(v, 1) });
  return `
  <h1>Prices</h1>
  <p class="lede">After decades near zero, consumer inflation returned in 2022 and stayed above 2%
  through 2024 — the first sustained inflation Japan has seen in a generation.</p>
  <div class="controls">
    <label class="ctl">Chart <select id="price-chart">
      <option value="line" ${state.priceChart === 'line' ? 'selected' : ''}>Line</option>
      <option value="bar" ${state.priceChart === 'bar' ? 'selected' : ''}>Bars</option>
    </select></label>
  </div>
  <div class="kpis">
    ${kpi('CPI inflation 2024', `+${fmt(PRICES.cpi[2024], 1)}%`, 'All items, 2020 base')}
    ${kpi('Core-core CPI 2024', `+${fmt(PRICES.coreCore2024, 1)}%`, 'Excl. fresh food & energy')}
    ${kpi('CPI inflation 2023', `+${fmt(PRICES.cpi[2023], 1)}%`, 'Peak of the recent run')}
    ${kpi('CPI inflation 2021', `${fmt(PRICES.cpi[2021], 1)}%`, 'Deflation, pre-surge')}
  </div>
  <div class="grid2">
  ${card('Consumer price inflation, 2020–2024', chart, PRICES.source)}
  ${card('Price rises by category, 2024', hbarChart({
    rows: PRICES.categories2024.map((c) => ({ label: c.label, value: c.value })), unit: '%', format: (v) => fmt(v, 1),
  }), 'Annual change, approximate. ' + PRICES.source)}
  </div>
  <p class="source">Food prices rose fastest in 2024 (about 4%), driven by fresh food and eating out;
  housing costs barely moved (about 0.8%).</p>`;
}

export function renderEducation() {
  return `
  <h1>Education</h1>
  <p class="lede">Two in three young Japanese adults now hold a tertiary qualification, and Japan's
  15-year-olds scored near the top of the OECD in the 2022 PISA tests.</p>
  <div class="kpis">
    ${kpi('Tertiary attainment, 25–34', `≈ ${fmt(EDUCATION.tertiary2534[2024], 0)}%`, '2024, OECD, approx.')}
    ${kpi('University entry rate', `${fmt(EDUCATION.universityEntry, 1)}%`, '2024, MEXT')}
    ${kpi('PISA maths 2022', EDUCATION.pisa2022[0].score, 'OECD average: 472')}
    ${kpi('Public education spending', `≈ ${fmt(EDUCATION.spendingGdp, 1)}% of GDP`, 'OECD, approx.')}
  </div>
  <div class="grid2">
  ${card('Tertiary attainment, ages 25–34', lineChart({
    labels: YEARS.map(String), values: YEARS.map((y) => EDUCATION.tertiary2534[y]),
    unit: '%', format: (v) => fmt(v, 1),
  }), 'Share with a tertiary qualification. ' + EDUCATION.source)}
  ${card('PISA 2022 scores', hbarChart({
    rows: EDUCATION.pisa2022.map((p) => ({ label: p.label, value: p.score })), unit: '', format: (v) => String(v),
  }), 'OECD PISA 2022, mean scores (OECD averages: maths 472, reading 476, science 485). ' + EDUCATION.source)}
  </div>`;
}

export function renderHealth() {
  return `
  <h1>Health</h1>
  <p class="lede">Japan has the world's longest life expectancy — about 84 years — and more hospital
  beds per person than any other OECD country.</p>
  <div class="kpis">
    ${kpi('Life expectancy', `≈ ${fmt(HEALTH.lifeExpectancy[2024], 1)} years`, '2024, approx., MHLW')}
    ${kpi('Women, 2023', `${fmt(HEALTH.lifeWomen2023, 1)} years`, 'MHLW life table')}
    ${kpi('Men, 2023', `${fmt(HEALTH.lifeMen2023, 1)} years`, 'MHLW life table')}
    ${kpi('Hospital beds', `${fmt(HEALTH.bedsPer1000, 1)} per 1,000`, 'OECD, most in the OECD')}
  </div>
  <div class="grid2">
  ${card('Life expectancy at birth, 2020–2024', lineChart({
    labels: YEARS.map(String), values: YEARS.map((y) => HEALTH.lifeExpectancy[y]),
    unit: ' yrs', format: (v) => fmt(v, 1),
  }), 'Years. ' + HEALTH.source)}
  ${card('Health spending', `<p class="bigstat">≈ ${fmt(HEALTH.spendingGdp, 1)}% <span>of GDP</span></p>
    <p>Health spending is about 11% of GDP — above the OECD average of roughly 9% —
    funded mostly through universal public insurance that covers every resident.</p>`,
    HEALTH.source)}
  </div>`;
}

export function renderRegions() {
  const metric = state.compareMetric;
  const rows = PREFECTURES.map((p) => ({
    name: p.name, pop: p.pop, density: p.density,
    share: (p.pop / POPULATION.total[2024]) * 100,
  }));
  const selected = rows.filter((r) => state.compare.includes(r.name));
  const chartRows = selected.map((r) => ({
    label: r.name, value: metric === 'pop' ? r.pop : metric === 'density' ? r.density : r.share,
  }));
  const chart = hbarChart({
    rows: chartRows,
    unit: metric === 'pop' ? 'm' : metric === 'density' ? '/km²' : '%',
    format: (v) => metric === 'pop' ? fmt(v, 2) : metric === 'density' ? fmt(v, 0) : fmt(v, 1),
  });
  return `
  <h1>Regions</h1>
  <p class="lede">Pick up to three prefectures and compare them. Tokyo alone holds about one in nine
  Japanese residents; Hokkaido, the largest prefecture by area, is among the least dense.</p>
  <div class="controls">
    <fieldset class="pref-pick"><legend>Compare prefectures (up to 3)</legend>
    ${PREFECTURES.slice(0, 9).map((p) => `<label><input type="checkbox" data-pref="${p.name}" ${state.compare.includes(p.name) ? 'checked' : ''}> ${p.name}</label>`).join('')}
    </fieldset>
    <label class="ctl">Compare by <select id="compare-metric">
      <option value="pop" ${metric === 'pop' ? 'selected' : ''}>Population (millions)</option>
      <option value="density" ${metric === 'density' ? 'selected' : ''}>Density (per km²)</option>
      <option value="share" ${metric === 'share' ? 'selected' : ''}>Share of Japan (%)</option>
    </select></label>
  </div>
  ${card(`Comparison: ${selected.map((s) => s.name).join(', ') || 'none selected'}`, selected.length ? chart : '<p>Select at least one prefecture above.</p>',
    '2024 estimates. ' + POPULATION.source)}
  ${card('Largest prefectures by population, 2024',
    `<table class="data"><thead><tr><th>Prefecture</th><th>Region</th><th>Population (m)</th><th>Density (/km²)</th><th>Share of Japan</th></tr></thead>
     <tbody>${rows.map((r) => `<tr><td>${r.name}</td><td>${PREFECTURES.find((p) => p.name === r.name).region}</td><td>${fmt(r.pop, 2)}</td><td>${fmt(r.density, 0)}</td><td>${fmt(r.share, 1)}%</td></tr>`).join('')}</tbody></table>`,
    'Population and density, 2024 estimates. ' + POPULATION.source)}`;
}

export function renderAbout() {
  return `
  <h1>Sources &amp; methods</h1>
  <p class="lede">Japan by Numbers is an independent, non-commercial statistics portal.
  It is not affiliated with the Statistics Bureau of Japan or any government body.</p>
  <div class="grid2">
  ${card('Where the numbers come from',
    `<ul class="src-list">
     <li><strong>Population</strong> — ${POPULATION.source}</li>
     <li><strong>Economy</strong> — ${ECONOMY.source}</li>
     <li><strong>Employment</strong> — ${EMPLOYMENT.source}</li>
     <li><strong>Prices</strong> — ${PRICES.source}</li>
     <li><strong>Education</strong> — ${EDUCATION.source}</li>
     <li><strong>Health</strong> — ${HEALTH.source}</li>
     </ul>`)}
  ${card('Methods &amp; caveats',
    `<ul class="src-list">
     <li>Figures are rounded; “≈” and “approx.” mark numbers rounded from published tables.</li>
     <li>Population figures are October 1 estimates; GDP figures are calendar-year IMF estimates in US dollars.</li>
     <li>Trade figures are goods only, in US dollars, approximate.</li>
     <li>Prefectural populations are 2024 estimates; densities use each prefecture's land area.</li>
     <li>Nothing on this site is fetched from the internet: all data ships with the page.</li>
     </ul>`)}
  </div>`;
}

export const VIEWS = {
  overview: renderOverview, population: renderPopulation, economy: renderEconomy,
  employment: renderEmployment, prices: renderPrices, education: renderEducation,
  health: renderHealth, regions: renderRegions, about: renderAbout,
};

export function bindControls(route, rerender) {
  const q = (id) => document.getElementById(id);
  if (route === 'population') q('pop-year')?.addEventListener('change', (e) => { state.popYear = Number(e.target.value); rerender(); });
  if (route === 'economy') {
    q('econ-ind')?.addEventListener('change', (e) => { state.econIndicator = e.target.value; rerender(); });
    q('econ-chart')?.addEventListener('change', (e) => { state.econChart = e.target.value; rerender(); });
  }
  if (route === 'prices') q('price-chart')?.addEventListener('change', (e) => { state.priceChart = e.target.value; rerender(); });
  if (route === 'regions') {
    q('compare-metric')?.addEventListener('change', (e) => { state.compareMetric = e.target.value; rerender(); });
    document.querySelectorAll('input[data-pref]').forEach((box) => box.addEventListener('change', () => {
      const name = box.dataset.pref;
      if (box.checked) {
        if (state.compare.length >= 3) { box.checked = false; return; }
        state.compare.push(name);
      } else {
        state.compare = state.compare.filter((n) => n !== name);
      }
      rerender();
    }));
  }
}
