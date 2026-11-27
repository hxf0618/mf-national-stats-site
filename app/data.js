// Japan by Numbers — data tables.
// Figures are rounded from public sources; every page names its source and year.
// Sources: Statistics Bureau of Japan (e-Stat), Cabinet Office, MHLW, IMF WEO (Oct 2025), OECD.
export const YEARS = [2020, 2021, 2022, 2023, 2024];

export const POPULATION = {
  total: { 2020: 126.15, 2021: 125.50, 2022: 124.95, 2023: 124.35, 2024: 123.72 }, // millions, Oct 1 estimate
  age2024: [
    { label: 'Ages 0–14', share: 11.2 },
    { label: 'Ages 15–64', share: 59.5 },
    { label: 'Ages 65+', share: 29.3 },
  ],
  fertility: { 2020: 1.33, 2021: 1.30, 2022: 1.26, 2023: 1.20, 2024: 1.15 },
  births: { 2020: 841, 2021: 812, 2022: 772, 2023: 727, 2024: 721 }, // thousands
  deaths: { 2020: 1373, 2021: 1440, 2022: 1569, 2023: 1576, 2024: 1618 }, // thousands
  medianAge: 49.4,
  source: 'Statistics Bureau of Japan, population estimates (Oct 1) and vital statistics, MHLW.',
};

export const PREFECTURES = [
  { name: 'Tokyo', pop: 14.18, density: 6471, region: 'Kanto' },
  { name: 'Kanagawa', pop: 9.20, density: 3810, region: 'Kanto' },
  { name: 'Osaka', pop: 8.77, density: 4606, region: 'Kansai' },
  { name: 'Aichi', pop: 7.46, density: 1444, region: 'Chubu' },
  { name: 'Saitama', pop: 7.32, density: 1928, region: 'Kanto' },
  { name: 'Chiba', pop: 6.25, density: 1212, region: 'Kanto' },
  { name: 'Hyogo', pop: 5.28, density: 629, region: 'Kansai' },
  { name: 'Hokkaido', pop: 5.09, density: 61, region: 'Hokkaido' },
  { name: 'Fukuoka', pop: 5.09, density: 1022, region: 'Kyushu' },
  { name: 'Shizuoka', pop: 3.55, density: 456, region: 'Chubu' },
  { name: 'Ibaraki', pop: 2.86, density: 469, region: 'Kanto' },
  { name: 'Hiroshima', pop: 2.75, density: 325, region: 'Chugoku' },
];
// Population in millions, density per km², 2024 estimates (Statistics Bureau).

export const ECONOMY = {
  gdpUsd: { 2020: 5.06, 2021: 5.02, 2022: 4.26, 2023: 4.21, 2024: 4.03 }, // trillion USD, IMF WEO
  gdpPerCapita: { 2020: 40100, 2021: 40000, 2022: 34100, 2023: 33800, 2024: 32500 }, // USD, approx.
  growth: { 2020: -4.2, 2021: 2.6, 2022: 0.9, 2023: 1.7, 2024: -0.1 }, // real GDP growth %, Cabinet Office
  debtRatio: { 2020: 259, 2021: 255, 2022: 251, 2023: 240, 2024: 237 }, // % of GDP, IMF, approx.
  exports: { 2020: 641, 2021: 757, 2022: 747, 2023: 717, 2024: 710 }, // goods, USD bn, approx.
  imports: { 2020: 635, 2021: 769, 2022: 902, 2023: 786, 2024: 730 }, // goods, USD bn, approx.
  source: 'IMF World Economic Outlook (Oct 2025), Cabinet Office national accounts, MOF trade statistics.',
};

export const EMPLOYMENT = {
  unemployment: { 2020: 2.8, 2021: 2.8, 2022: 2.6, 2023: 2.6, 2024: 2.5 }, // %, Statistics Bureau
  jobRatio: { 2020: 1.18, 2021: 1.13, 2022: 1.28, 2023: 1.31, 2024: 1.25 }, // openings per applicant, MHLW
  wageGrowth: { 2020: 0.1, 2021: 0.3, 2022: 1.7, 2023: 1.3, 2024: 2.8 }, // nominal monthly cash earnings %, MHLW
  sectors2024: [
    { label: 'Services', share: 72.3 },
    { label: 'Manufacturing & industry', share: 24.5 },
    { label: 'Agriculture, forestry & fisheries', share: 3.2 },
  ],
  source: 'Statistics Bureau Labour Force Survey; MHLW Employment Referrals and Monthly Labour Survey.',
};

export const PRICES = {
  cpi: { 2020: 0.0, 2021: -0.2, 2022: 2.5, 2023: 3.3, 2024: 2.7 }, // all-items CPI, % change, Statistics Bureau
  coreCore2024: 2.6, // CPI excl. fresh food and energy, 2024
  categories2024: [
    { label: 'Food', value: 4.0 },
    { label: 'Culture & recreation', value: 2.9 },
    { label: 'Clothing & footwear', value: 2.1 },
    { label: 'Miscellaneous', value: 2.0 },
    { label: 'Transport & communication', value: 0.4 },
    { label: 'Housing', value: 0.8 },
  ], // % change 2024, approx.
  source: 'Statistics Bureau of Japan, Consumer Price Index (2020 base). Category figures are approximate.',
};

export const EDUCATION = {
  tertiary2534: { 2020: 61.4, 2021: 62.4, 2022: 63.0, 2023: 65.6, 2024: 66.0 }, // % with tertiary education, OECD, approx.
  universityEntry: 57.7, // % of high-school graduates entering university, 2024, MEXT
  pisa2022: [
    { label: 'Mathematics', score: 536 },
    { label: 'Reading', score: 516 },
    { label: 'Science', score: 547 },
  ],
  spendingGdp: 3.1, // public spending on education, % of GDP, OECD, approx.
  source: 'OECD Education at a Glance; MEXT School Basic Survey; OECD PISA 2022.',
};

export const HEALTH = {
  lifeExpectancy: { 2020: 84.6, 2021: 84.0, 2022: 84.0, 2023: 84.0, 2024: 84.0 }, // years, MHLW, approx.
  lifeMen2023: 81.1,
  lifeWomen2023: 87.1,
  bedsPer1000: 12.6, // hospital beds per 1,000 people, OECD
  spendingGdp: 11.0, // health spending, % of GDP, OECD, approx.
  source: 'MHLW abridged life tables; OECD Health Statistics.',
};

export const fmt = (n, d = 1) => Number(n).toFixed(d);
