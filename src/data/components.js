// Component Library Data with categories, descriptions, and image placeholders
export const COMPONENT_CATEGORIES = [
  { id: 'microcontrollers', label: 'Microcontrollers', icon: '🤖' },
  { id: 'sensors', label: 'Sensors', icon: '📡' },
  { id: 'actuators', label: 'Actuators', icon: '⚙️' },
  { id: 'displays', label: 'Displays', icon: '📺' },
  { id: 'passive', label: 'Passive', icon: '🔌' },
  { id: 'communication', label: 'Communication', icon: '📶' },
  { id: 'power', label: 'Power', icon: '⚡' },
  { id: 'logic', label: 'Logic ICs', icon: '🔲' },
];

export const COMPONENTS = [
  // Microcontrollers
  {
    id: 'arduino-uno',
    name: 'Arduino Uno R3',
    category: 'microcontrollers',
    description: 'ATmega328P-based board with 14 digital I/O pins, 6 analog inputs',
    tags: ['arduino', 'avr', 'atmega328p', 'microcontroller'],
    color: '#0066cc',
    accentColor: '#00aaff',
    symbol: 'UNO',
    width: 120,
    height: 80,
    pins: {
      digital: ['D0','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13'],
      analog: ['A0','A1','A2','A3','A4','A5'],
      power: ['5V','3.3V','GND','VIN'],
      special: ['RST','AREF','SCL','SDA']
    },
    specs: { voltage: '5V', flash: '32KB', sram: '2KB', clock: '16MHz' }
  },
  {
    id: 'esp32',
    name: 'ESP32 Dev Board',
    category: 'microcontrollers',
    description: 'Dual-core 240MHz with WiFi, Bluetooth, 34 GPIO pins',
    tags: ['esp32', 'wifi', 'bluetooth', 'iot', 'espressif'],
    color: '#e44d26',
    accentColor: '#ff7043',
    symbol: 'ESP32',
    width: 100,
    height: 120,
    pins: {
      digital: Array.from({length:34}, (_,i)=>`GPIO${i}`),
      analog: ['ADC0','ADC1','ADC2'],
      power: ['3.3V','5V','GND','EN'],
      special: ['TX','RX','SCL','SDA','MOSI','MISO','SCK','SS']
    },
    specs: { voltage: '3.3V', flash: '4MB', sram: '520KB', clock: '240MHz', wifi: true, bt: true }
  },
  {
    id: 'rp2040',
    name: 'Raspberry Pi Pico',
    category: 'microcontrollers',
    description: 'RP2040 dual-core ARM Cortex-M0+, 264KB SRAM, 2MB flash',
    tags: ['rp2040', 'raspberry pi', 'pico', 'arm', 'cortex'],
    color: '#c51a4a',
    accentColor: '#e91e63',
    symbol: 'PICO',
    width: 105,
    height: 75,
    pins: {
      digital: Array.from({length:26}, (_,i)=>`GP${i}`),
      analog: ['ADC0','ADC1','ADC2'],
      power: ['3.3V','VBUS','GND','3V3_EN'],
      special: ['SPI0','SPI1','I2C0','I2C1','UART0','UART1']
    },
    specs: { voltage: '3.3V', flash: '2MB', sram: '264KB', clock: '133MHz' }
  },
  {
    id: 'arduino-nano',
    name: 'Arduino Nano',
    category: 'microcontrollers',
    description: 'Compact ATmega328P board, breadboard-friendly',
    tags: ['arduino', 'nano', 'avr', 'small', 'compact'],
    color: '#0066cc',
    accentColor: '#4fc3f7',
    symbol: 'NANO',
    width: 60,
    height: 100,
    pins: {
      digital: ['D0','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13'],
      analog: ['A0','A1','A2','A3','A4','A5','A6','A7'],
      power: ['5V','3.3V','GND','VIN','RST']
    },
    specs: { voltage: '5V', flash: '32KB', sram: '2KB', clock: '16MHz' }
  },
  {
    id: 'stm32',
    name: 'STM32 Blue Pill',
    category: 'microcontrollers',
    description: 'ARM Cortex-M3, 72MHz, 64KB flash, 20KB SRAM',
    tags: ['stm32', 'arm', 'cortex-m3', 'bluepill', 'st'],
    color: '#0277bd',
    accentColor: '#29b6f6',
    symbol: 'STM32',
    width: 80,
    height: 100,
    pins: { digital: Array.from({length:32}, (_,i)=>`P${i}`), power: ['3.3V','GND','VCC'] },
    specs: { voltage: '3.3V', flash: '64KB', sram: '20KB', clock: '72MHz' }
  },
  {
    id: 'esp8266-nodemcu',
    name: 'NodeMCU ESP8266',
    category: 'microcontrollers',
    description: 'Wi-Fi enabled IoT board, 80MHz Tensilica L106, 4MB Flash, CP2102 USB',
    tags: ['esp8266', 'nodemcu', 'wifi', 'iot', 'espressif', 'microcontroller'],
    color: '#0f766e',
    accentColor: '#14b8a6',
    symbol: 'NODEMCU',
    width: 80,
    height: 110,
    pins: {
      digital: ['D0','D1','D2','D3','D4','D5','D6','D7','D8'],
      analog: ['A0'],
      power: ['3.3V','GND','VIN','RST'],
      special: ['TX','RX','D9/RX','D10/TX']
    },
    specs: { voltage: '3.3V', flash: '4MB', sram: '80KB', clock: '80MHz', wifi: '802.11 b/g/n' }
  },
  {
    id: 'attiny85',
    name: 'ATtiny85 DIP-8',
    category: 'microcontrollers',
    description: 'Ultra-compact 8-bit AVR microcontroller with 8KB flash in breadboard-friendly DIP-8',
    tags: ['attiny85', 'avr', 'tiny', 'dip8', 'atmel', 'microcontroller'],
    color: '#312e81',
    accentColor: '#6366f1',
    symbol: 'ATTINY',
    width: 60,
    height: 65,
    pins: {
      digital: ['PB0','PB1','PB2','PB3','PB4','PB5/RST'],
      power: ['VCC','GND']
    },
    specs: { voltage: '2.7-5.5V', flash: '8KB', sram: '512B', clock: '20MHz' }
  },

  // Sensors
  {
    id: 'dht11',
    name: 'DHT11',
    category: 'sensors',
    description: 'Temperature & humidity sensor, 0-50°C, 20-80% RH',
    tags: ['dht11', 'temperature', 'humidity', 'sensor', 'environmental'],
    color: '#1976d2',
    accentColor: '#42a5f5',
    symbol: 'DHT11',
    width: 50,
    height: 60,
    pins: { signal: ['DATA'], power: ['VCC','GND'] },
    specs: { range: '0-50°C', humidity: '20-80%', accuracy: '±2°C' }
  },
  {
    id: 'dht22',
    name: 'DHT22 / AM2302',
    category: 'sensors',
    description: 'High-precision temperature & humidity, -40 to 80°C',
    tags: ['dht22', 'am2302', 'temperature', 'humidity', 'precision'],
    color: '#1565c0',
    accentColor: '#1e88e5',
    symbol: 'DHT22',
    width: 50,
    height: 65,
    pins: { signal: ['DATA'], power: ['VCC','GND'] },
    specs: { range: '-40 to 80°C', humidity: '0-100%', accuracy: '±0.5°C' }
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04',
    category: 'sensors',
    description: 'Ultrasonic distance sensor, 2cm to 400cm range',
    tags: ['ultrasonic', 'distance', 'hcsr04', 'sonar', 'proximity'],
    color: '#7b1fa2',
    accentColor: '#ab47bc',
    symbol: 'SONAR',
    width: 70,
    height: 50,
    pins: { signal: ['TRIG','ECHO'], power: ['VCC','GND'] },
    specs: { range: '2-400cm', resolution: '0.3cm', angle: '15°' }
  },
  {
    id: 'pir',
    name: 'PIR Motion Sensor',
    category: 'sensors',
    description: 'Passive infrared motion detector, adjustable sensitivity',
    tags: ['pir', 'motion', 'infrared', 'detector', 'security'],
    color: '#e65100',
    accentColor: '#ff7043',
    symbol: 'PIR',
    width: 55,
    height: 55,
    pins: { signal: ['OUT'], power: ['VCC','GND'] },
    specs: { range: '3-7m', angle: '120°', delay: '5s-5min' }
  },
  {
    id: 'mpu6050',
    name: 'MPU-6050 IMU',
    category: 'sensors',
    description: '6-axis accelerometer + gyroscope with I2C interface',
    tags: ['mpu6050', 'accelerometer', 'gyroscope', 'imu', 'i2c', 'motion'],
    color: '#2e7d32',
    accentColor: '#43a047',
    symbol: 'IMU',
    width: 55,
    height: 45,
    pins: { signal: ['SDA','SCL','INT'], power: ['VCC','GND'] },
    specs: { accel: '±2/4/8/16g', gyro: '±250-2000°/s', interface: 'I2C' }
  },
  {
    id: 'soil-moisture',
    name: 'Soil Moisture Sensor',
    category: 'sensors',
    description: 'Capacitive soil moisture measurement for plant monitoring',
    tags: ['soil', 'moisture', 'plant', 'analog', 'agricultural'],
    color: '#795548',
    accentColor: '#a1887f',
    symbol: 'SOIL',
    width: 40,
    height: 80,
    pins: { signal: ['AOUT','DOUT'], power: ['VCC','GND'] },
    specs: { output: 'Analog + Digital', voltage: '3.3-5V' }
  },
  {
    id: 'bmp280',
    name: 'BMP280',
    category: 'sensors',
    description: 'Barometric pressure & temperature sensor via I2C/SPI',
    tags: ['bmp280', 'pressure', 'barometric', 'altitude', 'weather'],
    color: '#00838f',
    accentColor: '#00acc1',
    symbol: 'BMP',
    width: 45,
    height: 40,
    pins: { signal: ['SDA','SCL','SDO','CSB'], power: ['VCC','GND'] },
    specs: { pressure: '300-1100hPa', accuracy: '±1hPa', interface: 'I2C/SPI' }
  },
  {
    id: 'ldr',
    name: 'LDR / Photoresistor',
    category: 'sensors',
    description: 'Light-dependent resistor for ambient light sensing',
    tags: ['ldr', 'light', 'photoresistor', 'analog', 'brightness'],
    color: '#f9a825',
    accentColor: '#ffc107',
    symbol: 'LDR',
    width: 40,
    height: 40,
    pins: { signal: ['A','B'] },
    specs: { resistance: '10Ω-1MΩ', response: 'Analog' }
  },
  {
    id: 'bme280',
    name: 'BME280 Environmental',
    category: 'sensors',
    description: 'Precision temperature, humidity & barometric pressure sensor via I2C/SPI',
    tags: ['bme280', 'temperature', 'humidity', 'pressure', 'i2c', 'spi', 'weather', 'bosch'],
    color: '#0891b2',
    accentColor: '#06b6d4',
    symbol: 'BME280',
    width: 55,
    height: 45,
    pins: { signal: ['SDA','SCL','SDO','CSB'], power: ['VCC','GND'] },
    specs: { temp: '-40 to 85°C', humidity: '0-100% RH', pressure: '300-1100hPa', accuracy: '±0.5°C' }
  },
  {
    id: 'vl53l0x',
    name: 'VL53L0X Laser ToF',
    category: 'sensors',
    description: 'Time-of-Flight distance sensor using 940nm VCSEL laser, up to 2m range',
    tags: ['vl53l0x', 'laser', 'tof', 'distance', 'ranging', 'i2c', 'proximity'],
    color: '#4338ca',
    accentColor: '#6366f1',
    symbol: 'TOF',
    width: 55,
    height: 45,
    pins: { signal: ['SDA','SCL','XSHUT','GPIO1'], power: ['VIN','GND'] },
    specs: { range: '50-2000mm', wavelength: '940nm', interface: 'I2C', precision: '±3%' }
  },
  {
    id: 'mq2-gas',
    name: 'MQ-2 Gas & Smoke',
    category: 'sensors',
    description: 'Metal oxide sensor for LPG, smoke, methane, butane, alcohol, and hydrogen',
    tags: ['mq2', 'gas', 'smoke', 'lpg', 'methane', 'air quality', 'analog'],
    color: '#b45309',
    accentColor: '#f59e0b',
    symbol: 'MQ-2',
    width: 55,
    height: 60,
    pins: { signal: ['AOUT','DOUT'], power: ['VCC','GND'] },
    specs: { detects: 'LPG, Smoke, Alcohol', output: 'Analog + Digital', voltage: '5V' }
  },
  {
    id: 'ds18b20',
    name: 'DS18B20 Temp Probe',
    category: 'sensors',
    description: '1-Wire digital thermometer probe with stainless steel waterproof casing',
    tags: ['ds18b20', 'temperature', 'waterproof', '1-wire', 'probe', 'dallas', 'maxim'],
    color: '#0284c7',
    accentColor: '#38bdf8',
    symbol: '1WIRE',
    width: 65,
    height: 45,
    pins: { signal: ['DATA'], power: ['VCC','GND'] },
    specs: { range: '-55 to +125°C', resolution: '9-12 bit', interface: '1-Wire', accuracy: '±0.5°C' }
  },
  {
    id: 'hx711',
    name: 'HX711 Load Cell Amp',
    category: 'sensors',
    description: '24-bit precision analog-to-digital converter designed for weigh scales and strain gauges',
    tags: ['hx711', 'load cell', 'weight', 'scale', 'strain gauge', '24-bit', 'adc'],
    color: '#047857',
    accentColor: '#10b981',
    symbol: 'HX711',
    width: 65,
    height: 50,
    pins: { signal: ['DT','SCK'], power: ['VCC','GND'], input: ['E+','E-','A+','A-'] },
    specs: { adc: '24-bit', gain: '64/128', dataRate: '10/80 SPS', voltage: '2.6-5.5V' }
  },
  {
    id: 'rc522-rfid',
    name: 'RC522 RFID Reader',
    category: 'sensors',
    description: '13.56MHz contactless RFID/NFC reader module with SPI interface',
    tags: ['rc522', 'rfid', 'nfc', 'contactless', 'card', 'spi', 'mifare'],
    color: '#1d4ed8',
    accentColor: '#3b82f6',
    symbol: 'RFID',
    width: 65,
    height: 70,
    pins: { signal: ['SDA','SCK','MOSI','MISO','IRQ','RST'], power: ['3.3V','GND'] },
    specs: { frequency: '13.56MHz', protocol: 'ISO 14443A / MIFARE', interface: 'SPI' }
  },
  {
    id: 'joystick-module',
    name: 'Dual-Axis Joystick',
    category: 'sensors',
    description: 'Thumb analog joystick with dual potentiometers (X, Y) and tactile push button (SW)',
    tags: ['joystick', 'analog', 'controller', 'ky-023', 'thumbstick', 'input'],
    color: '#475569',
    accentColor: '#94a3b8',
    symbol: 'JOY',
    width: 60,
    height: 60,
    pins: { signal: ['VRx','VRy','SW'], power: ['VCC','GND'] },
    specs: { axes: 'X, Y Analog', button: 'Push Tactile', voltage: '3.3V-5V' }
  },

  // Actuators
  {
    id: 'servo',
    name: 'SG90 Servo Motor',
    category: 'actuators',
    description: 'Micro servo motor, 180° rotation, PWM controlled',
    tags: ['servo', 'motor', 'pwm', 'rotation', 'sg90'],
    color: '#e53935',
    accentColor: '#ef5350',
    symbol: 'SERVO',
    width: 55,
    height: 55,
    pins: { signal: ['PWM'], power: ['VCC','GND'] },
    specs: { torque: '1.8kg-cm', speed: '0.1s/60°', angle: '180°' }
  },
  {
    id: 'dc-motor',
    name: 'DC Motor',
    category: 'actuators',
    description: '3-6V DC motor with 2-wire interface for H-bridge control',
    tags: ['dc motor', 'motor', 'h-bridge', 'l298n', 'actuator'],
    color: '#37474f',
    accentColor: '#607d8b',
    symbol: 'MOTOR',
    width: 50,
    height: 60,
    pins: { signal: ['A+','A-'] },
    specs: { voltage: '3-6V', rpm: '100-300RPM' }
  },
  {
    id: 'buzzer',
    name: 'Passive Buzzer',
    category: 'actuators',
    description: 'Magnetic buzzer for tone generation via PWM frequency',
    tags: ['buzzer', 'sound', 'audio', 'pwm', 'beep'],
    color: '#4a148c',
    accentColor: '#7b1fa2',
    symbol: 'BZR',
    width: 40,
    height: 40,
    pins: { signal: ['SIG'], power: ['GND'] },
    specs: { frequency: '2kHz', voltage: '3.3-5V' }
  },
  {
    id: 'relay',
    name: '5V Relay Module',
    category: 'actuators',
    description: 'Single channel relay for switching high voltage AC/DC loads',
    tags: ['relay', 'switch', 'ac', 'high voltage', 'module'],
    color: '#b71c1c',
    accentColor: '#f44336',
    symbol: 'RELAY',
    width: 65,
    height: 50,
    pins: { signal: ['IN'], power: ['VCC','GND'], output: ['NO','NC','COM'] },
    specs: { load: '10A/250VAC', trigger: '5V', type: 'SPDT' }
  },
  {
    id: 'stepper',
    name: '28BYJ-48 Stepper',
    category: 'actuators',
    description: 'Unipolar stepper motor with ULN2003 driver board',
    tags: ['stepper', 'motor', '28byj48', 'uln2003', 'precision'],
    color: '#1b5e20',
    accentColor: '#2e7d32',
    symbol: 'STEP',
    width: 60,
    height: 70,
    pins: { signal: ['IN1','IN2','IN3','IN4'], power: ['5V','GND'] },
    specs: { steps: '64×64', voltage: '5V', angle: '5.625°/step' }
  },
  {
    id: 'neopixel-ring',
    name: 'WS2812B NeoPixel Ring',
    category: 'actuators',
    description: 'Circular array of 16 individually addressable 5050 RGB LEDs with single-wire control',
    tags: ['neopixel', 'ws2812b', 'rgb', 'led ring', 'addressable', 'adafruit', 'lighting'],
    color: '#059669',
    accentColor: '#10b981',
    symbol: 'PIXEL',
    width: 75,
    height: 75,
    pins: { signal: ['DI','DO'], power: ['5V','GND'] },
    specs: { leds: 16, protocol: 'NZR 800kHz', colorDepth: '24-bit (16.7M colors)' }
  },
  {
    id: 'solenoid-valve',
    name: '12V Solenoid Valve',
    category: 'actuators',
    description: 'Normally-closed electromagnetic liquid/air control valve (1/2" NPT)',
    tags: ['solenoid', 'valve', '12v', 'fluid', 'pneumatic', 'water', 'automation'],
    color: '#334155',
    accentColor: '#64748b',
    symbol: 'VALVE',
    width: 65,
    height: 60,
    pins: { power: ['12V','GND'] },
    specs: { voltage: '12V DC', current: '300mA', pressure: '0.02-0.8MPa', type: 'NC' }
  },
  {
    id: 'vibration-motor',
    name: 'Mini Vibration Motor',
    category: 'actuators',
    description: 'Coin-type eccentric rotating mass (ERM) haptic feedback vibration motor',
    tags: ['vibration', 'haptic', 'motor', 'erm', 'disc', 'pager', 'feedback'],
    color: '#64748b',
    accentColor: '#94a3b8',
    symbol: 'HAPTIC',
    width: 45,
    height: 45,
    pins: { power: ['VCC','GND'] },
    specs: { voltage: '3V DC', rpm: '12000 RPM', current: '70mA' }
  },

  // Displays
  {
    id: 'lcd-16x2',
    name: 'LCD 16×2 (I2C)',
    category: 'displays',
    description: '16 column × 2 row character LCD with I2C backpack module',
    tags: ['lcd', 'display', 'i2c', '16x2', 'character'],
    color: '#004d40',
    accentColor: '#00897b',
    symbol: 'LCD',
    width: 100,
    height: 50,
    pins: { signal: ['SDA','SCL'], power: ['VCC','GND'] },
    specs: { cols: 16, rows: 2, interface: 'I2C (PCF8574)', address: '0x27' }
  },
  {
    id: 'oled-128x64',
    name: 'OLED 0.96" 128×64',
    category: 'displays',
    description: 'SSD1306 OLED display, 128×64 pixels, I2C interface',
    tags: ['oled', 'ssd1306', 'display', 'i2c', '128x64', 'screen'],
    color: '#212121',
    accentColor: '#616161',
    symbol: 'OLED',
    width: 65,
    height: 55,
    pins: { signal: ['SDA','SCL'], power: ['VCC','GND'] },
    specs: { resolution: '128×64', interface: 'I2C', voltage: '3.3-5V' }
  },
  {
    id: 'seven-seg',
    name: '7-Segment Display',
    category: 'displays',
    description: 'Common cathode 7-segment single digit LED display',
    tags: ['7segment', 'display', 'led', 'digit', 'seven segment'],
    color: '#b71c1c',
    accentColor: '#ff1744',
    symbol: '7SEG',
    width: 55,
    height: 75,
    pins: { signal: ['A','B','C','D','E','F','G','DP'], power: ['CC','GND'] },
    specs: { type: 'Common Cathode', segments: 7, color: 'Red' }
  },
  {
    id: 'tft-lcd',
    name: 'TFT LCD 2.4"',
    category: 'displays',
    description: 'ILI9341 TFT color display 320×240, SPI interface with touch',
    tags: ['tft', 'lcd', 'ili9341', 'color', 'spi', 'touch', 'display'],
    color: '#1a237e',
    accentColor: '#3949ab',
    symbol: 'TFT',
    width: 85,
    height: 110,
    pins: { signal: ['MOSI','MISO','SCK','CS','DC','RST'], power: ['VCC','GND'] },
    specs: { resolution: '320×240', interface: 'SPI', colors: '65K' }
  },
  {
    id: 'tm1637-display',
    name: 'TM1637 4-Digit Display',
    category: 'displays',
    description: '4-digit 0.36" 7-segment LED clock module with middle colon, 2-wire serial interface',
    tags: ['tm1637', '7segment', 'display', 'clock', '4digit', 'timer', 'led'],
    color: '#991b1b',
    accentColor: '#ef4444',
    symbol: 'TM1637',
    width: 80,
    height: 45,
    pins: { signal: ['CLK','DIO'], power: ['VCC','GND'] },
    specs: { digits: 4, interface: '2-Wire Serial', color: 'Red LED', colon: true }
  },
  {
    id: 'max7219-matrix',
    name: 'MAX7219 8×8 Matrix',
    category: 'displays',
    description: 'Red 64-LED dot matrix display with MAX7219 serially interfaced driver IC, SPI cascadable',
    tags: ['max7219', 'matrix', 'led matrix', '8x8', 'spi', 'dot matrix'],
    color: '#831843',
    accentColor: '#ec4899',
    symbol: 'MATRIX',
    width: 65,
    height: 65,
    pins: { signal: ['DIN','CS','CLK','DOUT'], power: ['VCC','GND'] },
    specs: { matrix: '8×8 (64 LEDs)', interface: 'SPI 10MHz', cascadable: true }
  },

  // Passive Components
  {
    id: 'resistor',
    name: 'Resistor',
    category: 'passive',
    packageType: 'Axial 1/4W',
    pinCount: 2,
    description: 'Fixed value axial resistor, color-coded through-hole',
    tags: ['resistor', 'passive', 'ohm', 'current limiting', 'axial'],
    color: '#8d6e63',
    accentColor: '#a1887f',
    symbol: 'R',
    width: 60,
    height: 25,
    pins: { signal: ['A','B'] },
    properties: { resistance: 1000, tolerance: 5, power: 0.25 }
  },
  {
    id: 'led',
    name: 'LED (5mm)',
    category: 'passive',
    packageType: 'Radial 5mm',
    pinCount: 2,
    description: 'Light emitting diode with flanged epoxy dome, polarity marked',
    tags: ['led', 'light', 'diode', 'indicator', 'output'],
    color: '#f57f17',
    accentColor: '#ffca28',
    symbol: 'LED',
    width: 35,
    height: 45,
    pins: { signal: ['A','K'] },
    properties: { color: 'red', voltage: 2.0, current: 20 }
  },
  {
    id: 'capacitor',
    name: 'Electrolytic Cap',
    category: 'passive',
    packageType: 'Radial Can',
    pinCount: 2,
    description: 'Polarized aluminum electrolytic capacitor for filtering and bulk storage',
    tags: ['capacitor', 'electrolytic', 'filter', 'passive', 'farad', 'polarized'],
    color: '#455a64',
    accentColor: '#78909c',
    symbol: 'C',
    width: 35,
    height: 50,
    pins: { signal: ['+','-'] },
    properties: { capacitance: 100, voltage: 25, type: 'electrolytic' }
  },
  {
    id: 'ceramic-capacitor',
    name: 'Ceramic Capacitor',
    category: 'passive',
    packageType: 'Disc Ceramic',
    pinCount: 2,
    description: 'Non-polarized ceramic disc capacitor (100nF / 0.1µF) for high-frequency decoupling',
    tags: ['capacitor', 'ceramic', 'decoupling', '100nf', '0.1uf', 'disc', 'filter'],
    color: '#d97706',
    accentColor: '#f59e0b',
    symbol: 'CC',
    width: 35,
    height: 45,
    pins: { signal: ['1','2'] },
    properties: { capacitance: 100, unit: 'nF', code: '104', voltage: 50, type: 'ceramic' }
  },
  {
    id: 'diode-1n4007',
    name: '1N4007 Diode',
    category: 'passive',
    packageType: 'DO-41 Axial',
    pinCount: 2,
    description: '1A 1000V general purpose silicon rectifier diode with cathode stripe',
    tags: ['diode', '1n4007', 'rectifier', 'flyback', 'protection', 'semiconductor'],
    color: '#1e293b',
    accentColor: '#94a3b8',
    symbol: 'D',
    width: 55,
    height: 25,
    pins: { signal: ['A','K'] },
    properties: { current: '1A', maxVoltage: '1000V', vf: '0.7V' }
  },
  {
    id: 'transistor-2n2222',
    name: '2N2222 NPN Transistor',
    category: 'passive',
    packageType: 'TO-92',
    pinCount: 3,
    description: 'General purpose NPN bipolar junction transistor for switching and amplification',
    tags: ['transistor', 'npn', '2n2222', 'to92', 'bjt', 'switch', 'amplifier'],
    color: '#334155',
    accentColor: '#64748b',
    symbol: 'Q',
    width: 45,
    height: 45,
    pins: { signal: ['E','B','C'] },
    properties: { type: 'NPN', vce: '40V', ic: '800mA', hfe: '100-300' }
  },
  {
    id: 'push-button',
    name: 'Push Button',
    category: 'passive',
    packageType: 'Tactile 6x6mm',
    pinCount: 4,
    description: 'Momentary tactile push button switch, 6mm square with 4 leads',
    tags: ['button', 'switch', 'push', 'momentary', 'tactile'],
    color: '#546e7a',
    accentColor: '#78909c',
    symbol: 'BTN',
    width: 35,
    height: 35,
    pins: { signal: ['1','2','3','4'] },
    properties: { type: 'momentary', rating: '50mA 12V' }
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    category: 'passive',
    packageType: 'Rotary 9mm',
    pinCount: 3,
    description: 'Variable rotary resistor with wiper output for analog control',
    tags: ['potentiometer', 'variable resistor', 'pot', 'analog', 'knob'],
    color: '#4e342e',
    accentColor: '#6d4c41',
    symbol: 'POT',
    width: 50,
    height: 50,
    pins: { signal: ['A','W','B'] },
    properties: { resistance: 10000, type: 'linear' }
  },
  {
    id: 'rgb-led',
    name: 'RGB LED (5mm)',
    category: 'passive',
    packageType: 'Radial 5mm 4-Pin',
    pinCount: 4,
    description: 'Diffused 5mm 4-pin RGB LED with common cathode for full-spectrum color mixing',
    tags: ['rgb', 'led', 'multicolor', 'common cathode', 'tri-color', 'light'],
    color: '#7c3aed',
    accentColor: '#a78bfa',
    symbol: 'RGB',
    width: 45,
    height: 50,
    pins: { signal: ['R','G','B'], power: ['GND'] },
    properties: { type: 'Common Cathode', vf_red: 2.0, vf_green: 3.2, vf_blue: 3.2 }
  },
  {
    id: 'mosfet-irf520',
    name: 'IRF520 N-MOSFET',
    category: 'passive',
    packageType: 'TO-220',
    pinCount: 3,
    description: 'N-Channel 100V 9.2A power MOSFET for high-current DC loads and motor PWM',
    tags: ['mosfet', 'irf520', 'transistor', 'to220', 'n-channel', 'high current', 'switch'],
    color: '#1e293b',
    accentColor: '#64748b',
    symbol: 'FET',
    width: 45,
    height: 55,
    pins: { signal: ['G','D','S'] },
    properties: { vds: '100V', id: '9.2A', rdsOn: '0.27Ω' }
  },
  {
    id: 'slide-switch',
    name: 'Slide Switch (SPDT)',
    category: 'passive',
    packageType: 'Through-Hole',
    pinCount: 3,
    description: 'Miniature single-pole double-throw slide switch for power on/off and signal routing',
    tags: ['switch', 'slide', 'spdt', 'power switch', 'toggle'],
    color: '#475569',
    accentColor: '#64748b',
    symbol: 'SW',
    width: 45,
    height: 35,
    pins: { signal: ['1','COM','2'] },
    properties: { rating: '0.3A 50V DC', positions: 2 }
  },
  {
    id: 'inductor-axial',
    name: 'Axial Inductor',
    category: 'passive',
    packageType: 'Axial Choke',
    pinCount: 2,
    description: 'Color-coded axial lead power choke inductor for LC filtering and EMI suppression',
    tags: ['inductor', 'choke', 'coil', '100uh', 'filter', 'passive'],
    color: '#065f46',
    accentColor: '#10b981',
    symbol: 'L',
    width: 60,
    height: 25,
    pins: { signal: ['1','2'] },
    properties: { inductance: 100, unit: 'µH', current: '500mA' }
  },

  // Communication
  {
    id: 'hc-05',
    name: 'HC-05 Bluetooth',
    category: 'communication',
    description: 'Serial Bluetooth module, UART interface, master/slave',
    tags: ['bluetooth', 'hc05', 'wireless', 'serial', 'uart'],
    color: '#0d47a1',
    accentColor: '#1565c0',
    symbol: 'BT',
    width: 60,
    height: 45,
    pins: { signal: ['TX','RX','STATE','KEY'], power: ['VCC','GND'] },
    specs: { range: '10m', baud: '9600', version: 'BT 2.0' }
  },
  {
    id: 'nrf24l01',
    name: 'NRF24L01+',
    category: 'communication',
    description: '2.4GHz wireless transceiver module, SPI interface, 100m range',
    tags: ['nrf24l01', '2.4ghz', 'wireless', 'rf', 'transceiver', 'spi'],
    color: '#1a237e',
    accentColor: '#283593',
    symbol: 'NRF',
    width: 55,
    height: 45,
    pins: { signal: ['MOSI','MISO','SCK','CSN','CE','IRQ'], power: ['VCC','GND'] },
    specs: { frequency: '2.4GHz', range: '100m', dataRate: '2Mbps' }
  },
  {
    id: 'sim800l',
    name: 'SIM800L GSM',
    category: 'communication',
    description: 'GSM/GPRS module for SMS, calls, and mobile data (2G)',
    tags: ['sim800l', 'gsm', 'gprs', 'sms', '2g', 'cellular'],
    color: '#1b5e20',
    accentColor: '#388e3c',
    symbol: 'GSM',
    width: 55,
    height: 65,
    pins: { signal: ['TX','RX','RST'], power: ['VCC','GND'] },
    specs: { bands: 'GSM 850/900/1800/1900', voltage: '3.7-4.2V' }
  },
  {
    id: 'lora-sx1278',
    name: 'LoRa SX1278 Ra-02',
    category: 'communication',
    description: 'Long-range spread-spectrum RF transceiver module, SPI interface, 433MHz, up to 10km line-of-sight',
    tags: ['lora', 'sx1278', 'ra02', '433mhz', 'long range', 'wireless', 'spi', 'semtech'],
    color: '#064e3b',
    accentColor: '#10b981',
    symbol: 'LORA',
    width: 65,
    height: 60,
    pins: { signal: ['MOSI','MISO','SCK','NSS','RST','DIO0','DIO1'], power: ['3.3V','GND'] },
    specs: { frequency: '433MHz', sensitivity: '-148dBm', maxPower: '+20dBm', interface: 'SPI' }
  },
  {
    id: 'esp-01',
    name: 'ESP-01 WiFi Module',
    category: 'communication',
    description: 'Ultra-compact 8-pin ESP8266 serial WiFi module with integrated PCB antenna',
    tags: ['esp01', 'esp8266', 'wifi', 'serial', 'uart', 'compact'],
    color: '#0369a1',
    accentColor: '#38bdf8',
    symbol: 'ESP01',
    width: 55,
    height: 50,
    pins: { signal: ['TX','RX','GPIO0','GPIO2','CH_PD','RST'], power: ['3.3V','GND'] },
    specs: { voltage: '3.3V', protocol: '802.11 b/g/n', interface: 'UART' }
  },

  // Power
  {
    id: 'voltage-regulator',
    name: 'LM7805 Regulator',
    category: 'power',
    description: '5V linear voltage regulator, 1A output current',
    tags: ['lm7805', 'voltage regulator', 'power', '5v', 'linear'],
    color: '#37474f',
    accentColor: '#546e7a',
    symbol: 'LM7805',
    width: 45,
    height: 50,
    pins: { signal: ['IN','GND','OUT'] },
    specs: { output: '5V', current: '1A', input: '7-35V' }
  },
  {
    id: 'lipo-battery',
    name: 'LiPo Battery 3.7V',
    category: 'power',
    description: '3.7V lithium polymer rechargeable battery cell',
    tags: ['lipo', 'battery', '3.7v', 'rechargeable', 'lithium'],
    color: '#f57f17',
    accentColor: '#ffa000',
    symbol: 'BATT',
    width: 70,
    height: 45,
    pins: { signal: ['+','-'] },
    properties: { voltage: 3.7, type: 'LiPo' }
  },
  {
    id: 'power-supply',
    name: 'Power Supply',
    category: 'power',
    description: 'Adjustable DC power supply rail for circuit power',
    tags: ['power supply', 'vcc', 'dc', 'supply', 'rail'],
    color: '#880e4f',
    accentColor: '#c2185b',
    symbol: 'PWR',
    width: 55,
    height: 55,
    pins: { signal: ['VCC','GND'] },
    properties: { voltage: 5, adjustable: true }
  },
  {
    id: 'tp4056-charger',
    name: 'TP4056 Li-Ion Charger',
    category: 'power',
    description: '1A Lithium battery charging module with USB-C input and DW01A battery protection IC',
    tags: ['tp4056', 'charger', 'lipo', '18650', 'usb-c', 'battery charging', 'protection'],
    color: '#0284c7',
    accentColor: '#38bdf8',
    symbol: 'TP4056',
    width: 65,
    height: 50,
    pins: { power: ['IN+','IN-','BAT+','BAT-','OUT+','OUT-'] },
    specs: { chargeCurrent: '1A', chargeVoltage: '4.2V', input: '4.5-5.5V USB-C' }
  },
  {
    id: 'buck-converter-lm2596',
    name: 'LM2596 Buck Converter',
    category: 'power',
    description: 'Step-down DC-DC switching regulator with multi-turn potentiometer, 3A peak output',
    tags: ['buck', 'step-down', 'lm2596', 'converter', 'regulator', 'power', 'dcdc'],
    color: '#1e3a8a',
    accentColor: '#3b82f6',
    symbol: 'BUCK',
    width: 75,
    height: 50,
    pins: { power: ['IN+','IN-','OUT+','OUT-'] },
    specs: { inVoltage: '4.5-40V', outVoltage: '1.25-35V Adj', current: '3A max', efficiency: '92%' }
  },
  {
    id: 'coin-cell-cr2032',
    name: 'CR2032 Coin Cell',
    category: 'power',
    packageType: 'Coin Cell Holder',
    pinCount: 2,
    description: '3V Lithium manganese dioxide coin battery with PCB spring clip holder for RTC & low-power backups',
    tags: ['cr2032', 'coin cell', 'battery', '3v', 'rtc', 'backup'],
    color: '#475569',
    accentColor: '#94a3b8',
    symbol: 'CR2032',
    width: 45,
    height: 45,
    pins: { signal: ['+','-'] },
    properties: { voltage: 3.0, capacity: '225mAh', chemistry: 'Li-MnO2' }
  },

  // Logic ICs
  {
    id: 'l298n',
    name: 'L298N Motor Driver',
    category: 'logic',
    packageType: 'Multiwatt15',
    pinCount: 15,
    description: 'Dual H-bridge high-power motor driver IC with heatsink, 2A per channel',
    tags: ['l298n', 'motor driver', 'h-bridge', 'pwm', 'dual', 'stepper'],
    color: '#263238',
    accentColor: '#37474f',
    symbol: 'L298N',
    width: 70,
    height: 75,
    pins: { signal: ['ENA','IN1','IN2','IN3','IN4','ENB'], power: ['VCC','5V','GND'], output: ['OUT1','OUT2','OUT3','OUT4'] },
    specs: { channels: 2, current: '2A', voltage: '5-35V' }
  },
  {
    id: 'ne555',
    name: 'NE555 Timer IC',
    category: 'logic',
    packageType: 'DIP-8',
    pinCount: 8,
    description: 'Precision timer / oscillator IC for pulse generation, delays, and PWM',
    tags: ['555', 'timer', 'pwm', 'oscillator', 'classic', 'ne555', 'dip8', 'ic'],
    color: '#1e293b',
    accentColor: '#4f46e5',
    symbol: '555',
    width: 60,
    height: 65,
    pins: { signal: ['TRIG','OUT','RST','CV','THR','DIS'], power: ['VCC','GND'] },
    specs: { modes: 'Astable/Monostable', frequency: '100kHz max', package: 'DIP-8' }
  },
  {
    id: 'ic-74hc595',
    name: '74HC595 Shift Register',
    category: 'logic',
    packageType: 'DIP-16',
    pinCount: 16,
    description: '8-bit serial-in, parallel-out shift register with 3-state output latches',
    tags: ['74hc595', 'shift register', 'io expander', 'serial', 'parallel', 'dip16', 'logic'],
    color: '#1e1b4b',
    accentColor: '#6366f1',
    symbol: '595',
    width: 65,
    height: 85,
    pins: {
      signal: ['DS','SHCP','STCP','OE','MR','Q7S'],
      output: ['Q0','Q1','Q2','Q3','Q4','Q5','Q6','Q7'],
      power: ['VCC','GND']
    },
    specs: { type: '8-bit SIPO', speed: '100MHz', voltage: '2-6V', package: 'DIP-16' }
  },
  {
    id: 'ic-lm358',
    name: 'LM358 Dual Op-Amp',
    category: 'logic',
    packageType: 'DIP-8',
    pinCount: 8,
    description: 'Dual low-power operational amplifier IC for analog signal processing',
    tags: ['lm358', 'op-amp', 'amplifier', 'comparator', 'analog', 'dip8'],
    color: '#0f172a',
    accentColor: '#38bdf8',
    symbol: 'LM358',
    width: 60,
    height: 65,
    pins: {
      signal: ['OUT1','IN1-','IN1+','IN2+','IN2-','OUT2'],
      power: ['VCC','GND']
    },
    specs: { channels: 2, gainBandwidth: '1MHz', package: 'DIP-8' }
  },
  {
    id: 'ic-74hc04',
    name: '74HC04 Hex Inverter',
    category: 'logic',
    packageType: 'DIP-14',
    pinCount: 14,
    description: 'Hex inverter gate IC containing 6 independent NOT logic gates',
    tags: ['74hc04', 'inverter', 'not gate', 'logic gate', 'cmos', 'dip14'],
    color: '#0f172a',
    accentColor: '#a855f7',
    symbol: 'NOTx6',
    width: 65,
    height: 80,
    pins: {
      signal: ['1A','1Y','2A','2Y','3A','3Y','4A','4Y','5A','5Y','6A','6Y'],
      power: ['VCC','GND']
    },
    specs: { gates: 6, logic: 'NOT Inverter', package: 'DIP-14' }
  },
  {
    id: 'mcp3008',
    name: 'MCP3008 ADC',
    category: 'logic',
    packageType: 'DIP-16',
    pinCount: 16,
    description: '8-channel 10-bit SPI ADC for analog input expansion',
    tags: ['mcp3008', 'adc', 'analog', 'spi', '10-bit', 'converter'],
    color: '#006064',
    accentColor: '#00838f',
    symbol: 'ADC',
    width: 65,
    height: 80,
    pins: { signal: ['CH0','CH1','CH2','CH3','CH4','CH5','CH6','CH7','CS','DIN','DOUT','CLK'], power: ['VCC','VREF','AGND','DGND'] },
    specs: { channels: 8, resolution: '10-bit', interface: 'SPI' }
  },
  {
    id: 'logic-level-shifter',
    name: '4-Ch Level Shifter',
    category: 'logic',
    description: 'Bi-directional 4-channel voltage translator module (3.3V <-> 5.0V) with MOSFETs for I2C/SPI',
    tags: ['level shifter', 'logic', 'voltage divider', '3.3v', '5v', 'bidirectional', 'i2c'],
    color: '#065f46',
    accentColor: '#10b981',
    symbol: 'LVL4',
    width: 55,
    height: 50,
    pins: {
      signal: ['LV1','LV2','LV3','LV4','HV1','HV2','HV3','HV4'],
      power: ['LV','GND_L','HV','GND_H']
    },
    specs: { channels: 4, lowVoltage: '1.8-3.3V', highVoltage: '2.8-5.5V', speed: 'Up to 2MHz' }
  },
  {
    id: 'pc817-optocoupler',
    name: 'PC817 Optocoupler',
    category: 'logic',
    packageType: 'DIP-4',
    pinCount: 4,
    description: 'Galvanic optical isolator IC with infrared emitter diode and NPN phototransistor',
    tags: ['pc817', 'optocoupler', 'isolator', 'optical', 'dip4', 'isolation', 'protection'],
    color: '#1e293b',
    accentColor: '#475569',
    symbol: 'PC817',
    width: 50,
    height: 50,
    pins: { signal: ['ANODE','CATHODE','COLLECTOR','EMITTER'] },
    specs: { isolation: '5000Vrms', package: 'DIP-4', ctr: '50-600%' }
  },
  {
    id: 'pcf8574-io-expander',
    name: 'PCF8574 I2C Expander',
    category: 'logic',
    packageType: 'DIP-16',
    pinCount: 16,
    description: '8-bit remote I/O port expander for I2C-bus with open-drain interrupt output',
    tags: ['pcf8574', 'i2c', 'io expander', 'gpio', 'dip16', 'philips'],
    color: '#1e1b4b',
    accentColor: '#818cf8',
    symbol: 'PCF8574',
    width: 65,
    height: 85,
    pins: {
      signal: ['A0','A1','A2','SDA','SCL','INT'],
      output: ['P0','P1','P2','P3','P4','P5','P6','P7'],
      power: ['VDD','VSS']
    },
    specs: { bus: 'I2C Standard 100kHz', address: '0x20-0x27', package: 'DIP-16' }
  },
  {
    id: 'uln2003a-darlington',
    name: 'ULN2003A Darlington',
    category: 'logic',
    packageType: 'DIP-16',
    pinCount: 16,
    description: 'High-voltage high-current 7-channel Darlington transistor array with common clamp diodes',
    tags: ['uln2003', 'darlington', 'transistor array', 'stepper driver', 'dip16', 'inductive'],
    color: '#0f172a',
    accentColor: '#38bdf8',
    symbol: 'ULN2003',
    width: 65,
    height: 85,
    pins: {
      signal: ['1B','2B','3B','4B','5B','6B','7B'],
      output: ['1C','2C','3C','4C','5C','6C','7C'],
      power: ['COM','GND']
    },
    specs: { channels: 7, current: '500mA/ch', voltage: '50V', package: 'DIP-16' }
  }
];

