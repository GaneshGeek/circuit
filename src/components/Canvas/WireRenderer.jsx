import React from 'react';
import { getComponentPinPosition } from '../../utils/circuitEngine';

export default function WireRenderer({ wire, components, isSimulating, pinStates = {}, onDelete }) {
  const { fromId, fromPin, toId, toPin, color, width: strokeWidth } = wire;

  const fromComp = components.find(c => c.id === fromId);
  const toComp = components.find(c => c.id === toId);

  if (!fromComp || !toComp) return null;

  const offset = 4999; // SVG offset to handle negative canvas coordinates

  // Calculate exact pin physical positions
  const p1 = getComponentPinPosition(fromComp, fromPin);
  const p2 = getComponentPinPosition(toComp, toPin);

  const fx = p1.x + offset;
  const fy = p1.y + offset;
  const tx = p2.x + offset;
  const ty = p2.y + offset;

  // L-shaped orthogonal path routing with slight rounded corner feel
  const mx = (fx + tx) / 2;
  const d = `M ${fx} ${fy} L ${mx} ${fy} L ${mx} ${ty} L ${tx} ${ty}`;

  // Check if wire is energized during simulation
  const fromState = pinStates[`${fromId}:${fromPin}`];
  const toState = pinStates[`${toId}:${toPin}`];
  const isHigh = Boolean(fromState?.high || toState?.high);
  const activeColor = isHigh ? (color === '#475569' ? '#38bdf8' : color) : color;

  return (
    <g className="wire-group">
      {/* Outer Glow layer */}
      <path
        d={d}
        fill="none"
        stroke={activeColor}
        strokeWidth={strokeWidth + (isSimulating && isHigh ? 6 : 3)}
        strokeOpacity={isSimulating && isHigh ? 0.35 : 0.12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main wire line */}
      <path
        d={d}
        fill="none"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.shiftKey) onDelete();
        }}
      />

      {/* Animated current pulses when simulating */}
      {isSimulating && (
        <path
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={strokeWidth * 0.75}
          strokeDasharray="6,8"
          strokeLinecap="round"
          strokeOpacity={isHigh ? 0.9 : 0.4}
          style={{
            animation: 'wireDashFlow 0.8s linear infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Connection endpoint solder dots */}
      <circle cx={fx} cy={fy} r={isSimulating && isHigh ? 4.5 : 3.5} fill={activeColor} />
      <circle cx={tx} cy={ty} r={isSimulating && isHigh ? 4.5 : 3.5} fill={activeColor} />
    </g>
  );
}
