# AutoAI India — original luxury experience system

Status: implementation in progress. This is not a completed website or native-app release.

## Reference study and independent design direction

Public reference: Porsche international homepage, model overview, and configurator (reviewed 2026-10-24).
Learn from their editorial hierarchy, immersive media, progressive option selection and persistent build summary; do not copy proprietary layouts, photography, logos, fonts or source code.

**AutoAI India / Atelier**: architectural off-white, charcoal, restrained mineral accents, generous negative space, refined editorial type, high-resolution licensed automotive photography, and quiet purposeful motion. Product data and actual vehicle capabilities remain backend-authoritative.

## Experience inventory

| Surface | Target interaction | Acceptance criteria |
| --- | --- | --- |
| Home | Cinematic editorial media and discovery entry | Licensed media, poster fallback, keyboard navigation, reduced motion |
| Manufacturers / discovery | Real API filters, model cards, saved filters | No invented inventory or prices; useful empty/error states |
| Vehicle detail | Gallery, specifications, variants and ownership insights | Source attribution, verified prices with location and date |
| Compare | Side-by-side evidence and differences | Works with keyboard and narrow viewports |
| AI guidance | Explainable recommendations | Clear AI limitations and source traceability |
| Configurator | Real GLB geometry, controlled cameras, options, price | Capability-gated interactions; never simulate unsupported doors/lights |
| Saved builds | Persistence, share, revalidation | Server-side compatibility and pricing authority |
| Bookings / account | Authenticated end-to-end journeys | Clear validation and safe errors |
| Android / iOS | Safe areas, gesture controls, sheets, deep links | Capacitor compatibility first; assess Expo migration separately |

## Motion contract

Entrance 450–700 ms, control feedback 150–250 ms, camera travel based on distance and scene complexity. Use transform/opacity for UI motion. Disable parallax and autoplay where reduced motion or data-saving preferences apply. Do not promise 60 FPS on every device; measure long tasks, CLS, LCP and GPU frame times.

## Assets and licensing

A photographic hero must have confirmed reuse rights, a responsive image set and a fallback. A production configurator model requires explicit vehicle/variant identity, rights, mesh/material mapping, animation metadata and verified price source. Without those inputs, expose unavailable states rather than presenting a demonstrator as a purchasable vehicle.

## Migration approach

1. Establish scoped design tokens and accessible reusable primitives without disrupting current production routes.
2. Redesign navigation, home and discovery; retain existing API calls.
3. Redesign vehicle detail, compare and recommendation journeys.
4. Upgrade configurator viewport and controls against capability metadata.
5. Apply mobile-specific interaction patterns and run Android/iOS device QA.
6. Execute automated accessibility, performance, visual-regression and end-to-end checks before staged rollout.

## Stack decision

Existing React 18 / CRACO / Tailwind / Framer Motion / React Three Fiber / Capacitor remain active. A Next.js or Expo migration is a separate architecture decision requiring routing, auth, backend and release parity; do not mix it into an unverified visual rewrite.
