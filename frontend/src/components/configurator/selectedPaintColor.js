/** Resolve backend-authoritative paint swatches to the exact viewer colour. */
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function resolveSelectedPaintHex(colors, selectedId) {
  if (!Array.isArray(colors) || typeof selectedId !== 'string' || !selectedId) return null;
  const selected = colors.find((option) =>
    (option?.option_id || option?.color_id) === selectedId && option?.available !== false
  );
  if (!selected) return null;
  const value = selected.primary_hex || selected.preview_color_hex;
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return HEX_COLOR.test(normalized) ? normalized : null;
}
