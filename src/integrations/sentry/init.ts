/**
 * Sentry bootstrap — no-op unless VITE_SENTRY_DSN is set.
 * To enable error tracking later:
 *   1. `bun add @sentry/react`
 *   2. Set VITE_SENTRY_DSN in env
 */
export async function initSentry() {
  const dsn = (import.meta as any).env?.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;
  try {
    // Dynamically import so the package is optional.
    // @ts-ignore — optional peer dependency
    const Sentry = await import(/* @vite-ignore */ '@sentry/react');
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 1.0,
    });
  } catch (e) {
    console.warn('[sentry] DSN set but @sentry/react is not installed. Run `bun add @sentry/react`.');
  }
}
