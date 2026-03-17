

# Atomic UI/UX Overhaul: Newspaper Editorial Brutalism, Light Theme Default

## Design Direction

Inspired by the "Inspire OKC" reference: off-white textured background, near-black text, **red (#C53030)** as the sole accent, massive uppercase headlines, thin-bordered flat cards, newspaper-column dividers. No blue. No gradients. No beveled surfaces. Raw, loud, editorial.

## 1. Color System Rewrite (`src/index.css`)

**Light theme becomes `:root` (default).** Dark theme moves to `.dark` class.

| Token | New Value |
|-------|-----------|
| `--background` | `40 20% 96%` (warm off-white, paper-like) |
| `--foreground` | `0 0% 8%` (near black) |
| `--primary` | `0 65% 42%` (deep red, #C53030) |
| `--primary-foreground` | `0 0% 100%` |
| `--surface-0` through `--surface-3` | Flat grays: `0 0% 96%` → `0 0% 100%` → `0 0% 98%` → `0 0% 95%` |
| `--card` | `0 0% 100%` (white) |
| `--border` | `0 0% 15%` (strong black borders) |
| `--muted-foreground` | `0 0% 40%` |
| `--accent` | Same as primary (red) |
| `--destructive` | `0 0% 8%` (black for destructive in light editorial) |

Remove all blue references. Difficulty badges keep distinct colors but muted/editorial tones.

Dark theme (`.dark` class) gets a matching editorial treatment: near-black background, off-white text, same red accent.

## 2. Typography Overhaul

- **Headlines**: Switch from Space Grotesk to a condensed bold style. We'll use `Space Grotesk` still but crank weight to 700, increase sizes massively, and use tight negative letter-spacing (`-0.04em`).
- **Body**: Inter stays, but bump contrast.
- New utility: