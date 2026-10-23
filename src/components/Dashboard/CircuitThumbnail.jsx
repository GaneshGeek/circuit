import React from 'react';
import './CircuitThumbnail.css';

/**
 * Renders a visual schematic/PCB thumbnail for a circuit project.
 * Uses components & wires data or preset layout to draw a realistic circuit board preview.
 */
export default function CircuitThumbnail({ project, status, isSimulating = false }) {
  const components = project?.components || [];
  const wires = project?.wires || [];

  // If no explicit components, check if preset layout exists or generate fallback representation
  const hasLiveComponents = components.length > 0;

  // Determine circuit color theme based on main MCU
  const hasESP32 = components.some(c => (c.defId || c.id || '').includes('esp32'));
  const hasPico = components.some(c => (c.defId || c.id || '').includes('pico') || (c.defId || c.id || '').includes('rp2040'));
  const mcuTheme = hasESP32 ? '#06b6d4' : hasPico ? '#10b981' : '#6366f1';

  return (
    <div className={`circuit-thumbnail-wrapper ${status === 'Simulating' ? 'simulating-active' : ''}`}>
      <svg
        className="circuit-thumbnail-svg"
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* PCB Grid Pattern */}
          <pattern id={`pcb-grid-${project?.id || 'default'}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="0.8" fill="rgba(255,255,255,0.08)" />
            <circle cx="16" cy="16" r="0.8" fill="rgba(255,255,255,0.08)" />
          </pattern>

          {/* Gradients */}
          <linearGradient id="pcb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c1222" />
            <stop offset="100%" stopColor="#080c18" />
          </linearGradient>

          <linearGradient id="uno-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="esp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>

          <linearGradient id="chip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Pulse Glow for Simulating state */}
          <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Board Background */}
        <rect width="320" height="180" fill="url(#pcb-bg)" rx="8" />
        <rect width="320" height="180" fill={`url(#pcb-grid-${project?.id || 'default'})`} rx="8" />

        {/* Silkscreen Corner Guides */}
        <path d="M 12 24 L 12 12 L 24 12" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        <path d="M 308 24 L 308 12 L 296 12" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        <path d="M 12 156 L 12 168 L 24 168" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        <path d="M 308 156 L 308 168 L 296 168" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />

        {/* Mounting Holes */}
        <circle cx="20" cy="20" r="3" fill="#080c18" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />
        <circle cx="300" cy="20" r="3" fill="#080c18" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />
        <circle cx="20" cy="160" r="3" fill="#080c18" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />
        <circle cx="300" cy="160" r="3" fill="#080c18" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" />

        {/* Silkscreen Board Title */}
        <text x="24" y="166" fill="rgba(255,255,255,0.22)" fontSize="7" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.8">
          VOLTCRAFT EDA · REV 2.4 · {project?.name?.toUpperCase()?.slice(0, 18) || 'CIRCUIT'}
        </text>

        {/* Circuit Traces & Components Rendering */}
        {hasLiveComponents ? (
          <g className="circuit-live-elements">
            {/* Render Wires first (behind components) */}
            {wires.map((w, idx) => {
              const fromComp = components.find(c => c.id === w.fromId);
              const toComp = components.find(c => c.id === w.toId);
              if (!fromComp || !toComp) return null;

              // Scale down coordinates from canvas space (typical 0-800) to 320x180
              const x1 = Math.min(290, Math.max(30, (fromComp.x || 100) * 0.38 + 20));
              const y1 = Math.min(155, Math.max(25, (fromComp.y || 80) * 0.34 + 20));
              const x2 = Math.min(290, Math.max(30, (toComp.x || 200) * 0.38 + 20));
              const y2 = Math.min(155, Math.max(25, (toComp.y || 80) * 0.34 + 20));
              const cx = (x1 + x2) / 2;

              const wireColors = ['#ef4444', '#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'];
              const wireColor = w.color || wireColors[idx % wireColors.length];

              return (
                <g key={w.id || idx}>
                  <path
                    d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={wireColor}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity={status === 'Simulating' ? 0.95 : 0.75}
                    filter={status === 'Simulating' ? 'url(#wire-glow)' : undefined}
                    className={status === 'Simulating' ? 'wire-pulse' : ''}
                  />
                  <circle cx={x1} cy={y1} r="2" fill={wireColor} />
                  <circle cx={x2} cy={y2} r="2" fill={wireColor} />
                </g>
              );
            })}

            {/* Render Component Footprints */}
            {components.map((c, idx) => {
              const x = Math.min(260, Math.max(25, (c.x || 100) * 0.38 + 10));
              const y = Math.min(135, Math.max(25, (c.y || 80) * 0.34 + 10));
              const cType = (c.defId || c.id || '').toLowerCase();
              const isMcu = cType.includes('uno') || cType.includes('esp32') || cType.includes('pico') || cType.includes('nano');

              if (isMcu) {
                return (
                  <g key={c.id || idx} transform={`translate(${x}, ${y})`}>
                    <rect width="64" height="42" rx="4" fill="url(#uno-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    {/* ATmega / MCU chip */}
                    <rect x="20" y="12" width="24" height="18" rx="2" fill="url(#chip-grad)" stroke="#475569" strokeWidth="0.8" />
                    <circle cx="23" cy="15" r="1" fill="#64748b" />
                    <text x="32" y="23" fill="#cbd5e1" fontSize="4.5" textAnchor="middle" fontWeight="bold">MCU</text>
                    {/* Header pins top & bottom */}
                    {Array.from({ length: 8 }).map((_, pi) => (
                      <rect key={`pt-${pi}`} x={6 + pi * 6.5} y="2" width="3" height="4" rx="0.5" fill="#f59e0b" />
                    ))}
                    {Array.from({ length: 8 }).map((_, pi) => (
                      <rect key={`pb-${pi}`} x={6 + pi * 6.5} y="36" width="3" height="4" rx="0.5" fill="#f59e0b" />
                    ))}
                  </g>
                );
              }

              // Sensor or peripheral
              return (
                <g key={c.id || idx} transform={`translate(${x}, ${y})`}>
                  <rect width="28" height="22" rx="3" fill="#1e293b" stroke={c.color || '#6366f1'} strokeWidth="1" />
                  <circle cx="14" cy="11" r="5" fill={c.color ? `${c.color}33` : 'rgba(99,102,241,0.2)'} />
                  <circle cx="14" cy="11" r="2.5" fill={c.color || '#6366f1'} />
                  {/* Pin headers */}
                  <rect x="4" y="19" width="3" height="2" fill="#f59e0b" />
                  <rect x="12" y="19" width="3" height="2" fill="#f59e0b" />
                  <rect x="20" y="19" width="3" height="2" fill="#f59e0b" />
                </g>
              );
            })}
          </g>
        ) : (
          /* High-Fidelity Default Schematic Vector (for sample/new projects) */
          <g className="circuit-default-schematic">
            {/* Background Copper Traces */}
            <path
              d="M 40 40 L 90 40 L 110 65 L 140 65 M 140 100 L 170 100 L 190 125 L 280 125 M 70 140 L 120 140 L 140 115"
              fill="none"
              stroke="rgba(99, 102, 241, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* MCU Board Footprint */}
            <g transform="translate(110, 48)">
              {/* Board body */}
              <rect width="95" height="66" rx="6" fill="url(#uno-grad)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
              {/* USB connector */}
              <rect x="-8" y="12" width="10" height="14" rx="2" fill="#94a3b8" />
              {/* Power jack */}
              <rect x="-6" y="40" width="8" height="16" rx="2" fill="#334155" />
              {/* ATmega MCU */}
              <rect x="34" y="20" width="36" height="26" rx="3" fill="url(#chip-grad)" stroke="#475569" strokeWidth="1" />
              <circle cx="40" cy="26" r="1.5" fill="#64748b" />
              <text x="52" y="35" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="'Inter', sans-serif">
                ATmega328P
              </text>
              <text x="52" y="42" fill="#94a3b8" fontSize="4.5" textAnchor="middle">16.0 MHz</text>
              {/* Header pin bars */}
              {Array.from({ length: 10 }).map((_, i) => (
                <rect key={`top-${i}`} x={12 + i * 7.2} y="3" width="3.5" height="5" rx="0.8" fill="#f59e0b" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <rect key={`bot-${i}`} x={12 + i * 7.2} y="58" width="3.5" height="5" rx="0.8" fill="#f59e0b" />
              ))}
              {/* Builtin LED */}
              <circle cx="24" cy="22" r="2.5" fill={status === 'Simulating' ? '#10b981' : '#64748b'} />
              {status === 'Simulating' && (
                <circle cx="24" cy="22" r="5" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.6" className="led-ring" />
              )}
            </g>

            {/* Peripheral 1: Sensor Module (Left) */}
            <g transform="translate(35, 62)">
              <rect width="44" height="46" rx="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
              <rect x="6" y="6" width="32" height="24" rx="2" fill="#0891b2" opacity="0.85" />
              {/* Sensor grill */}
              <path d="M 12 12 L 32 12 M 12 18 L 32 18 M 12 24 L 32 24" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
              <text x="22" y="40" fill="#94a3b8" fontSize="5" textAnchor="middle" fontWeight="600">DHT22</text>
            </g>

            {/* Peripheral 2: Output Display/Actuator (Right) */}
            <g transform="translate(235, 54)">
              <rect width="52" height="58" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
              {/* OLED Screen frame */}
              <rect x="6" y="6" width="40" height="30" rx="2" fill="#020617" stroke="#334155" strokeWidth="0.8" />
              <text x="26" y="18" fill="#38bdf8" fontSize="5" fontWeight="bold" textAnchor="middle">VOLT 3.3V</text>
              <path d="M 10 26 L 16 26 L 20 20 L 26 30 L 32 26 L 42 26" fill="none" stroke="#10b981" strokeWidth="1" />
              {/* Pins */}
              <rect x="14" y="46" width="3" height="6" fill="#f59e0b" />
              <rect x="22" y="46" width="3" height="6" fill="#f59e0b" />
              <rect x="30" y="46" width="3" height="6" fill="#f59e0b" />
              <rect x="38" y="46" width="3" height="6" fill="#f59e0b" />
            </g>

            {/* Connecting Wire Traces with distinct colors */}
            {/* Wire 1 (Power: VCC Red) */}
            <path
              d="M 79 72 C 95 72, 95 56, 122 56"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={status === 'Simulating' ? 'wire-pulse' : ''}
            />
            {/* Wire 2 (Data: Cyan) */}
            <path
              d="M 79 84 C 95 84, 95 90, 122 90"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={status === 'Simulating' ? 'wire-pulse' : ''}
            />
            {/* Wire 3 (I2C SDA: Green) */}
            <path
              d="M 205 60 C 218 60, 218 66, 249 66"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={status === 'Simulating' ? 'wire-pulse' : ''}
            />
            {/* Wire 4 (I2C SCL: Amber) */}
            <path
              d="M 205 92 C 220 92, 220 100, 257 100"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={status === 'Simulating' ? 'wire-pulse' : ''}
            />
          </g>
        )}

        {/* Live Simulation Indicator Signal Waves */}
        {status === 'Simulating' && (
          <g transform="translate(285, 20)">
            <circle cx="0" cy="0" r="4" fill="#06b6d4" />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.6" className="sim-wave-1" />
            <circle cx="0" cy="0" r="12" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.3" className="sim-wave-2" />
          </g>
        )}
      </svg>
    </div>
  );
}
