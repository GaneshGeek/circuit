import React, { useState } from 'react';
import { X, Sparkles, Cpu, Layers, Play, CheckCircle2, ArrowRight, Zap, Code, GitBranch } from 'lucide-react';
import { useCircuitStore, useAppStore } from '../../store/store';
import { PRESET_PROJECTS } from '../../utils/circuitEngine';
import { COMPONENTS } from '../../data/components';
import './QuickCircuitBuilderModal.css';

export default function QuickCircuitBuilderModal({ onClose }) {
  const { loadPresetProject, buildFromComponentList, startSimulation } = useCircuitStore();
  const { setRightPanelTab } = useAppStore();

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'presets'
  const [componentText, setComponentText] = useState('Arduino Uno, HC-SR04 Ultrasonic, Passive Buzzer, Red LED, Resistor');
  const [selectedChips, setSelectedChips] = useState(['arduino-uno', 'hc-sr04', 'buzzer', 'led', 'resistor']);
  const [autoSimulateAfterBuild, setAutoSimulateAfterBuild] = useState(true);

  // Suggested popular hardware tags
  const POPULAR_TAGS = [
    { id: 'arduino-uno', name: 'Arduino Uno R3', category: 'MCU' },
    { id: 'esp32', name: 'ESP32 Dev Board', category: 'MCU' },
    { id: 'rp2040', name: 'Raspberry Pi Pico', category: 'MCU' },
    { id: 'hc-sr04', name: 'HC-SR04 Ultrasonic', category: 'Sensor' },
    { id: 'dht22', name: 'DHT22 Temp & Humid', category: 'Sensor' },
    { id: 'potentiometer', name: 'Potentiometer', category: 'Sensor' },
    { id: 'push-button', name: 'Push Button', category: 'Input' },
    { id: 'pir', name: 'PIR Motion Sensor', category: 'Sensor' },
    { id: 'soil-moisture', name: 'Soil Moisture', category: 'Sensor' },
    { id: 'ldr', name: 'LDR Photoresistor', category: 'Sensor' },
    { id: 'led', name: 'LED Indicator', category: 'Actuator' },
    { id: 'servo', name: 'SG90 Micro Servo', category: 'Actuator' },
    { id: 'buzzer', name: 'Passive Buzzer', category: 'Actuator' },
    { id: 'relay', name: '5V Relay Module', category: 'Actuator' },
    { id: 'lcd-16x2', name: 'LCD 16x2 (I2C)', category: 'Display' },
    { id: 'oled-128x64', name: 'OLED Display', category: 'Display' },
    { id: 'resistor', name: '220Ω Resistor', category: 'Passive' },
  ];

  const toggleChip = (id) => {
    let next;
    if (selectedChips.includes(id)) {
      next = selectedChips.filter(c => c !== id);
    } else {
      next = [...selectedChips, id];
    }
    setSelectedChips(next);

    // Update text box representation
    const names = next.map(cid => {
      const found = COMPONENTS.find(c => c.id === cid);
      return found ? found.name : cid;
    });
    setComponentText(names.join(', '));
  };

  const handleBuildFromList = () => {
    let success = false;
    if (selectedChips.length > 0) {
      success = buildFromComponentList(selectedChips);
    } else {
      success = buildFromComponentList(componentText);
    }

    if (success) {
      setRightPanelTab('code');
      if (autoSimulateAfterBuild) {
        setTimeout(() => startSimulation(), 300);
      }
      onClose();
    }
  };

  const handleLoadPreset = (presetId) => {
    loadPresetProject(presetId);
    setRightPanelTab('code');
    if (autoSimulateAfterBuild) {
      setTimeout(() => startSimulation(), 300);
    }
    onClose();
  };

  return (
    <div className="builder-modal-backdrop" onClick={onClose}>
      <div className="builder-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="builder-header">
          <div className="builder-header-left">
            <div className="builder-icon-box">
              <Sparkles size={20} className="glow-cyan" />
            </div>
            <div>
              <h2
                className="builder-title"
                onClick={onClose}
                style={{ cursor: 'pointer' }}
                title="Touch to close"
              >
                Instant Circuit Builder &amp; Auto-Wiring
              </h2>
              <p className="builder-subtitle">
                List or select components — the engine automatically places them, wires every pin, generates the C++ code, and runs the live simulation!
              </p>
            </div>
          </div>
          <button className="builder-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="builder-tabs">
          <button
            className={`builder-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <Layers size={14} />
            <span>List Components</span>
          </button>
          <button
            className={`builder-tab ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Cpu size={14} />
            <span>Ready-to-Run Starter Circuits ({PRESET_PROJECTS.length})</span>
          </button>
        </div>

        {/* Tab 1: List / Custom Build */}
        {activeTab === 'list' && (
          <div className="builder-body">
            <div className="builder-field-group">
              <label className="builder-label">
                Type or paste your components list:
              </label>
              <textarea
                className="builder-textarea"
                rows={3}
                placeholder="e.g. Arduino Uno, HC-SR04 Ultrasonic, Passive Buzzer, Red LED, Resistor"
                value={componentText}
                onChange={e => setComponentText(e.target.value)}
              />
            </div>

            <div className="builder-field-group">
              <label className="builder-label">
                Or click to add/remove components:
              </label>
              <div className="builder-chips-grid">
                {POPULAR_TAGS.map(tag => {
                  const isSelected = selectedChips.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      className={`builder-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleChip(tag.id)}
                    >
                      <span className="chip-cat">{tag.category}</span>
                      <span className="chip-name">{tag.name}</span>
                      {isSelected && <CheckCircle2 size={13} className="chip-check" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feature highlights */}
            <div className="builder-features-row">
              <div className="b-feat">
                <GitBranch size={14} style={{ color: '#6366f1' }} />
                <span>Auto-Wiring: VCC, GND &amp; Signal lines</span>
              </div>
              <div className="b-feat">
                <Code size={14} style={{ color: '#10b981' }} />
                <span>Firmware Code: Full setup() &amp; loop()</span>
              </div>
              <div className="b-feat">
                <Play size={14} style={{ color: '#f59e0b' }} />
                <span>Live Simulation: Interactive HUD</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="builder-footer">
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={autoSimulateAfterBuild}
                  onChange={e => setAutoSimulateAfterBuild(e.target.checked)}
                />
                <span>Start interactive simulation immediately</span>
              </label>

              <button className="builder-build-btn" onClick={handleBuildFromList}>
                <Zap size={16} fill="currentColor" />
                <span>Build, Wire &amp; Code Circuit</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Preset Recipes */}
        {activeTab === 'presets' && (
          <div className="builder-body">
            <div className="builder-presets-grid">
              {PRESET_PROJECTS.map(preset => (
                <div key={preset.id} className="preset-card card">
                  <div className="preset-card-header">
                    <span className="preset-icon">{preset.icon}</span>
                    <div>
                      <h4 className="preset-title">{preset.title}</h4>
                      <span className="preset-category">{preset.category}</span>
                    </div>
                  </div>
                  <p className="preset-desc">{preset.description}</p>
                  <div className="preset-components-tags">
                    {preset.componentIds.map(cid => (
                      <span key={cid} className="preset-tag">{cid}</span>
                    ))}
                  </div>
                  <button
                    className="preset-load-btn"
                    onClick={() => handleLoadPreset(preset.id)}
                  >
                    <Play size={13} />
                    <span>Load &amp; Run Project</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
