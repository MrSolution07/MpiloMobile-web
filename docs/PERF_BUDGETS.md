# Performance budgets and baseline protocol

This document defines **non-functional targets** and how to capture **baselines** and **regressions** for the Mpilo Mobile web apps (patient-website, doctor-dashboard, admin-dashboard).

## Metrics (calibrate with product; record actual baselines in CI artifacts)

| Metric | Scope | Target (example — replace after first baseline) |
|--------|--------|--------------------------------------------------|
| **LCP** | p75 on agreed URL + lab profile (e.g. Slow 4G) | Team threshold after image + LCP work |
| **CLS** | Key templates (Home, Gallery, one dashboard) | ≤ 0.1 |
| **INP / TBT** | Dashboard routes with maps, PDF, heavy lists | Baseline first, then improvement goal |
| **Bundle** | Main entry + largest chunk (gzip) | Per-app budget after `rollup-plugin-visualizer` |

## Baseline protocol

1. Use the **same build** (`npm run build`) and environment (`npm run preview` or static host).
2. Run Lighthouse (or Lighthouse CI) on the **same URLs** and connection profile.
3. Store HTML/JSON reports or CI artifacts for comparison.
4. **Stop rule**: If a change does not improve agreed metrics, revert or iterate with evidence.

## CI

- GitHub Actions workflow **`.github/workflows/perf-ci.yml`** builds **patient-website** and runs **Lighthouse CI** against `vite preview` for `/` and `/gallery`.
- Adjust thresholds in **`patient-website/lighthouserc.cjs`** after establishing a real baseline (first run may need relaxed `assert` or temporary skip).

## Optional bundle budgets

After adding **`rollup-plugin-visualizer`** to each app’s Vite config, set optional CI checks on output size (not enabled by default — enable when baselines exist).
