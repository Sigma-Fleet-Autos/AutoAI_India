# UI review verification — 11 November 2026

This is an isolated implementation review, not production acceptance. No production services, environment variables or databases were changed. The local UI fixture server explicitly labels its synthetic vehicles; no named Indian model specifications were invented.

## Passed

- Optimized CRA production build with existing React architecture.
- 36 frontend suites, 137 tests including media-evidence and body-style regression tests.
- `git diff --check` and fixture server syntax check.
- Browser homepage hero switching and category links.
- Native modal navigation, initial close-button focus, Escape dismissal and return focus.
- Catalogue query-string category filters, search, clear filters and empty state.
- Detail navigation, real photo gallery and full-screen opening/Escape dismissal.
- Configurator photo fallback without an empty WebGL canvas or fictitious rotation.
- Responsive browser iframe viewports: 360×800 catalogue, 390×844 homepage/menu/configurator, 768×1024 configurator, 1024×900 homepage, 1440×900 homepage. These are exact embedded CSS viewports, not hardware device tests. Scrollbars reduce document client width by 8px. Measured document scroll width equaled client width: 352, 382, 760, 1016 and 1432 respectively. No horizontal document overflow in these tested states.
- At 390px and 768px the option panel begins below the viewer; verified their DOM bounds do not overlap.
- Images in tested homepage states report no failed loaded images.
- Visible label check on the 360px catalogue found no unlabeled inputs/selects. Mobile menu accessible name fixed after initial test.
- Fixed low-contrast white configurator summary values and inherited mobile sticky-sheet spacing after visual review.

## Performance evidence

Before route splitting: initial JS ~511.3 kB gzip. After: ~145.45 kB gzip, with the Three.js route chunk loaded separately (~275.93 kB gzip). This is bundle output, not a Lighthouse score. Editorial images are local optimized-size downloads, lazy-loaded below the fold. Main hero is prioritized. Reduced-motion CSS and motion-library preference handling are implemented; no hardware timing claim.

## Limits and remaining acceptance gates

- Main's catalogue does not expose the new licensed `media` metadata contract. Populate/map approved photography before catalogue visual acceptance. Legacy CDN images are not silently treated as licensed.
- No verified model-specific GLB was available for browser exercise of orbit, wheels, interiors, doors, bonnet, boot or save/share against a live backend. Existing capability guards and backend authority are preserved. Selected paint is now passed into the renderer's declared paint materials, but needs an approved runtime asset for visual acceptance.
- All non-UI operations are refused by the fixture API. Price validation, persistence, bookings, partner integrations and payment flows are not integration-tested here.
- Editorial redesign now covers comparison, advisor, EMI, journal, about, dealer application, sign-in, booking, my bookings and Premium. Internal dealer/admin portals remain outside this redesign. Live authenticated and transactional journeys still require isolated integration testing.
- Exact Porsche font metrics/easing, all carousel interactions, reduced-motion state, and matching-dimension screenshot comparisons are not exhaustively measured. No similarity percentage or pixel-perfect claim.
- Axe WCAG A/AA scans on the 390px advisor and EMI screens reported no violations; color contrast and ARIA checks included incomplete results requiring manual review. This is not a full accessibility audit. No real Android device profile, Lighthouse run, or full production regression suite was performed.
- Local runtime Node 24/npm 11 is newer than repository's Node 20–22/npm 10 engines. Install required `--engine-strict=false`; runtime build/tests pass. CI on the supported Node 22 remains the acceptance authority.

## Reproduce locally

Use repository-supported Node 22 and npm 10:

```sh
cd frontend
npm install --no-audit --no-fund
REACT_APP_BACKEND_URL=http://127.0.0.1:4173 npm run build
npm run preview:ui
```

Open `http://127.0.0.1:4173/`. Responsive harness: `/__qa__/viewport?width=390&height=844&path=/configurator/ui-suv`. The fixture service is local-only and read-only. For a real integration review, use an isolated approved backend and preserve its pricing/asset authority.

## Supporting-page verification

- Production build and 36 suites / 137 frontend tests pass. New tests cover EMI mathematics (including zero interest), request error normalization, cancellation and stale response protection.
- Five local preview-server security tests pass: reflected-query absence, encoded traversal refusal, malformed URL handling, transactional POST refusal and SPA routing. CodeQL on the security-fix commit reported no new alerts.
- Browser: comparison sample populates and returns clearly labeled fixture results; simulated unavailable service displays an inline error. Mobile EMI at zero percent produces ₹13,333 monthly, ₹0 interest and ₹8,00,000 repayment for ₹8,00,000 over 60 months.
- Optional local axe harness serves a fixed installed script and writes scan results to its visible status area. Synthetic comparison/recommendation calculations are stateless preview responses; booking/auth/payment/dealer writes remain refused.
- Query-string payment returns do not establish payment entitlement. Existing checkout and verification endpoints remain authoritative; no payment was executed.
