// Japan by Numbers — hand-in program for the make.fun bounty.
// The site is plain static files in app/ (index.html entry, no build step, no
// network requests); screenshots/ holds 3–4 real browser renders of it.
// This program copies app/ and screenshots/ beside it into /output and writes
// /output/dossier.json with the kit's vendored buildDossier library, so the
// judge can read the site from the dossier alone. Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit's reference/gate.json): only
// text_max_bytes shapes the dossier text; the other caps refuse an entry
// the scorer would refuse — more than 4 screenshots or one over 256 KiB,
// more than 993 files and directories in app/, or 16 MiB of app files in all.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