// Curated list of common parts for the Quick-Access Side Shelf
export const COMMON_PARTS = [
  { id: 'resistor', label: 'Resistor', symbol: 'R', desc: '1kΩ Axial' },
  { id: 'capacitor', label: 'Electrolytic', symbol: 'C', desc: '100µF Radial' },
  { id: 'ceramic-capacitor', label: 'Ceramic Cap', symbol: 'CC', desc: '100nF (0.1µF)' },
  { id: 'led', label: '5mm LED', symbol: 'LED', desc: 'Red Dome' },
  { id: 'rgb-led', label: 'RGB LED', symbol: 'RGB', desc: '5mm 4-Pin' },
  { id: 'diode-1n4007', label: '1N4007 Diode', symbol: 'D', desc: '1A Rectifier' },
  { id: 'transistor-2n2222', label: '2N2222 NPN', symbol: 'Q', desc: 'TO-92 BJT' },
  { id: 'mosfet-irf520', label: 'Power MOSFET', symbol: 'FET', desc: 'IRF520 9.2A' },
  { id: 'ne555', label: 'NE555 Timer', symbol: '555', desc: 'DIP-8 Timer' },
  { id: 'ic-74hc595', label: '74HC595 Shift', symbol: '595', desc: 'DIP-16 SIPO' },
  { id: 'push-button', label: 'Push Button', symbol: 'BTN', desc: 'Tactile 6mm' },
  { id: 'potentiometer', label: 'Potentiometer', symbol: 'POT', desc: '10kΩ Rotary' },
  { id: 'bme280', label: 'BME280 Sensor', symbol: 'BME', desc: 'Temp/Press/Hum' },
  { id: 'tp4056-charger', label: 'USB Charger', symbol: 'TP4056', desc: '1A Li-Ion USB-C' },
];

