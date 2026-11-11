export function requestError(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (error?.response?.status === 429)
    return "Too many requests. Please wait a moment and try again.";
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (typeof item === "string" ? item : item?.msg))
      .filter((item) => typeof item === "string");
    if (messages.length) return messages.join(" · ");
  }
  return fallback;
}
