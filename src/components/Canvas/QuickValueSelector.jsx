import React, { useState } from 'react';
import { X, Check, Sliders, Zap } from 'lucide-react';
import { VALUE_PRESETS } from '../../data/components';
import { useCircuitStore } from '../../store/store';
import './QuickValueSelector.css';

export default function QuickValueSelector({ component, position, onClose }) {
  const { updateComponent } = useCircuitStore();

  const compType = component?.defId || component?.id;
  const presets = compType ? VALUE_PRESETS[compType] || null : null;

  const currentVal =
    component?.properties?.resistance ||
    component?.properties?.capacitance ||
    component?.properties?.voltage ||
    '';

  const [customInput, setCustomInput] = useState(currentVal ? String(currentVal) : '');

  if (!component) return null;

  const handleSelectPreset = (preset) => {
    if (compType === 'resistor') {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          resistance: preset.value,
        },
        label: `${component.symbol || 'R'} (${preset.label})`,
      });
    } else if (compType === 'capacitor' || compType === 'ceramic-capacitor') {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          capacitance: preset.value,
          unit: preset.unit,
        },
        label: `${component.symbol || 'C'} (${preset.label})`,
      });
    } else if (compType === 'led') {
      updateComponent(component.id, {
        color: preset.color,
        properties: {
          ...component.properties,
          color: preset.label.toLowerCase(),
          voltage: preset.voltage,
        },
        label: `LED (${preset.label})`,
      });
    } else if (compType === 'diode-1n4007') {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          model: preset.model,
        },
        label: `Diode (${preset.model})`,
      });
    } else if (compType === 'transistor-2n2222') {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          type: preset.type,
          label: preset.label,
        },
        label: `BJT (${preset.label})`,
      });
    } else if (compType === 'potentiometer') {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          resistance: preset.value,
        },
        label: `POT (${preset.label})`,
      });
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const num = parseFloat(customInput);
    if (isNaN(num) || num <= 0) return;

    if (compType === 'resistor') {
      const formatted = num >= 1000000 ? `${(num / 1000000).toFixed(1)}MΩ` : num >= 1000 ? `${(num / 1000).toFixed(1)}kΩ` : `${num}Ω`;
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          resistance: num,
        },
        label: `${component.symbol || 'R'} (${formatted})`,
      });
    } else if (compType === 'capacitor' || compType === 'ceramic-capacitor') {
      updateComponent(component.id, {
        properties: {
          ...component.properties,
          capacitance: num,
        },
        label: `${component.symbol || 'C'} (${num}${component.properties?.unit || 'µF'})`,
      });
    }
    onClose?.();
  };

  // Clamp popover position so it stays comfortably inside the screen
  const left = Math.max(16, (position?.x || 200) - 120);
  const top = Math.max(70, (position?.y || 200) - 130);

  return (
    <div
      className="quick-value-popover animate-fadeIn"
      style={{ left: `${left}px`, top: `${top}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="qvp-header">
        <div className="qvp-title-group">
          <span className="qvp-symbol">{component.symbol || 'PART'}</span>
          <div className="qvp-title">{component.name}</div>
          {component.packageType && (
            <span className="qvp-package-badge">{component.packageType}</span>
          )}
        </div>
        <button className="qvp-close-btn" onClick={onClose} title="Close value selector">
          <X size={13} />
        </button>
      </div>

      {presets && (
        <div className="qvp-presets">
          <div className="qvp-section-label">
            <Sliders size={11} /> Quick Presets
          </div>
          <div className="qvp-preset-chips">
            {presets.map((p, idx) => {
              const isSelected =
                (compType === 'resistor' && component.properties?.resistance === p.value) ||
                (compType === 'capacitor' && component.properties?.capacitance === p.value) ||
                (compType === 'led' && component.properties?.color === p.label.toLowerCase());

              return (
                <button
                  key={idx}
                  className={`qvp-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(p)}
                >
                  {p.color && (
                    <span
                      className="qvp-color-dot"
                      style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }}
                    />
                  )}
                  {p.label}
                  {isSelected && <Check size={11} className="qvp-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(compType === 'resistor' || compType === 'capacitor') && (
        <form className="qvp-custom-row" onSubmit={handleApplyCustom}>
          <input
            className="qvp-input"
            type="number"
            min="1"
            step="any"
            placeholder={compType === 'resistor' ? 'e.g. 4700' : 'e.g. 47'}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <span className="qvp-unit-label">
            {compType === 'resistor' ? 'Ω' : component.properties?.unit || 'µF'}
          </span>
          <button type="submit" className="qvp-apply-btn" title="Apply custom value">
            Set
          </button>
        </form>
      )}

      {/* Pinout info row */}
      {component.pins && (
        <div className="qvp-pin-info">
          <Zap size={11} />
          <span>
            {Object.entries(component.pins).map(([grp, pList]) => `${grp}: ${(pList || []).join(', ')}`).join(' · ')}
          </span>
        </div>
      )}
    </div>
  );
}
