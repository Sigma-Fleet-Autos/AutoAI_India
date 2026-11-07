/**
 * ConfiguratorViewer — React Three Fiber scene for the verified 3D configurator.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, ContactShadows, Environment } from '@react-three/drei';
import { Maximize2, Minimize2, Share2, Camera, Info, RotateCw, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

import VehicleModel from '../../three/VehicleModel';
import { AssetSuspense, AssetUnavailable } from '../../three/AssetLoader';
import { useLightingController } from '../../three/LightingController';
import { ConfiguratorControls, useCameraPreset } from '../../three/CameraPresets';
import { useConfiguratorStore } from '../../state/configuratorStore';
import { configuratorApi } from '../../services/configuratorApi';
import { normalizeHotspots } from './premiumShowroom';
import { buildConfiguratorShareCard } from './shareCard';
import { buildCinematicSequence, getNextCinematicPreset } from './cinematicShowroom';
import { getVerifiedInteractionControls, hasVerifiedPartAnimations } from './interactionControls';
import { getConfiguratorRenderProfile } from '../../three/configuratorPerformance';
import { resolveSelectedPaintHex } from './selectedPaintColor';

const CINEMATIC_INTERVAL_MS = 4200;

function ConfiguratorScene({ asset, purchasable, interaction, paintColorHex, sceneRef, onManualInteraction, renderProfile, cameraRevision }) {
  const controlsRef = useRef();
  useCameraPreset(interaction.cameraPreset, controlsRef, asset.cameraPresetNames, cameraRevision);
  useLightingController(sceneRef, interaction.lighting, asset.supportedInteractions);
  return <>
    <color attach="background" args={['#060606']} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 8, 5]} intensity={2} castShadow />
    <directionalLight position={[-4, 4, -4]} intensity={0.8} />
    <Environment preset="studio" />
    <Bounds fit clip observe margin={1.3}>
      <AssetSuspense>
        <group ref={sceneRef} position={[0, -0.5, 0]}>
          <VehicleModel asset={asset} purchasable={purchasable} interaction={interaction} paintColorHex={paintColorHex} />
        </group>
      </AssetSuspense>
    </Bounds>
    {renderProfile.contactShadows && <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={14} blur={2.5} far={5} />}
    <ConfiguratorControls cameraPreset={interaction.cameraPreset} autoRotate={interaction.autoRotate} onInteract={onManualInteraction} controlsRef={controlsRef} />
  </>;
}

const CAMERA_LABELS = {
  exterior: 'Exterior',
  front: 'Front',
  rear: 'Rear',
  left: 'Left side',
  right: 'Right side',
  top: 'Top',
  wheel: 'Wheel detail',
  interior: 'Interior',
  cockpit: 'Cockpit',
  boot: 'Boot',
};

const ORBIT_VIEWS = ['exterior', 'front', 'rear', 'left', 'right', 'top'];

function CameraViewTiles({ available, current, onSelect }) {
  const views = Object.entries(CAMERA_LABELS).filter(([preset]) => available.includes(preset));
  if (!views.length) return null;

  return <nav className="configurator-viewpoints" aria-label="Vehicle camera viewpoints">
    {views.map(([preset, label]) => (
      <button key={preset} type="button" aria-pressed={current === preset} onClick={() => onSelect(preset)}>
        {label}
      </button>
    ))}
  </nav>;
}

function optionLabel(options, id) {
  const option = options?.find((item) => (item.option_id || item.color_id || item.wheel_id || item.interior_id || item.roof_id) === id);
  return option?.display_name || option?.name || option?.color_name || option?.wheel_name || option?.interior_name || id || 'Not selected';
}

function InteractionControls({ supportedInteractions, interactionAnimationNames, interaction, onManualInteraction }) {
  const store = useConfiguratorStore();
  const controls = useMemo(() => getVerifiedInteractionControls(supportedInteractions, interactionAnimationNames), [supportedInteractions, interactionAnimationNames]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const has = (id) => controls.some((control) => control.id === id);
  const canMove = (part, side) => has(part) && hasVerifiedPartAnimations(supportedInteractions, interactionAnimationNames, part, side);
  const buttonClass = (active) => `configurator-interaction-button${active ? ' active' : ''}`;
  if (!controls.length) return null;

  const doors = [
    ['frontLeft', 'Front L'],
    ['frontRight', 'Front R'],
    ['rearLeft', 'Rear L'],
    ['rearRight', 'Rear R'],
  ].filter(([side]) => canMove('doors', side));
  const lighting = controls.filter((control) => control.group === 'lighting');

  const lightState = (id) => Boolean(interaction.lighting[id]);
  const toggleLight = (id) => { onManualInteraction(); store.toggleLight(id); };

  return <section className={`configurator-interaction-panel${mobileOpen ? ' mobile-open' : ''}`} aria-label="Verified 3D interactions">
    <button type="button" className="configurator-interaction-mobile-toggle" aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>
      <span><strong>3D controls</strong><small>{controls.length} verified capabilities</small></span>
      {mobileOpen ? <ChevronDown aria-hidden="true" /> : <ChevronUp aria-hidden="true" />}
    </button>
    <div className="configurator-interaction-content">
      <div className="configurator-interaction-heading"><div><h3>3D interactions</h3><p>Verified capabilities only</p></div><span>{controls.length} available</span></div>
      {doors.length > 0 && <div className="configurator-interaction-group"><span className="configurator-interaction-label">Doors</span><div className="configurator-interaction-grid">{doors.map(([side, label]) => <button key={side} type="button" className={buttonClass(interaction.doors[side])} aria-pressed={interaction.doors[side]} onClick={() => { onManualInteraction(); store.toggleDoor(side); }}>{label}</button>)}</div></div>}
      {(canMove('hood') || canMove('boot') || canMove('frunk') || canMove('sunroof')) && <div className="configurator-interaction-group"><span className="configurator-interaction-label">Body</span><div className="configurator-interaction-grid">
        {canMove('hood') && <button type="button" className={buttonClass(interaction.hoodOpen)} aria-pressed={interaction.hoodOpen} onClick={() => { onManualInteraction(); store.toggleHood(); }}>Bonnet</button>}
        {canMove('boot') && <button type="button" className={buttonClass(interaction.bootOpen)} aria-pressed={interaction.bootOpen} onClick={() => { onManualInteraction(); store.toggleBoot(); }}>Boot</button>}
        {canMove('frunk') && <button type="button" className={buttonClass(interaction.frunkOpen)} aria-pressed={interaction.frunkOpen} onClick={() => { onManualInteraction(); store.toggleFrunk(); }}>Frunk</button>}
        {canMove('sunroof') && <button type="button" className={buttonClass(interaction.sunroofOpen)} aria-pressed={interaction.sunroofOpen} onClick={() => { onManualInteraction(); store.toggleSunroof(); }}>Sunroof</button>}
      </div></div>}
      {lighting.length > 0 && <div className="configurator-interaction-group"><span className="configurator-interaction-label">Lighting</span><div className="configurator-interaction-grid">{lighting.map((control) => <button key={control.id} type="button" className={buttonClass(lightState(control.id))} aria-pressed={lightState(control.id)} onClick={() => control.id === 'hazard' ? (onManualInteraction(), store.toggleHazard()) : toggleLight(control.id)}>{control.label}</button>)}</div></div>}
    </div>
  </section>;
}

export default function ConfiguratorViewer({ style, options, variant }) {
  const sceneRef = useRef();
  const canvasRef = useRef(null);
  const [cameraRevision, setCameraRevision] = useState(0);
  const [cinematic, setCinematic] = useState(false);
  const [captureState, setCaptureState] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const asset = useConfiguratorStore((state) => state.asset);
  const purchasable = useConfiguratorStore((state) => state.purchasable);
  const interaction = useConfiguratorStore((state) => state.interaction);
  const showroom = useConfiguratorStore((state) => state.showroom);
  const price = useConfiguratorStore((state) => state.price);
  const city = useConfiguratorStore((state) => state.city);
  const isInitialized = useConfiguratorStore((state) => state.isInitialized);
  const setCameraPreset = useConfiguratorStore((state) => state.setCameraPreset);
  const setAutoRotate = useConfiguratorStore((state) => state.setAutoRotate);
  const setShowroomActive = useConfiguratorStore((state) => state.setShowroomActive);
  const setShowroomPaused = useConfiguratorStore((state) => state.setShowroomPaused);
  const renderProfile = useMemo(() => {
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return getConfiguratorRenderProfile({
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      reducedMotion,
    });
  }, []);

  const paintColorHex = resolveSelectedPaintHex(options?.colors, purchasable.paintId);

  const cinematicSequence = useMemo(
    () => buildCinematicSequence(asset.supportedInteractions, asset.cameraPresetNames),
    [asset.cameraPresetNames, asset.supportedInteractions],
  );

  useEffect(() => {
    if (!showroom.active || !cinematicSequence.length || showroom.paused) return undefined;
    const timer = window.setInterval(() => {
      const currentPreset = useConfiguratorStore.getState().interaction.cameraPreset;
      const nextPreset = getNextCinematicPreset(cinematicSequence, currentPreset);
      if (nextPreset) useConfiguratorStore.getState().setCameraPreset(nextPreset, { pauseShowroom: false });
    }, CINEMATIC_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [cinematicSequence, showroom.active, showroom.paused]);

  useEffect(() => {
    if (showroom.active && !cinematicSequence.length) setShowroomActive(false);
  }, [cinematicSequence.length, setShowroomActive, showroom.active]);

  useEffect(() => {
    if (cinematicSequence.length && !cinematicSequence.includes(interaction.cameraPreset)) {
      setCameraPreset(cinematicSequence[0], { pauseShowroom: false });
    }
  }, [cinematicSequence, interaction.cameraPreset, setCameraPreset]);

  useEffect(() => {
    const handleFullscreenChange = () => setCinematic(document.fullscreenElement === canvasRef.current);
    const exitOnEscape = (event) => {
      if (event.key === 'Escape' && !document.fullscreenElement) setCinematic(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', exitOnEscape);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', exitOnEscape);
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!isInitialized || !asset.available || !purchasable.variantId) {
      setHotspots([]);
      setSelectedHotspot(null);
      return undefined;
    }
    configuratorApi.getHotspots(purchasable.variantId)
      .then(({ data }) => { if (active) setHotspots(normalizeHotspots(data?.hotspots)); })
      .catch(() => { if (active) setHotspots([]); });
    return () => { active = false; };
  }, [asset.available, isInitialized, purchasable.variantId]);

  const toggleCinematic = async () => {
    if (document.fullscreenElement === canvasRef.current) {
      await document.exitFullscreen();
      return;
    }
    if (!cinematic && canvasRef.current?.requestFullscreen) {
      try {
        await canvasRef.current.requestFullscreen();
        return;
      } catch {
        setCinematic(true);
        return;
      }
    }
    setCinematic((value) => !value);
  };

  const toggleShowroom = () => {
    if (!cinematicSequence.length) return;
    setAutoRotate(false);
    if (!showroom.active) {
      const currentPreset = interaction.cameraPreset;
      const firstPreset = cinematicSequence.includes(currentPreset) ? currentPreset : cinematicSequence[0];
      setCameraPreset(firstPreset, { pauseShowroom: false });
      setShowroomActive(true);
      setShowroomPaused(false);
      return;
    }
    setShowroomPaused(!showroom.paused);
  };

  const takeManualControl = () => { setShowroomPaused(true); useConfiguratorStore.getState().pauseAutoRotate(); };

  const capture = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    setCaptureState({ status: 'capturing' });
    buildConfiguratorShareCard(canvas, {
      variant: variant?.display_name || variant?.name || purchasable.variantId,
      color: optionLabel(options?.colors, purchasable.paintId),
      wheels: optionLabel(options?.wheels, purchasable.wheelId),
      interior: optionLabel(options?.interiors, purchasable.interiorId),
      roof: optionLabel(options?.roofs, purchasable.roofId),
      price: price?.total,
      city,
    }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'auto-ai-india-configuration.png';
      anchor.click();
      URL.revokeObjectURL(url);
      setCaptureState({ status: 'ready' });
    }).catch(() => setCaptureState({ status: 'error' }));
  };

  const share = async () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas || !navigator.share) return;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const file = new File([blob], 'auto-ai-india-configuration.png', { type: 'image/png' });
    await navigator.share({ title: 'My Auto AI India configuration', files: [file] });
  };

  const selectHotspotCamera = (preset) => {
    if (!asset.cameraPresetNames.includes(preset)) return;
    setCameraPreset(preset);
  };

  if (!asset.available) {
    return <AssetUnavailable status={asset.configuratorStatus} variantName={[variant?.brand, variant?.model].filter(Boolean).join(' ')} />;
  }

  const orbitAvailable = asset.cameraPresetNames.some((preset) => ORBIT_VIEWS.includes(preset));
  const selectView = (preset) => {
    takeManualControl();
    setCameraPreset(preset);
    setCameraRevision((revision) => revision + 1);
  };

  const toggleOrbit = () => {
    setShowroomPaused(true);
    if (!ORBIT_VIEWS.includes(interaction.cameraPreset)) {
      setCameraPreset(ORBIT_VIEWS.find((preset) => asset.cameraPresetNames.includes(preset)));
    }
    setAutoRotate(!interaction.autoRotate);
  };

  return <section ref={canvasRef} style={style} aria-label="Vehicle visualisation" className={`configurator-viewer${cinematic ? ' cinematic' : ''}`}>
    <div className="configurator-stage">
      <Canvas dpr={renderProfile.dpr} gl={{ preserveDrawingBuffer: true, powerPreference: 'high-performance' }} camera={{ position: [5, 2.5, 5], fov: 35 }}
        fallback={<p className="p-6" role="status">This browser cannot display the interactive 3D model.</p>}>
        <ConfiguratorScene asset={asset} purchasable={purchasable} interaction={interaction} paintColorHex={paintColorHex} sceneRef={sceneRef} onManualInteraction={takeManualControl} renderProfile={renderProfile} cameraRevision={cameraRevision} />
      </Canvas>
      <InteractionControls supportedInteractions={asset.supportedInteractions} interactionAnimationNames={asset.interactionAnimationNames} interaction={interaction} onManualInteraction={takeManualControl} />
      {showroom.active && <div className="configurator-showroom-status" role="status">{showroom.paused ? 'Manual control' : 'Cinematic showroom'} · {interaction.cameraPreset}</div>}
      {captureState?.status === 'error' && <div role="status">Unable to capture configuration.</div>}
      {hotspots.map((hotspot) => <button key={hotspot.id} type="button" className="configurator-hotspot" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }} onClick={() => { takeManualControl(); setSelectedHotspot(hotspot); if (hotspot.cameraPreset) selectHotspotCamera(hotspot.cameraPreset); }} aria-label={hotspot.label}><Info /></button>)}
      {selectedHotspot && <aside className="configurator-hotspot-panel"><strong>{selectedHotspot.label}</strong>{selectedHotspot.description && <p>{selectedHotspot.description}</p>}<button type="button" onClick={() => setSelectedHotspot(null)}>Close</button></aside>}
    </div>
    <div className="configurator-stage-tools" role="group" aria-label="Vehicle display controls">
      {orbitAvailable && <button type="button" onClick={toggleOrbit} aria-pressed={interaction.autoRotate}><RotateCw size={16} aria-hidden="true" /> 360° rotation</button>}
      {cinematicSequence.length > 1 && <button type="button" onClick={toggleShowroom} aria-label={!showroom.active || showroom.paused ? 'Play cinematic showroom' : 'Pause cinematic showroom'}>{showroom.active && !showroom.paused ? <Pause size={16} /> : <Play size={16} />}</button>}
      <button type="button" onClick={() => selectView(asset.cameraPresetNames.includes('exterior') ? 'exterior' : interaction.cameraPreset)} disabled={!asset.cameraPresetNames.length} aria-label="Reset camera"><RotateCw size={16} /></button>
      <button type="button" onClick={toggleCinematic} aria-label={cinematic ? 'Exit fullscreen' : 'Open fullscreen'}>{cinematic ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
      <button type="button" onClick={capture} aria-label="Capture configuration"><Camera size={16} /></button>
      {typeof navigator !== 'undefined' && navigator.share && <button type="button" onClick={share} aria-label="Share configuration"><Share2 size={16} /></button>}
    </div>
    <CameraViewTiles available={asset.cameraPresetNames} current={interaction.cameraPreset} onSelect={selectView} />
  </section>;
}