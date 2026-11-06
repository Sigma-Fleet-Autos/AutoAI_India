export const INTERACTION_CONTROLS = [
  { id: 'doors', label: 'Doors', capability: 'doors', group: 'vehicle' },
  { id: 'hood', label: 'Bonnet', capability: 'hood', group: 'vehicle' },
  { id: 'boot', label: 'Boot', capability: 'boot', group: 'vehicle' },
  { id: 'frunk', label: 'Frunk', capability: 'frunk', group: 'vehicle' },
  { id: 'sunroof', label: 'Sunroof', capability: 'sunroof', group: 'vehicle' },
  { id: 'headlights', label: 'Headlights', capability: 'headlights', group: 'lighting' },
  { id: 'drl', label: 'DRL', capability: 'drl', group: 'lighting' },
  { id: 'taillights', label: 'Tail lights', capability: 'taillights', group: 'lighting' },
  { id: 'fog_lights', label: 'Fog lights', capability: 'fog_lights', group: 'lighting' },
  { id: 'left_indicator', label: 'Left indicator', capability: 'left_indicator', group: 'lighting' },
  { id: 'right_indicator', label: 'Right indicator', capability: 'right_indicator', group: 'lighting' },
  { id: 'hazard', label: 'Hazard', capability: 'hazard', group: 'lighting' },
  { id: 'interior', label: 'Interior light', capability: 'interior_lights', group: 'lighting' },
];

export function getSupportedInteractionControls(supportedInteractions = []) {
  const supported = new Set(Array.isArray(supportedInteractions) ? supportedInteractions : []);
  return INTERACTION_CONTROLS.filter((control) => supported.has(control.capability));
}

export function getDoorControls(supportedInteractions = []) {
  return getSupportedInteractionControls(supportedInteractions).filter((control) => control.id === 'doors');
}

const DOOR_ANIMATIONS = {
  frontLeft: ['front_left_open', 'front_left_close'],
  frontRight: ['front_right_open', 'front_right_close'],
  rearLeft: ['rear_left_open', 'rear_left_close'],
  rearRight: ['rear_right_open', 'rear_right_close'],
};

export function hasVerifiedPartAnimations(supportedInteractions, animationMappings, part, doorSide = null) {
  if (!Array.isArray(supportedInteractions) || !supportedInteractions.includes(part)) return false;
  if (!animationMappings || typeof animationMappings !== 'object' || Array.isArray(animationMappings)) return false;
  const mapping = animationMappings[part];
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return false;
  const required = part === 'doors' ? DOOR_ANIMATIONS[doorSide] : ['open', 'close'];
  if (!required) return false;
  return required.every((key) => typeof mapping[key] === 'string' && mapping[key].trim().length > 0);
}
