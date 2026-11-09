# Architecture rules
- Use React/Vite with Capacitor for Android packaging; keep the web experience shared so fixes apply on both platforms.
- Keep theme colors, media contrast and safe-area layout in global semantic tokens; shared controls must use the design-system Button.
- Use validated section query parameters for cross-page navigation so admin shortcuts land on their intended screen.