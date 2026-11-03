# Private preview: vehicle asset provenance and release gates

## Homepage photography

The restored private-preview homepage uses the earlier reviewed cinematic layout with the following
Unsplash image IDs. Photograph copyright reuse is governed by the
[Unsplash License](https://unsplash.com/license), which permits broad reuse but does **not** clear
visible vehicle trademarks, people or third-party property rights.

| Placement | Unsplash photo ID |
| --- | --- |
| Hero and editorial production luxury sedan | `photo-1555215695-3004980ad54e` |
| SUV category | `photo-1519641471654-76ce0107ad1b` |
| Sedan category | `photo-1555215695-3004980ad54e` |
| Hatchback category | `photo-1549317661-bd32c8ce0db2` |

Source delivery: `https://images.unsplash.com/{photo-id}`. Do not invent photographer names
or imply rights to automaker logos. Plate visibility, crop, and brand/trademark use require a
final manual inspection before any public release. No imagery or source code from the design
benchmark is included.

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
