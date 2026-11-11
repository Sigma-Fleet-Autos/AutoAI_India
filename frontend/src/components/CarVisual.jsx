import { useState } from "react";
import { licensedPhotos } from "../lib/vehicleMedia";
export default function CarVisual({ car, className = "" }) {
  const media = licensedPhotos(car)[0];
  const [failedUrl, setFailedUrl] = useState(null);
  return (
    <div
      className={`vehicle-photo ${className}`}
      data-testid={`car-visual-${car.id}`}
    >
      {media && failedUrl !== media.url ? (
        <img
          src={media.url}
          alt={media.alt || `${car.brand} ${car.model}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailedUrl(media.url)}
        />
      ) : (
        <div className="photo-unavailable">
          <span>{car.brand}</span>
          <strong>{car.model}</strong>
          <small>Licensed photography pending</small>
        </div>
      )}
    </div>
  );
}
