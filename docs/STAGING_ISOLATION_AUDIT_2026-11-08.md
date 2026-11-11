# Auto AI India — Staging Isolation and Release Gate Audit

**Audit date:** 2026-11-08  
**Status checked:** 2026-11-11  
**Scope:** GitHub draft PR #91, Vercel preview, Render services, MongoDB Atlas metadata.  
**Mode:** Read-only infrastructure inspection; no Render deploy, database write, access-list edit, or production change.

## Verified observations

| Area | Observation | Release implication |
| --- | --- | --- |
| GitHub | PR #91 is open, draft, unmerged and mergeable. | Keep in draft until the gates below pass. |
| Vercel | The private preview for PR commit `c6fd866` is READY; the branch-scoped `REACT_APP_BACKEND_URL` points to `https://auto-ai-staging-backend.onrender.com`, and `REACT_APP_PREVIEW_READ_ONLY=true`. | The frontend Axios clients reject non-GET/HEAD/OPTIONS requests in preview. This is not a backend security boundary. |
| Render staging | `auto-ai-staging-backend` runs the legacy staging branch, not the PR branch. The latest recorded deployment attempts failed. | Preview API functionality cannot be declared healthy. |
| Render staging deployment | The 2026-08-31 build succeeded, then deployment failed with process exit code 3. Historical startup logs were not available in the accessible log window. | Root cause is unknown; do not guess or trigger a retry until data isolation is verified. |
| Render staging health | The staging service has no configured Render health-check path. | Configure a non-destructive readiness endpoint after fixing the service. |
| Render production | `auto-ai-api` tracks `main`, with a recorded live deployment and `/health/ready` health check. | Do not modify or restart production during this audit. |
| MongoDB Atlas | The Auto AI project exposes one cluster, `AutoAI-India`, with databases `auto_ai` and `autoai`. | Different database names alone do not prove environment isolation. |
| MongoDB Atlas identity | One visible Atlas database user, `autoai_backend`, has `readWriteAnyDatabase` on `admin`. | A dedicated staging identity with database-scoped permissions is needed. |
| MongoDB Atlas network | The Atlas project contains ten network-access entries, including individual IPs and Render CIDRs. | Audit each entry against active needs; do not remove without identifying its owner. |
| Staging startup source | `backend/server.py` on the legacy staging branch calls `db.cars.delete_many({})` and `db.news.delete_many({})` during application startup, then reseeds both collections. | **Destructive startup path: do not deploy or restart staging until the actual `MONGO_URL` and `DB_NAME` are verified and startup code is made safe.** |
| Production startup source | `backend/server.py` on `main` inserts seed cars/news only when the respective collection is empty. | This differs materially from the old staging branch and is not a reason to assume the old branch is safe. |
| CI | Frontend tests/build, backend tests, independence validation, CodeQL and production smoke passed for PR commit `c6fd866`. The successful smoke run checked `/health`, `/health/live` and `/health/ready`; readiness reported MongoDB and Redis OK. An earlier smoke attempt timed out, so the successful run does not establish continuous availability. | CI status must be read back for the latest PR head before any release. |

## Not yet verified

1. The actual `MONGO_URL` and `DB_NAME` configured in each Render service; the available Render connector does not expose read-only environment-variable values.
2. Whether staging and production connect to the same Atlas cluster, database, or database identity. No assumption should be made from database names or collection layouts.
3. The precise cause of the staging process exit code 3; historical application startup logs were unavailable.
4. Live staging API readiness and end-to-end UI functionality; a successful frontend build is not proof of backend health.
5. Manufacturer-accurate licensed vehicle GLB and validated mesh/animation manifest; this remains a separate production blocker.

## Required gates before restarting staging

1. **Identify the connection targets without disclosing secrets.** Compare the staging and production MongoDB host/cluster identifiers, database names and DB usernames through Render's secure environment controls. Record only non-secret identifiers and whether they differ. Do not copy passwords or connection URIs into PRs or logs.
2. **Provision isolation.** Use a dedicated staging database and a staging-only database user limited to that database. Verify that production credentials cannot write to staging and staging credentials cannot write to production. Prefer distinct clusters where feasible; database and identity separation are the minimum.
3. **Remove destructive startup behaviour.** Replace the staging branch's unconditional delete-and-reseed startup with an idempotent, reviewed migration/seed procedure. Add tests that verify startup never deletes existing cars or news.
4. **Investigate the failed deployment.** After gates 1–3, use Render startup logs and deployment events to diagnose exit code 3, configure a health-check path, and only then perform a controlled staging deploy.
5. **Verify readiness and rollback.** Check staging readiness, expected catalogue reads, no production data mutations, and backend error rates. Keep preview writes disabled until the service and isolation are verified.
6. **Complete the release gate.** Recheck latest-commit CI, browser UX at desktop/mobile sizes, and licensed 3D asset readiness before considering PR #91 for review or merge.

## CI reliability improvement

The PR branch's `.github/workflows/production-gate.yml` retains all three production health/readiness HTTP checks while adding connection/request timeouts and a 10-minute job timeout. This bounds hung external checks; it does not waive or fake their success.

**Operational hold:** No Render staging redeploy, production deployment, Atlas user change, database mutation, or PR merge is authorised by this document.
