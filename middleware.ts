export const config = {
  // Run on every request, including the SPA shell and static assets, so
  // nothing is served before authentication is checked. Excludes only
  // Vercel's own internal paths, which don't need gating.
  matcher: '/((?!_vercel/).*)',
};

/**
 * Runs at Vercel's edge, in front of the static build. Gates the whole app
 * with HTTP Basic Auth, independent of the dashboard's Deployment Protection
 * toggle (which requires a Vercel login and wasn't reliably taking effect).
 * Credentials are compared against env vars set in the Vercel project
 * (never committed here), so nothing secret lives in this file or the
 * shipped JS bundle.
 */
export default function middleware(request: Request): Response | undefined {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // Fail open only if the env vars were never configured, so a missing
  // config doesn't quietly leave the deployment wide open -- instead
  // treat it as "auth required, nothing will ever match" until they're set.
  const header = request.headers.get('authorization');
  const expected = user && pass ? `Basic ${btoa(`${user}:${pass}`)}` : null;

  if (expected && header && constantTimeEqual(header, expected)) {
    return undefined; // continue to the requested resource
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Personal Tracker"' },
  });
}

/** Avoids a timing side-channel on the credential comparison. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
