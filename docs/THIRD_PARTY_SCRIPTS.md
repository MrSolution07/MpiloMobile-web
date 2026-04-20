# Third-party scripts and heavy client libraries (inventory)

Use this list when tuning **INP / TBT** on dashboard routes (not only LCP on marketing pages).

| Area | Package / source | Where used | Notes |
|------|------------------|------------|--------|
| Maps | `leaflet`, `react-leaflet` | Map components | Lazy-load route or defer map mount until in view |
| PDF | `@react-pdf/renderer` | Records / PDF flows | Heavy; load only on routes that render PDF |
| Barcode | `@zxing/library` | Inventory / scanning | Gate behind user action |
| HTTP | `axios` | Various | Tree-shake unused paths |
| Video / calls | Agora / `video-call` | Doctor video | Third-party SDK; monitor long tasks |
| Icons | `react-icons`, legacy Font Awesome CSS | Global | Prefer tree-shaken icons or subset FA |

**Analytics / tracking**: If added later, load after consent and prefer `async`/`defer` or tag managers with explicit triggers.

---

## Fonts

- Prefer **system font stack** or **self-hosted** fonts with `font-display: swap`.
- Legacy CSS bundles in `index.html` may pull webfonts; audit with Network tab and remove unused families.
