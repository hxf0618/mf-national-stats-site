// Small SVG chart builders — no library, no network.
function svgOpen(w, h, label) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}">`;
}

function niceTicks(min, max, n = 4) {
  const span = max - min || 1;
  const step = span / n;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const lo = Math.floor(min / s) * s;
  const out = [];
  for (let v = lo; v <= max + 1e-9; v += s) out.push(v);
  return { ticks: out, lo, hi: Math.max(...out) };
}

export function lineChart({ labels, values, unit = '', color = '#bc002d', height = 220, format = (v) => String(v) }) {
  const W = 640, H = height, PL = 52, PR = 14, PT = 14, PB = 28;
  const min = Math.min(...values), max = Math.max(...values);
  const pad = (max - min) * 0.15 || 1;
  const { ticks, lo, hi } = niceTicks(min - pad, max + pad);
  const x = (i) => PL + (i * (W - PL - PR)) / Math.max(labels.length - 1, 1);
  const y = (v) => PT + (1 - (v - lo) / (hi - lo)) * (H - PT - PB);
  let g = '';
  ticks.forEach((t) => {
    g += `<line x1="${PL}" y1="${y(t)}" x2="${W - PR}" y2="${y(t)}" stroke="#e5e0d8" stroke-width="1"/>` +
      `<text x="${PL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#6b655c">${format(t)}</text>`;
  });
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  g += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
  values.forEach((v, i) => {
    g += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="${color}" stroke-width="2">` +
      `<title>${labels[i]}: ${format(v)}${unit}</title></circle>` +
      `<text x="${x(i)}" y="${y(v) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="#2b2620">${format(v)}</text>`;
  });
  labels.forEach((l, i) => {
    g += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#6b655c">${l}</text>`;
  });
  return svgOpen(W, H, 'Line chart') + g + '</svg>';
}

export function barChart({ labels, values, unit = '', color = '#1b2a4a', height = 220, format = (v) => String(v) }) {
  const W = 640, H = height, PL = 52, PR = 14, PT = 18, PB = 28;
  const vMin = Math.min(0, ...values), vMax = Math.max(0, ...values);
  const { ticks, lo, hi } = niceTicks(vMin, vMax * 1.05 || vMax);
  const slot = (W - PL - PR) / labels.length;
  const bw = Math.min(slot * 0.62, 64);
  const y = (v) => PT + (1 - (v - lo) / (hi - lo)) * (H - PT - PB);
  let g = '';
  ticks.forEach((t) => {
    g += `<line x1="${PL}" y1="${y(t)}" x2="${W - PR}" y2="${y(t)}" stroke="#e5e0d8" stroke-width="1"/>` +
      `<text x="${PL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#6b655c">${format(t)}</text>`;
  });
  values.forEach((v, i) => {
    const cx = PL + slot * i + slot / 2;
    const neg = v < 0;
    const y0 = neg ? y(0) : y(v);
    const hgt = Math.abs(y(v) - y(0));
    g += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${y0.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(hgt, 2).toFixed(1)}" rx="3" fill="${neg ? '#bc002d' : color}">` +
      `<title>${labels[i]}: ${format(v)}${unit}</title></rect>` +
      `<text x="${cx}" y="${(neg ? y(v) + 16 : y(v) - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#2b2620">${format(v)}</text>` +
      `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#6b655c">${labels[i]}</text>`;
  });
  if (Math.min(...values) < 0) {
    g += `<line x1="${PL}" y1="${y(0)}" x2="${W - PR}" y2="${y(0)}" stroke="#2b2620" stroke-width="1"/>`;
  }
  return svgOpen(W, H, 'Bar chart') + g + '</svg>';
}

export function hbarChart({ rows, unit = '', color = '#bc002d', format = (v) => String(v) }) {
  const W = 640, rowH = 34, PT = 6, PB = 8, PL = 170, PR = 56;
  const H = PT + PB + rows.length * rowH;
  const max = Math.max(...rows.map((r) => r.value));
  let g = '';
  rows.forEach((r, i) => {
    const y = PT + i * rowH + 6;
    const w = Math.max(((r.value / max) * (W - PL - PR)), 2);
    g += `<text x="${PL - 10}" y="${y + 13}" text-anchor="end" font-size="12" fill="#2b2620">${r.label}</text>` +
      `<rect x="${PL}" y="${y}" width="${w.toFixed(1)}" height="18" rx="3" fill="${color}"><title>${r.label}: ${format(r.value)}${unit}</title></rect>` +
      `<text x="${PL + w + 8}" y="${y + 13}" font-size="12" font-weight="600" fill="#2b2620">${format(r.value)}${unit}</text>`;
  });
  return svgOpen(W, H, 'Horizontal bar chart') + g + '</svg>';
}

export function donutChart({ rows, colors = ['#bc002d', '#1b2a4a', '#c98a2b', '#4a7a5c'] }) {
  const size = 200, cx = 100, cy = 100, r = 78, inner = 52;
  const total = rows.reduce((s, x) => s + x.share, 0);
  let a0 = -Math.PI / 2, paths = '';
  rows.forEach((row, i) => {
    const a1 = a0 + (row.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${cx} ${cy} Z" fill="${colors[i % colors.length]}"><title>${row.label}: ${row.share}%</title></path>`;
    a0 = a1;
  });
  paths += `<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#fff"/>` +
    `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="20" font-weight="700" fill="#2b2620">100%</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#6b655c">of population</text>`;
  const legend = rows.map((row, i) =>
    `<span class="legend-item"><i style="background:${colors[i % colors.length]}"></i>${row.label} — ${row.share}%</span>`).join('');
  return `<div class="donut-wrap">${svgOpen(size, size, 'Age structure')}${paths}</svg><div class="legend">${legend}</div></div>`;
}
