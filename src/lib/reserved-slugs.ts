// Slugs that cannot be registered as showrooms and must not be treated as tenant
// subdomains. Used by validation, tenant resolution, and proxy hardening.
export const RESERVED_SLUGS = new Set([
  'www',
  'api',
  'app',
  'admin',
  'dashboard',
  'auth',
  'login',
  'signup',
  'static',
  'cdn',
  'mail',
  'support',
  'help',
  'about',
  'pricing',
  'terms',
  'privacy',
  'tenant',
])
