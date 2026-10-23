import { create } from 'zustand';
import { autoWireCircuit, generateFirmwareCode, PRESET_PROJECTS, buildProjectFromList, getCompBaseType } from '../utils/circuitEngine';
import { simulationRunner } from '../utils/simulationRunner';
import { COMPONENTS } from '../data/components';

let idCounter = 1;
const newId = (prefix = 'comp') => `${prefix}_${Date.now()}_${idCounter++}`;

export const useCircuitStore = create((set, get) => ({
  // Canvas state
  components: [],
  wires: [],
  selectedIds: [],
  canvasOffset: { x: 0, y: 0 },
  zoom: 1,
  gridSize: 24,
  showGrid: true,
  mode: 'select', // select | wire | pan | delete
  autoSync: true, // When true, dragging/adding components automatically auto-wires and updates code

  // Simulation state
  isSimulating: false,
  simulationSpeed: 1,
  pinStates: {}, // { 'compId:pinName': { high: bool, voltage: number } }
  mcuOutputs: {}, // { buzzerActive, servoAngle, [comp.id]: { active, brightness, line1, line2 } }
  soundEnabled: false,

  // Interactive sensor inputs for live simulation
  sensorValues: {
    ultrasonicDist: 18, // cm
    potVal: 512,        // 0-1023
    btnPressed: false,
    temp: 24.5,         // deg C
    humidity: 55,       // %
    pirMotion: false,
    lightLevel: 65,     // %
    soilMoisture: 45,   // %
  },

  // Serial port state
  serialPort: null,
  serialConnected: false,
  serialBaudRate: 9600,
  serialData: [], // array of { type: 'rx'|'tx'|'info'|'error', text, ts }

  // Project state
  projectName: 'Untitled Project',
  projectId: null,
  projectStatus: 'Draft', // 'Draft' | 'Simulating' | 'Completed'
  isDirty: false,
  lastSaved: null,
  setProjectStatus: (status) => set({ projectStatus: status, isDirty: true }),

  // Firmware / Compilation state
  firmwareCode: `// VoltCraft - Hardware & Firmware Platform
// Drag components onto the canvas or use "Quick Build" to auto-wire and code!
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("VoltCraft ready!");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}`,
  compileStatus: 'idle', // idle | compiling | success | error
  compileOutput: '',
  compileErrors: [],

  // Setting sensor inputs interactively
  setSensorValue: (key, val) => {
    set(s => ({
      sensorValues: { ...s.sensorValues, [key]: val },
    }));
  },

  toggleSound: () => {
    set(s => ({ soundEnabled: !s.soundEnabled }));
  },

  setAutoSync: (autoSync) => set({ autoSync }),

  // Intelligent Auto-Wiring and Code Generator
  autoWireAndGenerate: () => {
    const { components } = get();
    if (components.length === 0) return;

    // Check if MCU is present. If only peripherals, auto-add Arduino Uno
    let currentComponents = [...components];
    const hasMCU = currentComponents.some(c =>
      ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(getCompBaseType(c))
    );

    if (!hasMCU) {
      const unoDef = COMPONENTS.find(c => c.id === 'arduino-uno');
      if (unoDef) {
        const id = newId();
        const unoInstance = {
          id,
          defId: unoDef.id,
          name: unoDef.name,
          symbol: unoDef.symbol,
          color: unoDef.color,
          accentColor: unoDef.accentColor,
          category: unoDef.category,
          pins: unoDef.pins,
          specs: unoDef.specs || {},
          properties: unoDef.properties || {},
          x: 240,
          y: 140,
          width: unoDef.width,
          height: unoDef.height,
          rotation: 0,
          label: 'UNO1',
        };
        currentComponents.unshift(unoInstance);
      }
    }

    const { wires } = autoWireCircuit(currentComponents);
    const code = generateFirmwareCode(currentComponents, wires);

    set({
      components: currentComponents,
      wires,
      firmwareCode: code,
      isDirty: true,
    });

    get().appendSerialData({
      type: 'info',
      text: `✓ Auto-wired ${wires.length} pins & generated firmware sketch.`,
      ts: Date.now(),
    });
  },

  // Load one of the 8 rich preset projects
  loadPresetProject: (presetId) => {
    const preset = PRESET_PROJECTS.find(p => p.id === presetId);
    if (!preset) return;

    const components = [];
    preset.layout.forEach(item => {
      const def = COMPONENTS.find(c => c.id === item.id);
      if (def) {
        components.push({
          id: newId(),
          defId: def.id,
          name: def.name,
          symbol: def.symbol,
          color: def.color,
          accentColor: def.accentColor,
          category: def.category,
          pins: def.pins,
          specs: def.specs || {},
          properties: def.properties || {},
          x: item.x,
          y: item.y,
          width: def.width,
          height: def.height,
          rotation: 0,
          label: `${def.symbol}${idCounter}`,
        });
      }
    });

    const { wires } = autoWireCircuit(components);
    const code = generateFirmwareCode(components, wires);

    set({
      projectName: preset.title,
      components,
      wires,
      firmwareCode: code,
      isDirty: false,
      canvasOffset: { x: 40, y: 30 },
      zoom: 1,
    });

    get().appendSerialData({
      type: 'info',
      text: `🚀 Loaded project: "${preset.title}" with ${components.length} components.`,
      ts: Date.now(),
    });
  },

  // Build project from text list or component IDs
  buildFromComponentList: (queryOrList) => {
    const result = buildProjectFromList(queryOrList);
    if (!result) return false;

    set({
      projectName: result.projectName,
      components: result.components,
      wires: result.wires,
      firmwareCode: result.firmwareCode,
      isDirty: true,
      canvasOffset: { x: 40, y: 30 },
      zoom: 1,
    });

    get().appendSerialData({
      type: 'info',
      text: `✨ Built project "${result.projectName}" with ${result.wires.length} wires. Ready to simulate!`,
      ts: Date.now(),
    });

    return true;
  },

  // Canvas actions
  addComponent: (componentDef, position) => {
    const id = newId();
    const instance = {
      id,
      defId: componentDef.id,
      name: componentDef.name,
      symbol: componentDef.symbol,
      color: componentDef.color,
      accentColor: componentDef.accentColor,
      category: componentDef.category,
      pins: componentDef.pins,
      specs: componentDef.specs || {},
      properties: componentDef.properties || {},
      x: position.x,
      y: position.y,
      width: componentDef.width,
      height: componentDef.height,
      rotation: 0,
      label: `${componentDef.symbol}${idCounter}`,
    };

    const newComponents = [...get().components, instance];

    if (get().autoSync) {
      // Auto-wire and update code immediately!
      const { wires } = autoWireCircuit(newComponents);
      const code = generateFirmwareCode(newComponents, wires);
      set({
        components: newComponents,
        wires,
        firmwareCode: code,
        isDirty: true,
      });
    } else {
      set({ components: newComponents, isDirty: true });
    }

    return id;
  },

  updateComponent: (id, updates) => {
    set(s => ({
      components: s.components.map(c => c.id === id ? { ...c, ...updates } : c),
      isDirty: true,
    }));
  },

  removeComponent: (id) => {
    const remaining = get().components.filter(c => c.id !== id);
    if (get().autoSync && remaining.length > 0) {
      const { wires } = autoWireCircuit(remaining);
      const code = generateFirmwareCode(remaining, wires);
      set({
        components: remaining,
        wires,
        firmwareCode: code,
        selectedIds: get().selectedIds.filter(sid => sid !== id),
        isDirty: true,
      });
    } else {
      set(s => ({
        components: remaining,
        wires: s.wires.filter(w => w.fromId !== id && w.toId !== id),
        selectedIds: s.selectedIds.filter(sid => sid !== id),
        isDirty: true,
      }));
    }
  },

  addWire: (fromId, fromPin, toId, toPin, points) => {
    const wire = {
      id: newId('wire'),
      fromId,
      fromPin,
      toId,
      toPin,
      points: points || [],
      color: '#6366f1',
      width: 2.5,
    };
    const newWires = [...get().wires, wire];
    const newCode = generateFirmwareCode(get().components, newWires);
    set({ wires: newWires, firmwareCode: newCode, isDirty: true });
    return wire.id;
  },

  removeWire: (id) => {
    const remainingWires = get().wires.filter(w => w.id !== id);
    const newCode = generateFirmwareCode(get().components, remainingWires);
    set({ wires: remainingWires, firmwareCode: newCode, isDirty: true });
  },

  updateWireColor: (id, color) => {
    set(s => ({
      wires: s.wires.map(w => w.id === id ? { ...w, color } : w),
    }));
  },

  selectComponent: (id, multi = false) => {
    set(s => ({
      selectedIds: multi
        ? (s.selectedIds.includes(id) ? s.selectedIds.filter(i => i !== id) : [...s.selectedIds, id])
        : [id],
    }));
  },

  clearSelection: () => set({ selectedIds: [] }),

  setMode: (mode) => set({ mode }),

  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.2, zoom)) }),

  setCanvasOffset: (offset) => set({ canvasOffset: offset }),

  // Simulation
  startSimulation: () => {
    set({ isSimulating: true });
    // Initialize pin states
    const pinStates = {};
    get().components.forEach(c => {
      const allPins = Object.values(c.pins || {}).flat();
      allPins.forEach(pin => {
        pinStates[`${c.id}:${pin}`] = { high: false, voltage: 0 };
      });
    });
    set({ pinStates });

    get().appendSerialData({
      type: 'info',
      text: `▶ Simulation started at 16MHz. Monitoring I/O pins...`,
      ts: Date.now(),
    });

    simulationRunner.start(get, set);
  },

  stopSimulation: () => {
    simulationRunner.stop();
    set({ isSimulating: false, pinStates: {}, mcuOutputs: {} });
    get().appendSerialData({
      type: 'info',
      text: `⏹ Simulation stopped.`,
      ts: Date.now(),
    });
  },

  setPinState: (compId, pin, state) => {
    set(s => ({
      pinStates: { ...s.pinStates, [`${compId}:${pin}`]: state },
    }));
  },

  // Serial
  setSerialPort: (port) => set({ serialPort: port }),
  setSerialConnected: (v) => set({ serialConnected: v }),
  setSerialBaudRate: (v) => set({ serialBaudRate: v }),
  appendSerialData: (entry) => {
    set(s => ({ serialData: [...s.serialData.slice(-500), entry] }));
  },
  clearSerialData: () => set({ serialData: [] }),

  // Firmware
  setFirmwareCode: (code) => set({ firmwareCode: code, isDirty: true }),
  setCompileStatus: (status, output = '', errors = []) => set({ compileStatus: status, compileOutput: output, compileErrors: errors }),

  // Project
  setProjectName: (name) => set({ projectName: name, isDirty: true }),
  markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

  // Clear all
  newProject: () => {
    simulationRunner.stop();
    set({
      components: [],
      wires: [],
      selectedIds: [],
      pinStates: {},
      mcuOutputs: {},
      isSimulating: false,
      projectName: 'Untitled Project',
      projectId: null,
      projectStatus: 'Draft',
      isDirty: false,
      compileStatus: 'idle',
      compileOutput: '',
      serialData: [],
      firmwareCode: `// VoltCraft - New sketch\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  // Drag components to auto-generate code!\n}\n`,
    });
  },

  // Import/Export
  exportProject: () => {
    const { components, wires, firmwareCode, projectName, projectStatus } = get();
    return JSON.stringify({ version: '1.0', projectName, projectStatus: projectStatus || 'Draft', components, wires, firmwareCode }, null, 2);
  },

  importProject: (json) => {
    try {
      const data = JSON.parse(json);
      set({
        components: data.components || [],
        wires: data.wires || [],
        firmwareCode: data.firmwareCode || '',
        projectName: data.projectName || 'Imported Project',
        projectStatus: data.projectStatus || 'Draft',
        isDirty: false,
      });
      return true;
    } catch {
      return false;
    }
  },
}));

