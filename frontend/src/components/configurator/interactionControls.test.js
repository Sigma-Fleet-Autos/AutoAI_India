import { getDoorControls, getSupportedInteractionControls, getVerifiedInteractionControls } from './interactionControls';

test('only exposes controls declared by the verified asset', () => {
  expect(getSupportedInteractionControls(['doors', 'boot', 'headlights'])).toEqual([
    { id: 'doors', label: 'Doors', capability: 'doors', group: 'vehicle' },
    { id: 'boot', label: 'Boot', capability: 'boot', group: 'vehicle' },
    { id: 'headlights', label: 'Headlights', capability: 'headlights', group: 'lighting' },
  ]);
});

test('door control remains independently gated by the doors capability', () => {
  expect(getDoorControls(['camera_exterior'])).toEqual([]);
  expect(getDoorControls(['doors'])).toEqual([
    { id: 'doors', label: 'Doors', capability: 'doors', group: 'vehicle' },
  ]);
});

describe('verified mechanical part controls', () => {
  const mappings = {
    doors: { front_left_open: 'FL_Open', front_left_close: 'FL_Close' },
    boot: { open: 'Boot_Open', close: 'Boot_Close' },
  };
  const verify = require('./interactionControls').hasVerifiedPartAnimations;

  test('enables only complete declared animation pairs', () => {
    expect(verify(['doors', 'boot'], mappings, 'doors', 'frontLeft')).toBe(true);
    expect(verify(['doors', 'boot'], mappings, 'doors', 'frontRight')).toBe(false);
    expect(verify(['doors', 'boot'], mappings, 'boot')).toBe(true);
    expect(verify(['doors'], mappings, 'boot')).toBe(false);
    expect(verify(['doors', 'boot'], { boot: { open: 'Boot_Open' } }, 'boot')).toBe(false);
  });
});


describe('visible 3D control availability', () => {
  const animationMappings = {
    doors: { front_left_open: 'FL_Open', front_left_close: 'FL_Close' },
    boot: { open: 'Boot_Open' },
    sunroof: { open: 'Sunroof_Open', close: 'Sunroof_Close' },
  };

  test('does not advertise mechanical controls without complete open/close animation pairs', () => {
    const visible = getVerifiedInteractionControls(['doors', 'boot', 'sunroof', 'headlights'], animationMappings);
    expect(visible.map(({ id }) => id)).toEqual(['doors', 'sunroof', 'headlights']);
  });

  test('hides the interaction panel when every declared mechanical capability is unusable', () => {
    expect(getVerifiedInteractionControls(['doors', 'boot'], { doors: {}, boot: { open: 'Boot_Open' } })).toEqual([]);
  });

  test('keeps lighting capabilities visible without requiring mechanical animation mappings', () => {
    const visible = getVerifiedInteractionControls(['headlights', 'hazard', 'hood'], null);
    expect(visible.map(({ id }) => id)).toEqual(['headlights', 'hazard']);
  });

  test('rejects undeclared mechanical capabilities even with animation names', () => {
    expect(getVerifiedInteractionControls(['headlights'], animationMappings).map(({ id }) => id)).toEqual(['headlights']);
  });
});
