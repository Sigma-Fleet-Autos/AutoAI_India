# Private preview: vehicle asset provenance and release gates

## Homepage photography

The following three body-style photographs and hero are original third-party photographs published on Unsplash under the [Unsplash License](https://unsplash.com/license). Attribution is recorded although not mandatory under the photo copyright license.

| Use | Photographer / publisher | Source |
| --- | --- | --- |
| Hero: black luxury grand tourer, side profile | Oli Woodman | https://unsplash.com/photos/a-black-car-parked-in-front-of-a-white-building-2e07u8GXe3I |
| SUV: silver Genesis GV80, side profile | Hyundai Motor Group | https://unsplash.com/photos/a-light-gray-suv-parked-by-the-ocean-LF4FiHABjE4 |
| Sedan: black Mercedes, studio side profile | Samuele Errico Piccarini | https://unsplash.com/photos/black-sedan-FMbWFDiVRPs |
| Hatchback: white Fiat 500, side profile | Oli Woodman | https://unsplash.com/photos/white-5-door-hatchback-parked-beside-brown-concrete-building-during-daytime-fTDYvXNjAKU |

License scope: image copyright only. The Unsplash License does **not** grant trademark rights in brands/logos or third-party publicity/property rights. This is editorial category illustration, not manufacturer sponsorship, endorsement, or official model marketing. Confirm the final crops show no readable registration plates; obscure them or replace the asset before release. Visual plate clearance is **pending**.

The visual styling was independently authored; the external automotive benchmark was used only for creative direction. No borrowed brand photography, markup, shaders, or code is included.

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
