# Premium website reference inventory — 11 November 2026

Scope: UI review branch from main 9ea5662; no production merge, release, environment or database changes. Existing open design PRs #84, #88 and #91 were inspected, not modified or merged.

## Live reference observations

Inspected Porsche India homepage, expanded navigation, Macan Electric model page and configurator in connected Chrome, desktop 1440×900, tablet 768×1024 and mobile 390×844. Browser viewport override is asynchronous; screenshots captured immediately after resizing can show the previous state. Treat those captures as qualitative, not precise measurement evidence.

| Surface | Observed | AutoAI implementation direction |
|---|---|---|
| Homepage | Full-bleed moving car media; light centered wordmark; menu left; sparse CTA and large lower-left heading | Original wordmark, licensed stock editorial photography, simple two-CTA hero |
| Composition | Featured trio, model grid, inventory section, discovery trio, dark structured footer | Body-style trio with captions outside images; catalogue-led model showcase; advisor and ownership stories |
| Menu | White left panel, secondary pale model panel, dark blurred scrim; mobile single-column hierarchy | Modal navigation with categories and working route links, focus containment, Escape and restoration |
| Model page | Media hero, vehicle identification and variant links, technical highlights, horizontal highlights gallery, in-page navigation | Existing showroom route becomes real model detail/photo gallery; specifications from API only |
| Configurator | Desktop large left viewer, right options; swatches, thumbnails, summary and enquiry; mobile viewer above options with bottom action area | Preserve canonical capability/price validation, use responsive split workspace, avoid overlay collisions |
| Motion | Homepage video with pause; menu transitions; carousel controls | Reduced-motion-aware reveals, controlled media scale, no scroll-jacking |

Exact proprietary font, easing curves, pixel spacing, loading transitions, reduced-motion implementation and all configurator options were not measured/fully exercised. No exact-match or performance-score claim is made. Porsche code, fonts and media are not incorporated.

## Existing source gaps

Main has amber HUD styling, a dense header, overlapping decorative overlays, fabricated wait-time ticker, photograph mirroring in Showroom, synthetic SVG interiors and unsupported controls. The separate production configurator has capability guards but its viewer has no base height and mobile overlay rules can conceal controls. Several supporting routes retain the earlier theme.

## Asset constraints

Existing catalogue CDN URLs do not establish reuse rights. Retain only explicit licensed image metadata in the new photo resolver; otherwise show a clear missing-photography state. Existing licensed editorial stock images may illustrate discovery, but never stand in for a named model. Production acceptance requires model-specific licensed imagery and runtime-approved GLBs, not additional UI code alone.
