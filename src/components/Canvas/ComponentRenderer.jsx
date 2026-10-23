import React from 'react';
import { useCircuitStore, useAppStore } from '../../store/store';
import ComponentIllustration from '../Common/ComponentImage';
import { getComponentPinPosition, getCompBaseType } from '../../utils/circuitEngine';

export default function ComponentRenderer({
  component, isSelected, isSimulating, onMouseDown, onPinClick, wireMode, wireStart, onClick
}) {
  const { pinStates, mcuOutputs, setSensorValue } = useCircuitStore();
  const { theme } = useAppStore();
  const { id, defId, x, y, width, height, color, accentColor, symbol, label, pins, rotation } = component;

  const baseType = getCompBaseType(component);
  const allPins = Object.entries(pins || {}).flatMap(([group, pinList]) =>
    (pinList || []).map((pin, idx) => ({ group, pin, idx }))
  );

  const getPinState = (pin) => {
    return pinStates[`${id}:${pin}`] || null;
  };

  const compDefId = defId || id;

  // Simulation states
  const ledState = mcuOutputs[id];
  const isLedOn = Boolean(ledState?.active || pinStates[`${id}:A`]?.high);
  const isBuzzerOn = Boolean(mcuOutputs.buzzerActive && baseType === 'buzzer');
  const servoAngle = mcuOutputs.servoAngle !== undefined ? mcuOutputs.servoAngle : 90;
  const lcdData = mcuOutputs[id];
  const oledData = mcuOutputs[id];
  const isMotorSpinning = isSimulating && baseType === 'dc-motor';
  const isRelayOn = Boolean(mcuOutputs.relayActive && baseType === 'relay');

  return (
    <div
      className={`circuit-component ${isSelected ? 'selected' : ''} ${wireMode ? 'wire-mode' : ''}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {/* Component body */}
      <div
        className="comp-body"
        style={{
          width: '100%',
          height: '100%',
          background: theme === 'light'
            ? `radial-gradient(circle at 50% 50%, ${color}12, #ffffff)`
            : `radial-gradient(circle at 50% 50%, ${color}22, rgba(15, 23, 42, 0.94))`,
          border: `1.5px solid ${isSelected ? accentColor : theme === 'light' ? '#cbd5e1' : color + '88'}`,
          borderRadius: '8px',
          boxShadow: isSelected
            ? `0 0 0 2px ${accentColor}88, 0 4px 16px ${color}33`
            : isLedOn
            ? `0 0 25px ${color || '#ef4444'}, 0 0 10px #ffffff`
            : theme === 'light'
            ? '0 1px 4px rgba(0,0,0,0.06)'
            : '0 2px 8px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: wireMode ? 'crosshair' : 'grab',
          userSelect: 'none',
          transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
      >
        {/* Shimmer overlay */}
        <div className="comp-shimmer" style={{ background: `linear-gradient(135deg, ${accentColor}11, transparent)` }} />

        {/* Realistic Component Visual Illustration */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <ComponentIllustration
            componentId={compDefId}
            width={Math.max(26, width - 8)}
            height={Math.max(20, height - 16)}
            properties={component.properties}
          />

          {/* Interactive Servo Motor rotating horn in simulation */}
          {baseType === 'servo' && isSimulating && (
            <div
              style={{
                position: 'absolute',
                width: 24,
                height: 4,
                background: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 0 6px rgba(0,0,0,0.8)',
                transformOrigin: '4px 2px',
                transform: `rotate(${servoAngle - 90}deg)`,
                transition: 'transform 0.08s linear',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* DC Motor spinning indicator */}
          {isMotorSpinning && (
            <div
              style={{
                position: 'absolute',
                width: 22,
                height: 22,
                border: '2px dashed #38bdf8',
                borderRadius: '50%',
                animation: 'spin 0.4s linear infinite',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* LCD 16x2 simulated live text */}
          {baseType === 'lcd-16x2' && isSimulating && (
            <div
              style={{
                position: 'absolute',
                inset: '12px 10px',
                background: '#047857',
                color: '#ecfdf5',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 7.5,
                lineHeight: 1.25,
                padding: '3px 4px',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div>{lcdData?.line1 || 'VoltCraft EDA'}</div>
              <div>{lcdData?.line2 || 'Sim Active...'}</div>
            </div>
          )}

          {/* OLED simulated live display */}
          {baseType === 'oled-128x64' && isSimulating && (
            <div
              style={{
                position: 'absolute',
                inset: '14px 10px',
                background: '#090d16',
                color: '#38bdf8',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 6.8,
                padding: '2px 4px',
                borderRadius: 2,
                border: '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#f8fafc' }}>{oledData?.title || 'VOLTCRAFT'}</div>
              <div>{oledData?.value1 || 'Temp: 24.5C'}</div>
              <div>{oledData?.value2 || 'Humid: 55%'}</div>
            </div>
          )}
        </div>

        {/* Small identification tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            background: theme === 'light' ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
            border: `1px solid ${theme === 'light' ? '#e2e8f0' : accentColor + '44'}`,
            borderRadius: 3,
            padding: '1px 5px',
            color: theme === 'light' ? '#0f172a' : '#e2e8f0',
            fontSize: 8.5,
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 3,
            boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          {label || symbol}
        </div>

        {/* Interactive Push Button Click overlay */}
        {baseType === 'push-button' && (
          <button
            style={{
              position: 'absolute',
              inset: 4,
              opacity: 0,
              cursor: 'pointer',
              zIndex: 6,
            }}
            title="Click to press button"
            onMouseDown={(e) => {
              e.stopPropagation();
              setSensorValue('btnPressed', true);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              setSensorValue('btnPressed', false);
            }}
          />
        )}

        {/* Live Simulation LED Radiant Glow effect */}
        {(baseType === 'led' || compDefId.includes('led')) && isSimulating && (
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 12,
              background: isLedOn
                ? `radial-gradient(circle, ${color || '#ef4444'}ee 0%, ${color || '#ef4444'}44 50%, transparent 80%)`
                : 'transparent',
              opacity: isLedOn ? 1 : 0.05,
              transition: 'opacity 0.15s ease',
              pointerEvents: 'none',
              boxShadow: isLedOn ? `0 0 20px ${color || '#ef4444'}` : 'none',
            }}
          />
        )}

        {/* Buzzer Sound Wave ripples */}
        {isBuzzerOn && isSimulating && (
          <div
            style={{
              position: 'absolute',
              inset: -8,
              border: '2px solid #eab308',
              borderRadius: '50%',
              animation: 'buzzerWave 0.5s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Relay indicator */}
        {isRelayOn && (
          <div
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Pins */}
      {allPins.map(({ group, pin }) => {
        const pinPos = getComponentPinPosition(component, pin);
        const relX = pinPos.x - x;
        const relY = pinPos.y - y;

        const state = getPinState(pin);
        const pinColor = state?.high ? '#10b981' : state ? '#ef4444' : '#6366f1';
        const isWireFrom = wireStart?.compId === id && wireStart?.pin === pin;

        return (
          <div
            key={`${group}-${pin}`}
            className={`comp-pin ${wireMode ? 'wire-mode' : ''} ${isWireFrom ? 'wire-from' : ''}`}
            style={{
              position: 'absolute',
              left: relX - 5,
              top: relY - 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isWireFrom ? '#f59e0b' : pinColor + 'cc',
              border: `2px solid ${isWireFrom ? '#f59e0b' : pinColor}`,
              boxShadow: isWireFrom
                ? '0 0 8px #f59e0b'
                : state?.high
                ? '0 0 8px #10b981'
                : '0 1px 3px rgba(0,0,0,0.5)',
              cursor: wireMode ? 'crosshair' : 'default',
              zIndex: 5,
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
            }}
            onClick={(e) => { e.stopPropagation(); onPinClick?.(id, pin); }}
            title={`${pin} (${group})${state ? ` - ${state.high ? 'HIGH (5V)' : 'LOW (0V)'}` : ''}`}
          />
        );
      })}

      {/* Selection handles */}
      {isSelected && (
        <>
          <div className="sel-handle" style={{ top: -4, left: -4 }} />
          <div className="sel-handle" style={{ top: -4, right: -4 }} />
          <div className="sel-handle" style={{ bottom: -4, left: -4 }} />
          <div className="sel-handle" style={{ bottom: -4, right: -4 }} />
        </>
      )}
    </div>
  );
}