export const useAppStore = create((set) => ({
  // UI state
  activePanel: 'dashboard', // dashboard | editor | community | profile
  rightPanelTab: 'code', // code | serial | properties
  leftPanelOpen: true,
  codePanelOpen: true,
  aiPanelOpen: true,
  quickBuilderOpen: false,
  theme: localStorage.getItem('voltcraft_theme') || 'light',
  toggleTheme: () => set(s => {
    const next = s.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('voltcraft_theme', next);
    return { theme: next };
  }),
  setTheme: (theme) => {
    localStorage.setItem('voltcraft_theme', theme);
    set({ theme });
  },

  // AI Copilot
  aiMessages: [
    {
      role: 'assistant',
      content: "👋 Hi! I'm **VoltCraft AI**, your intelligent circuit design copilot.\n\nI can help you:\n- 🔌 **Auto-wire** components intelligently\n- 🔍 **Debug** circuit issues\n- 📝 **Write firmware** code\n- 💡 **Suggest** components for your project\n- 📚 **Explain** how any component works\n\nDescribe your project or ask me anything!",
      ts: Date.now(),
    }
  ],
  aiLoading: false,
  aiApiKey: localStorage.getItem('voltcraft_ai_key') || '',

  setActivePanel: (panel) => set({ activePanel: panel }),
  setRightPanelTab: (tab) => set(s => {
    // If clicking the currently active tab while open, close/collapse the panel!
    if (s.rightPanelTab === tab && s.codePanelOpen) {
      return { codePanelOpen: false };
    }
    return { rightPanelTab: tab, codePanelOpen: true };
  }),
  toggleCodePanel: () => set(s => ({ codePanelOpen: !s.codePanelOpen })),
  setCodePanelOpen: (open) => set({ codePanelOpen: open }),
  toggleLeftPanel: () => set(s => ({ leftPanelOpen: !s.leftPanelOpen })),
  setLeftPanelOpen: (open) => set({ leftPanelOpen: open }),
  toggleAiPanel: () => set(s => ({ aiPanelOpen: !s.aiPanelOpen })),
  setQuickBuilderOpen: (open) => set({ quickBuilderOpen: open }),

  appendAiMessage: (msg) => set(s => ({ aiMessages: [...s.aiMessages, msg] })),
  setAiLoading: (v) => set({ aiLoading: v }),
  setAiApiKey: (key) => {
    localStorage.setItem('voltcraft_ai_key', key);
    set({ aiApiKey: key });
  },
  clearAiMessages: () => set({ aiMessages: [] }),

  // Community
  communityProjects: [],
  setCommunityProjects: (projects) => set({ communityProjects: projects }),
}));
