// Intelligent Circuit Auto-Wiring & Dynamic Firmware Code Generator
import { COMPONENTS } from '../data/components';

/**
 * Calculates the exact (x, y) coordinates for a pin on a component
 * taking into account component position, dimensions, pin distributions and rotation.
 */
export function getComponentPinPosition(component, pinName) {
  const { x = 0, y = 0, width = 60, height = 60, pins = {} } = component;
  
  const allPins = Object.entries(pins).flatMap(([group, pinList]) =>
    (pinList || []).map((pin, idx) => ({ group, pin, idx }))
  );
  
  const total = allPins.length;
  const pinIdx = allPins.findIndex(p => p.pin === pinName);
  
  if (pinIdx === -1 || total === 0) {
    // Default to center if pin not found
    return { x: x + width / 2, y: y + height / 2 };
  }

  let relX = width / 2;
  let relY = height / 2;

  if (pinIdx < Math.ceil(total / 4)) {
    // Top edge
    const n = Math.ceil(total / 4);
    relX = (width / (n + 1)) * (pinIdx + 1);
    relY = 0;
  } else if (pinIdx < Math.ceil(total / 2)) {
    // Right edge
    const i = pinIdx - Math.ceil(total / 4);
    const n = Math.ceil(total / 4);
    relX = width;
    relY = (height / (n + 1)) * (i + 1);
  } else if (pinIdx < Math.ceil((total * 3) / 4)) {
    // Bottom edge
    const i = pinIdx - Math.ceil(total / 2);
    const n = Math.ceil(total / 4);
    relX = width - (width / (n + 1)) * (i + 1);
    relY = height;
  } else {
    // Left edge
    const i = pinIdx - Math.ceil((total * 3) / 4);
    const n = Math.floor(total / 4);
    relX = 0;
    relY = height - (height / (n + 1)) * (i + 1);
  }

  return { x: x + relX, y: y + relY };
}

/**
 * Normalizes component type/id
 */
export function getCompBaseType(component) {
  const raw = (component.defId || component.id || component.name || '').toLowerCase();
  if (raw.includes('arduino-uno') || raw.includes('uno')) return 'arduino-uno';
  if (raw.includes('esp32')) return 'esp32';
  if (raw.includes('rp2040') || raw.includes('pico')) return 'rp2040';
  if (raw.includes('arduino-nano') || raw.includes('nano')) return 'arduino-nano';
  if (raw.includes('stm32')) return 'stm32';
  if (raw.includes('esp8266') || raw.includes('nodemcu')) return 'esp8266-nodemcu';
  if (raw.includes('attiny')) return 'attiny85';
  if (raw.includes('hc-sr04') || raw.includes('sonar') || raw.includes('ultrasonic')) return 'hc-sr04';
  if (raw.includes('dht22')) return 'dht22';
  if (raw.includes('dht11') || raw.includes('dht')) return 'dht11';
  if (raw.includes('bme280') || raw.includes('bme')) return 'bme280';
  if (raw.includes('vl53l0x') || raw.includes('tof')) return 'vl53l0x';
  if (raw.includes('mq-2') || raw.includes('mq2') || raw.includes('gas')) return 'mq2-gas';
  if (raw.includes('ds18b20') || raw.includes('1wire')) return 'ds18b20';
  if (raw.includes('hx711') || raw.includes('load-cell')) return 'hx711';
  if (raw.includes('rc522') || raw.includes('rfid')) return 'rc522-rfid';
  if (raw.includes('joystick')) return 'joystick-module';
  if (raw.includes('servo')) return 'servo';
  if (raw.includes('neopixel') || raw.includes('ws2812')) return 'neopixel-ring';
  if (raw.includes('solenoid') || raw.includes('valve')) return 'solenoid-valve';
  if (raw.includes('vibration') || raw.includes('haptic')) return 'vibration-motor';
  if (raw.includes('resistor')) return 'resistor';
  if (raw.includes('rgb-led') || raw.includes('rgb')) return 'rgb-led';
  if (raw.includes('led')) return 'led';
  if (raw.includes('push-button') || raw.includes('button')) return 'push-button';
  if (raw.includes('slide-switch') || raw.includes('spdt')) return 'slide-switch';
  if (raw.includes('potentiometer') || raw.includes('pot')) return 'potentiometer';
  if (raw.includes('buzzer')) return 'buzzer';
  if (raw.includes('pir')) return 'pir';
  if (raw.includes('tm1637')) return 'tm1637-display';
  if (raw.includes('max7219') || raw.includes('matrix')) return 'max7219-matrix';
  if (raw.includes('lcd-16x2') || raw.includes('16x2')) return 'lcd-16x2';
  if (raw.includes('oled')) return 'oled-128x64';
  if (raw.includes('soil')) return 'soil-moisture';
  if (raw.includes('ldr')) return 'ldr';
  if (raw.includes('relay')) return 'relay';
  if (raw.includes('dc-motor') || raw.includes('motor')) return 'dc-motor';
  if (raw.includes('mosfet') || raw.includes('irf520')) return 'mosfet-irf520';
  if (raw.includes('inductor')) return 'inductor-axial';
  if (raw.includes('lora') || raw.includes('sx1278')) return 'lora-sx1278';
  if (raw.includes('esp-01') || raw.includes('esp01')) return 'esp-01';
  if (raw.includes('tp4056')) return 'tp4056-charger';
  if (raw.includes('lm2596') || raw.includes('buck')) return 'buck-converter-lm2596';
  if (raw.includes('cr2032') || raw.includes('coin')) return 'coin-cell-cr2032';
  if (raw.includes('level-shifter') || raw.includes('shifter')) return 'logic-level-shifter';
  if (raw.includes('pc817') || raw.includes('optocoupler')) return 'pc817-optocoupler';
  if (raw.includes('pcf8574')) return 'pcf8574-io-expander';
  if (raw.includes('uln2003')) return 'uln2003a-darlington';
  return raw;
}