// Presets for the Quick Value Selector floating popover
export const VALUE_PRESETS = {
  resistor: [
    { label: '220 Ω', value: 220, unit: 'Ω' },
    { label: '330 Ω', value: 330, unit: 'Ω' },
    { label: '1 kΩ', value: 1000, unit: 'Ω' },
    { label: '4.7 kΩ', value: 4700, unit: 'Ω' },
    { label: '10 kΩ', value: 10000, unit: 'Ω' },
    { label: '100 kΩ', value: 100000, unit: 'Ω' },
  ],
  capacitor: [
    { label: '1 µF', value: 1, unit: 'µF' },
    { label: '10 µF', value: 10, unit: 'µF' },
    { label: '47 µF', value: 47, unit: 'µF' },
    { label: '100 µF', value: 100, unit: 'µF' },
    { label: '470 µF', value: 470, unit: 'µF' },
    { label: '1000 µF', value: 1000, unit: 'µF' },
  ],
  'ceramic-capacitor': [
    { label: '22 pF', value: 22, unit: 'pF' },
    { label: '100 pF', value: 100, unit: 'pF' },
    { label: '1 nF', value: 1, unit: 'nF' },
    { label: '10 nF', value: 10, unit: 'nF' },
    { label: '100 nF', value: 100, unit: 'nF' },
  ],
  led: [
    { label: 'Red', color: '#ef4444', voltage: 2.0 },
    { label: 'Green', color: '#22c55e', voltage: 2.2 },
    { label: 'Blue', color: '#3b82f6', voltage: 3.2 },
    { label: 'Yellow', color: '#eab308', voltage: 2.1 },
    { label: 'White', color: '#f8fafc', voltage: 3.3 },
  ],
  'rgb-led': [
    { label: 'Diffused RGB', type: 'Common Cathode' },
    { label: 'Clear RGB', type: 'Common Anode' },
    { label: 'Cyan Pre-mix', color: '#06b6d4' },
    { label: 'Purple Pre-mix', color: '#a855f7' },
    { label: 'Amber Pre-mix', color: '#f59e0b' },
  ],
  'diode-1n4007': [
    { label: '1N4007 (1000V)', model: '1N4007' },
    { label: '1N4148 (Fast)', model: '1N4148' },
    { label: 'Zener 3.3V', model: '3V3 Zener' },
    { label: 'Zener 5.1V', model: '5V1 Zener' },
  ],
  'transistor-2n2222': [
    { label: '2N2222 (NPN)', type: 'NPN' },
    { label: '2N2907 (PNP)', type: 'PNP' },
    { label: '2N3904 (NPN)', type: 'NPN' },
  ],
  'mosfet-irf520': [
    { label: 'IRF520 (100V 9.2A)', model: 'IRF520' },
    { label: 'IRLZ44N (55V 47A Logic)', model: 'IRLZ44N' },
    { label: 'IRF3205 (55V 110A High-Pwr)', model: 'IRF3205' },
    { label: '2N7000 (Small Signal)', model: '2N7000' },
  ],
  'inductor-axial': [
    { label: '10 µH', value: 10, unit: 'µH' },
    { label: '47 µH', value: 47, unit: 'µH' },
    { label: '100 µH', value: 100, unit: 'µH' },
    { label: '1 mH', value: 1000, unit: 'µH' },
    { label: '10 mH', value: 10000, unit: 'µH' },
  ],
  potentiometer: [
    { label: '1 kΩ', value: 1000, unit: 'Ω' },
    { label: '5 kΩ', value: 5000, unit: 'Ω' },
    { label: '10 kΩ', value: 10000, unit: 'Ω' },
    { label: '50 kΩ', value: 50000, unit: 'Ω' },
    { label: '100 kΩ', value: 100000, unit: 'Ω' },
  ],
};

