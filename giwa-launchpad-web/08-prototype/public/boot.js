// Runs before first paint as an external file (no inline scripts, so CSP stays `script-src 'self'`).
// Applies the saved display preference or the automatic default: theme from the OS, price colours from language or time zone (Q13, Q16).
(function () {
  var root = document.documentElement;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem('bros:display') || '{}') || {}; } catch (e) { saved = {}; }

  function autoDirection() {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) if (/^ko\b/i.test(langs[i])) return 'korean';
    try { if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul') return 'korean'; } catch (e) {}
    return 'global';
  }

  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = saved.theme === 'light' || saved.theme === 'dark' ? saved.theme : dark ? 'dark' : 'light';
  root.dataset.direction = saved.direction === 'global' || saved.direction === 'korean' ? saved.direction : autoDirection();
})();
