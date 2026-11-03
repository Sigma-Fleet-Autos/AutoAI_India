# Production and staging verification runbook

This runbook accompanies the read-only smoke checker in `scripts/verify_live_stack.py`. No configuration changes or deployments are authorized by this document.

## Verified evidence (2026-11-04)

- PR #90 head `6b82e3df68ce8b790c92fd3da65d9f59885e4ba5`: Backend Tests, Production Gate, independence validation, and read-only smoke unit tests all succeeded. The smoke workflow was triggered by a pull request; its live HTTP checks only execute on manual dispatch.
- Vercel project `auto-ai`: `REACT_APP_BACKEND_URL` environment metadata has a preview-only entry bound to `feat/cinematic-homepage-review`. No production-scoped entry was returned in the inspected project environment listing. This does not establish what value was baked into any prior production bundle.
- Vercel production deployments returned `READY` at Git SHA `9ea566271380db718c9b142c4fac671d4830281a`; this is a deployment status, not proof of browser application initialization.
- Render staging service `srv-d9vugltg1s2s73bu2tfg`: latest inspected deployment `dep-daacnass728c73810u90` (2026-08-31) and four preceding deployments show `update_failed`. The inspected recent logs window contained no entries; root cause is **unknown**.
- Vercel deployment file-tree inspection returned 404 because the Git deployment did not expose a compatible file tree. No inference about bundle contents is supported.

## Gate A: frontend runtime

1. From an authorized workstation with HTTPS access, load `https://autoaiindia.com` in a clean browser session.
2. Inspect JavaScript console for `REACT_APP_BACKEND_URL is required to run Auto-AI.` and other initialization exceptions.
3. In the Network panel, verify JavaScript chunks load successfully and actual frontend API requests use the intended HTTPS backend origin.
4. Verify API responses and CORS behavior; do not treat HTML HTTP 200 as sufficient.
5. Record timestamp, deployment SHA, request URL/path, status, console errors and screenshots (redact tokens and personal data).
6. If the build is missing the backend origin, propose a production-scoped Vercel environment correction, then obtain approval **before** any environment write or redeploy. CRA `REACT_APP_*` values are compiled at build time, so a new production build is required.

## Gate B: Render staging

1. Inspect service build/start commands, root directory, branch, Python runtime and sanitized environment-key presence. Do not read or publish secret values.
2. Retrieve historical build/deploy logs for `dep-daacnass728c73810u90` or reproduce on an approved non-production branch. Recent log absence is not a diagnosis.
3. Compare the staging commit `0e113ab6fffb0dd9b1874988cad1fe9992d45b6f` against the desired staging ref.
4. Confirm database isolation and secret scopes before enabling any staging deployment.
5. Propose the smallest tested change, require explicit staging approval, then run `/health/live`, `/health/ready` and a representative API integration test.

## Gate C: manual HTTP smoke

Use the Actions workflow `Read-only deployment smoke` via manual dispatch, or run:

```bash
python -m scripts.verify_live_stack \
  --frontend https://autoaiindia.com \
  --backend https://auto-ai-api.onrender.com
```

The tool sends only GET requests and checks frontend HTML plus JSON health endpoints. It does **not** verify browser execution, CORS, configurator readiness, licensed 3D assets or commerce flows.

## Promotion requirements

- PR unit and existing production gates green.
- Browser initialization and real API requests verified.
- Staging deploy green with sanitized failure diagnosis recorded.
- No synthetic catalogue records, inferred prices, unlicensed GLBs or legacy-to-canonical automatic promotion.
- Human approval required separately for merging PRs, modifying Vercel/Render configuration, deploying, altering AWS identity/permissions, or writing production MongoDB.