// Resistor standard 4-band EIA color calculation
const DIGIT_COLORS = [
  '#18181b', // 0 Black
  '#78350f', // 1 Brown
  '#dc2626', // 2 Red
  '#ea580c', // 3 Orange
  '#eab308', // 4 Yellow
  '#16a34a', // 5 Green
  '#2563eb', // 6 Blue
  '#7c3aed', // 7 Violet
  '#64748b', // 8 Gray
  '#f8fafc', // 9 White
];

export function calculateResistorBands(ohms = 1000) {
  const str = Math.round(ohms).toString();
  if (str.length < 2) {
    return ['#78350f', '#18181b', '#18181b', '#f59e0b'];
  }
  const digit1 = parseInt(str[0], 10);
  const digit2 = parseInt(str[1], 10);
  const multiplier = str.length - 2;

  const band1 = DIGIT_COLORS[digit1] || '#78350f';
  const band2 = DIGIT_COLORS[digit2] || '#18181b';
  const band3 = DIGIT_COLORS[multiplier] || '#dc2626';
  const band4 = '#f59e0b'; // Gold ±5% tolerance

  return [band1, band2, band3, band4];
}

export const getComponentsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') return COMPONENTS;
  return COMPONENTS.filter(c => c.category === categoryId);
};

export const searchComponents = (query) => {
  if (!query) return COMPONENTS;
  const q = query.toLowerCase();
  return COMPONENTS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.packageType && c.packageType.toLowerCase().includes(q)) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some(t => t.includes(q)) ||
    c.symbol.toLowerCase().includes(q)
  );
};
