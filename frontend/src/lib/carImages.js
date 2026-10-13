/**
 * Approved vehicle imagery registry.
 *
 * Do not hotlink or proxy third-party marketplace imagery. Those photos can
 * contain publisher branding, represent a different model year, and may not
 * be licensed for redistribution. Add only verified, licensed, model-specific
 * images hosted on AutoAI-controlled storage, with asset provenance recorded.
 *
 * Until assets are approved, CarVisual renders its branded silhouette fallback.
 */
export const CAR_IMAGES = Object.freeze({});

export function getCarImage(carId) {
  return Object.prototype.hasOwnProperty.call(CAR_IMAGES, carId)
    ? CAR_IMAGES[carId]
    : null;
}
