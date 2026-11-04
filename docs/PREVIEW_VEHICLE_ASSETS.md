# Private preview — asset provenance and release gates

## Current editorial homepage (PR #91)

Active route: `frontend/src/pages/ExperienceHome.jsx`.
Styles: `frontend/src/styles/experience-home.css`.

All five active images are **different photographs of five different vehicles available
in the Indian market**. Their original Unsplash pages identify the vehicle or marque,
and explicitly state that the photograph is free to use under the
[Unsplash License](https://unsplash.com/license). The primary CDN IDs below were
verified against the original photo-page `<img>` elements, not search thumbnails.

| Placement | Vehicle | Original photographer / source | Verified primary CDN ID |
| --- | --- | --- | --- |
| Hero | Mercedes-Benz EQS (Made in India) | Aditya Panchal · https://unsplash.com/photos/a-car-parked-in-a-room-XShcvS-o8gA | `photo-1668248835473-c2f28c752663` |
| Editorial | Audi passenger car photographed in Kolkata | Joy Lakra · https://unsplash.com/photos/b1DzEounjIs | `photo-1652946950814-25f52bb0ebfc` |
| SUV | Mahindra Thar | Amjith S · https://unsplash.com/photos/a-black-jeep-driving-down-a-rural-road-8G4hNKdu60M | `photo-1723306975792-f5a053a59dd3` |
| Sedan | BMW 2 Series Gran Coupé | Original photo · https://unsplash.com/photos/blue-car-in-a-parking-lot-1blmJ3x496I | `photo-1623994518372-2211dc3afb29` |
| Hatchback | Hyundai i20 | Vignesh Rajendran · https://unsplash.com/photos/a-white-car-driving-down-a-forest-road-idjb6DfLP28 | `photo-1650029380425-7fbfbd9b2b68` |

### Release limitations

Unsplash copyright permission does **not** independently clear vehicle trademarks,
recognisable persons, number plates, or manufacturer endorsement. A complete
image-by-image visual inspection and plate masking is still required before
any public publishing. The photographs are editorial representations of cars
available in India; they are not proof of current inventory or a specific trim.

The earlier candidate batch was rejected: its image IDs had not been mapped to
their actual source photographs and one supposed SUV image was indexed as a
Hyundai Verna sedan. Do not reintroduce that batch.

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
