// Real-time Interactive Circuit Simulation Engine
// Manages sensor inputs, actuator states, voltage propagation, audio synthesize, and serial streaming.

class SimulationRunner {
  constructor() {
    this.intervalId = null;
    this.tickCount = 0;
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isBuzzerSounding = false;
  }

  // Audio tone generator for real buzzer sound
  initAudio() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch {}
  }

  playBuzzerTone(freq = 1800, volume = 0.05) {
    if (!this.audioCtx || this.isBuzzerSounding) return;
    try {
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();
      this.oscillator.type = 'square';
      this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();
      this.isBuzzerSounding = true;
    } catch {}
  }

  stopBuzzerTone() {
    if (this.oscillator && this.isBuzzerSounding) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {}
      this.oscillator = null;
      this.isBuzzerSounding = false;
    }
  }

  start(getState, setState) {
    this.stop();
    this.tickCount = 0;

    // Simulation loop running at 100ms intervals (10Hz simulation clock)
    this.intervalId = setInterval(() => {
      this.step(getState, setState);
    }, 100);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.stopBuzzerTone();
  }

  step(getState, setState) {
    const state = getState();
    if (!state.isSimulating) {
      this.stop();
      return;
    }

    this.tickCount++;
    const { components, wires, sensorValues = {}, soundEnabled = false } = state;

    // Identify primary MCU
    const mcu = components.find(c => {
      const id = (c.defId || c.id || '').toLowerCase();
      return id.includes('arduino') || id.includes('esp32') || id.includes('rp2040') || id.includes('stm32');
    });

    const newPinStates = { ...(state.pinStates || {}) };
    const newMcuOutputs = { ...(state.mcuOutputs || {}) };

    // Default sensor inputs (can be changed interactively via SimulationHUD)
    const ultrasonicDist = sensorValues.ultrasonicDist !== undefined ? sensorValues.ultrasonicDist : 18; // cm
    const potVal = sensorValues.potVal !== undefined ? sensorValues.potVal : 512; // 0-1023
    const btnPressed = sensorValues.btnPressed !== undefined ? sensorValues.btnPressed : false;
    const temp = sensorValues.temp !== undefined ? sensorValues.temp : 24.5;
    const humidity = sensorValues.humidity !== undefined ? sensorValues.humidity : 55;
    const pirMotion = sensorValues.pirMotion !== undefined ? sensorValues.pirMotion : false;
    const lightLevel = sensorValues.lightLevel !== undefined ? sensorValues.lightLevel : 65; // %
    const soilMoisture = sensorValues.soilMoisture !== undefined ? sensorValues.soilMoisture : 45; // %

    // Determine actuator reactions based on active sensors and circuit logic
    const hasUltrasonic = components.some(c => (c.defId || c.id).includes('hc-sr04'));
    const hasBuzzer = components.some(c => (c.defId || c.id).includes('buzzer'));
    const hasPot = components.some(c => (c.defId || c.id).includes('potentiometer'));
    const hasServo = components.some(c => (c.defId || c.id).includes('servo'));
    const hasButton = components.some(c => (c.defId || c.id).includes('button'));
    const hasLeds = components.filter(c => (c.defId || c.id).includes('led'));
    const hasLcd = components.find(c => (c.defId || c.id).includes('lcd-16x2'));
    const hasOled = components.find(c => (c.defId || c.id).includes('oled'));
    const hasMotor = components.some(c => (c.defId || c.id).includes('motor'));
    const hasRelay = components.some(c => (c.defId || c.id).includes('relay'));

    // 1. Proximity Alarm Logic
    const isProximityAlarm = hasUltrasonic && ultrasonicDist < 20;

    // 2. Buzzer State
    let buzzerActive = false;
    if (hasBuzzer) {
      if (hasUltrasonic) {
        buzzerActive = isProximityAlarm;
      } else if (hasButton) {
        buzzerActive = btnPressed;
      } else if (pirMotion) {
        buzzerActive = true;
      } else {
        // Periodic gentle chirp every 2 seconds
        buzzerActive = this.tickCount % 20 === 0;
      }
    }
    newMcuOutputs.buzzerActive = buzzerActive;

    // Audio handling
    if (soundEnabled && buzzerActive) {
      this.initAudio();
      this.playBuzzerTone(2000, 0.03);
    } else {
      this.stopBuzzerTone();
    }

    // 3. LED States
    let ledActive = false;
    if (hasButton) {
      ledActive = btnPressed;
    } else if (hasUltrasonic) {
      ledActive = isProximityAlarm;
    } else if (pirMotion) {
      ledActive = true;
    } else if (lightLevel < 30) {
      // Automatic nightlight
      ledActive = true;
    } else {
      // Classic 1-second blink (5 ticks ON, 5 ticks OFF)
      ledActive = Math.floor(this.tickCount / 5) % 2 === 0;
    }

    hasLeds.forEach(led => {
      newMcuOutputs[led.id] = { active: ledActive, brightness: ledActive ? 1 : 0 };
    });

    // 4. Servo Angle
    let servoAngle = 90;
    if (hasServo) {
      if (hasPot) {
        servoAngle = Math.round((potVal / 1023) * 180);
      } else if (hasUltrasonic) {
        servoAngle = Math.min(180, Math.max(0, Math.round((ultrasonicDist / 100) * 180)));
      } else {
        // Smooth sine wave oscillation
        servoAngle = Math.round(90 + 75 * Math.sin(this.tickCount * 0.15));
      }
      newMcuOutputs.servoAngle = servoAngle;
    }

    // 5. Motor RPM
    if (hasMotor) {
      newMcuOutputs.motorRpm = hasPot ? Math.round((potVal / 1023) * 100) : 75;
    }

    // 6. Relay State
    if (hasRelay) {
      newMcuOutputs.relayActive = soilMoisture > 70 || btnPressed;
    }

    // 7. LCD / OLED Text Screen
    if (hasLcd) {
      if (hasUltrasonic) {
        newMcuOutputs[hasLcd.id] = {
          line1: `Radar: ${Math.round(ultrasonicDist)} cm`,
          line2: isProximityAlarm ? '⚠️ ALARM CLOSE!' : 'Status: Normal',
        };
      } else if (hasServo) {
        newMcuOutputs[hasLcd.id] = {
          line1: `Servo Angle: ${servoAngle}°`,
          line2: `Pot: ${potVal}`,
        };
      } else {
        newMcuOutputs[hasLcd.id] = {
          line1: `VoltCraft EDA`,
          line2: `T:${temp}°C H:${humidity}%`,
        };
      }
    }

    if (hasOled) {
      newMcuOutputs[hasOled.id] = {
        title: 'VOLTCRAFT IoT',
        value1: `Temp: ${temp.toFixed(1)}°C`,
        value2: `Humid: ${humidity.toFixed(0)}%`,
        status: isProximityAlarm ? 'WARN!' : 'ONLINE',
      };
    }

    // Propagate Pin States (Voltage) across all pins
    components.forEach(comp => {
      const type = (comp.defId || comp.id).toLowerCase();
      const allPins = Object.values(comp.pins || {}).flat();

      allPins.forEach(pin => {
        const key = `${comp.id}:${pin}`;
        if (pin === '5V' || pin === '3.3V' || pin === 'VCC') {
          newPinStates[key] = { high: true, voltage: 5.0 };
        } else if (pin === 'GND') {
          newPinStates[key] = { high: false, voltage: 0.0 };
        } else if (type.includes('led') && pin === 'A') {
          newPinStates[key] = { high: ledActive, voltage: ledActive ? 3.2 : 0 };
        } else if (type.includes('buzzer') && pin === 'SIG') {
          newPinStates[key] = { high: buzzerActive, voltage: buzzerActive ? 5.0 : 0 };
        } else if (type.includes('pot') && pin === 'W') {
          newPinStates[key] = { high: potVal > 512, voltage: (potVal / 1023) * 5.0 };
        } else if (type.includes('button')) {
          newPinStates[key] = { high: !btnPressed, voltage: btnPressed ? 0 : 5.0 };
        } else if (type.includes('ultrasonic') && pin === 'TRIG') {
          newPinStates[key] = { high: this.tickCount % 2 === 0, voltage: 5.0 };
        } else if (mcu && comp.id === mcu.id) {
          if (pin === 'D13' || pin === 'D12') {
            newPinStates[key] = { high: ledActive, voltage: ledActive ? 5.0 : 0 };
          } else if (pin === 'D8') {
            newPinStates[key] = { high: buzzerActive, voltage: buzzerActive ? 5.0 : 0 };
          } else if (pin === 'D9') {
            newPinStates[key] = { high: true, voltage: (servoAngle / 180) * 5.0 };
          }
        }
      });
    });

    // Output live Telemetry to Serial Monitor (every 1 second / 10 ticks)
    if (this.tickCount % 10 === 0) {
      let telemetryMsg = '';
      if (hasUltrasonic) {
        telemetryMsg = `[HC-SR04] Distance: ${ultrasonicDist.toFixed(1)} cm ${isProximityAlarm ? '🚨 PROXIMITY ALERT!' : '✓ OK'}`;
      } else if (hasPot && hasServo) {
        telemetryMsg = `[POT] Raw: ${potVal} -> [SERVO] Angle: ${servoAngle}°`;
      } else if (hasButton) {
        telemetryMsg = `[BTN] State: ${btnPressed ? 'PRESSED (LOW)' : 'RELEASED (HIGH)'} -> LED: ${ledActive ? 'ON' : 'OFF'}`;
      } else if (hasLeds.length > 0) {
        telemetryMsg = `[TICK ${this.tickCount * 100}ms] LED: ${ledActive ? 'HIGH (5V)' : 'LOW (0V)'}`;
      } else {
        telemetryMsg = `[TELEMETRY] System Active | VCC: 5.02V | Clock: 16MHz`;
      }

      state.appendSerialData?.({
        type: isProximityAlarm ? 'error' : 'info',
        text: telemetryMsg,
        ts: Date.now(),
      });
    }

    setState({
      pinStates: newPinStates,
      mcuOutputs: newMcuOutputs,
    });
  }
}

export const simulationRunner = new SimulationRunner();
