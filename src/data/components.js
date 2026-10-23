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

  // Passive Components
  {
    id: 'resistor',
    name: 'Resistor',
    category: 'passive',
    description: 'Fixed value resistor, standard axial through-hole',
    tags: ['resistor', 'passive', 'ohm', 'current limiting'],
    color: '#8d6e63',
    accentColor: '#a1887f',
    symbol: 'R',
    width: 50,
    height: 20,
    pins: { signal: ['A','B'] },
    properties: { resistance: 1000, tolerance: 5, power: 0.25 }
  },
  {
    id: 'led',
    name: 'LED',
    category: 'passive',
    description: 'Light emitting diode, available in multiple colors',
    tags: ['led', 'light', 'diode', 'indicator', 'output'],
    color: '#f57f17',
    accentColor: '#ffca28',
    symbol: 'LED',
    width: 30,
    height: 40,
    pins: { signal: ['A','K'] },
    properties: { color: 'red', voltage: 2.0, current: 20 }
  },
  {
    id: 'capacitor',
    name: 'Capacitor',
    category: 'passive',
    description: 'Electrolytic capacitor for filtering and energy storage',
    tags: ['capacitor', 'electrolytic', 'filter', 'passive', 'farad'],
    color: '#455a64',
    accentColor: '#78909c',
    symbol: 'C',
    width: 30,
    height: 45,
    pins: { signal: ['+','-'] },
    properties: { capacitance: 100, voltage: 25, type: 'electrolytic' }
  },
  {
    id: 'push-button',
    name: 'Push Button',
    category: 'passive',
    description: 'Momentary tactile push button switch, 6mm',
    tags: ['button', 'switch', 'push', 'momentary', 'tactile'],
    color: '#546e7a',
    accentColor: '#78909c',
    symbol: 'BTN',
    width: 30,
    height: 30,
    pins: { signal: ['1','2','3','4'] },
    properties: { type: 'momentary', rating: '50mA 12V' }
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    category: 'passive',
    description: 'Variable resistor with wiper output for analog control',
    tags: ['potentiometer', 'variable resistor', 'pot', 'analog', 'knob'],
    color: '#4e342e',
    accentColor: '#6d4c41',
    symbol: 'POT',
    width: 45,
    height: 45,
    pins: { signal: ['A','W','B'] },
    properties: { resistance: 10000, type: 'linear' }
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

  // Logic ICs
  {
    id: 'l298n',
    name: 'L298N Motor Driver',
    category: 'logic',
    description: 'Dual H-bridge motor driver IC, 2A per channel',
    tags: ['l298n', 'motor driver', 'h-bridge', 'pwm', 'dual'],
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
    name: 'NE555 Timer',
    category: 'logic',
    description: 'Classic 555 timer IC for oscillators, PWM, delays',
    tags: ['555', 'timer', 'pwm', 'oscillator', 'classic', 'ne555'],
    color: '#212121',
    accentColor: '#424242',
    symbol: '555',
    width: 60,
    height: 65,
    pins: { signal: ['TRIG','OUT','RST','CV','THR','DIS'], power: ['VCC','GND'] },
    specs: { modes: 'Astable/Monostable', frequency: '100kHz max' }
  },
  {
    id: 'mcp3008',
    name: 'MCP3008 ADC',
    category: 'logic',
    description: '8-channel 10-bit SPI ADC for analog input expansion',
    tags: ['mcp3008', 'adc', 'analog', 'spi', '10-bit', 'converter'],
    color: '#006064',
    accentColor: '#00838f',
    symbol: 'ADC',
    width: 65,
    height: 80,
    pins: { signal: ['CH0','CH1','CH2','CH3','CH4','CH5','CH6','CH7','CS','DIN','DOUT','CLK'], power: ['VCC','VREF','AGND','DGND'] },
    specs: { channels: 8, resolution: '10-bit', interface: 'SPI' }
  }
];

export const getComponentsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') return COMPONENTS;
  return COMPONENTS.filter(c => c.category === categoryId);
};

export const searchComponents = (query) => {
  if (!query) return COMPONENTS;
  const q = query.toLowerCase();
  return COMPONENTS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some(t => t.includes(q)) ||
    c.symbol.toLowerCase().includes(q)
  );
};