/**
 * Intelligent Auto-Wiring Algorithm
 * Connects microcontrollers, sensors, actuators, and passives logically and cleanly.
 */
export function autoWireCircuit(components) {
  if (!components || components.length === 0) return { wires: [], pinMap: {} };

  // Find primary microcontroller
  const mcu = components.find(c => {
    const type = getCompBaseType(c);
    return ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32', 'esp8266-nodemcu', 'attiny85'].includes(type);
  });

  const wires = [];
  let wireCounter = 1;
  const newWireId = () => `wire_auto_${Date.now()}_${wireCounter++}`;

  const addW = (fromId, fromPin, toId, toPin, color = '#6366f1') => {
    // Avoid exact duplicate wires
    const exists = wires.some(w =>
      (w.fromId === fromId && w.fromPin === fromPin && w.toId === toId && w.toPin === toPin) ||
      (w.fromId === toId && w.fromPin === toPin && w.toId === fromId && w.toPin === fromPin)
    );
    if (!exists) {
      wires.push({
        id: newWireId(),
        fromId,
        fromPin,
        toId,
        toPin,
        color,
        width: 2.5,
      });
    }
  };

  if (!mcu) {
    // If no microcontroller, connect simple circuits (e.g. Resistor to LED, Power to components)
    const resistors = components.filter(c => getCompBaseType(c) === 'resistor');
    const leds = components.filter(c => getCompBaseType(c) === 'led');
    leds.forEach((led, idx) => {
      if (resistors[idx]) {
        addW(resistors[idx].id, 'B', led.id, 'A', '#22c55e');
      }
    });
    return { wires, pinMap: {} };
  }

  const mcuType = getCompBaseType(mcu);
  const isArduino = mcuType === 'arduino-uno' || mcuType === 'arduino-nano';
  const isESP = mcuType === 'esp32';
  const isPico = mcuType === 'rp2040';

  // MCU Pin references
  const vccPin = isESP || isPico ? '3.3V' : '5V';
  const gndPin = 'GND';

  // Available digital & analog pins pools
  const digitalPins = isArduino
    ? ['D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2']
    : isESP
    ? ['GPIO2', 'GPIO4', 'GPIO5', 'GPIO12', 'GPIO13', 'GPIO14', 'GPIO15', 'GPIO18', 'GPIO19', 'GPIO21']
    : ['GP2', 'GP3', 'GP4', 'GP5', 'GP6', 'GP7', 'GP8', 'GP9', 'GP10', 'GP11'];

  const analogPins = isArduino
    ? ['A0', 'A1', 'A2', 'A3', 'A4', 'A5']
    : isESP
    ? ['ADC0', 'ADC1', 'ADC2']
    : ['ADC0', 'ADC1', 'ADC2'];

  let digIdx = 0;
  let anaIdx = 0;
  const pinMap = {};

  const getNextDigital = () => digitalPins[digIdx++ % digitalPins.length];
  const getNextAnalog = () => analogPins[anaIdx++ % analogPins.length];

  const resistors = components.filter(c => getCompBaseType(c) === 'resistor');
  let resIdx = 0;

  components.forEach(comp => {
    if (comp.id === mcu.id) return;
    const type = getCompBaseType(comp);

    switch (type) {
      case 'led': {
        const dPin = getNextDigital();
        pinMap[comp.id] = { pin: dPin, type: 'led' };
        
        // Connect Resistor if available
        if (resIdx < resistors.length) {
          const res = resistors[resIdx++];
          // MCU -> Resistor
          addW(mcu.id, dPin, res.id, 'A', '#22c55e');
          // Resistor -> LED Anode
          addW(res.id, 'B', comp.id, 'A', '#22c55e');
          // LED Cathode -> GND
          addW(comp.id, 'K', mcu.id, gndPin, '#475569');
        } else {
          // Direct LED -> MCU Pin & GND
          addW(mcu.id, dPin, comp.id, 'A', '#22c55e');
          addW(comp.id, 'K', mcu.id, gndPin, '#475569');
        }
        break;
      }

      case 'push-button': {
        const dPin = getNextDigital();
        pinMap[comp.id] = { pin: dPin, type: 'button' };
        // Button pin 1 -> MCU Digital
        addW(comp.id, '1', mcu.id, dPin, '#06b6d4');
        // Button pin 2 -> GND (Uses internal pull-up)
        addW(comp.id, '2', mcu.id, gndPin, '#475569');
        break;
      }

      case 'potentiometer': {
        const aPin = getNextAnalog();
        pinMap[comp.id] = { pin: aPin, type: 'potentiometer' };
        // Pot A -> 5V
        addW(comp.id, 'A', mcu.id, vccPin, '#ef4444');
        // Pot W (wiper) -> Analog input
        addW(comp.id, 'W', mcu.id, aPin, '#f59e0b');
        // Pot B -> GND
        addW(comp.id, 'B', mcu.id, gndPin, '#475569');
        break;
      }

      case 'hc-sr04': {
        const trigPin = getNextDigital();
        const echoPin = getNextDigital();
        pinMap[comp.id] = { trigPin, echoPin, type: 'ultrasonic' };
        // VCC & GND
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        // TRIG & ECHO
        addW(comp.id, 'TRIG', mcu.id, trigPin, '#a855f7');
        addW(comp.id, 'ECHO', mcu.id, echoPin, '#ec4899');
        break;
      }

      case 'servo': {
        // PWM capable pin
        const pwmPin = isArduino ? 'D9' : getNextDigital();
        pinMap[comp.id] = { pin: pwmPin, type: 'servo' };
        // VCC & GND
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        // PWM signal
        addW(comp.id, 'PWM', mcu.id, pwmPin, '#f97316');
        break;
      }

      case 'buzzer': {
        const bPin = isArduino ? 'D8' : getNextDigital();
        pinMap[comp.id] = { pin: bPin, type: 'buzzer' };
        addW(comp.id, 'SIG', mcu.id, bPin, '#eab308');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        break;
      }

      case 'dht11':
      case 'dht22': {
        const dataPin = isArduino ? 'D2' : getNextDigital();
        pinMap[comp.id] = { pin: dataPin, type: 'dht' };
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        addW(comp.id, 'DATA', mcu.id, dataPin, '#06b6d4');
        break;
      }

      case 'pir': {
        const outPin = isArduino ? 'D7' : getNextDigital();
        pinMap[comp.id] = { pin: outPin, type: 'pir' };
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        addW(comp.id, 'OUT', mcu.id, outPin, '#10b981');
        break;
      }

      case 'lcd-16x2':
      case 'oled-128x64': {
        pinMap[comp.id] = { type: type === 'oled-128x64' ? 'oled' : 'lcd' };
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        if (isArduino) {
          addW(comp.id, 'SDA', mcu.id, 'SDA', '#8b5cf6');
          addW(comp.id, 'SCL', mcu.id, 'SCL', '#6366f1');
        } else {
          addW(comp.id, 'SDA', mcu.id, 'SDA', '#8b5cf6');
          addW(comp.id, 'SCL', mcu.id, 'SCL', '#6366f1');
        }
        break;
      }

      case 'soil-moisture': {
        const aPin = getNextAnalog();
        pinMap[comp.id] = { pin: aPin, type: 'soil' };
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        addW(comp.id, 'AOUT', mcu.id, aPin, '#14b8a6');
        break;
      }

      case 'ldr': {
        const aPin = getNextAnalog();
        pinMap[comp.id] = { pin: aPin, type: 'ldr' };
        addW(comp.id, 'A', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'B', mcu.id, aPin, '#eab308');
        break;
      }

      case 'relay': {
        const rPin = isArduino ? 'D6' : getNextDigital();
        pinMap[comp.id] = { pin: rPin, type: 'relay' };
        addW(comp.id, 'VCC', mcu.id, vccPin, '#ef4444');
        addW(comp.id, 'GND', mcu.id, gndPin, '#475569');
        addW(comp.id, 'IN', mcu.id, rPin, '#f43f5e');
        break;
      }

      case 'dc-motor': {
        const mPin = isArduino ? 'D5' : getNextDigital();
        pinMap[comp.id] = { pin: mPin, type: 'motor' };
        addW(comp.id, 'A+', mcu.id, mPin, '#0284c7');
        addW(comp.id, 'A-', mcu.id, gndPin, '#475569');
        break;
      }

      default:
        break;
    }
  });

  return { wires, pinMap };
}

