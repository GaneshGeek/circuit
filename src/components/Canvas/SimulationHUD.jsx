import React, { useState } from 'react';
import { Volume2, VolumeX, Activity, Square, ChevronUp, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import { useCircuitStore } from '../../store/store';
import './SimulationHUD.css';

export default function SimulationHUD() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    isSimulating,
    components,
    sensorValues,
    setSensorValue,
    mcuOutputs,
    soundEnabled,
    toggleSound,
    stopSimulation,
  } = useCircuitStore();

  if (!isSimulating) return null;

  // Detect which sensors are present in the current circuit
  const hasUltrasonic = components.some(c => (c.defId || c.id).includes('hc-sr04'));
  const hasPot = components.some(c => (c.defId || c.id).includes('potentiometer'));
  const hasButton = components.some(c => (c.defId || c.id).includes('button'));
  const hasDHT = components.some(c => (c.defId || c.id).includes('dht'));
  const hasPIR = components.some(c => (c.defId || c.id).includes('pir'));
  const hasLDR = components.some(c => (c.defId || c.id).includes('ldr'));
  const hasSoil = components.some(c => (c.defId || c.id).includes('soil'));
  const hasBuzzer = components.some(c => (c.defId || c.id).includes('buzzer'));
  const hasServo = components.some(c => (c.defId || c.id).includes('servo'));

  const dist = sensorValues.ultrasonicDist ?? 18;
  const pot = sensorValues.potVal ?? 512;
  const isAlarm = hasUltrasonic && dist < 20;

  return (
    <div className={`sim-hud-container animate-slideUp ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header bar */}
      <div className="sim-hud-header">
        <div
          className="sim-hud-title"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer' }}
          title={isCollapsed ? "Touch to expand simulation controls" : "Touch to collapse controls"}
        >
          <span className="sim-pulse-dot" />
          <Activity size={14} className="sim-active-icon" />
          <span>Interactive Hardware Simulation</span>
          <span className="sim-clock-badge">16 MHz</span>
          {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>

        <div className="sim-hud-actions">
          <button
            className="sim-tool-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Touch to expand controls" : "Touch to collapse controls"}
          >
            {isCollapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>

          {hasBuzzer && (
            <button
              className={`sim-tool-btn ${soundEnabled ? 'active' : ''}`}
              onClick={toggleSound}
              title={soundEnabled ? 'Mute buzzer audio' : 'Enable audio tone for buzzer'}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
            </button>
          )}

          <button className="sim-stop-btn" onClick={stopSimulation}>
            <Square size={13} fill="currentColor" /> Stop
          </button>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      {!isCollapsed && (
        <div className="sim-hud-controls">
        {/* Ultrasonic distance slider */}
        {hasUltrasonic && (
          <div className={`sim-control-card ${isAlarm ? 'alarm' : ''}`}>
            <div className="sim-ctrl-label">
              <span>📡 Ultrasonic Distance (HC-SR04)</span>
              <span className={`sim-ctrl-val ${isAlarm ? 'alarm-text' : ''}`}>
                {dist.toFixed(1)} cm {isAlarm && '⚠️ ALARM!'}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="200"
              step="1"
              value={dist}
              onChange={(e) => setSensorValue('ultrasonicDist', Number(e.target.value))}
              className="sim-slider"
            />
            <div className="sim-slider-marks">
              <span>2cm (Close)</span>
              <span style={{ color: '#ef4444' }}>&lt;20cm Alarm</span>
              <span>200cm</span>
            </div>
          </div>
        )}

        {/* Potentiometer slider / angle */}
        {hasPot && (
          <div className="sim-control-card">
            <div className="sim-ctrl-label">
              <span>🎛️ Potentiometer Knob</span>
              <span className="sim-ctrl-val">{pot} / 1023 ({Math.round((pot / 1023) * 100)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1023"
              step="1"
              value={pot}
              onChange={(e) => setSensorValue('potVal', Number(e.target.value))}
              className="sim-slider"
            />
            {hasServo && (
              <div className="sim-ctrl-sub">
                Servo Target Angle: <strong>{mcuOutputs.servoAngle ?? 90}°</strong>
              </div>
            )}
          </div>
        )}

        {/* Push Button Interactive Toggle */}
        {hasButton && (
          <div className="sim-control-card">
            <div className="sim-ctrl-label">
              <span>🔘 Tactile Push Button</span>
              <span className="sim-ctrl-val">
                {sensorValues.btnPressed ? 'PRESSED (LOW)' : 'RELEASED (HIGH)'}
              </span>
            </div>
            <div className="sim-btn-group">
              <button
                className={`sim-press-btn ${sensorValues.btnPressed ? 'pressed' : ''}`}
                onMouseDown={() => setSensorValue('btnPressed', true)}
                onMouseUp={() => setSensorValue('btnPressed', false)}
                onMouseLeave={() => setSensorValue('btnPressed', false)}
              >
                {sensorValues.btnPressed ? '🔘 Holding Pressed...' : '👉 Click & Hold to Press'}
              </button>
            </div>
          </div>
        )}

        {/* DHT Temperature & Humidity */}
        {hasDHT && (
          <div className="sim-control-card">
            <div className="sim-ctrl-label">
              <span>🌡️ DHT Environment Sensor</span>
              <span className="sim-ctrl-val">
                {(sensorValues.temp ?? 24.5).toFixed(1)}°C · {Math.round(sensorValues.humidity ?? 55)}% RH
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="range"
                min="-10"
                max="60"
                value={sensorValues.temp ?? 24.5}
                onChange={(e) => setSensorValue('temp', Number(e.target.value))}
                className="sim-slider"
                title="Temperature (°C)"
              />
              <input
                type="range"
                min="10"
                max="95"
                value={sensorValues.humidity ?? 55}
                onChange={(e) => setSensorValue('humidity', Number(e.target.value))}
                className="sim-slider"
                title="Humidity (%)"
              />
            </div>
          </div>
        )}

        {/* PIR Motion Sensor */}
        {hasPIR && (
          <div className="sim-control-card">
            <div className="sim-ctrl-label">
              <span>🚨 PIR Motion Sensor</span>
              <span className="sim-ctrl-val">{sensorValues.pirMotion ? 'MOTION DETECTED!' : 'Idle'}</span>
            </div>
            <button
              className={`sim-press-btn ${sensorValues.pirMotion ? 'alarm' : ''}`}
              onClick={() => {
                setSensorValue('pirMotion', true);
                setTimeout(() => setSensorValue('pirMotion', false), 2500);
              }}
            >
              {sensorValues.pirMotion ? '🚨 Motion Triggered (Active)' : '🚶 Trigger Motion Pulse'}
            </button>
          </div>
        )}

        {/* LDR Light Sensor */}
        {hasLDR && (
          <div className="sim-control-card">
            <div className="sim-ctrl-label">
              <span>☀️ Ambient Light (LDR)</span>
              <span className="sim-ctrl-val">{sensorValues.lightLevel ?? 65}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sensorValues.lightLevel ?? 65}
              onChange={(e) => setSensorValue('lightLevel', Number(e.target.value))}
              className="sim-slider"
            />
          </div>
        )}

        {/* Soil Moisture */}
        {hasSoil && (
          <div className="sim-control-card">
            <div className="sim-ctrl-label">
              <span>🌱 Soil Moisture Sensor</span>
              <span className="sim-ctrl-val">{sensorValues.soilMoisture ?? 45}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sensorValues.soilMoisture ?? 45}
              onChange={(e) => setSensorValue('soilMoisture', Number(e.target.value))}
              className="sim-slider"
            />
          </div>
        )}

        {/* General status if no interactive sensors */}
        {!hasUltrasonic && !hasPot && !hasButton && !hasDHT && !hasPIR && !hasLDR && !hasSoil && (
          <div className="sim-control-card" style={{ flex: 1 }}>
            <div className="sim-ctrl-label">
              <span>⚡ Circuit Real-Time Execution</span>
              <span className="sim-ctrl-val" style={{ color: '#10b981' }}>Running Smoothly</span>
            </div>
            <p className="sim-ctrl-desc">
              All digital pins and actuators are cycling in real-time according to firmware code.
              Watch the glowing LEDs, pulsating wire currents, and live Serial Monitor output!
            </p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
