# Private preview — asset provenance and release gates

## Current editorial homepage (PR #91)

Active route: `frontend/src/pages/ExperienceHome.jsx`.
Styles: `frontend/src/styles/experience-home.css`.

Vehicle photographs are visually separated from all major headings and body copy;
captions and body-style labels are rendered below the media region.

The photographs below are published on Unsplash as free to use under the
[Unsplash License](https://unsplash.com/license). Copyright permission does
not clear third-party brand logos, vehicle trademarks, identifiable persons,
or registration plates. Final visual and legal clearance remains pending.

| Placement | Photographer / publisher | Original photo | CDN ID |
| --- | --- | --- | --- |
| Hero — contemporary AMG GT | Rana Singh | https://unsplash.com/photos/a-dark-grey-mercedes-amg-gt-parked-outside-a-building-B1h8eJCK6g8 | `photo-1774066811800-448b846647a2` |
| Editorial — orange AMG GT | Madeline Liu | https://unsplash.com/photos/a-bright-orange-mercedes-amg-gt-sports-car-parked-outside-PxsKpeYBxiE | `photo-1758563920563-0c9d7378058c` |
| SUV — modern black luxury SUV | Wesley Shen | https://unsplash.com/photos/a-black-luxury-suv-parked-outside-a-modern-building-lTWuQD6Kzg8 | `photo-1771904488909-9137431615c5` |
| Sedan — modern grey AMG GT | Gleb Paniotov | https://unsplash.com/photos/a-sleek-gray-mercedes-amg-gt-sport-car-qGzFSFyFSN0 | `photo-1741014154802-ecd803813064` |
| Hatchback — Hyundai i30 N | Autotrader UK | https://unsplash.com/photos/a-light-blue-performance-hatchback-parked-on-a-wet-road-ckdXbtSez5c | `photo-1765891628083-cbabd2a0c3a8` |

Each image is unique within this homepage. No photography or code from the
benchmark manufacturer is included. This is editorial illustration, not
manufacturer affiliation or endorsement.

## Visual acceptance gates

- Desktop 1440px, tablet 768px, mobile 390px and 320px: no heading/photo overlap,
  clipping, horizontal scroll, or invisible menu.
- Hero car fully legible at responsive crops; image load and alt text verified.
- SUV, Sedan, Hatchback labels all below photography.
- Scroll reveals visible, with reduced-motion fallback.
- Preview sign-in protection and read-only staging mode retained.
- Blank or obscured number plates and logo/trademark use cleared before public release.

## Production vehicle 3D assets

A production 3D vehicle is **not yet approved**. A valid replacement is required to include:
- Manufacturer-accurate model geometry and confirmed redistribution / web-display license.
- Original license record, permitted uses, publisher/author, asset checksum and provenance.
- Blank registration plates (including textures and decals) verified in every camera view.
- Inspected GLB with actual paint material names and wheel option mesh mappings.
- Inspected exterior/interior camera capability and corresponding viewpoints.
- Named open/close animation pairs for each declared door/bonnet/boot interaction.
- Successful backend readiness, manifest validation, browser render and interaction tests.

Do not imply an unverified concept or sample GLB is a production model. The existing unavailable state stays active until an actual licensed manifest passes the publishing gate.

## Private preview and release

Vercel project `auto-ai` now reports `ssoProtection: { enabled: true, deploymentType: "preview" }`. Access to previews requires Vercel team authentication. Do not disable this setting while reviewing the feature.

Public domains must remain attached to the existing production revision; do not promote the preview branch, merge into `main`, or modify production data. A production-independent backend/database configuration is a prerequisite before enabling preview interactions that can save data, make bookings or process payments.

## Acceptance (not yet signed off)

- Homepage desktop/mobile, full scroll and image licensing: pending browser QA.
- 3D vehicle model and licensing: blocked until validated production-car asset exists.
- Viewer responsive split: code staged; pending browser QA.
- Paint and wheels: mapping code staged; pending real GLB interaction QA.
- Camera navigation: code staged; pending real GLB interaction QA.
- Door and boot open/close: blocked until verified animation mappings and GLB QA.
- Vercel SSO preview access: enabled; login smoke pending.
