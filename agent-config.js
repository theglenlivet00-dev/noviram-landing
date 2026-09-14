// Public configuration only — never add API keys or SMTP credentials here.
// Empty means same-origin /api and /health (recommended behind a reverse proxy).
// Separate API deployment: set an HTTPS origin, e.g. https://api.example.com.
// Local static preview: set http://127.0.0.1:8787, or inject configuration before this file.
window.NOVIRAM_AGENT_CONFIG = Object.freeze({
  apiBaseUrl: 'https://api.noviram.com',
  ...(window.NOVIRAM_AGENT_CONFIG || {})
});
