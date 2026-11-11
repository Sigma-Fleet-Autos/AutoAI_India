import { bodyStyle, licensedPhotos, matchesCategory } from "./vehicleMedia";
test("a CDN URL without reuse evidence is not considered licensed media", () => {
  expect(
    licensedPhotos({
      image: "https://example.com/car.jpg",
      media: [{ type: "image", url: "https://example.com/car.jpg" }],
    }),
  ).toEqual([]);
});
test("only explicit licensed images with source evidence and safe URLs are shown", () => {
  const valid = {
    type: "image",
    license_verified: true,
    url: "https://example.com/car.jpg",
    license: "Owner permission",
    source_url: "https://example.com/source",
  };
  expect(
    licensedPhotos({
      media: [
        valid,
        { ...valid, url: "javascript:alert(1)" },
        { ...valid, source_url: null },
        { ...valid, license_verified: false },
      ],
    }),
  ).toEqual([valid]);
});
test("body styles remain separated even for premium and luxury labels", () => {
  expect(bodyStyle({ segment: "Luxury SUV" })).toBe("SUV");
  expect(bodyStyle({ segment: "Premium Sedan" })).toBe("Sedan");
  expect(bodyStyle({ segment: "Luxury Hatchback" })).toBe("Hatchback");
});
test("powertrain discovery does not mix up body style", () => {
  const car = { segment: "SUV", fuel: "Electric" };
  expect(matchesCategory(car, "SUV")).toBe(true);
  expect(matchesCategory(car, "Electric")).toBe(true);
  expect(matchesCategory(car, "Sedan")).toBe(false);
  expect(matchesCategory(car, "Hybrid")).toBe(false);
  expect(matchesCategory(car, "All")).toBe(true);
});
