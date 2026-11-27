// Japan by Numbers — hash router. No build step, no network: everything is local.
import { VIEWS, navHtml, bindControls } from './views.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function route() {
  const name = (location.hash.replace(/^#\/?/, '') || 'overview').split('/')[0];
  const view = VIEWS[name] ?? VIEWS.overview;
  const current = VIEWS[name] ? name : 'overview';
  nav.innerHTML = navHtml(current);
  app.innerHTML = view();
  bindControls(current, route);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
