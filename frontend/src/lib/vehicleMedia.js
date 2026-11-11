// Named model photography must carry explicit rights metadata. A legacy CDN
// location alone is not proof of permission to reproduce an image.
export function licensedPhotos(car) {
  return (Array.isArray(car?.media) ? car.media : []).filter(
    (item) =>
      item?.type === "image" &&
      item.license_verified === true &&
      item.url &&
      /^(https:\/\/|\/[^/])/.test(item.url) &&
      item.license &&
      item.source_url,
  );
}
export function bodyStyle(car) {
  const segment = String(car?.segment || "").toLowerCase();
  if (/motorcycle|motorbike/.test(segment)) return "Motorcycle";
  if (/suv|crossover/.test(segment)) return "SUV";
  if (/sedan|saloon/.test(segment)) return "Sedan";
  if (/hatch/.test(segment)) return "Hatchback";
  if (/mpv|muv/.test(segment)) return "MPV";
  return car?.segment || "Other";
}
export function matchesCategory(car, category) {
  if (!category || category === "All") return true;
  if (category === "Electric") return /electric|\bev\b/i.test(car.fuel || "");
  if (category === "Hybrid") return /hybrid/i.test(car.fuel || "");
  return bodyStyle(car) === category;
}
