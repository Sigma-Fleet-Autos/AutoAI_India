import { computeEMI, validEMIResponse } from "./financeMath";
test("zero interest spreads principal across the term without interest", () => {
  expect(computeEMI(120000, 0, 12)).toEqual({
    principal: 120000,
    emi: 10000,
    total_payment: 120000,
    total_interest: 0,
    tenure_months: 12,
  });
});
test("reducing-balance payment matches an independently checked loan example", () => {
  const value = computeEMI(100000, 12, 12);
  expect(value.emi).toBeCloseTo(8884.878867834, 6);
  expect(value.total_payment).toBeCloseTo(106618.546414008, 5);
  expect(value.total_interest).toBeCloseTo(6618.546414008, 5);
});
test.each([
  [NaN, 9, 12],
  [10000, -1, 12],
  [10000, 9, 0],
  [10000, 9, 12.5],
  [Infinity, 9, 12],
])(
  "invalid assumptions cannot produce a plausible payment (%p,%p,%p)",
  (p, r, n) => {
    expect(() => computeEMI(p, r, n)).toThrow(RangeError);
  },
);
test("a service estimate must match the requested principal and term", () => {
  const data = computeEMI(120000, 9, 36);
  expect(validEMIResponse(data, 120000, 36)).toBe(true);
  expect(validEMIResponse(data, 240000, 36)).toBe(false);
  expect(validEMIResponse({ ...data, emi: NaN }, 120000, 36)).toBe(false);
  expect(validEMIResponse({ ...data, total_interest: -10 }, 120000, 36)).toBe(
    false,
  );
});
