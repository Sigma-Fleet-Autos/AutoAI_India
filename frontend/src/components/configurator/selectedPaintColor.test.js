import { resolveSelectedPaintHex } from './selectedPaintColor';

describe('resolveSelectedPaintHex', () => {
  const colors = [
    { color_id: 'midnight', primary_hex: '#14283A', available: true },
    { color_id: 'silver', preview_color_hex: '#C9CBD0', available: true },
    { color_id: 'disabled', primary_hex: '#FF0000', available: false },
  ];

  it('uses canonical swatches for the selected option', () => {
    expect(resolveSelectedPaintHex(colors, 'midnight')).toBe('#14283A');
    expect(resolveSelectedPaintHex(colors, 'silver')).toBe('#C9CBD0');
  });

  it('rejects unknown, disabled, and unsafe colour values', () => {
    expect(resolveSelectedPaintHex(colors, 'disabled')).toBeNull();
    expect(resolveSelectedPaintHex(colors, 'unknown')).toBeNull();
    expect(resolveSelectedPaintHex([{ color_id: 'x', primary_hex: 'url(javascript:1)' }], 'x')).toBeNull();
  });
});
