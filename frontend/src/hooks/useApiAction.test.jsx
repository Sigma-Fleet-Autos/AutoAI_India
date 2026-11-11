import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { api } from "../lib/api";
import useApiAction from "./useApiAction";
jest.mock("../lib/api", () => ({ api: { post: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;
let root, container, action;
function Harness() {
  action = useApiAction();
  return (
    <output>
      {action.pending
        ? "pending"
        : action.error || action.data?.value || "idle"}
    </output>
  );
}
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<Harness />));
  api.post.mockReset();
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
test("a newer request aborts the prior request and ignores its late response", async () => {
  let finishFirst, finishSecond;
  api.post
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve;
        }),
    )
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishSecond = resolve;
        }),
    );
  let first, second;
  act(() => {
    first = action.submit("/first", {});
  });
  const firstSignal = api.post.mock.calls[0][2].signal;
  act(() => {
    second = action.submit("/second", {});
  });
  expect(firstSignal.aborted).toBe(true);
  await act(async () => {
    finishSecond({ data: { value: "latest" } });
    await second;
  });
  await act(async () => {
    finishFirst({ data: { value: "stale" } });
    await first;
  });
  expect(container.textContent).toBe("latest");
});
test("a rejected request surfaces an error and ends pending state", async () => {
  api.post.mockRejectedValueOnce({
    response: { status: 503, data: { detail: "Temporarily unavailable" } },
  });
  await act(async () => {
    await action.submit("/compare", {});
  });
  expect(container.textContent).toBe("Temporarily unavailable");
  expect(action.pending).toBe(false);
});
test("reset cancels work and removes previous results", async () => {
  let finish;
  api.post.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  let pending;
  act(() => {
    pending = action.submit("/work", {});
  });
  const signal = api.post.mock.calls[0][2].signal;
  act(() => action.reset());
  expect(signal.aborted).toBe(true);
  await act(async () => {
    finish({ data: { value: "late" } });
    await pending;
  });
  expect(container.textContent).toBe("idle");
});
