import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  MousePointer, ZoomIn, ZoomOut, Move,
  Trash2, RotateCcw, Grid, Play, Square,
  GitBranch, Sparkles, Cpu
} from 'lucide-react';
import { useCircuitStore, useAppStore } from '../../store/store';
import ComponentRenderer from './ComponentRenderer';
import WireRenderer from './WireRenderer';
import SimulationHUD from './SimulationHUD';
import QuickCircuitBuilderModal from './QuickCircuitBuilderModal';
import './Canvas.css';

export default function CircuitCanvas({ onComponentClick }) {
  const {
    components, wires, selectedIds, mode, zoom, canvasOffset,
    gridSize, isSimulating, autoSync, pinStates,
    setMode, setZoom, setCanvasOffset, clearSelection, selectComponent,
    addWire, removeComponent, removeWire, updateComponent,
    startSimulation, stopSimulation, autoWireAndGenerate, setAutoSync
  } = useCircuitStore();

  const { quickBuilderOpen, setQuickBuilderOpen, theme } = useAppStore();

  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [dragComp, setDragComp] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wireStart, setWireStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showGridState, setShowGridState] = useState(true);

  const snapToGrid = (val) => Math.round(val / gridSize) * gridSize;

  const screenToCanvas = useCallback((sx, sy) => ({
    x: (sx - canvasOffset.x) / zoom,
    y: (sy - canvasOffset.y) / zoom,
  }), [canvasOffset, zoom]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const newZoom = Math.min(3, Math.max(0.2, zoom * delta));
    setZoom(newZoom);
    setCanvasOffset({
      x: mx - (mx - canvasOffset.x) * (newZoom / zoom),
      y: my - (my - canvasOffset.y) * (newZoom / zoom),
    });
  }, [zoom, canvasOffset, setZoom, setCanvasOffset]);

  useEffect(() => {
    const el = canvasRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleMouseDown = (e) => {
    if (e.button === 1 || mode === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      return;
    }
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-bg')) {
      clearSelection();
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
    setMousePos(pos);

    if (isPanning && panStart) {
      setCanvasOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (dragComp) {
      updateComponent(dragComp.id, {
        x: snapToGrid(pos.x - dragOffset.x),
        y: snapToGrid(pos.y - dragOffset.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setPanStart(null);
    setDragComp(null);
  };

  const handleComponentMouseDown = (e, comp) => {
    e.stopPropagation();
    if (mode === 'delete') {
      removeComponent(comp.id);
      return;
    }
    if (mode === 'select') {
      selectComponent(comp.id, e.shiftKey || e.ctrlKey);
      const rect = canvasRef.current.getBoundingClientRect();
      const pos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
      setDragComp(comp);
      setDragOffset({ x: pos.x - comp.x, y: pos.y - comp.y });
    }
  };

  const handlePinClick = (compId, pin) => {
    if (mode !== 'wire') return;
    if (!wireStart) {
      setWireStart({ compId, pin });
    } else {
      if (wireStart.compId !== compId || wireStart.pin !== pin) {
        addWire(wireStart.compId, wireStart.pin, compId, pin, []);
      }
      setWireStart(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
    const compData = e.dataTransfer.getData('application/component');
    if (compData) {
      try {
        const def = JSON.parse(compData);
        const { addComponent } = useCircuitStore.getState();
        addComponent(def, {
          x: snapToGrid(pos.x - def.width / 2),
          y: snapToGrid(pos.y - def.height / 2),
        });
      } catch {}
    }
  };

  const tools = [
    { id: 'select', icon: MousePointer, tip: 'Select & Move (V)' },
    { id: 'wire', icon: GitBranch, tip: 'Wire (W)' },
    { id: 'pan', icon: Move, tip: 'Pan (Space)' },
    { id: 'delete', icon: Trash2, tip: 'Delete (Del)' },
  ];

  return (
    <div className="canvas-container">
      {/* Toolbar */}
      <div className="canvas-toolbar">
        <div className="toolbar-section">
          {tools.map(t => (
            <button
              key={t.id}
              className={`btn-icon tooltip ${mode === t.id ? 'active' : ''}`}
              data-tip={t.tip}
              onClick={() => setMode(t.id)}
            >
              <t.icon size={16} />
            </button>
          ))}
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-section">
          <button className="btn-icon tooltip" data-tip="Zoom In" onClick={() => setZoom(zoom * 1.2)}>
            <ZoomIn size={16} />
          </button>
          <span className="zoom-label">{Math.round(zoom * 100)}%</span>
          <button className="btn-icon tooltip" data-tip="Zoom Out" onClick={() => setZoom(zoom * 0.8)}>
            <ZoomOut size={16} />
          </button>
          <button className="btn-icon tooltip" data-tip="Reset View" onClick={() => { setZoom(1); setCanvasOffset({ x: 0, y: 0 }); }}>
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-section">
          <button
            className={`btn-icon tooltip ${showGridState ? 'active' : ''}`}
            data-tip="Toggle Grid"
            onClick={() => setShowGridState(!showGridState)}
          >
            <Grid size={16} />
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Quick Builder & Auto-Wire actions */}
        <div className="toolbar-section">
          <button
            className="quick-build-btn tooltip"
            data-tip="List or pick components to auto-build & run circuit"
            onClick={() => setQuickBuilderOpen(true)}
          >
            <Sparkles size={14} />
            <span>List / Quick Build</span>
          </button>

          <button
            className="auto-wire-btn tooltip"
            data-tip="Auto-wire all components on canvas & update sketch"
            onClick={autoWireAndGenerate}
          >
            <GitBranch size={14} />
            <span>Auto-Wire</span>
          </button>

          <label className="auto-sync-toggle tooltip" data-tip="When ON, dragging components automatically wires them & updates code">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
            />
            <span>Auto-Sync</span>
          </label>
        </div>

        <div style={{ flex: 1 }} />

        {/* Simulation start / stop */}
        <div className="toolbar-section">
          <button
            className={`sim-btn ${isSimulating ? 'stop' : 'start'}`}
            onClick={isSimulating ? stopSimulation : startSimulation}
          >
            {isSimulating ? <><Square size={14} fill="currentColor" /> Stop Simulation</> : <><Play size={14} fill="currentColor" /> Simulate</>}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`canvas-area mode-${mode}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <div
          className="canvas-transform"
          style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})` }}
        >
          {/* Grid */}
          {showGridState && (
            <svg className="canvas-grid" width="100%" height="100%">
              <defs>
                <pattern id="smallGrid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                  <circle cx={gridSize / 2} cy={gridSize / 2} r="0.75" fill={theme === 'light' ? '#94a3b8' : 'rgba(99,102,241,0.3)'} opacity={theme === 'light' ? 0.7 : 1} />
                  <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke={theme === 'light' ? 'rgba(203,213,225,0.45)' : 'rgba(99,102,241,0.08)'} strokeWidth="0.5" />
                </pattern>
                <pattern id="bigGrid" width={gridSize * 5} height={gridSize * 5} patternUnits="userSpaceOnUse">
                  <rect width={gridSize * 5} height={gridSize * 5} fill="url(#smallGrid)" />
                  <path d={`M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}`} fill="none" stroke={theme === 'light' ? 'rgba(148,163,184,0.35)' : 'rgba(99,102,241,0.18)'} strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="9999" height="9999" x="-4999" y="-4999" fill="url(#bigGrid)" />
            </svg>
          )}

          {/* Wires */}
          <svg className="wires-layer" style={{ position: 'absolute', inset: 0, width: '9999px', height: '9999px', left: '-4999px', top: '-4999px', overflow: 'visible', pointerEvents: 'none' }}>
            {wires.map(wire => (
              <WireRenderer
                key={wire.id}
                wire={wire}
                components={components}
                isSimulating={isSimulating}
                pinStates={pinStates}
                onDelete={() => removeWire(wire.id)}
              />
            ))}
            {/* Preview wire while drawing */}
            {wireStart && mode === 'wire' && (() => {
              const fromComp = components.find(c => c.id === wireStart.compId);
              if (!fromComp) return null;
              const fx = fromComp.x + fromComp.width / 2 + 4999;
              const fy = fromComp.y + fromComp.height / 2 + 4999;
              const tx = mousePos.x + 4999;
              const ty = mousePos.y + 4999;
              return (
                <line
                  x1={fx} y1={fy} x2={tx} y2={ty}
                  stroke="rgba(99,102,241,0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  pointerEvents="none"
                />
              );
            })()}
          </svg>

          {/* Components */}
          {components.map(comp => (
            <ComponentRenderer
              key={comp.id}
              component={comp}
              isSelected={selectedIds.includes(comp.id)}
              isSimulating={isSimulating}
              onMouseDown={(e) => handleComponentMouseDown(e, comp)}
              onPinClick={handlePinClick}
              wireMode={mode === 'wire'}
              wireStart={wireStart}
              onClick={() => { if (mode === 'select') onComponentClick?.(comp); }}
            />
          ))}

          {/* Empty state */}
          {components.length === 0 && (
            <div className="canvas-empty">
              <div className="canvas-empty-icon">
                <Cpu size={48} />
              </div>
              <h3>Drag &amp; Drop or Quick Build</h3>
              <p>
                Drag components from the library panel on the left,<br />
                or click <strong>"List / Quick Build"</strong> to auto-assemble any circuit with wires and code!
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: 14, padding: '8px 18px', fontSize: 13 }}
                onClick={() => setQuickBuilderOpen(true)}
              >
                <Sparkles size={15} />
                Open Quick Circuit Builder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Simulation Floating HUD */}
      <SimulationHUD />

      {/* Quick Circuit Builder Modal */}
      {quickBuilderOpen && (
        <QuickCircuitBuilderModal onClose={() => setQuickBuilderOpen(false)} />
      )}

      {/* Status bar */}
      <div className="canvas-statusbar">
        <span>X: {Math.round(mousePos.x)} Y: {Math.round(mousePos.y)}</span>
        <span>
          {components.length} components · {wires.length} wires {autoSync && '· Auto-Sync Active'}
        </span>
        {wireStart && <span className="wire-hint">Click a pin to connect wire · ESC to cancel</span>}
      </div>
    </div>
  );
}