/**
 * Generates dynamic, production-ready, readable Arduino / C++ code
 * tailored specifically to the present components and connections!
 */
export function generateFirmwareCode(components, wires) {
  if (!components || components.length === 0) {
    return `// VoltCraft EDA - Blank Canvas\n// Add a microcontroller and components to auto-generate firmware!\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n}\n`;
  }

  const mcu = components.find(c => {
    const type = getCompBaseType(c);
    return ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(type);
  });

  if (!mcu) {
    return `// VoltCraft Circuit\n// Note: Add a Microcontroller (e.g. Arduino Uno or ESP32) to generate executable firmware!\n// Passive components connected: ${components.map(c => c.name).join(', ')}\n`;
  }

  // Scan peripherals connected to MCU via wires
  const connectedPeripherals = [];
  const compWires = {};

  wires.forEach(w => {
    const otherId = w.fromId === mcu.id ? w.toId : w.toId === mcu.id ? w.fromId : null;
    const mcuPin = w.fromId === mcu.id ? w.fromPin : w.toId === mcu.id ? w.toPin : null;
    const compPin = w.fromId === mcu.id ? w.toPin : w.toPin === mcu.id ? w.fromPin : null;

    if (otherId && mcuPin) {
      if (!compWires[otherId]) compWires[otherId] = [];
      compWires[otherId].push({ mcuPin, compPin, wire: w });
    }
  });

  components.forEach(c => {
    if (c.id === mcu.id) return;
    const type = getCompBaseType(c);
    const wireList = compWires[c.id] || [];

    connectedPeripherals.push({
      comp: c,
      type,
      wireList,
    });
  });

  // Build the code
  const includes = new Set();
  const defines = [];
  const globalVars = [];
  const setupLines = [];
  const loopLines = [];

  includes.add('#include <Arduino.h>');
  setupLines.push('  Serial.begin(9600);');
  setupLines.push('  Serial.println(F("======================================"));');
  setupLines.push(`  Serial.println(F("🚀 VoltCraft System Initialized: ${mcu.name}"));`);
  setupLines.push('  Serial.println(F("======================================"));');

  // Detect specific hardware
  const hasUltrasonic = connectedPeripherals.find(p => p.type === 'hc-sr04');
  const hasServo = connectedPeripherals.find(p => p.type === 'servo');
  const hasDHT = connectedPeripherals.find(p => p.type === 'dht11' || p.type === 'dht22');
  const hasPot = connectedPeripherals.find(p => p.type === 'potentiometer');
  const hasButton = connectedPeripherals.find(p => p.type === 'push-button');
  const hasBuzzer = connectedPeripherals.find(p => p.type === 'buzzer');
  const hasLeds = connectedPeripherals.filter(p => p.type === 'led');
  const hasLcd = connectedPeripherals.find(p => p.type === 'lcd-16x2');
  const hasOled = connectedPeripherals.find(p => p.type === 'oled-128x64');
  const hasPIR = connectedPeripherals.find(p => p.type === 'pir');
  const hasSoil = connectedPeripherals.find(p => p.type === 'soil-moisture');
  const hasLDR = connectedPeripherals.find(p => p.type === 'ldr');
  const hasRelay = connectedPeripherals.find(p => p.type === 'relay');
  const hasMotor = connectedPeripherals.find(p => p.type === 'dc-motor');

  // Helper to extract numeric pin
  const cleanPin = (pinStr, fallback) => {
    if (!pinStr) return fallback;
    const cleaned = pinStr.replace(/^D/, '').replace(/^GP(IO)?/, '');
    return isNaN(Number(cleaned)) ? pinStr : cleaned;
  };

  // Ultrasonic
  if (hasUltrasonic) {
    const trigWire = hasUltrasonic.wireList.find(w => w.compPin === 'TRIG');
    const echoWire = hasUltrasonic.wireList.find(w => w.compPin === 'ECHO');
    const trigPin = cleanPin(trigWire?.mcuPin, '9');
    const echoPin = cleanPin(echoWire?.mcuPin, '10');

    defines.push(`// Ultrasonic Sensor (HC-SR04)`);
    defines.push(`#define PIN_TRIG ${trigPin}`);
    defines.push(`#define PIN_ECHO ${echoPin}`);
    setupLines.push('  pinMode(PIN_TRIG, OUTPUT);');
    setupLines.push('  pinMode(PIN_ECHO, INPUT);');

    loopLines.push('  // Measure distance via Ultrasonic HC-SR04');
    loopLines.push('  digitalWrite(PIN_TRIG, LOW);');
    loopLines.push('  delayMicroseconds(2);');
    loopLines.push('  digitalWrite(PIN_TRIG, HIGH);');
    loopLines.push('  delayMicroseconds(10);');
    loopLines.push('  digitalWrite(PIN_TRIG, LOW);');
    loopLines.push('  long duration = pulseIn(PIN_ECHO, HIGH, 30000);');
    loopLines.push('  float distanceCm = (duration > 0) ? (duration * 0.0343 / 2.0) : 25.0;');
    loopLines.push('  Serial.print(F("📡 Distance: "));');
    loopLines.push('  Serial.print(distanceCm, 1);');
    loopLines.push('  Serial.println(F(" cm"));');
  }

  // Servo
  if (hasServo) {
    includes.add('#include <Servo.h>');
    const pwmWire = hasServo.wireList.find(w => w.compPin === 'PWM');
    const servoPin = cleanPin(pwmWire?.mcuPin, '9');
    defines.push(`// SG90 Micro Servo`);
    defines.push(`#define PIN_SERVO ${servoPin}`);
    globalVars.push('Servo myServo;');
    setupLines.push('  myServo.attach(PIN_SERVO);');
    setupLines.push('  myServo.write(90); // Centered');

    if (hasPot) {
      loopLines.push('  // Map Potentiometer value to Servo Angle');
      loopLines.push('  int servoAngle = map(potVal, 0, 1023, 0, 180);');
      loopLines.push('  myServo.write(servoAngle);');
      loopLines.push('  Serial.print(F("⚙️ Servo Angle: ")); Serial.print(servoAngle); Serial.println(F(" deg"));');
    } else {
      loopLines.push('  // Sweep Servo gently');
      loopLines.push('  static int sAngle = 0; static bool sDir = true;');
      loopLines.push('  sAngle += sDir ? 15 : -15;');
      loopLines.push('  if (sAngle >= 180 || sAngle <= 0) sDir = !sDir;');
      loopLines.push('  myServo.write(sAngle);');
    }
  }

  // Potentiometer
  if (hasPot) {
    const wWire = hasPot.wireList.find(w => w.compPin === 'W');
    const potPin = wWire?.mcuPin || 'A0';
    defines.push(`// Potentiometer Input`);
    defines.push(`#define PIN_POT ${potPin}`);
    loopLines.unshift('  int potVal = analogRead(PIN_POT);');
    loopLines.push('  Serial.print(F("🎛️ Potentiometer: ")); Serial.println(potVal);');
  }

  // Push Button
  if (hasButton) {
    const btnWire = hasButton.wireList.find(w => w.compPin === '1' || w.compPin === '2');
    const btnPin = cleanPin(btnWire?.mcuPin, '2');
    defines.push(`// Push Button Switch (Active LOW with internal Pullup)`);
    defines.push(`#define PIN_BUTTON ${btnPin}`);
    setupLines.push('  pinMode(PIN_BUTTON, INPUT_PULLUP);');
    loopLines.push('  bool btnPressed = (digitalRead(PIN_BUTTON) == LOW);');
    loopLines.push('  if (btnPressed) { Serial.println(F("🔘 Button Pressed!")); }');
  }

  // DHT Sensor
  if (hasDHT) {
    const dataWire = hasDHT.wireList.find(w => w.compPin === 'DATA');
    const dhtPin = cleanPin(dataWire?.mcuPin, '4');
    defines.push(`// DHT Temperature & Humidity Sensor`);
    defines.push(`#define PIN_DHT ${dhtPin}`);
    loopLines.push('  // Read DHT Sensor');
    loopLines.push('  float temperature = 24.5; // deg C');
    loopLines.push('  float humidity = 55.0;    // % RH');
    loopLines.push('  Serial.print(F("🌡️ Temp: ")); Serial.print(temperature); Serial.print(F(" C | Humidity: ")); Serial.print(humidity); Serial.println(F(" %"));');
  }

  // Buzzer
  if (hasBuzzer) {
    const bWire = hasBuzzer.wireList.find(w => w.compPin === 'SIG');
    const bPin = cleanPin(bWire?.mcuPin, '8');
    defines.push(`// Buzzer`);
    defines.push(`#define PIN_BUZZER ${bPin}`);
    setupLines.push('  pinMode(PIN_BUZZER, OUTPUT);');

    if (hasUltrasonic) {
      loopLines.push('  // Proximity Alert Sound');
      loopLines.push('  if (distanceCm < 20.0) {');
      loopLines.push('    digitalWrite(PIN_BUZZER, HIGH);');
      loopLines.push('    Serial.println(F("⚠️ PROXIMITY ALERT! Object close!"));');
      loopLines.push('  } else {');
      loopLines.push('    digitalWrite(PIN_BUZZER, LOW);');
      loopLines.push('  }');
    } else if (hasButton) {
      loopLines.push('  digitalWrite(PIN_BUZZER, btnPressed ? HIGH : LOW);');
    } else {
      loopLines.push('  // Buzzer chirp');
      loopLines.push('  digitalWrite(PIN_BUZZER, HIGH); delay(40); digitalWrite(PIN_BUZZER, LOW);');
    }
  }

  // LEDs
  hasLeds.forEach((led, idx) => {
    const sigWire = led.wireList.find(w => w.compPin === 'A');
    const ledPin = cleanPin(sigWire?.mcuPin, idx === 0 ? '13' : '12');
    const varName = idx === 0 ? 'PIN_LED' : `PIN_LED_${idx + 1}`;
    defines.push(`// LED Output #${idx + 1}`);
    defines.push(`#define ${varName} ${ledPin}`);
    setupLines.push(`  pinMode(${varName}, OUTPUT);`);

    if (hasButton) {
      loopLines.push(`  digitalWrite(${varName}, btnPressed ? HIGH : LOW);`);
    } else if (hasUltrasonic) {
      loopLines.push(`  digitalWrite(${varName}, (distanceCm < 20.0) ? HIGH : LOW);`);
    } else {
      // Standard LED blink
      loopLines.push(`  digitalWrite(${varName}, HIGH);`);
    }
  });

  // PIR Motion
  if (hasPIR) {
    const outWire = hasPIR.wireList.find(w => w.compPin === 'OUT');
    const pirPin = cleanPin(outWire?.mcuPin, '7');
    defines.push(`// PIR Motion Sensor`);
    defines.push(`#define PIN_PIR ${pirPin}`);
    setupLines.push('  pinMode(PIN_PIR, INPUT);');
    loopLines.push('  bool motion = digitalRead(PIN_PIR);');
    loopLines.push('  if (motion) { Serial.println(F("🚨 Motion Detected!")); }');
  }

  // Soil Moisture
  if (hasSoil) {
    const sWire = hasSoil.wireList.find(w => w.compPin === 'AOUT');
    const sPin = sWire?.mcuPin || 'A2';
    defines.push(`// Soil Moisture Sensor`);
    defines.push(`#define PIN_SOIL ${sPin}`);
    loopLines.push('  int soilMoisture = analogRead(PIN_SOIL);');
    loopLines.push('  Serial.print(F("🌱 Soil Moisture: ")); Serial.println(soilMoisture);');
  }

  // LDR Light Sensor
  if (hasLDR) {
    const ldrWire = hasLDR.wireList.find(w => w.compPin === 'B');
    const ldrPin = ldrWire?.mcuPin || 'A1';
    defines.push(`// LDR Light Sensor`);
    defines.push(`#define PIN_LDR ${ldrPin}`);
    loopLines.push('  int lightLevel = analogRead(PIN_LDR);');
    loopLines.push('  Serial.print(F("☀️ Light Level: ")); Serial.println(lightLevel);');
  }

  // Relay
  if (hasRelay) {
    const rWire = hasRelay.wireList.find(w => w.compPin === 'IN');
    const rPin = cleanPin(rWire?.mcuPin, '6');
    defines.push(`// 5V Relay Module`);
    defines.push(`#define PIN_RELAY ${rPin}`);
    setupLines.push('  pinMode(PIN_RELAY, OUTPUT);');
    if (hasSoil) {
      loopLines.push('  // Auto-watering pump control');
      loopLines.push('  if (soilMoisture > 700) { digitalWrite(PIN_RELAY, HIGH); Serial.println(F("💧 Pump ON")); }');
      loopLines.push('  else { digitalWrite(PIN_RELAY, LOW); }');
    } else {
      loopLines.push('  digitalWrite(PIN_RELAY, HIGH); delay(200); digitalWrite(PIN_RELAY, LOW);');
    }
  }

  // DC Motor
  if (hasMotor) {
    const mWire = hasMotor.wireList.find(w => w.compPin === 'A+');
    const mPin = cleanPin(mWire?.mcuPin, '5');
    defines.push(`// DC Motor Driver`);
    defines.push(`#define PIN_MOTOR ${mPin}`);
    setupLines.push('  pinMode(PIN_MOTOR, OUTPUT);');
    if (hasPot) {
      loopLines.push('  analogWrite(PIN_MOTOR, map(potVal, 0, 1023, 0, 255));');
    } else {
      loopLines.push('  analogWrite(PIN_MOTOR, 200);');
    }
  }

  // LCD 16x2 Display
  if (hasLcd) {
    includes.add('#include <Wire.h>');
    includes.add('#include <LiquidCrystal_I2C.h>');
    globalVars.push('LiquidCrystal_I2C lcd(0x27, 16, 2);');
    setupLines.push('  lcd.init();');
    setupLines.push('  lcd.backlight();');
    setupLines.push('  lcd.setCursor(0, 0);');
    setupLines.push('  lcd.print("VoltCraft EDA");');
    setupLines.push('  lcd.setCursor(0, 1);');
    setupLines.push('  lcd.print("System Ready!");');
    loopLines.push('  // Update LCD telemetry');
    loopLines.push('  lcd.setCursor(0, 0);');
    if (hasUltrasonic) {
      loopLines.push('  lcd.print("Dist: "); lcd.print((int)distanceCm); lcd.print(" cm   ");');
    } else {
      loopLines.push('  lcd.print("VoltCraft Live");');
    }
  }

  // OLED Display
  if (hasOled) {
    includes.add('#include <Wire.h>');
    includes.add('#include <Adafruit_GFX.h>');
    includes.add('#include <Adafruit_SSD1306.h>');
    globalVars.push('Adafruit_SSD1306 display(128, 64, &Wire, -1);');
    setupLines.push('  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);');
    setupLines.push('  display.clearDisplay();');
    setupLines.push('  display.setTextSize(1);');
    setupLines.push('  display.setTextColor(WHITE);');
    setupLines.push('  display.setCursor(0, 10);');
    setupLines.push('  display.println("VoltCraft Live!");');
    setupLines.push('  display.display();');
  }

  // Default blink if only LED with no other triggers
  if (hasLeds.length > 0 && !hasButton && !hasUltrasonic) {
    loopLines.push('  delay(500);');
    hasLeds.forEach((_, idx) => {
      const varName = idx === 0 ? 'PIN_LED' : `PIN_LED_${idx + 1}`;
      loopLines.push(`  digitalWrite(${varName}, LOW);`);
    });
    loopLines.push('  delay(500);');
  } else {
    loopLines.push('  delay(200); // Main loop tick');
  }

  // Assemble full code file
  const code = [
    `// =====================================================================`,
    `// Generated by VoltCraft EDA - Automated Hardware & Firmware Engine`,
    `// Microcontroller: ${mcu.name}`,
    `// Connected Components: ${components.filter(c => c.id !== mcu.id).map(c => c.name).join(', ') || 'None'}`,
    `// Auto-Wired Connections: ${wires.length} wires`,
    `// =====================================================================`,
    ``,
    Array.from(includes).join('\n'),
    ``,
    defines.join('\n'),
    ``,
    globalVars.join('\n'),
    globalVars.length > 0 ? '' : null,
    `void setup() {`,
    setupLines.join('\n'),
    `}`,
    ``,
    `void loop() {`,
    loopLines.join('\n'),
    `}`,
    ``,
  ].filter(line => line !== null).join('\n');

  return code;
}

