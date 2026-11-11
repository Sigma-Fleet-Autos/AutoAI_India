import { requestError } from "./requestError";
test("validation detail is normalized instead of rendered as an object", () => {
  expect(
    requestError({
      response: {
        data: {
          detail: [{ msg: "Phone is required" }, { msg: "City is required" }],
        },
      },
    }),
  ).toBe("Phone is required · City is required");
});
test("rate limit does not expose server internals", () => {
  expect(
    requestError({ response: { status: 429, data: { detail: "internal" } } }),
  ).toMatch(/Too many requests/);
});
test("unknown structured detail falls back to safe user-facing copy", () => {
  expect(
    requestError(
      { response: { data: { detail: { exception: "secret" } } } },
      "Please retry.",
    ),
  ).toBe("Please retry.");
});
