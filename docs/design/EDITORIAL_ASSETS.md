# Editorial image inventory

These are stock editorial images used for general driving stories, not canonical photographs of named catalogue models. Downloaded 11 November 2026. No Porsche imagery is included.

| Local file | Source |
|---|---|
| frontend/public/media/editorial-hero.jpg | https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8 |
| frontend/public/media/editorial-suv.jpg | https://images.unsplash.com/photo-1519641471654-76ce0107ad1b |
| frontend/public/media/editorial-sport.jpg | https://images.unsplash.com/photo-1552519507-da3b142c6e3d |

License reference: https://unsplash.com/license (read 11 November 2026). Unsplash permits downloading and using images for commercial/noncommercial purposes; this is not evidence of trademark endorsement or model-specific manufacturer approval. Photographer identities and additional brand/property clearances have not been independently verified. Review before public launch. The review branch uses the images as editorial stock, with a visible editorial caption.

## Named model photography

The legacy `carImages.js` URLs are retained unchanged but no longer assumed licensed. The new resolver accepts `media` records with `type: image`, `license_verified: true`, a safe URL, `license` and `source_url`; optional `view: interior` enables the real interior gallery. This frontend contract is additive; current backend catalogue records do not expose that media contract. Until mapped from approved source data, model pages show “Licensed photography pending.” No backend migration or data alteration was performed.

## UI QA only

`frontend/scripts/ui-preview.cjs` explicitly requires `--fixtures`, returns illustrative model records, refuses non-GET API requests and has no database connection. Stock photos in that server are fixture illustrations, not verified real-model views. Never point production at the fixture server.

Additional sedan editorial source: `frontend/public/media/editorial-sedan.jpg` from https://images.unsplash.com/photo-1555215695-3004980ad54e with the same stock-license review requirements.