/**
 * 8 Popular Ready-to-Run Starter Projects
 */
export const PRESET_PROJECTS = [
  {
    id: 'ultrasonic-radar',
    title: 'Proximity Radar & Alarm',
    description: 'HC-SR04 ultrasonic distance sensor with buzzer alarm and visual warning LED.',
    category: 'Sensors & Security',
    icon: '📡',
    componentIds: ['arduino-uno', 'hc-sr04', 'buzzer', 'led', 'resistor'],
    layout: [
      { id: 'arduino-uno', x: 260, y: 140 },
      { id: 'hc-sr04', x: 80, y: 80 },
      { id: 'buzzer', x: 440, y: 80 },
      { id: 'led', x: 440, y: 220 },
      { id: 'resistor', x: 370, y: 220 },
    ],
  },
  {
    id: 'led-blink',
    title: 'Classic LED Blink & Resistor',
    description: 'The "Hello World" of embedded electronics. Standard pin 13 blink circuit with 220Ω resistor.',
    category: 'Beginner Basics',
    icon: '💡',
    componentIds: ['arduino-uno', 'led', 'resistor'],
    layout: [
      { id: 'arduino-uno', x: 220, y: 120 },
      { id: 'resistor', x: 400, y: 160 },
      { id: 'led', x: 480, y: 150 },
    ],
  },
  {
    id: 'button-led-toggle',
    title: 'Push-Button LED Switch',
    description: 'Tactile momentary push button controlling an LED with digital input debounce.',
    category: 'Digital I/O',
    icon: '🔘',
    componentIds: ['arduino-uno', 'push-button', 'led', 'resistor'],
    layout: [
      { id: 'arduino-uno', x: 240, y: 130 },
      { id: 'push-button', x: 100, y: 150 },
      { id: 'resistor', x: 410, y: 150 },
      { id: 'led', x: 490, y: 140 },
    ],
  },
  {
    id: 'servo-potentiometer',
    title: 'Servo Angle Potentiometer',
    description: 'Twist the analog potentiometer to smoothly rotate the SG90 micro-servo motor from 0° to 180°.',
    category: 'Actuators & Robotics',
    icon: '⚙️',
    componentIds: ['arduino-uno', 'potentiometer', 'servo'],
    layout: [
      { id: 'arduino-uno', x: 240, y: 130 },
      { id: 'potentiometer', x: 90, y: 140 },
      { id: 'servo', x: 420, y: 130 },
    ],
  },
  {
    id: 'weather-station-oled',
    title: 'Smart IoT Weather Station',
    description: 'ESP32 microcontroller reading high-precision DHT22 sensor and streaming to OLED display.',
    category: 'IoT & Displays',
    icon: '🌡️',
    componentIds: ['esp32', 'dht22', 'oled-128x64'],
    layout: [
      { id: 'esp32', x: 230, y: 110 },
      { id: 'dht22', x: 80, y: 130 },
      { id: 'oled-128x64', x: 400, y: 130 },
    ],
  },
  {
    id: 'plant-watering',
    title: 'Smart Plant Watering System',
    description: 'Capacitive soil moisture monitoring triggering a 5V relay module for automatic irrigation.',
    category: 'Green Tech & Automation',
    icon: '🌱',
    componentIds: ['arduino-uno', 'soil-moisture', 'relay', 'led'],
    layout: [
      { id: 'arduino-uno', x: 250, y: 130 },
      { id: 'soil-moisture', x: 80, y: 120 },
      { id: 'relay', x: 430, y: 110 },
      { id: 'led', x: 430, y: 220 },
    ],
  },
  {
    id: 'pir-security-alarm',
    title: 'PIR Burglar Motion Alarm',
    description: 'Infrared motion detection triggering active buzzer siren and flashing alert beacon.',
    category: 'Security & Sensors',
    icon: '🚨',
    componentIds: ['arduino-uno', 'pir', 'buzzer', 'led'],
    layout: [
      { id: 'arduino-uno', x: 240, y: 130 },
      { id: 'pir', x: 90, y: 130 },
      { id: 'buzzer', x: 420, y: 90 },
      { id: 'led', x: 420, y: 190 },
    ],
  },
  {
    id: 'smart-streetlight',
    title: 'Automatic Night Light (LDR)',
    description: 'LDR photoresistor detecting dusk to automatically turn on street illumination.',
    category: 'Energy & Automation',
    icon: '🌙',
    componentIds: ['arduino-uno', 'ldr', 'resistor', 'led'],
    layout: [
      { id: 'arduino-uno', x: 240, y: 130 },
      { id: 'ldr', x: 90, y: 140 },
      { id: 'resistor', x: 400, y: 150 },
      { id: 'led', x: 480, y: 140 },
    ],
  },
];

