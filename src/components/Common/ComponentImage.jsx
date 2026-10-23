import React from 'react';

/**
 * High-fidelity, authentic vector illustrations for all 36+ electronic components
 * in the VoltCraft catalog. Renders clean, scalable SVGs matching real-world hardware.
 */

export function ComponentIllustration({ componentId, width = 100, height = 70, className = '', glow = false, properties = null }) {
  const id = (componentId || '').toLowerCase().trim();

  // Helper gradient defs used across components
  const renderDefs = () => (
    <defs>
      {/* PCB Green */}
      <linearGradient id="pcbGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#0f5127" />
      </linearGradient>

      {/* Arduino Teal Blue */}
      <linearGradient id="arduinoTeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>

      {/* Silver Metal */}
      <linearGradient id="metalSilver" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>

      {/* Gold plating */}
      <linearGradient id="goldPad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>

      {/* IC Black Epoxy */}
      <linearGradient id="icBlack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#27272a" />
        <stop offset="100%" stopColor="#18181b" />
      </linearGradient>

      {/* Translucent LED Glow */}
      <radialGradient id="ledRedGlow" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="40%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </radialGradient>

      {/* Resistor Tan Ceramic */}
      <linearGradient id="resistorBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>

      {/* Electrolytic Blue Can */}
      <linearGradient id="capBlue" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="30%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>

      {/* Ultrasonic Transducer Mesh */}
      <radialGradient id="sonarMesh" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="70%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </radialGradient>

      {/* OLED Active Matrix */}
      <linearGradient id="oledBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#090d16" />
        <stop offset="100%" stopColor="#020408" />
      </linearGradient>
    </defs>
  );

  switch (id) {
    /* -------------------------------------------------------------
       ARDUINO UNO R3
       ------------------------------------------------------------- */
    case 'arduino-uno':
      return (
        <svg viewBox="0 0 160 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Main PCB */}
          <rect x="10" y="10" width="140" height="90" rx="8" fill="url(#arduinoTeal)" stroke="#38bdf8" strokeWidth="1" />
          <path d="M 10 32 L 20 32 L 20 10" fill="none" stroke="#0284c7" strokeWidth="2" />
          
          {/* Mounting holes */}
          <circle cx="20" cy="20" r="3.5" fill="#0b1320" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="20" cy="90" r="3.5" fill="#0b1320" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="140" cy="20" r="3.5" fill="#0b1320" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="140" cy="90" r="3.5" fill="#0b1320" stroke="#fbbf24" strokeWidth="1" />

          {/* USB Type-B Port */}
          <rect x="6" y="24" width="24" height="20" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <rect x="8" y="28" width="8" height="12" rx="1" fill="#1e293b" />

          {/* DC Power Barrel Jack */}
          <rect x="6" y="66" width="22" height="24" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <rect x="2" y="72" width="6" height="12" rx="1" fill="#0f172a" />

          {/* ATmega328P DIP IC */}
          <rect x="64" y="52" width="46" height="18" rx="2" fill="url(#icBlack)" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="68" cy="61" r="2" fill="#3f3f46" />
          <text x="87" y="64" fill="#a1a1aa" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ATmega328P</text>
          {/* IC Pins */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <g key={i}>
              <rect x={68 + i * 5.6} y="48" width="2.5" height="4" fill="url(#metalSilver)" />
              <rect x={68 + i * 5.6} y="70" width="2.5" height="4" fill="url(#metalSilver)" />
            </g>
          ))}

          {/* 16MHz Crystal */}
          <rect x="42" y="56" width="12" height="6" rx="3" fill="url(#metalSilver)" stroke="#94a3b8" strokeWidth="0.5" />
          <text x="48" y="60.5" fill="#475569" fontSize="3" fontFamily="monospace" textAnchor="middle">16.0</text>

          {/* Reset button */}
          <rect x="36" y="20" width="8" height="8" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="40" cy="24" r="2.5" fill="#ef4444" />

          {/* Female Header Rails: Digital */}
          <rect x="52" y="12" width="82" height="7" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          {[...Array(14)].map((_, i) => (
            <rect key={i} x={54 + i * 5.6} y="13.5" width="3" height="4" rx="0.5" fill="#38bdf8" opacity="0.8" />
          ))}

          {/* Female Header Rails: Power & Analog */}
          <rect x="60" y="91" width="74" height="7" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          {[...Array(12)].map((_, i) => (
            <rect key={i} x={62 + i * 5.7} y="92.5" width="3" height="4" rx="0.5" fill="#f59e0b" opacity="0.8" />
          ))}

          {/* Silk screen text */}
          <text x="96" y="32" fill="#ffffff" opacity="0.9" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="900" letterSpacing="0.5">ARDUINO</text>
          <text x="126" y="42" fill="#ffffff" opacity="0.8" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold">UNO</text>
          <text x="100" y="25" fill="#38bdf8" fontSize="4.5" fontFamily="monospace">DIGITAL (PWM~)</text>
          <text x="100" y="87" fill="#fbbf24" fontSize="4.5" fontFamily="monospace">ANALOG IN</text>
          <circle cx="34" cy="40" r="1.5" fill="#22c55e" /> {/* ON LED */}
          <circle cx="48" cy="40" r="1.5" fill="#f59e0b" /> {/* L LED */}
        </svg>
      );

    /* -------------------------------------------------------------
       ESP32 DEV BOARD
       ------------------------------------------------------------- */
    case 'esp32':
      return (
        <svg viewBox="0 0 110 140" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black PCB */}
          <rect x="15" y="10" width="80" height="120" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

          {/* Meandering Antenna trace */}
          <path d="M 30 18 L 30 28 L 36 28 L 36 18 L 42 18 L 42 28 L 48 28 L 48 18 L 54 18 L 54 28 L 60 28 L 60 18 L 66 18 L 66 28 L 72 28 L 72 18 L 78 18"
            fill="none" stroke="url(#goldPad)" strokeWidth="2" strokeLinecap="round" />

          {/* Metal RF Shield */}
          <rect x="25" y="34" width="60" height="48" rx="3" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <rect x="27" y="36" width="56" height="44" rx="2" fill="#94a3b8" opacity="0.2" />
          <text x="55" y="52" fill="#334155" fontSize="7" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">ESP-WROOM-32</text>
          <text x="55" y="62" fill="#475569" fontSize="5" fontFamily="monospace" textAnchor="middle">FCC ID: 2AC7Z</text>
          <circle cx="34" cy="72" r="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />

          {/* Micro USB Port */}
          <rect x="42" y="122" width="26" height="12" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <rect x="47" y="125" width="16" height="6" rx="1" fill="#0f172a" />

          {/* CP2102 Bridge Chip */}
          <rect x="47" y="90" width="16" height="16" rx="1.5" fill="url(#icBlack)" />

          {/* EN & BOOT Buttons */}
          <rect x="24" y="112" width="8" height="8" rx="1.5" fill="#3f3f46" />
          <circle cx="28" cy="116" r="2.5" fill="#f43f5e" />
          <text x="28" y="125" fill="#a1a1aa" fontSize="4" textAnchor="middle">EN</text>

          <rect x="78" y="112" width="8" height="8" rx="1.5" fill="#3f3f46" />
          <circle cx="82" cy="116" r="2.5" fill="#38bdf8" />
          <text x="82" y="125" fill="#a1a1aa" fontSize="4" textAnchor="middle">BOOT</text>

          {/* Dual row header pins */}
          {[...Array(15)].map((_, i) => (
            <g key={i}>
              <rect x="17" y={22 + i * 6.5} width="4" height="4" rx="0.5" fill="url(#goldPad)" />
              <rect x="89" y={22 + i * 6.5} width="4" height="4" rx="0.5" fill="url(#goldPad)" />
            </g>
          ))}
          <circle cx="55" cy="112" r="1.5" fill="#22c55e" /> {/* Power LED */}
        </svg>
      );

    /* -------------------------------------------------------------
       RASPBERRY PI PICO (RP2040)
       ------------------------------------------------------------- */
    case 'rp2040':
      return (
        <svg viewBox="0 0 110 150" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Green PCB */}
          <rect x="20" y="12" width="70" height="126" rx="5" fill="url(#pcbGreen)" stroke="#4ade80" strokeWidth="0.8" />

          {/* Micro USB Port */}
          <rect x="42" y="8" width="26" height="14" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <rect x="47" y="11" width="16" height="6" rx="1" fill="#0f172a" />

          {/* RP2040 Chip (Tilted square) */}
          <rect x="44" y="60" width="22" height="22" rx="2" fill="url(#icBlack)" stroke="#52525b" strokeWidth="0.8" />
          <text x="55" y="70" fill="#e2e8f0" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">RP2</text>
          <text x="55" y="77" fill="#cbd5e1" fontSize="4" fontFamily="monospace" textAnchor="middle">040</text>
          <circle cx="48" cy="64" r="1.5" fill="#f43f5e" />

          {/* BOOTSEL Button */}
          <rect x="48" y="32" width="14" height="10" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
          <rect x="52" y="34.5" width="6" height="5" rx="1" fill="#cbd5e1" />
          <text x="55" y="47" fill="#ffffff" fontSize="4" fontFamily="monospace" textAnchor="middle">BOOTSEL</text>

          {/* Flash memory chip */}
          <rect x="47" y="92" width="16" height="12" rx="1.5" fill="url(#icBlack)" />

          {/* Castellated Edge Pads (20 each side) */}
          {[...Array(20)].map((_, i) => (
            <g key={i}>
              <circle cx="20" cy={20 + i * 5.6} r="2.5" fill="none" stroke="url(#goldPad)" strokeWidth="1.5" />
              <circle cx="90" cy={20 + i * 5.6} r="2.5" fill="none" stroke="url(#goldPad)" strokeWidth="1.5" />
            </g>
          ))}

          {/* Raspberry Pi Logo mark */}
          <circle cx="55" cy="116" r="5" fill="#c026d3" opacity="0.9" />
          <text x="55" y="130" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Raspberry Pi Pico</text>
        </svg>
      );

    /* -------------------------------------------------------------
       ARDUINO NANO
       ------------------------------------------------------------- */
    case 'arduino-nano':
      return (
        <svg viewBox="0 0 80 130" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="12" y="10" width="56" height="110" rx="4" fill="url(#arduinoTeal)" stroke="#38bdf8" strokeWidth="0.8" />

          {/* Mini USB Port */}
          <rect x="28" y="6" width="24" height="14" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <rect x="33" y="9" width="14" height="6" rx="1" fill="#0f172a" />

          {/* ATmega328P QFP Chip (diamond/square) */}
          <rect x="30" y="52" width="20" height="20" rx="2" fill="url(#icBlack)" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="34" cy="56" r="1.5" fill="#94a3b8" />
          <text x="40" y="64" fill="#a1a1aa" fontSize="4" fontFamily="monospace" textAnchor="middle">MEGA</text>
          <text x="40" y="69" fill="#a1a1aa" fontSize="3.5" fontFamily="monospace" textAnchor="middle">328P</text>

          {/* Reset button in center */}
          <rect x="34" y="32" width="12" height="10" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="40" cy="37" r="2.5" fill="#ef4444" />

          {/* 16MHz Crystal */}
          <rect x="34" y="80" width="12" height="6" rx="3" fill="url(#metalSilver)" />

          {/* Header pins (15 per side) */}
          {[...Array(15)].map((_, i) => (
            <g key={i}>
              <rect x="14" y={18 + i * 6.5} width="3.5" height="3.5" rx="0.5" fill="url(#goldPad)" />
              <rect x="62.5" y={18 + i * 6.5} width="3.5" height="3.5" rx="0.5" fill="url(#goldPad)" />
            </g>
          ))}
          <text x="40" y="108" fill="#ffffff" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">NANO</text>
        </svg>
      );

    /* -------------------------------------------------------------
       STM32 BLUE PILL
       ------------------------------------------------------------- */
    case 'stm32':
      return (
        <svg viewBox="0 0 90 140" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="15" y="10" width="60" height="120" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

          {/* Micro USB */}
          <rect x="35" y="6" width="20" height="12" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <rect x="39" y="8" width="12" height="5" rx="1" fill="#0f172a" />

          {/* STM32F103 Chip */}
          <rect x="33" y="48" width="24" height="24" rx="2" fill="url(#icBlack)" stroke="#52525b" strokeWidth="0.8" />
          <text x="45" y="61" fill="#e2e8f0" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STM32</text>
          <text x="45" y="67" fill="#94a3b8" fontSize="3.5" fontFamily="monospace" textAnchor="middle">F103C8T6</text>

          {/* Yellow Jumpers BOOT0 / BOOT1 */}
          <rect x="30" y="24" width="12" height="7" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          <rect x="48" y="24" width="12" height="7" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          <text x="36" y="22" fill="#ffffff" fontSize="3.5" textAnchor="middle">B0</text>
          <text x="54" y="22" fill="#ffffff" fontSize="3.5" textAnchor="middle">B1</text>

          {/* Reset button */}
          <rect x="40" y="102" width="10" height="8" rx="1.5" fill="#e2e8f0" />
          <circle cx="45" cy="106" r="2" fill="#ef4444" />

          {/* Pins */}
          {[...Array(20)].map((_, i) => (
            <g key={i}>
              <rect x="17" y={16 + i * 5.4} width="3" height="3" fill="url(#goldPad)" />
              <rect x="70" y={16 + i * 5.4} width="3" height="3" fill="url(#goldPad)" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       DHT11 TEMPERATURE & HUMIDITY SENSOR
       ------------------------------------------------------------- */
    case 'dht11':
      return (
        <svg viewBox="0 0 90 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue Ribbed Plastic Casing */}
          <rect x="20" y="15" width="50" height="65" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
          
          {/* Grille slots */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x="28" y={25 + i * 9} width="34" height="4.5" rx="2" fill="#0369a1" />
          ))}

          {/* Mounting hole */}
          <circle cx="45" cy="20" r="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.5" />

          {/* Printed label */}
          <rect x="28" y="68" width="34" height="9" rx="2" fill="#0369a1" />
          <text x="45" y="74.5" fill="#ffffff" fontSize="6" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">DHT11</text>

          {/* Pins */}
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <rect x={28 + i * 9.5} y="80" width="3" height="22" rx="0.5" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       DHT22 / AM2302 SENSOR
       ------------------------------------------------------------- */
    case 'dht22':
      return (
        <svg viewBox="0 0 90 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* White Plastic Case */}
          <rect x="20" y="12" width="50" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Lattice perforations */}
          {[...Array(6)].map((_, r) => (
            [...Array(4)].map((_, c) => (
              <circle key={`${r}-${c}`} cx={30 + c * 10} cy={22 + r * 7} r="2" fill="#cbd5e1" />
            ))
          ))}

          {/* Label */}
          <text x="45" y="72" fill="#334155" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">AM2302</text>
          <text x="45" y="78" fill="#64748b" fontSize="4.5" fontFamily="monospace" textAnchor="middle">DHT22</text>

          {/* Pins */}
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={28 + i * 9.5} y="82" width="3" height="22" rx="0.5" fill="url(#metalSilver)" stroke="#94a3b8" strokeWidth="0.5" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       HC-SR04 ULTRASONIC DISTANCE SENSOR
       ------------------------------------------------------------- */
    case 'hc-sr04':
      return (
        <svg viewBox="0 0 140 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="15" y="15" width="110" height="60" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
          
          {/* Left Transducer (Transmitter 'T') */}
          <circle cx="44" cy="45" r="22" fill="url(#metalSilver)" stroke="#475569" strokeWidth="1" />
          <circle cx="44" cy="45" r="18" fill="url(#sonarMesh)" stroke="#334155" strokeWidth="1" />
          <circle cx="44" cy="45" r="4" fill="#1e293b" />
          <text x="44" y="20" fill="#ffffff" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">T</text>

          {/* Right Transducer (Receiver 'R') */}
          <circle cx="96" cy="45" r="22" fill="url(#metalSilver)" stroke="#475569" strokeWidth="1" />
          <circle cx="96" cy="45" r="18" fill="url(#sonarMesh)" stroke="#334155" strokeWidth="1" />
          <circle cx="96" cy="45" r="4" fill="#1e293b" />
          <text x="96" y="20" fill="#ffffff" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">R</text>

          {/* Crystal */}
          <rect x="66" y="42" width="8" height="6" rx="2" fill="url(#metalSilver)" />

          {/* Center 4-pin header */}
          <rect x="55" y="70" width="30" height="6" rx="1" fill="#0f172a" />
          {['VCC', 'TRIG', 'ECHO', 'GND'].map((p, i) => (
            <rect key={p} x={58 + i * 7} y="74" width="2.5" height="10" fill="url(#metalSilver)" />
          ))}
          <text x="70" y="32" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HC-SR04</text>
        </svg>
      );

    /* -------------------------------------------------------------
       PIR MOTION SENSOR
       ------------------------------------------------------------- */
    case 'pir':
      return (
        <svg viewBox="0 0 110 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Green PCB */}
          <rect x="15" y="15" width="80" height="80" rx="6" fill="url(#pcbGreen)" stroke="#4ade80" strokeWidth="1" />

          {/* White Fresnel Dome Lens */}
          <circle cx="55" cy="55" r="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Facets */}
          <circle cx="55" cy="55" r="20" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="55" cy="55" r="11" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="55" cy="55" r="4" fill="#cbd5e1" />

          {/* Orange trimmer pots */}
          <circle cx="28" cy="85" r="5" fill="#f97316" stroke="#c2410c" strokeWidth="0.8" />
          <rect x="26.5" y="82" width="3" height="6" fill="#fbbf24" />
          <circle cx="82" cy="85" r="5" fill="#f97316" stroke="#c2410c" strokeWidth="0.8" />
          <rect x="80.5" y="82" width="3" height="6" fill="#fbbf24" />

          {/* 3 Header Pins at bottom */}
          <rect x="47" y="92" width="16" height="5" rx="1" fill="#0f172a" />
          {[0, 1, 2].map(i => (
            <rect key={i} x={49 + i * 5} y="95" width="2.5" height="9" fill="url(#goldPad)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       MPU-6050 6-AXIS IMU ACCELEROMETER/GYROSCOPE
       ------------------------------------------------------------- */
    case 'mpu6050':
      return (
        <svg viewBox="0 0 100 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="15" y="12" width="70" height="66" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />

          {/* MPU-6050 QFN Chip */}
          <rect x="38" y="28" width="24" height="24" rx="2" fill="url(#icBlack)" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="42" cy="32" r="1" fill="#fbbf24" />
          <text x="50" y="41" fill="#e2e8f0" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MPU</text>
          <text x="50" y="47" fill="#94a3b8" fontSize="4" fontFamily="monospace" textAnchor="middle">6050</text>

          {/* Power LED */}
          <circle cx="68" cy="22" r="1.5" fill="#ef4444" />

          {/* 8 Header Pads */}
          {['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'].map((p, i) => (
            <circle key={p} cx={22 + i * 8} cy="68" r="2.5" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
          <text x="50" y="20" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GY-521</text>
        </svg>
      );

    /* -------------------------------------------------------------
       SOIL MOISTURE SENSOR
       ------------------------------------------------------------- */
    case 'soil-moisture':
      return (
        <svg viewBox="0 0 80 140" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Top PCB Head */}
          <rect x="15" y="10" width="50" height="36" rx="4" fill="url(#pcbGreen)" stroke="#4ade80" strokeWidth="0.8" />
          {/* 4 Header pins */}
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={24 + i * 8} y="4" width="3" height="8" rx="0.5" fill="url(#goldPad)" />
          ))}
          {/* IC on head */}
          <rect x="30" y="20" width="20" height="12" rx="1.5" fill="url(#icBlack)" />

          {/* Two PCB Probe Legs */}
          <path d="M 22 46 L 22 125 L 34 135 L 34 46 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <path d="M 46 46 L 46 135 L 58 125 L 58 46 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          
          {/* Exposed gold traces */}
          <path d="M 25 55 L 25 120" stroke="url(#goldPad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 31 55 L 31 125" stroke="url(#goldPad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 49 55 L 49 125" stroke="url(#goldPad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 55 55 L 55 120" stroke="url(#goldPad)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    /* -------------------------------------------------------------
       BMP280 BAROMETRIC PRESSURE & TEMP SENSOR
       ------------------------------------------------------------- */
    case 'bmp280':
      return (
        <svg viewBox="0 0 90 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Purple PCB */}
          <rect x="15" y="12" width="60" height="56" rx="5" fill="#7e22ce" stroke="#c084fc" strokeWidth="0.8" />
          {/* Silver Sensor Can */}
          <rect x="36" y="24" width="18" height="14" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          {/* Pressure orifice vent hole */}
          <circle cx="48" cy="31" r="1.5" fill="#0f172a" />
          <text x="45" y="47" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">BMP280</text>
          {/* 6 Gold Pins */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle key={i} cx={22 + i * 9.2} cy="60" r="2.5" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       LDR / PHOTORESISTOR
       ------------------------------------------------------------- */
    case 'ldr':
      return (
        <svg viewBox="0 0 80 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Ceramic Disc Head */}
          <circle cx="40" cy="34" r="22" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
          {/* S-curved CdS Photo-track */}
          <path d="M 26 24 C 36 24, 36 30, 48 30 C 54 30, 54 38, 40 38 C 26 38, 28 44, 46 44" 
            fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          {/* Two Leads */}
          <rect x="32" y="55" width="2.5" height="40" fill="url(#metalSilver)" />
          <rect x="46" y="55" width="2.5" height="40" fill="url(#metalSilver)" />
        </svg>
      );

    /* -------------------------------------------------------------
       SG90 MICRO SERVO MOTOR
       ------------------------------------------------------------- */
    case 'servo':
      return (
        <svg viewBox="0 0 110 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Translucent Blue Housing */}
          <rect x="25" y="32" width="60" height="50" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
          {/* Mounting Wings */}
          <rect x="14" y="44" width="12" height="8" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
          <circle cx="19" cy="48" r="2" fill="#0b1320" />
          <rect x="84" y="44" width="12" height="8" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
          <circle cx="91" cy="48" r="2" fill="#0b1320" />

          {/* Cylindrical gear tower */}
          <circle cx="44" cy="28" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />

          {/* White Servo Horn (3-arm gear) */}
          <circle cx="44" cy="28" r="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 44 28 L 74 24 A 4 4 0 0 1 74 32 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          <circle cx="56" cy="28" r="1.5" fill="#94a3b8" />
          <circle cx="64" cy="28" r="1.5" fill="#94a3b8" />
          <circle cx="71" cy="28" r="1.5" fill="#94a3b8" />
          <circle cx="44" cy="28" r="2.5" fill="#64748b" /> {/* Center Screw */}

          {/* SG90 Text label */}
          <rect x="33" y="58" width="44" height="14" rx="2" fill="#0f172a" />
          <text x="55" y="68" fill="#38bdf8" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">SG90</text>

          {/* 3-wire ribbon cable at bottom */}
          <rect x="50" y="82" width="3" height="24" fill="#92400e" /> {/* Brown GND */}
          <rect x="53" y="82" width="3" height="24" fill="#dc2626" /> {/* Red VCC */}
          <rect x="56" y="82" width="3" height="24" fill="#f97316" /> {/* Orange SIG */}
        </svg>
      );

    /* -------------------------------------------------------------
       DC MOTOR
       ------------------------------------------------------------- */
    case 'dc-motor':
      return (
        <svg viewBox="0 0 100 120" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Silver cylindrical body */}
          <rect x="25" y="35" width="50" height="60" rx="10" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          {/* Black plastic back cap */}
          <rect x="25" y="85" width="50" height="12" rx="4" fill="#1e293b" />

          {/* Center Axle Shaft */}
          <rect x="47" y="10" width="6" height="26" rx="1" fill="url(#metalSilver)" stroke="#475569" strokeWidth="0.8" />
          <rect x="43" y="32" width="14" height="4" rx="1" fill="#94a3b8" />

          {/* Terminals at back */}
          <rect x="34" y="97" width="5" height="12" rx="1" fill="#dc2626" stroke="#b91c1c" strokeWidth="0.5" />
          <rect x="61" y="97" width="5" height="12" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          <text x="50" y="65" fill="#334155" fontSize="7" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">3-6V DC</text>
        </svg>
      );

    /* -------------------------------------------------------------
       PASSIVE BUZZER
       ------------------------------------------------------------- */
    case 'buzzer':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black Cylindrical Case */}
          <circle cx="45" cy="40" r="28" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="45" cy="40" r="23" fill="#27272a" stroke="#18181b" strokeWidth="1" />
          
          {/* Center sound outlet hole */}
          <circle cx="45" cy="40" r="6" fill="#09090b" stroke="#000000" strokeWidth="1" />

          {/* (+) Positive polarity mark */}
          <text x="30" y="28" fill="#ef4444" fontSize="12" fontWeight="bold">+</text>
          
          {/* Pins at bottom */}
          <rect x="36" y="66" width="2.5" height="18" fill="url(#metalSilver)" />
          <rect x="52" y="66" width="2.5" height="18" fill="url(#metalSilver)" />
        </svg>
      );

    /* -------------------------------------------------------------
       5V RELAY MODULE
       ------------------------------------------------------------- */
    case 'relay':
      return (
        <svg viewBox="0 0 120 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="12" y="10" width="96" height="80" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

          {/* Blue Songle Relay Box Cube */}
          <rect x="18" y="18" width="52" height="64" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
          <rect x="22" y="22" width="44" height="56" rx="2" fill="#0ea5e9" opacity="0.2" />
          <text x="44" y="35" fill="#ffffff" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">SONGLE</text>
          <text x="44" y="44" fill="#ffffff" fontSize="4.5" fontFamily="monospace" textAnchor="middle">10A 250VAC</text>
          <text x="44" y="52" fill="#ffffff" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">5VDC</text>
          {/* Relay schematic icon */}
          <path d="M 28 62 L 36 62 L 40 58 L 44 66 L 48 58 L 52 66 L 56 62 L 60 62" fill="none" stroke="#ffffff" strokeWidth="0.8" />

          {/* Blue Screw Terminal Blocks (3 ports: NO, COM, NC) */}
          <rect x="76" y="18" width="26" height="42" rx="2" fill="#1e3a8a" stroke="#172554" strokeWidth="1" />
          {[0, 1, 2].map(i => (
            <g key={i}>
              <circle cx="89" cy={26 + i * 13} r="3.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
              <line x1="86.5" y1={26 + i * 13} x2="91.5" y2={26 + i * 13} stroke="#334155" strokeWidth="1" />
            </g>
          ))}

          {/* Input header pins */}
          <rect x="76" y="68" width="26" height="8" rx="1" fill="#0f172a" />
          {[0, 1, 2].map(i => (
            <rect key={i} x={80 + i * 7} y="71" width="3" height="5" fill="url(#goldPad)" />
          ))}
          <circle cx="24" cy="74" r="1.5" fill="#22c55e" /> {/* Status LED */}
        </svg>
      );

    /* -------------------------------------------------------------
       28BYJ-48 STEPPER MOTOR
       ------------------------------------------------------------- */
    case 'stepper':
      return (
        <svg viewBox="0 0 110 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Silver Motor Round Can */}
          <circle cx="55" cy="50" r="34" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <circle cx="55" cy="50" r="26" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

          {/* Mounting Ears */}
          <rect x="12" y="44" width="14" height="12" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="18" cy="50" r="3" fill="#0b1320" />
          <rect x="84" y="44" width="14" height="12" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="92" cy="50" r="3" fill="#0b1320" />

          {/* Flattened Brass D-shaft */}
          <circle cx="55" cy="50" r="6" fill="url(#goldPad)" stroke="#b45309" strokeWidth="1" />
          <rect x="58" y="45" width="3" height="10" fill="#b45309" />

          {/* Blue Wire Harness */}
          <rect x="42" y="82" width="26" height="12" rx="2" fill="#0284c7" />
          {['#3b82f6', '#f97316', '#ef4444', '#ec4899', '#eab308'].map((c, i) => (
            <rect key={i} x={45 + i * 4} y="92" width="2.5" height="14" fill={c} />
          ))}
          <text x="55" y="32" fill="#475569" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">28BYJ-48</text>
        </svg>
      );

    /* -------------------------------------------------------------
       LCD 16x2 DISPLAY (I2C)
       ------------------------------------------------------------- */
    case 'lcd-16x2':
      return (
        <svg viewBox="0 0 150 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* PCB Base */}
          <rect x="10" y="10" width="130" height="70" rx="4" fill="url(#pcbGreen)" stroke="#4ade80" strokeWidth="0.8" />

          {/* Metal Bezel */}
          <rect x="18" y="16" width="114" height="52" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />

          {/* Backlit Display Screen */}
          <rect x="24" y="22" width="102" height="40" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          
          {/* Character Cells (16 cols x 2 rows) */}
          <rect x="28" y="27" width="94" height="13" rx="1" fill="#0369a1" opacity="0.6" />
          <text x="32" y="37" fill="#ffffff" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" letterSpacing="1">VoltCraft 2.0</text>
          <rect x="28" y="44" width="94" height="13" rx="1" fill="#0369a1" opacity="0.6" />
          <text x="32" y="54" fill="#38bdf8" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" letterSpacing="1">ONLINE: 16x2 I2C</text>

          {/* 16 Pins across top */}
          {[...Array(16)].map((_, i) => (
            <circle key={i} cx={22 + i * 6.8} cy="13" r="1.5" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="0.8" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       OLED 0.96" 128x64 DISPLAY (I2C)
       ------------------------------------------------------------- */
    case 'oled-128x64':
      return (
        <svg viewBox="0 0 100 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="15" y="12" width="70" height="68" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />

          {/* Black Glass OLED Screen */}
          <rect x="20" y="24" width="60" height="46" rx="2" fill="url(#oledBg)" stroke="#475569" strokeWidth="1" />
          
          {/* Glowing Blue/Cyan UI Graphics on OLED */}
          {/* Yellow header line */}
          <line x1="24" y1="30" x2="76" y2="30" stroke="#facc15" strokeWidth="1.2" />
          <text x="24" y="28.5" fill="#facc15" fontSize="4.5" fontFamily="monospace" fontWeight="bold">OSCILLOSCOPE</text>

          {/* Sine wave graphic */}
          <path d="M 24 46 Q 30 36 36 46 T 48 46 T 60 46 T 72 46" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          
          <text x="24" y="60" fill="#38bdf8" fontSize="4" fontFamily="monospace">f: 1.00kHz  Vpp: 3.3V</text>

          {/* 4 Pin Header at top */}
          {['GND', 'VCC', 'SCL', 'SDA'].map((p, i) => (
            <g key={p}>
              <rect x={29 + i * 12} y="8" width="3" height="8" rx="0.5" fill="url(#goldPad)" />
              <text x={30.5 + i * 12} y="20" fill="#ffffff" fontSize="3" fontFamily="monospace" textAnchor="middle">{p}</text>
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       7-SEGMENT DISPLAY
       ------------------------------------------------------------- */
    case 'seven-seg':
      return (
        <svg viewBox="0 0 80 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black Case */}
          <rect x="15" y="10" width="50" height="74" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          
          {/* Glowing Red Segments (Displaying '8.') */}
          {/* Segment A (top) */}
          <polygon points="26,18 50,18 47,23 29,23" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* Segment B (top right) */}
          <polygon points="51,19 55,23 53,42 49,39" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* Segment C (bottom right) */}
          <polygon points="49,46 53,43 51,62 47,66" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* Segment D (bottom) */}
          <polygon points="26,67 29,62 47,62 50,67" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* Segment E (bottom left) */}
          <polygon points="25,46 29,43 27,62 23,66" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* Segment F (top left) */}
          <polygon points="27,19 31,23 29,42 25,39" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* Segment G (middle) */}
          <polygon points="29,42 47,42 49,44 47,46 29,46 27,44" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          {/* DP Decimal Point */}
          <circle cx="58" cy="65" r="3" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />

          {/* Downward pins */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={21 + i * 8.5} y="84" width="2.5" height="18" fill="url(#metalSilver)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       TFT LCD 2.4" SPI DISPLAY
       ------------------------------------------------------------- */
    case 'tft-lcd':
      return (
        <svg viewBox="0 0 110 140" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Red/Blue PCB */}
          <rect x="15" y="10" width="80" height="120" rx="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          {/* Screen Glass */}
          <rect x="22" y="18" width="66" height="96" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
          
          {/* Colorful GUI Display */}
          <rect x="26" y="22" width="58" height="16" rx="2" fill="#4f46e5" />
          <text x="55" y="32" fill="#ffffff" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">VoltCraft OS</text>
          
          {/* Graphs / gauges */}
          <circle cx="40" cy="56" r="12" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="50 20" />
          <text x="40" y="58" fill="#ffffff" fontSize="5" textAnchor="middle">85%</text>

          <circle cx="70" cy="56" r="12" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="40 30" />
          <text x="70" y="58" fill="#ffffff" fontSize="5" textAnchor="middle">24°C</text>

          <rect x="26" y="76" width="58" height="26" rx="2" fill="#0f172a" />
          <polyline points="28,94 36,88 44,96 52,82 60,88 68,80 76,86 82,82" fill="none" stroke="#f43f5e" strokeWidth="1.5" />

          {/* SPI Header Pins */}
          {[...Array(9)].map((_, i) => (
            <rect key={i} x={18 + i * 8.5} y="118" width="3" height="14" fill="url(#goldPad)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       RESISTOR (AXIAL 1/4W)
       ------------------------------------------------------------- */
    case 'resistor': {
      const resistance = properties?.resistance || 1000;
      const DIGIT_COLORS = ['#18181b', '#78350f', '#dc2626', '#ea580c', '#eab308', '#16a34a', '#2563eb', '#7c3aed', '#64748b', '#f8fafc'];
      const str = Math.round(resistance).toString();
      const d1 = parseInt(str[0] || '1', 10);
      const d2 = parseInt(str[1] || '0', 10);
      const mult = Math.max(0, str.length - 2);
      const b1 = DIGIT_COLORS[d1] || '#78350f';
      const b2 = DIGIT_COLORS[d2] || '#18181b';
      const b3 = DIGIT_COLORS[mult] || '#dc2626';
      const label = resistance >= 1000000 ? `${(resistance/1000000).toFixed(1)} MΩ` : resistance >= 1000 ? `${(resistance/1000).toFixed(resistance % 1000 === 0 ? 0 : 1)} kΩ` : `${resistance} Ω`;
      return (
        <svg viewBox="0 0 120 60" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Wire leads */}
          <line x1="8" y1="30" x2="35" y2="30" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          <line x1="85" y1="30" x2="112" y2="30" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />

          {/* Tan Ceramic Body with bulbous shoulders */}
          <path d="M 35 22 C 32 24, 32 36, 35 38 L 85 38 C 88 36, 88 24, 85 22 Z"
            fill="url(#resistorBody)" stroke="#d97706" strokeWidth="1" />

          {/* Color Bands */}
          <rect x="42" y="21.5" width="4" height="17" fill={b1} />
          <rect x="52" y="22" width="4" height="16" fill={b2} />
          <rect x="62" y="22" width="4" height="16" fill={b3} />
          <rect x="76" y="21.5" width="4" height="17" fill="#f59e0b" />

          <text x="60" y="52" fill="#cbd5e1" fontSize="7" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">{label}</text>
        </svg>
      );
    }

    /* -------------------------------------------------------------
       5mm LED (RED / GLOWING)
       ------------------------------------------------------------- */
    case 'led':
      return (
        <svg viewBox="0 0 80 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Glowing Red Epoxy Dome Bulb */}
          <path d="M 25 45 C 25 20, 55 20, 55 45 L 55 52 L 25 52 Z"
            fill="url(#ledRedGlow)" stroke="#f87171" strokeWidth="1" filter={glow ? 'drop-shadow(0 0 8px #ef4444)' : 'none'} />
          {/* Flanged rim */}
          <rect x="23" y="52" width="34" height="5" rx="1.5" fill="#dc2626" stroke="#b91c1c" strokeWidth="0.8" />

          {/* Internal Anvil & Post */}
          <path d="M 33 46 L 37 36 L 41 36 L 37 46 Z" fill="#ffffff" opacity="0.6" />
          <line x1="45" y1="46" x2="45" y2="34" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

          {/* Leads: Anode (longer) & Cathode (shorter) */}
          <rect x="33" y="57" width="2.5" height="45" fill="url(#metalSilver)" /> {/* Anode */}
          <rect x="44" y="57" width="2.5" height="38" fill="url(#metalSilver)" /> {/* Cathode */}
          <text x="34" y="108" fill="#94a3b8" fontSize="6" textAnchor="middle">+</text>
          <text x="45" y="101" fill="#94a3b8" fontSize="6" textAnchor="middle">-</text>
        </svg>
      );

    /* -------------------------------------------------------------
       ELECTROLYTIC CAPACITOR
       ------------------------------------------------------------- */
    case 'capacitor':
      return (
        <svg viewBox="0 0 80 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue Aluminum Can Body */}
          <rect x="22" y="15" width="36" height="58" rx="4" fill="url(#capBlue)" stroke="#0369a1" strokeWidth="1" />
          {/* Stamped Aluminum top with vent scores */}
          <ellipse cx="40" cy="15" rx="18" ry="4" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <line x1="34" y1="15" x2="46" y2="15" stroke="#475569" strokeWidth="0.8" />
          <line x1="40" y1="12" x2="40" y2="18" stroke="#475569" strokeWidth="0.8" />

          {/* White Negative Polarity Stripe */}
          <rect x="24" y="16" width="7" height="56" fill="#f8fafc" />
          <text x="27.5" y="32" fill="#0f172a" fontSize="6" fontWeight="bold">-</text>
          <text x="27.5" y="46" fill="#0f172a" fontSize="6" fontWeight="bold">-</text>
          <text x="27.5" y="60" fill="#0f172a" fontSize="6" fontWeight="bold">-</text>

          {/* Specs */}
          <text x="44" y="40" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold">100µF</text>
          <text x="44" y="48" fill="#ffffff" fontSize="4.5" fontFamily="monospace">25V</text>

          {/* Leads */}
          <rect x="32" y="73" width="2.5" height="30" fill="url(#metalSilver)" />
          <rect x="44" y="73" width="2.5" height="24" fill="url(#metalSilver)" />
        </svg>
      );

    /* -------------------------------------------------------------
       CERAMIC CAPACITOR (100nF DISC)
       ------------------------------------------------------------- */
    case 'ceramic-capacitor':
      return (
        <svg viewBox="0 0 80 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Orange/Tan Ceramic Disc Body */}
          <circle cx="40" cy="40" r="24" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" />
          <circle cx="40" cy="40" r="21" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" />
          
          {/* Printed marking (e.g. 104) */}
          <text x="40" y="38" fill="#78350f" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="900" textAnchor="middle">104</text>
          <text x="40" y="48" fill="#92400e" fontSize="5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">100nF</text>

          {/* Wire Leads with kink/crimp */}
          <path d="M 32 63 L 32 70 L 30 73 L 30 92" fill="none" stroke="url(#metalSilver)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 48 63 L 48 70 L 50 73 L 50 92" fill="none" stroke="url(#metalSilver)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    /* -------------------------------------------------------------
       1N4007 RECTIFIER DIODE
       ------------------------------------------------------------- */
    case 'diode-1n4007':
      return (
        <svg viewBox="0 0 120 60" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Wire Leads */}
          <line x1="8" y1="30" x2="35" y2="30" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          <line x1="85" y1="30" x2="112" y2="30" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />

          {/* Black Cylindrical DO-41 Body */}
          <rect x="35" y="21" width="50" height="18" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />

          {/* Silver Cathode Band (Negative Terminal) */}
          <rect x="42" y="21" width="7" height="18" fill="url(#metalSilver)" />

          {/* Printed Text */}
          <text x="64" y="32" fill="#e2e8f0" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">1N4007</text>
          <text x="25" y="44" fill="#94a3b8" fontSize="6" fontWeight="bold">K</text>
          <text x="95" y="44" fill="#94a3b8" fontSize="6" fontWeight="bold">A</text>
        </svg>
      );

    /* -------------------------------------------------------------
       2N2222 NPN TRANSISTOR (TO-92)
       ------------------------------------------------------------- */
    case 'transistor-2n2222':
      return (
        <svg viewBox="0 0 90 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black Epoxy TO-92 Semi-Cylinder Body */}
          <path d="M 22 24 C 22 10, 68 10, 68 24 L 68 50 L 22 50 Z" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />
          {/* Flat Front Face */}
          <rect x="22" y="44" width="46" height="8" fill="#27272a" />
          
          {/* Laser Marking on Flat Face */}
          <text x="45" y="34" fill="#e2e8f0" fontSize="6" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">2N2222</text>
          <text x="45" y="42" fill="#a1a1aa" fontSize="4" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">NPN BJT</text>

          {/* 3 Leads (Emitter, Base, Collector) */}
          <rect x="30" y="52" width="2.5" height="36" fill="url(#metalSilver)" />
          <rect x="44" y="52" width="2.5" height="36" fill="url(#metalSilver)" />
          <rect x="58" y="52" width="2.5" height="36" fill="url(#metalSilver)" />
          <text x="31" y="96" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">E</text>
          <text x="45" y="96" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">B</text>
          <text x="59" y="96" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">C</text>
        </svg>
      );

    /* -------------------------------------------------------------
       PUSH BUTTON (TACTILE SWITCH)
       ------------------------------------------------------------- */
    case 'push-button':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Square Black Base */}
          <rect x="22" y="22" width="46" height="46" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          {/* Silver Metal Bracket Cover */}
          <rect x="26" y="26" width="38" height="38" rx="3" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="28" cy="28" r="1.5" fill="#334155" />
          <circle cx="62" cy="28" r="1.5" fill="#334155" />
          <circle cx="28" cy="62" r="1.5" fill="#334155" />
          <circle cx="62" cy="62" r="1.5" fill="#334155" />

          {/* Round Black Center Button Actuator */}
          <circle cx="45" cy="45" r="11" fill="#0f172a" stroke="#000000" strokeWidth="1" />
          <circle cx="45" cy="45" r="8" fill="#27272a" />

          {/* 4 Silver Bent Leg Terminals */}
          <path d="M 22 32 L 10 32 L 10 38" fill="none" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 22 58 L 10 58 L 10 52" fill="none" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 32 L 80 32 L 80 38" fill="none" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 58 L 80 58 L 80 52" fill="none" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    /* -------------------------------------------------------------
       POTENTIOMETER (VARIABLE RESISTOR)
       ------------------------------------------------------------- */
    case 'potentiometer':
      return (
        <svg viewBox="0 0 90 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue Body */}
          <rect x="20" y="20" width="50" height="50" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

          {/* Circular Metal Collar */}
          <circle cx="45" cy="45" r="20" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />

          {/* Knurled Center Turning Shaft with indicator */}
          <circle cx="45" cy="45" r="13" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <line x1="45" y1="45" x2="45" y2="34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* 3 Solder Lugs at bottom */}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <rect x={28 + i * 14} y="70" width="6" height="20" rx="1" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
              <circle cx={31 + i * 14} cy="86" r="1.5" fill="#0b1320" />
            </g>
          ))}
          <text x="45" y="16" fill="#cbd5e1" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">10 kΩ</text>
        </svg>
      );

    /* -------------------------------------------------------------
       HC-05 BLUETOOTH MODULE
       ------------------------------------------------------------- */
    case 'hc-05':
      return (
        <svg viewBox="0 0 110 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="12" y="10" width="86" height="60" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

          {/* Meandering Antenna trace */}
          <path d="M 18 16 L 36 16 L 36 22 L 20 22 L 20 28 L 36 28 L 36 34 L 18 34" fill="none" stroke="url(#goldPad)" strokeWidth="2" />

          {/* CSR Bluetooth IC */}
          <rect x="44" y="18" width="24" height="24" rx="2" fill="url(#icBlack)" />
          <circle cx="48" cy="22" r="1" fill="#94a3b8" />
          <text x="56" y="32" fill="#ffffff" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HC-05</text>

          {/* Status LEDs */}
          <circle cx="76" cy="24" r="1.5" fill="#ef4444" />
          <circle cx="76" cy="32" r="1.5" fill="#3b82f6" />

          {/* 6 Header Pins (STATE, RXD, TXD, GND, VCC, EN) */}
          <rect x="20" y="56" width="70" height="7" rx="1" fill="#0f172a" />
          {[...Array(6)].map((_, i) => (
            <rect key={i} x={25 + i * 11} y="60" width="3" height="12" fill="url(#goldPad)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       NRF24L01+ 2.4GHz WIRELESS TRANSCEIVER
       ------------------------------------------------------------- */
    case 'nrf24l01':
      return (
        <svg viewBox="0 0 110 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black PCB */}
          <rect x="12" y="10" width="86" height="60" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

          {/* Serpentine PCB Antenna */}
          <path d="M 18 16 L 38 16 L 38 22 L 22 22 L 22 28 L 38 28 L 38 34 L 18 34 L 18 40 L 38 40"
            fill="none" stroke="url(#goldPad)" strokeWidth="2" />

          {/* NRF24L01 Chip */}
          <rect x="46" y="22" width="18" height="18" rx="2" fill="url(#icBlack)" stroke="#52525b" strokeWidth="0.5" />
          <text x="55" y="33" fill="#ffffff" fontSize="4" fontFamily="monospace" fontWeight="bold" textAnchor="middle">NRF24</text>

          {/* 16MHz Crystal */}
          <rect x="48" y="44" width="12" height="6" rx="2" fill="url(#metalSilver)" />

          {/* 2x4 Header Socket */}
          <rect x="74" y="20" width="16" height="34" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          {[0, 1, 2, 3].map(r => (
            <g key={r}>
              <circle cx="78" cy={25 + r * 8} r="2" fill="url(#goldPad)" />
              <circle cx="86" cy={25 + r * 8} r="2" fill="url(#goldPad)" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       SIM800L GSM MODULE
       ------------------------------------------------------------- */
    case 'sim800l':
      return (
        <svg viewBox="0 0 90 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Red PCB */}
          <rect x="15" y="12" width="60" height="76" rx="4" fill="#dc2626" stroke="#f87171" strokeWidth="1" />

          {/* SIM800L Metal Shield */}
          <rect x="22" y="24" width="46" height="42" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <text x="45" y="44" fill="#1e293b" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">SIM800L</text>
          <text x="45" y="52" fill="#475569" fontSize="4.5" fontFamily="monospace" textAnchor="middle">QUAD-BAND</text>

          {/* Helical Spring Antenna socket */}
          <circle cx="24" cy="18" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

          {/* Header Pins */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle key={i} cx={22 + i * 9.2} cy="78" r="2.5" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       LM7805 VOLTAGE REGULATOR (TO-220)
       ------------------------------------------------------------- */
    case 'voltage-regulator':
      return (
        <svg viewBox="0 0 80 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Metal Heatsink Tab with mounting hole */}
          <rect x="26" y="12" width="28" height="24" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <circle cx="40" cy="22" r="5" fill="#0f172a" stroke="#475569" strokeWidth="1" />

          {/* Black Molded Body */}
          <rect x="24" y="32" width="32" height="26" rx="2" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="0.8" />
          <text x="40" y="46" fill="#e2e8f0" fontSize="5.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">LM7805</text>
          <text x="40" y="53" fill="#a1a1aa" fontSize="4" fontFamily="monospace" textAnchor="middle">+5V 1A</text>

          {/* 3 Downward Leads (IN, GND, OUT) */}
          <rect x="29" y="58" width="3" height="34" fill="url(#metalSilver)" />
          <rect x="38.5" y="58" width="3" height="34" fill="url(#metalSilver)" />
          <rect x="48" y="58" width="3" height="34" fill="url(#metalSilver)" />
        </svg>
      );

    /* -------------------------------------------------------------
       LIPO BATTERY 3.7V
       ------------------------------------------------------------- */
    case 'lipo-battery':
      return (
        <svg viewBox="0 0 120 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Silver Foil Pouch */}
          <rect x="15" y="16" width="76" height="48" rx="4" fill="url(#metalSilver)" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Yellow Kapton Tape wrap */}
          <rect x="80" y="16" width="12" height="48" fill="#fbbf24" opacity="0.8" stroke="#d97706" strokeWidth="0.5" />

          {/* Battery Labels */}
          <text x="46" y="36" fill="#0f172a" fontSize="7" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">LiPo 3.7V</text>
          <text x="46" y="46" fill="#334155" fontSize="5.5" fontFamily="monospace" textAnchor="middle">1200mAh 4.44Wh</text>

          {/* Lead Wires: Red (+) and Black (-) */}
          <path d="M 92 34 L 108 34" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <path d="M 92 46 L 108 46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          {/* White JST Connector */}
          <rect x="105" y="28" width="10" height="24" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <text x="96" y="31" fill="#dc2626" fontSize="7" fontWeight="bold">+</text>
          <text x="96" y="56" fill="#0f172a" fontSize="7" fontWeight="bold">-</text>
        </svg>
      );

    /* -------------------------------------------------------------
       POWER SUPPLY MODULE
       ------------------------------------------------------------- */
    case 'power-supply':
      return (
        <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black PCB */}
          <rect x="15" y="15" width="70" height="70" rx="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

          {/* DC Barrel Jack */}
          <rect x="10" y="25" width="18" height="20" rx="2" fill="#0f172a" />
          {/* USB-A Port */}
          <rect x="10" y="55" width="20" height="16" rx="2" fill="url(#metalSilver)" />

          {/* Push Switch */}
          <circle cx="50" cy="35" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          {/* Green Power LED */}
          <circle cx="50" cy="55" r="2.5" fill="#22c55e" />

          {/* 3.3V / 5V Select Jumpers */}
          <rect x="68" y="26" width="12" height="10" rx="1.5" fill="#fbbf24" />
          <rect x="68" y="58" width="12" height="10" rx="1.5" fill="#fbbf24" />
          <text x="74" y="22" fill="#ffffff" fontSize="4">3.3V</text>
          <text x="74" y="54" fill="#ffffff" fontSize="4">5V</text>
        </svg>
      );

    /* -------------------------------------------------------------
       L298N DUAL H-BRIDGE MOTOR DRIVER
       ------------------------------------------------------------- */
    case 'l298n':
      return (
        <svg viewBox="0 0 120 120" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Crimson Red PCB */}
          <rect x="15" y="15" width="90" height="90" rx="6" fill="#b91c1c" stroke="#f87171" strokeWidth="1" />

          {/* Finned Aluminum Heatsink */}
          <rect x="35" y="22" width="50" height="36" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1={42 + i * 8} y1="22" x2={42 + i * 8} y2="58" stroke="#334155" strokeWidth="2" />
          ))}

          {/* Large Electrolytic Cap */}
          <circle cx="90" cy="40" r="8" fill="url(#capBlue)" stroke="#0284c7" strokeWidth="0.8" />

          {/* Blue Screw Terminals (Motor A & Motor B) */}
          <rect x="18" y="32" width="14" height="24" rx="2" fill="#1e3a8a" />
          <rect x="88" y="70" width="14" height="24" rx="2" fill="#1e3a8a" />
          <rect x="36" y="86" width="28" height="14" rx="2" fill="#1e3a8a" /> {/* Power IN */}

          {/* Logic Pin Header */}
          <rect x="68" y="86" width="20" height="8" rx="1" fill="#0f172a" />
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx={72 + i * 4.5} cy="90" r="1.2" fill="url(#goldPad)" />
          ))}
          <text x="60" y="72" fill="#ffffff" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">L298N</text>
        </svg>
      );

    /* -------------------------------------------------------------
       NE555 TIMER IC (DIP-8)
       ------------------------------------------------------------- */
    case 'ne555':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* DIP-8 Black Epoxy IC Body */}
          <rect x="25" y="20" width="40" height="50" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />

          {/* Orientation Notch at top */}
          <path d="M 40 20 A 5 5 0 0 0 50 20 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          {/* Pin 1 Index Dot */}
          <circle cx="32" cy="27" r="2" fill="#3f3f46" />

          {/* White Laser Marking */}
          <text x="45" y="44" fill="#e2e8f0" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">NE555P</text>
          <text x="45" y="52" fill="#a1a1aa" fontSize="4" fontFamily="monospace" textAnchor="middle">TI 24K</text>

          {/* 8 Dual In-line Pins (4 on left, 4 on right) */}
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <rect x="14" y={26 + i * 11} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={26 + i * 11} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       MCP3008 8-CH SPI ADC (DIP-16)
       ------------------------------------------------------------- */
    case 'mcp3008':
      return (
        <svg viewBox="0 0 90 120" width={width} height={height} className={className}>
          {renderDefs()}
          {/* DIP-16 Black IC Body */}
          <rect x="25" y="15" width="40" height="90" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />

          {/* Orientation Notch */}
          <path d="M 40 15 A 5 5 0 0 0 50 15 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="32" cy="22" r="2" fill="#3f3f46" />

          {/* Laser Marking */}
          <text x="45" y="58" fill="#e2e8f0" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">MCP3008</text>
          <text x="45" y="66" fill="#a1a1aa" fontSize="4" fontFamily="monospace" textAnchor="middle">10-BIT ADC</text>

          {/* 16 Pins (8 on each side) */}
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <rect x="14" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );
    /* -------------------------------------------------------------
       74HC595 8-BIT SHIFT REGISTER (DIP-16)
       ------------------------------------------------------------- */
    case 'ic-74hc595':
      return (
        <svg viewBox="0 0 90 120" width={width} height={height} className={className}>
          {renderDefs()}
          {/* DIP-16 Black IC Body */}
          <rect x="25" y="15" width="40" height="90" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />
          {/* Orientation Notch */}
          <path d="M 40 15 A 5 5 0 0 0 50 15 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="32" cy="22" r="2" fill="#3f3f46" />
          {/* Laser Marking */}
          <text x="45" y="55" fill="#e2e8f0" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">SN74HC595N</text>
          <text x="45" y="63" fill="#818cf8" fontSize="4.5" fontFamily="monospace" textAnchor="middle">8-BIT SHIFT</text>
          {/* 16 Pins */}
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <rect x="14" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       LM358 DUAL OP-AMP (DIP-8)
       ------------------------------------------------------------- */
    case 'ic-lm358':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* DIP-8 Body */}
          <rect x="25" y="20" width="40" height="50" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />
          {/* Notch & Pin 1 dot */}
          <path d="M 40 20 A 5 5 0 0 0 50 20 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="32" cy="27" r="2" fill="#3f3f46" />
          <text x="45" y="44" fill="#e2e8f0" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">LM358P</text>
          <text x="45" y="52" fill="#38bdf8" fontSize="4" fontFamily="monospace" textAnchor="middle">DUAL OP-AMP</text>
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <rect x="14" y={26 + i * 11} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={26 + i * 11} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       74HC04 HEX INVERTER (DIP-14)
       ------------------------------------------------------------- */
    case 'ic-74hc04':
      return (
        <svg viewBox="0 0 90 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* DIP-14 Body */}
          <rect x="25" y="18" width="40" height="74" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />
          <path d="M 40 18 A 5 5 0 0 0 50 18 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="32" cy="24" r="2" fill="#3f3f46" />
          <text x="45" y="52" fill="#e2e8f0" fontSize="6" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">74HC04N</text>
          <text x="45" y="60" fill="#c084fc" fontSize="4" fontFamily="monospace" textAnchor="middle">HEX NOT x6</text>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <g key={i}>
              <rect x="14" y={24 + i * 9.5} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={24 + i * 9.5} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       ESP8266 NODEMCU DEV BOARD
       ------------------------------------------------------------- */
    case 'esp8266-nodemcu':
      return (
        <svg viewBox="0 0 110 140" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black PCB */}
          <rect x="15" y="10" width="80" height="120" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          {/* Gold Serpentine Trace Antenna */}
          <path d="M 28 16 L 28 26 L 35 26 L 35 16 L 42 16 L 42 26 L 49 26 L 49 16 L 56 16 L 56 26 L 63 26 L 63 16 L 70 16 L 70 26 L 77 26 L 77 16"
            fill="none" stroke="url(#goldPad)" strokeWidth="2" strokeLinecap="round" />
          {/* Silver Metal Shield */}
          <rect x="25" y="32" width="60" height="48" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <text x="55" y="50" fill="#1e293b" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">ESP-12F</text>
          <text x="55" y="60" fill="#475569" fontSize="4.5" fontFamily="monospace" textAnchor="middle">NodeMCU 8266</text>
          {/* Micro USB */}
          <rect x="42" y="122" width="26" height="12" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <rect x="47" y="125" width="16" height="6" rx="1" fill="#0f172a" />
          {/* CP2102 Chip */}
          <rect x="47" y="90" width="16" height="16" rx="1.5" fill="url(#icBlack)" />
          {/* RST / FLASH buttons */}
          <rect x="22" y="112" width="9" height="9" rx="1.5" fill="#3f3f46" />
          <circle cx="26.5" cy="116.5" r="2.5" fill="#ef4444" />
          <rect x="79" y="112" width="9" height="9" rx="1.5" fill="#3f3f46" />
          <circle cx="83.5" cy="116.5" r="2.5" fill="#38bdf8" />
          {/* Dual Row Header Pads */}
          {[...Array(15)].map((_, i) => (
            <g key={i}>
              <circle cx="19" cy={20 + i * 6.5} r="2" fill="url(#goldPad)" />
              <circle cx="91" cy={20 + i * 6.5} r="2" fill="url(#goldPad)" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       ATTINY85 DIP-8 MICROCONTROLLER
       ------------------------------------------------------------- */
    case 'attiny85':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          <rect x="25" y="20" width="40" height="50" rx="3" fill="url(#icBlack)" stroke="#4338ca" strokeWidth="1" />
          <path d="M 40 20 A 5 5 0 0 0 50 20 Z" fill="#18181b" stroke="#6366f1" strokeWidth="0.8" />
          <circle cx="32" cy="27" r="2" fill="#3f3f46" />
          <text x="45" y="44" fill="#e2e8f0" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">ATTINY85</text>
          <text x="45" y="52" fill="#818cf8" fontSize="4" fontFamily="monospace" textAnchor="middle">20PU</text>
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <rect x="14" y={26 + i * 11} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={26 + i * 11} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       BME280 ENVIRONMENTAL SENSOR (TEMP/PRESS/HUMIDITY)
       ------------------------------------------------------------- */
    case 'bme280':
      return (
        <svg viewBox="0 0 100 85" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Cyan/Teal PCB */}
          <rect x="15" y="12" width="70" height="60" rx="5" fill="#0e7490" stroke="#06b6d4" strokeWidth="0.8" />
          {/* Metal Sensor Can with vent hole */}
          <rect x="38" y="24" width="24" height="20" rx="3" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <circle cx="54" cy="34" r="2" fill="#082f49" />
          <text x="50" y="52" fill="#ffffff" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">BME280</text>
          <text x="50" y="58" fill="#a5f3fc" fontSize="3.5" fontFamily="monospace" textAnchor="middle">T / P / RH</text>
          {/* 6 Gold Pins */}
          {['VCC','GND','SCL','SDA','CSB','SDO'].map((p, i) => (
            <g key={p}>
              <circle cx={22 + i * 11} cy="66" r="2.5" fill="#082f49" stroke="url(#goldPad)" strokeWidth="1" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       VL53L0X TIME-OF-FLIGHT LASER DISTANCE SENSOR
       ------------------------------------------------------------- */
    case 'vl53l0x':
      return (
        <svg viewBox="0 0 100 85" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Indigo PCB */}
          <rect x="15" y="12" width="70" height="60" rx="5" fill="#312e81" stroke="#6366f1" strokeWidth="0.8" />
          {/* Sensor Aperture Frame */}
          <rect x="36" y="22" width="28" height="20" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          {/* Dual Optical Ports: Laser Emitter & Receiver Lens */}
          <circle cx="44" cy="32" r="4.5" fill="#dc2626" opacity="0.85" />
          <circle cx="56" cy="32" r="4.5" fill="#0284c7" opacity="0.85" />
          <circle cx="44" cy="32" r="1.5" fill="#ffffff" />
          <circle cx="56" cy="32" r="1.5" fill="#ffffff" />
          <text x="50" y="50" fill="#c7d2fe" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">VL53L0X</text>
          <text x="50" y="56" fill="#818cf8" fontSize="3.5" fontFamily="monospace" textAnchor="middle">2m ToF LASER</text>
          {/* 6 Pins */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <circle key={i} cx={22 + i * 11} cy="66" r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       MQ-2 GAS & SMOKE SENSOR
       ------------------------------------------------------------- */
    case 'mq2-gas':
      return (
        <svg viewBox="0 0 100 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="15" y="15" width="70" height="80" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
          {/* Circular Metal Mesh Chamber */}
          <circle cx="50" cy="50" r="26" fill="url(#metalSilver)" stroke="#475569" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="22" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Crosshatch fine mesh screen */}
          {[...Array(9)].map((_, i) => (
            <g key={i}>
              <line x1={32 + i * 4.5} y1="32" x2={32 + i * 4.5} y2="68" stroke="#64748b" strokeWidth="0.8" opacity="0.6" />
              <line x1="32" y1={32 + i * 4.5} x2="68" y2={32 + i * 4.5} stroke="#64748b" strokeWidth="0.8" opacity="0.6" />
            </g>
          ))}
          <circle cx="50" cy="50" r="10" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
          <text x="50" y="52.5" fill="#0f172a" fontSize="5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">MQ-2</text>
          {/* Blue trimmer pot */}
          <rect x="22" y="80" width="12" height="10" rx="1.5" fill="#1d4ed8" />
          <circle cx="28" cy="85" r="2.5" fill="#f8fafc" />
          {/* 4 Header pins */}
          {['VCC','GND','DO','AO'].map((p, i) => (
            <rect key={p} x={42 + i * 9.5} y="90" width="3" height="12" fill="url(#goldPad)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       DS18B20 WATERPROOF TEMPERATURE PROBE
       ------------------------------------------------------------- */
    case 'ds18b20':
      return (
        <svg viewBox="0 0 120 70" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Stainless Steel Cylindrical Cap */}
          <rect x="15" y="24" width="45" height="22" rx="4" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <line x1="26" y1="24" x2="26" y2="46" stroke="#94a3b8" strokeWidth="1" />
          <text x="38" y="37" fill="#1e293b" fontSize="4.5" fontFamily="monospace" fontWeight="bold">DS18B20</text>
          {/* Black Heat Shrink Collar */}
          <rect x="58" y="26" width="22" height="18" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" />
          {/* 3 Wires (Red VCC, Yellow DATA, Black GND) */}
          <path d="M 80 30 L 105 24" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <path d="M 80 35 L 108 35" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <path d="M 80 40 L 105 46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <text x="112" y="26" fill="#dc2626" fontSize="5" fontWeight="bold">V</text>
          <text x="112" y="37" fill="#facc15" fontSize="5" fontWeight="bold">D</text>
          <text x="112" y="48" fill="#94a3b8" fontSize="5" fontWeight="bold">G</text>
        </svg>
      );

    /* -------------------------------------------------------------
       HX711 LOAD CELL AMPLIFIER MODULE
       ------------------------------------------------------------- */
    case 'hx711':
      return (
        <svg viewBox="0 0 110 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Green PCB */}
          <rect x="12" y="10" width="86" height="60" rx="4" fill="url(#pcbGreen)" stroke="#4ade80" strokeWidth="0.8" />
          {/* HX711 SOP-16 IC */}
          <rect x="42" y="24" width="26" height="32" rx="2" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="0.8" />
          <text x="55" y="38" fill="#e2e8f0" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HX711</text>
          <text x="55" y="46" fill="#86efac" fontSize="3.5" fontFamily="monospace" textAnchor="middle">24-BIT ADC</text>
          {/* Input pads (E+, E-, A-, A+) */}
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx="20" cy={18 + i * 11} r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
          {/* Output pads (VCC, DT, SCK, GND) */}
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx="90" cy={18 + i * 11} r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       RC522 RFID / NFC READER MODULE
       ------------------------------------------------------------- */
    case 'rc522-rfid':
      return (
        <svg viewBox="0 0 100 120" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Deep Blue PCB */}
          <rect x="15" y="10" width="70" height="100" rx="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          {/* Concentric Rectangular Antenna Traces */}
          <rect x="22" y="16" width="56" height="48" rx="3" fill="none" stroke="url(#goldPad)" strokeWidth="1.8" />
          <rect x="26" y="20" width="48" height="40" rx="2" fill="none" stroke="url(#goldPad)" strokeWidth="1.2" opacity="0.8" />
          <rect x="30" y="24" width="40" height="32" rx="1.5" fill="none" stroke="url(#goldPad)" strokeWidth="1" opacity="0.6" />
          <text x="50" y="43" fill="#ffffff" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">RFID</text>
          <text x="50" y="50" fill="#93c5fd" fontSize="4" fontFamily="monospace" textAnchor="middle">13.56 MHz</text>
          {/* RC522 Chip */}
          <rect x="40" y="70" width="20" height="20" rx="2" fill="url(#icBlack)" stroke="#475569" strokeWidth="0.8" />
          <text x="50" y="82" fill="#ffffff" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RC522</text>
          {/* 8 Header Pins at bottom */}
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={22 + i * 8} cy="102" r="2" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       DUAL-AXIS ANALOG JOYSTICK MODULE
       ------------------------------------------------------------- */
    case 'joystick-module':
      return (
        <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Dark Slate PCB */}
          <rect x="15" y="15" width="70" height="70" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          {/* Domed Black Thumbstick Knob */}
          <circle cx="50" cy="50" r="24" fill="#09090b" stroke="#27272a" strokeWidth="2" />
          <circle cx="50" cy="50" r="18" fill="#18181b" />
          <circle cx="50" cy="50" r="9" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
          {/* Textured Grip Dots */}
          {[0, 90, 180, 270].map((deg) => (
            <circle key={deg} cx={50 + 13 * Math.cos(deg * Math.PI / 180)} cy={50 + 13 * Math.sin(deg * Math.PI / 180)} r="1.5" fill="#52525b" />
          ))}
          {/* Dual Potentiometer Housings */}
          <rect x="74" y="42" width="6" height="16" rx="1" fill="#15803d" />
          <rect x="42" y="74" width="16" height="6" rx="1" fill="#15803d" />
          {/* 5 Pins on Left (GND, +5V, VRx, VRy, SW) */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x="8" y={28 + i * 9.5} width="8" height="2.5" fill="url(#metalSilver)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       WS2812B NEOPIXEL RING (16-LED)
       ------------------------------------------------------------- */
    case 'neopixel-ring':
      return (
        <svg viewBox="0 0 110 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black Circular PCB Ring with central hole */}
          <circle cx="55" cy="55" r="46" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
          <circle cx="55" cy="55" r="26" fill="#0b1329" stroke="#27272a" strokeWidth="1.5" />
          {/* 16 Radial 5050 RGB LEDs */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5) * (Math.PI / 180);
            const r = 36;
            const cx = 55 + r * Math.cos(angle);
            const cy = 55 + r * Math.sin(angle);
            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'];
            const c = colors[i % colors.length];
            return (
              <g key={i}>
                <rect x={cx - 3.5} y={cy - 3.5} width="7" height="7" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
                <circle cx={cx} cy={cy} r="2.2" fill={c} filter="drop-shadow(0 0 2px currentColor)" />
              </g>
            );
          })}
          <text x="55" y="54" fill="#a1a1aa" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">WS2812B</text>
          <text x="55" y="60" fill="#38bdf8" fontSize="3.5" fontFamily="monospace" textAnchor="middle">16x RGB</text>
        </svg>
      );

    /* -------------------------------------------------------------
       12V SOLENOID VALVE
       ------------------------------------------------------------- */
    case 'solenoid-valve':
      return (
        <svg viewBox="0 0 110 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* White Plastic Valve Pipe Base */}
          <rect x="15" y="58" width="80" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 50 64 L 60 70 L 50 76 Z" fill="#3b82f6" opacity="0.7" /> {/* Flow direction arrow */}
          {/* Threaded Inlet / Outlet */}
          <rect x="8" y="62" width="10" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          <rect x="92" y="62" width="10" height="16" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Solenoid Electromagnetic Coil Tower */}
          <rect x="36" y="16" width="38" height="44" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <rect x="40" y="22" width="30" height="32" rx="2" fill="#0f172a" />
          <text x="55" y="38" fill="#e2e8f0" fontSize="5.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">SOLENOID</text>
          <text x="55" y="46" fill="#38bdf8" fontSize="4.5" fontFamily="monospace" textAnchor="middle">12V DC (NC)</text>
          {/* Spade Terminals on Top */}
          <rect x="43" y="8" width="4" height="10" fill="url(#metalSilver)" />
          <rect x="63" y="8" width="4" height="10" fill="url(#metalSilver)" />
        </svg>
      );

    /* -------------------------------------------------------------
       MINI VIBRATION MOTOR (HAPTIC DISC)
       ------------------------------------------------------------- */
    case 'vibration-motor':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Coin Motor Outer Rim */}
          <circle cx="45" cy="40" r="26" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1.2" />
          <circle cx="45" cy="40" r="22" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
          <circle cx="45" cy="40" r="14" fill="url(#metalSilver)" />
          <text x="45" y="42" fill="#334155" fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ERM 3V</text>
          {/* Blue / Red Twisted Wires */}
          <path d="M 40 64 C 40 76, 32 78, 32 88" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 50 64 C 50 76, 58 78, 58 88" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    /* -------------------------------------------------------------
       TM1637 4-DIGIT 7-SEGMENT CLOCK DISPLAY
       ------------------------------------------------------------- */
    case 'tm1637-display':
      return (
        <svg viewBox="0 0 130 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Dark Red/Black PCB */}
          <rect x="12" y="10" width="106" height="60" rx="4" fill="#18181b" stroke="#7f1d1d" strokeWidth="1" />
          {/* Display Bezel */}
          <rect x="18" y="16" width="94" height="42" rx="3" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          {/* 4 Glowing Red Digits "12:00" */}
          <text x="32" y="44" fill="#ef4444" fontSize="18" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" filter="drop-shadow(0 0 3px #ef4444)">1</text>
          <text x="50" y="44" fill="#ef4444" fontSize="18" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" filter="drop-shadow(0 0 3px #ef4444)">2</text>
          <circle cx="65" cy="33" r="2" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          <circle cx="65" cy="43" r="2" fill="#ef4444" filter="drop-shadow(0 0 2px #ef4444)" />
          <text x="75" y="44" fill="#ef4444" fontSize="18" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" filter="drop-shadow(0 0 3px #ef4444)">0</text>
          <text x="93" y="44" fill="#ef4444" fontSize="18" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" filter="drop-shadow(0 0 3px #ef4444)">0</text>
          {/* 4 Header Pins on Right */}
          {['CLK','DIO','VCC','GND'].map((p, i) => (
            <rect key={p} x="115" y={20 + i * 11} width="8" height="2.5" fill="url(#metalSilver)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       MAX7219 8x8 LED MATRIX
       ------------------------------------------------------------- */
    case 'max7219-matrix':
      return (
        <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black Matrix Housing */}
          <rect x="15" y="15" width="70" height="70" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          {/* 8x8 Grid of 64 Red LEDs */}
          {[...Array(8)].map((_, r) => (
            [...Array(8)].map((_, c) => {
              const isLit = (r === c || r + c === 7 || r === 0 || r === 7 || c === 0 || c === 7);
              return (
                <circle
                  key={`${r}-${c}`}
                  cx={23 + c * 7.7}
                  cy={23 + r * 7.7}
                  r="2.6"
                  fill={isLit ? '#ef4444' : '#450a0a'}
                  stroke="#7f1d1d"
                  strokeWidth="0.5"
                  filter={isLit ? 'drop-shadow(0 0 2px #ef4444)' : 'none'}
                />
              );
            })
          ))}
          {/* Input Header Pins on Left */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x="8" y={28 + i * 9.5} width="8" height="2.5" fill="url(#metalSilver)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       RGB LED (5mm 4-PIN COMMON CATHODE)
       ------------------------------------------------------------- */
    case 'rgb-led':
      return (
        <svg viewBox="0 0 80 110" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Diffused Clear/Milky Epoxy Dome */}
          <path d="M 25 45 C 25 20, 55 20, 55 45 L 55 52 L 25 52 Z"
            fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" opacity="0.9" />
          <rect x="23" y="52" width="34" height="5" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Glowing internal triple LED chips (R, G, B) */}
          <circle cx="34" cy="40" r="3" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />
          <circle cx="40" cy="35" r="3" fill="#22c55e" filter="drop-shadow(0 0 3px #22c55e)" />
          <circle cx="46" cy="40" r="3" fill="#3b82f6" filter="drop-shadow(0 0 3px #3b82f6)" />
          {/* 4 Leads: Red, Common Cathode (longest), Green, Blue */}
          <rect x="30" y="57" width="2" height="42" fill="url(#metalSilver)" />
          <rect x="37" y="57" width="2" height="48" fill="url(#metalSilver)" /> {/* Cathode */}
          <rect x="44" y="57" width="2" height="44" fill="url(#metalSilver)" />
          <rect x="51" y="57" width="2" height="40" fill="url(#metalSilver)" />
          <text x="31" y="105" fill="#ef4444" fontSize="5" fontWeight="bold">R</text>
          <text x="38" y="108" fill="#64748b" fontSize="5" fontWeight="bold">-</text>
          <text x="45" y="105" fill="#22c55e" fontSize="5" fontWeight="bold">G</text>
          <text x="52" y="105" fill="#3b82f6" fontSize="5" fontWeight="bold">B</text>
        </svg>
      );

    /* -------------------------------------------------------------
       IRF520 N-CHANNEL POWER MOSFET (TO-220)
       ------------------------------------------------------------- */
    case 'mosfet-irf520':
      return (
        <svg viewBox="0 0 80 100" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Metal Heatsink Tab with center hole */}
          <rect x="26" y="12" width="28" height="24" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <circle cx="40" cy="22" r="5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          {/* Black Epoxy Package Body */}
          <rect x="24" y="32" width="32" height="26" rx="2" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="0.8" />
          <text x="40" y="46" fill="#e2e8f0" fontSize="5.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">IRF520N</text>
          <text x="40" y="53" fill="#a1a1aa" fontSize="4" fontFamily="monospace" textAnchor="middle">N-MOSFET</text>
          {/* 3 Leads (Gate, Drain, Source) */}
          <rect x="29" y="58" width="3" height="34" fill="url(#metalSilver)" />
          <rect x="38.5" y="58" width="3" height="34" fill="url(#metalSilver)" />
          <rect x="48" y="58" width="3" height="34" fill="url(#metalSilver)" />
          <text x="30.5" y="98" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">G</text>
          <text x="40" y="98" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">D</text>
          <text x="49.5" y="98" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">S</text>
        </svg>
      );

    /* -------------------------------------------------------------
       SLIDE SWITCH (SPDT MINI)
       ------------------------------------------------------------- */
    case 'slide-switch':
      return (
        <svg viewBox="0 0 90 70" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Metal Top Housing */}
          <rect x="18" y="18" width="54" height="26" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          {/* Mounting Ear Holes */}
          <circle cx="24" cy="31" r="2.5" fill="#334155" />
          <circle cx="66" cy="31" r="2.5" fill="#334155" />
          {/* Black Actuator Sliding Knob */}
          <rect x="38" y="8" width="14" height="14" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="42" y1="12" x2="42" y2="18" stroke="#64748b" strokeWidth="1" />
          <line x1="48" y1="12" x2="48" y2="18" stroke="#64748b" strokeWidth="1" />
          {/* 3 Solder Lugs (1, COM, 2) */}
          {[0, 1, 2].map(i => (
            <rect key={i} x={32 + i * 12} y="44" width="3" height="18" fill="url(#metalSilver)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       AXIAL INDUCTOR (100uH CHOKE)
       ------------------------------------------------------------- */
    case 'inductor-axial':
      return (
        <svg viewBox="0 0 120 60" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Wire leads */}
          <line x1="8" y1="30" x2="35" y2="30" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          <line x1="85" y1="30" x2="112" y2="30" stroke="url(#metalSilver)" strokeWidth="3" strokeLinecap="round" />
          {/* Olive Green Epoxy Torpedo Body */}
          <path d="M 35 22 C 32 24, 32 36, 35 38 L 85 38 C 88 36, 88 24, 85 22 Z"
            fill="#065f46" stroke="#047857" strokeWidth="1" />
          {/* Color Bands (Brown, Black, Brown, Silver for 100uH) */}
          <rect x="42" y="21.5" width="4" height="17" fill="#78350f" />
          <rect x="52" y="22" width="4" height="16" fill="#18181b" />
          <rect x="62" y="22" width="4" height="16" fill="#78350f" />
          <rect x="76" y="21.5" width="4" height="17" fill="#cbd5e1" />
          <text x="60" y="52" fill="#34d399" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">100 µH</text>
        </svg>
      );

    /* -------------------------------------------------------------
       LORA SX1278 Ra-02 433MHz TRANSCEIVER
       ------------------------------------------------------------- */
    case 'lora-sx1278':
      return (
        <svg viewBox="0 0 110 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue/Green PCB */}
          <rect x="15" y="12" width="80" height="66" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1" />
          {/* Metal RF Shield */}
          <rect x="24" y="20" width="48" height="42" rx="2" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="0.8" />
          <text x="48" y="38" fill="#064e3b" fontSize="7" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">LoRa</text>
          <text x="48" y="48" fill="#1e293b" fontSize="5" fontFamily="monospace" textAnchor="middle">Ra-02 433MHz</text>
          {/* IPEX Antenna connector */}
          <circle cx="80" cy="28" r="4" fill="url(#goldPad)" stroke="#b45309" strokeWidth="1" />
          <circle cx="80" cy="28" r="1.5" fill="#0f172a" />
          {/* Castellated Edge Pads */}
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={20 + i * 10} cy="72" r="2" fill="url(#goldPad)" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       ESP-01 SERIAL WIFI MODULE
       ------------------------------------------------------------- */
    case 'esp-01':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black PCB */}
          <rect x="18" y="10" width="54" height="70" rx="3" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          {/* Gold Serpentine Antenna */}
          <path d="M 24 16 L 24 28 L 32 28 L 32 16 L 40 16 L 40 28 L 48 28 L 48 16 L 56 16 L 56 28 L 64 28 L 64 16"
            fill="none" stroke="url(#goldPad)" strokeWidth="1.8" />
          {/* ESP8266 Chip */}
          <rect x="28" y="36" width="18" height="18" rx="2" fill="url(#icBlack)" />
          <text x="37" y="47" fill="#ffffff" fontSize="4" fontFamily="monospace" textAnchor="middle">8266</text>
          {/* 2x4 Header Pins */}
          <rect x="24" y="62" width="42" height="12" rx="1.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
          {[0, 1, 2, 3].map(c => (
            <g key={c}>
              <circle cx={29 + c * 10} cy="66" r="1.5" fill="url(#goldPad)" />
              <circle cx={29 + c * 10} cy="70" r="1.5" fill="url(#goldPad)" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       TP4056 LI-ION BATTERY CHARGER MODULE (USB-C)
       ------------------------------------------------------------- */
    case 'tp4056-charger':
      return (
        <svg viewBox="0 0 110 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="12" y="10" width="86" height="60" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
          {/* USB-C Receptacle */}
          <rect x="8" y="28" width="16" height="24" rx="3" fill="url(#metalSilver)" stroke="#64748b" strokeWidth="1" />
          <rect x="11" y="34" width="10" height="12" rx="2" fill="#0f172a" />
          {/* TP4056 SOP-8 Chip */}
          <rect x="36" y="24" width="16" height="14" rx="1.5" fill="url(#icBlack)" />
          <text x="44" y="33" fill="#ffffff" fontSize="3.5" fontFamily="monospace" textAnchor="middle">TP4056</text>
          {/* DW01A Battery Protection IC */}
          <rect x="58" y="24" width="12" height="10" rx="1" fill="url(#icBlack)" />
          {/* Red (Charging) & Blue (Standby) LEDs */}
          <circle cx="38" cy="50" r="2" fill="#ef4444" />
          <circle cx="48" cy="50" r="2" fill="#3b82f6" />
          {/* BAT+/BAT- and OUT+/OUT- Pads */}
          <rect x="82" y="14" width="12" height="8" rx="1" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          <text x="88" y="20" fill="#38bdf8" fontSize="3.5" textAnchor="middle">OUT+</text>
          <rect x="82" y="26" width="12" height="8" rx="1" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          <text x="88" y="32" fill="#22c55e" fontSize="3.5" textAnchor="middle">B+</text>
          <rect x="82" y="38" width="12" height="8" rx="1" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          <text x="88" y="44" fill="#ef4444" fontSize="3.5" textAnchor="middle">B-</text>
          <rect x="82" y="50" width="12" height="8" rx="1" fill="#0b1320" stroke="url(#goldPad)" strokeWidth="1" />
          <text x="88" y="56" fill="#38bdf8" fontSize="3.5" textAnchor="middle">OUT-</text>
        </svg>
      );

    /* -------------------------------------------------------------
       LM2596 DC-DC BUCK STEP-DOWN CONVERTER
       ------------------------------------------------------------- */
    case 'buck-converter-lm2596':
      return (
        <svg viewBox="0 0 120 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Blue PCB */}
          <rect x="12" y="10" width="96" height="60" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          {/* Toroidal Power Inductor Coil */}
          <circle cx="36" cy="40" r="14" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="36" cy="40" r="8" fill="#0f172a" />
          {/* Blue Multi-turn Trim Potentiometer */}
          <rect x="58" y="22" width="22" height="14" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
          <circle cx="64" cy="29" r="3" fill="url(#goldPad)" stroke="#b45309" strokeWidth="0.5" />
          {/* Electrolytic Capacitor */}
          <circle cx="88" cy="40" r="9" fill="url(#capBlue)" stroke="#0284c7" strokeWidth="0.8" />
          <text x="60" y="54" fill="#ffffff" fontSize="5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">LM2596</text>
          <text x="60" y="62" fill="#93c5fd" fontSize="4" fontFamily="monospace" textAnchor="middle">STEP-DOWN 3A</text>
          {/* Input & Output solder holes */}
          <circle cx="18" cy="20" r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          <circle cx="18" cy="60" r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          <circle cx="102" cy="20" r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
          <circle cx="102" cy="60" r="2.5" fill="#0f172a" stroke="url(#goldPad)" strokeWidth="1" />
        </svg>
      );

    /* -------------------------------------------------------------
       CR2032 COIN CELL BATTERY & HOLDER
       ------------------------------------------------------------- */
    case 'coin-cell-cr2032':
      return (
        <svg viewBox="0 0 90 90" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Black PCB Plastic Holder Housing */}
          <circle cx="45" cy="45" r="32" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />
          {/* Silver Lithium Coin Disc */}
          <circle cx="45" cy="45" r="24" fill="url(#metalSilver)" stroke="#94a3b8" strokeWidth="1" />
          <text x="45" y="42" fill="#0f172a" fontSize="6.5" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">CR2032</text>
          <text x="45" y="52" fill="#334155" fontSize="5" fontFamily="monospace" textAnchor="middle">3V LITHIUM</text>
          {/* Metal Top Spring Clip Tab */}
          <path d="M 24 35 L 45 42 L 66 35" fill="none" stroke="url(#goldPad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    /* -------------------------------------------------------------
       4-CHANNEL LOGIC LEVEL SHIFTER
       ------------------------------------------------------------- */
    case 'logic-level-shifter':
      return (
        <svg viewBox="0 0 100 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* Emerald Green PCB */}
          <rect x="15" y="10" width="70" height="60" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1" />
          {/* 4 SMD MOSFETs in center */}
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x="44" y={18 + i * 11} width="12" height="7" rx="1" fill="url(#icBlack)" />
          ))}
          <text x="50" y="65" fill="#a7f3d0" fontSize="4" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3.3V ⇄ 5V</text>
          {/* LV side pins on left */}
          {['LV1','LV2','LV','GND','LV3','LV4'].map((p, i) => (
            <circle key={p} cx="22" cy={16 + i * 8.5} r="2" fill="#064e3b" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
          {/* HV side pins on right */}
          {['HV1','HV2','HV','GND','HV3','HV4'].map((p, i) => (
            <circle key={p} cx="78" cy={16 + i * 8.5} r="2" fill="#064e3b" stroke="url(#goldPad)" strokeWidth="1" />
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       PC817 OPTOCOUPLER (DIP-4)
       ------------------------------------------------------------- */
    case 'pc817-optocoupler':
      return (
        <svg viewBox="0 0 80 80" width={width} height={height} className={className}>
          {renderDefs()}
          {/* DIP-4 Black Epoxy Body */}
          <rect x="22" y="16" width="36" height="48" rx="3" fill="url(#icBlack)" stroke="#475569" strokeWidth="1" />
          <circle cx="28" cy="23" r="2" fill="#64748b" /> {/* Pin 1 Dot */}
          <text x="40" y="38" fill="#e2e8f0" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">PC817</text>
          <text x="40" y="46" fill="#94a3b8" fontSize="4" fontFamily="monospace" textAnchor="middle">SHARP</text>
          {/* 4 Pins (2 left, 2 right) */}
          <rect x="12" y="24" width="10" height="3" fill="url(#metalSilver)" rx="0.5" />
          <rect x="12" y="52" width="10" height="3" fill="url(#metalSilver)" rx="0.5" />
          <rect x="58" y="24" width="10" height="3" fill="url(#metalSilver)" rx="0.5" />
          <rect x="58" y="52" width="10" height="3" fill="url(#metalSilver)" rx="0.5" />
        </svg>
      );

    /* -------------------------------------------------------------
       PCF8574 I2C 8-BIT I/O EXPANDER (DIP-16)
       ------------------------------------------------------------- */
    case 'pcf8574-io-expander':
      return (
        <svg viewBox="0 0 90 120" width={width} height={height} className={className}>
          {renderDefs()}
          <rect x="25" y="15" width="40" height="90" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />
          <path d="M 40 15 A 5 5 0 0 0 50 15 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="32" cy="22" r="2" fill="#3f3f46" />
          <text x="45" y="55" fill="#e2e8f0" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">PCF8574P</text>
          <text x="45" y="63" fill="#818cf8" fontSize="4" fontFamily="monospace" textAnchor="middle">I2C 8-BIT IO</text>
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <rect x="14" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       ULN2003A DARLINGTON TRANSISTOR ARRAY (DIP-16)
       ------------------------------------------------------------- */
    case 'uln2003a-darlington':
      return (
        <svg viewBox="0 0 90 120" width={width} height={height} className={className}>
          {renderDefs()}
          <rect x="25" y="15" width="40" height="90" rx="3" fill="url(#icBlack)" stroke="#3f3f46" strokeWidth="1" />
          <path d="M 40 15 A 5 5 0 0 0 50 15 Z" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
          <circle cx="32" cy="22" r="2" fill="#3f3f46" />
          <text x="45" y="55" fill="#e2e8f0" fontSize="5.5" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">ULN2003A</text>
          <text x="45" y="63" fill="#38bdf8" fontSize="4" fontFamily="monospace" textAnchor="middle">7x DARLINGTON</text>
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <rect x="14" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
              <rect x="65" y={22 + i * 10} width="11" height="3" fill="url(#metalSilver)" rx="0.5" />
            </g>
          ))}
        </svg>
      );

    /* -------------------------------------------------------------
       DEFAULT GENERIC COMPONENT CHIP FALLBACK
       ------------------------------------------------------------- */
    default:
      return (
        <svg viewBox="0 0 100 80" width={width} height={height} className={className}>
          {renderDefs()}
          <rect x="15" y="15" width="70" height="50" rx="6" fill="url(#icBlack)" stroke="#6366f1" strokeWidth="1.2" />
          <circle cx="22" cy="22" r="2" fill="#6366f1" />
          <text x="50" y="44" fill="#a5b4fc" fontSize="7" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" textAnchor="middle">
            {(componentId || 'IC').toUpperCase()}
          </text>
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <rect x={26 + i * 14} y="8" width="3" height="7" fill="url(#metalSilver)" />
              <rect x={26 + i * 14} y="65" width="3" height="7" fill="url(#metalSilver)" />
            </g>
          ))}
        </svg>
      );
  }
}

export default ComponentIllustration;
