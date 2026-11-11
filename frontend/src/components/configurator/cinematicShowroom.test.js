import { buildCinematicSequence, getNextCinematicPreset, shouldAdvanceCinematicShowroom } from './cinematicShowroom';

test('buildCinematicSequence keeps only camera presets supported by the verified asset', () => {
  expect(buildCinematicSequence(['camera_exterior'])).toEqual([
    'exterior',
    'front',
    'left',
    'rear',
    'right',
    'top',
  ]);
});

test('buildCinematicSequence includes interior only when the asset declares an interior camera', () => {
  expect(buildCinematicSequence(['camera_exterior', 'camera_interior'])).toEqual([
    'exterior',
    'front',
    'left',
    'rear',
    'right',
    'top',
    'interior',
    'cockpit',
  ]);
});

test('buildCinematicSequence narrows the sequence to verified camera manifest names', () => {
  expect(buildCinematicSequence(['camera_exterior'], ['exterior', 'rear'])).toEqual([
    'exterior',
    'rear',
  ]);
  expect(buildCinematicSequence(['camera_exterior'], [])).toEqual([]);
});

test('getNextCinematicPreset wraps to the first supported preset', () => {
  const sequence = ['front', 'rear', 'right'];
  expect(getNextCinematicPreset(sequence, 'rear')).toBe('right');
  expect(getNextCinematicPreset(sequence, 'right')).toBe('front');
  expect(getNextCinematicPreset(sequence, 'unknown')).toBe('front');
});


test('cinematic showroom advances only when active, visible, unpaused and backed by multiple views', () => {
  const active = { active: true, paused: false, visibilityState: 'visible', sequenceLength: 3 };
  expect(shouldAdvanceCinematicShowroom(active)).toBe(true);
  expect(shouldAdvanceCinematicShowroom({ ...active, visibilityState: 'hidden' })).toBe(false);
  expect(shouldAdvanceCinematicShowroom({ ...active, active: false })).toBe(false);
  expect(shouldAdvanceCinematicShowroom({ ...active, paused: true })).toBe(false);
  expect(shouldAdvanceCinematicShowroom({ ...active, sequenceLength: 1 })).toBe(false);
});