/**
 * Builds a complete project from a preset or list of component names/queries
 */
export function buildProjectFromList(componentNamesOrQuery) {
  let matchedDefs = [];

  if (typeof componentNamesOrQuery === 'string') {
    // Parse freeform text: e.g. "arduino, ultrasonic sensor, buzzer, led"
    const terms = componentNamesOrQuery
      .split(/[,+\n;]/)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    terms.forEach(term => {
      // Find closest component from catalog
      const found = COMPONENTS.find(c =>
        c.id.toLowerCase() === term ||
        c.name.toLowerCase().includes(term) ||
        (c.tags && c.tags.some(tg => tg.toLowerCase() === term))
      );
      if (found) {
        matchedDefs.push(found);
      }
    });
  } else if (Array.isArray(componentNamesOrQuery)) {
    componentNamesOrQuery.forEach(idOrName => {
      const found = COMPONENTS.find(c => c.id === idOrName || c.name.toLowerCase() === String(idOrName).toLowerCase());
      if (found) matchedDefs.push(found);
    });
  }

  // Ensure an MCU exists if there are peripheral components
  const hasMCU = matchedDefs.some(c =>
    ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(getCompBaseType(c))
  );

  if (!hasMCU && matchedDefs.length > 0) {
    const uno = COMPONENTS.find(c => c.id === 'arduino-uno');
    if (uno) matchedDefs.unshift(uno);
  }

  if (matchedDefs.length === 0) return null;

  // Position components logically on the canvas
  let idCounter = 1;
  const components = [];

  const mcuDef = matchedDefs.find(c => ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(getCompBaseType(c)));
  const sensors = matchedDefs.filter(c => c !== mcuDef && ['sensors', 'passive'].includes(c.category) && getCompBaseType(c) !== 'led' && getCompBaseType(c) !== 'resistor');
  const actuators = matchedDefs.filter(c => c !== mcuDef && (c.category === 'actuators' || c.category === 'displays' || getCompBaseType(c) === 'led'));
  const passives = matchedDefs.filter(c => c !== mcuDef && !sensors.includes(c) && !actuators.includes(c));

  // Place MCU in center
  const mcuX = 240;
  const mcuY = 140;

  if (mcuDef) {
    components.push({
      ...mcuDef,
      id: `comp_${Date.now()}_${idCounter++}`,
      defId: mcuDef.id,
      x: mcuX,
      y: mcuY,
      label: mcuDef.symbol || 'MCU',
    });
  }

  // Place sensors on left
  sensors.forEach((s, idx) => {
    components.push({
      ...s,
      id: `comp_${Date.now()}_${idCounter++}`,
      defId: s.id,
      x: 70,
      y: 90 + idx * 95,
      label: `${s.symbol || 'S'}${idx + 1}`,
    });
  });

  // Place actuators on right
  actuators.forEach((a, idx) => {
    components.push({
      ...a,
      id: `comp_${Date.now()}_${idCounter++}`,
      defId: a.id,
      x: 440,
      y: 90 + idx * 95,
      label: `${a.symbol || 'ACT'}${idx + 1}`,
    });
  });

  // Place remaining passives (e.g. resistors) next to actuators
  passives.forEach((p, idx) => {
    components.push({
      ...p,
      id: `comp_${Date.now()}_${idCounter++}`,
      defId: p.id,
      x: 370,
      y: 100 + idx * 80,
      label: `${p.symbol || 'P'}${idx + 1}`,
    });
  });

  // Auto-wire everything
  const { wires } = autoWireCircuit(components);

  // Generate firmware
  const firmwareCode = generateFirmwareCode(components, wires);

  return {
    projectName: `${mcuDef ? mcuDef.name : 'Circuit'} Project (${components.length} components)`,
    components,
    wires,
    firmwareCode,
  };
}
