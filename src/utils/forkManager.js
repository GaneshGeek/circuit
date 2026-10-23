import { useCircuitStore, useAppStore } from '../store/store';
import { COMPONENTS } from '../data/components';
import { PRESET_PROJECTS, autoWireCircuit, generateFirmwareCode, getCompBaseType } from './circuitEngine';
import { toast } from 'react-hot-toast';

const FORKS_STORAGE_KEY = 'voltcraft_user_forks';
const GALLERY_STORAGE_KEY = 'voltcraft_gallery_custom';

/**
 * Retrieve all user-forked projects from localStorage
 */
export function getUserForks() {
  try {
    const raw = localStorage.getItem(FORKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading user forks:', err);
    return [];
  }
}

/**
 * Save or update a forked project
 */
export function saveUserFork(forkData) {
  try {
    const existing = getUserForks();
    const idx = existing.findIndex(f => f.id === forkData.id);
    let updated;
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = { ...updated[idx], ...forkData, updatedAt: 'Just now' };
    } else {
      updated = [forkData, ...existing];
    }
    localStorage.setItem(FORKS_STORAGE_KEY, JSON.stringify(updated));

    // Also sync with gallery custom projects so it shows on Dashboard
    try {
      const galleryRaw = localStorage.getItem(GALLERY_STORAGE_KEY);
      const gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
      const gIdx = gallery.findIndex(g => g.id === forkData.id);
      let nextGallery;
      if (gIdx >= 0) {
        nextGallery = [...gallery];
        nextGallery[gIdx] = { ...nextGallery[gIdx], ...forkData };
      } else {
        nextGallery = [forkData, ...gallery];
      }
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(nextGallery));
    } catch (e) {
      console.warn('Error syncing fork to gallery:', e);
    }

    // Broadcast update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voltcraft_forks_updated', { detail: forkData }));
    }

    return updated;
  } catch (err) {
    console.warn('Error saving user fork:', err);
    return [];
  }
}

/**
 * Delete a user fork
 */
export function deleteUserFork(forkId) {
  try {
    const existing = getUserForks();
    const updated = existing.filter(f => f.id !== forkId);
    localStorage.setItem(FORKS_STORAGE_KEY, JSON.stringify(updated));

    // Remove from gallery storage too
    try {
      const galleryRaw = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (galleryRaw) {
        const gallery = JSON.parse(galleryRaw);
        const nextGallery = gallery.filter(g => g.id !== forkId);
        localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(nextGallery));
      }
    } catch (e) {
      console.warn('Error removing fork from gallery:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voltcraft_forks_updated', { detail: { id: forkId, deleted: true } }));
    }

    return updated;
  } catch (err) {
    console.warn('Error deleting user fork:', err);
    return [];
  }
}

/**
 * Generate full circuit components, wires, and firmware from project metadata,
 * presetId, or componentIds.
 */
export function instantiateProjectCircuit(project) {
  let components = [];
  let wires = [];
  let firmwareCode = '';

  // 1. If project already has explicit components array with contents
  if (Array.isArray(project.components) && project.components.length > 0) {
    // Clone components with new instance IDs so it behaves as an independent fork
    const idMap = {};
    components = project.components.map(comp => {
      const newCompId = `comp_fork_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      idMap[comp.id] = newCompId;
      return {
        ...comp,
        id: newCompId,
      };
    });

    if (Array.isArray(project.wires) && project.wires.length > 0) {
      wires = project.wires.map((w, idx) => ({
        ...w,
        id: `wire_fork_${Date.now()}_${idx}`,
        fromId: idMap[w.fromId] || w.fromId,
        toId: idMap[w.toId] || w.toId,
      }));
    } else {
      const wired = autoWireCircuit(components);
      wires = wired.wires;
    }

    firmwareCode = project.firmwareCode || generateFirmwareCode(components, wires);
    return { components, wires, firmwareCode };
  }

  // 2. If project references a presetId (e.g. from PRESET_PROJECTS)
  const presetId = project.presetId || project.id;
  const preset = PRESET_PROJECTS.find(p => p.id === presetId);
  if (preset && Array.isArray(preset.layout)) {
    let idCounter = 1;
    preset.layout.forEach(item => {
      const def = COMPONENTS.find(c => c.id === item.id);
      if (def) {
        components.push({
          id: `comp_fork_${Date.now()}_${idCounter++}`,
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

    const wired = autoWireCircuit(components);
    wires = wired.wires;
    firmwareCode = generateFirmwareCode(components, wires);
    return { components, wires, firmwareCode };
  }

  // 3. If project has componentIds or tag hints
  const targetIds = project.componentIds || [];
  if (targetIds.length > 0) {
    let idCounter = 1;
    targetIds.forEach((compId, idx) => {
      const def = COMPONENTS.find(c => c.id === compId || c.tags.includes(compId));
      if (def) {
        const isMcu = ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(getCompBaseType(def));
        components.push({
          id: `comp_fork_${Date.now()}_${idCounter++}`,
          defId: def.id,
          name: def.name,
          symbol: def.symbol,
          color: def.color,
          accentColor: def.accentColor,
          category: def.category,
          pins: def.pins,
          specs: def.specs || {},
          properties: def.properties || {},
          x: isMcu ? 240 : idx % 2 === 0 ? 80 : 430,
          y: isMcu ? 130 : 90 + Math.floor(idx / 2) * 90,
          width: def.width,
          height: def.height,
          rotation: 0,
          label: `${def.symbol}${idCounter}`,
        });
      }
    });

    // Ensure MCU exists
    const hasMCU = components.some(c =>
      ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(getCompBaseType(c))
    );
    if (!hasMCU) {
      const defMcu = COMPONENTS.find(c => c.id === (project.targetMcu === 'ESP32' ? 'esp32' : 'arduino-uno')) || COMPONENTS[0];
      components.unshift({
        id: `comp_fork_${Date.now()}_0`,
        defId: defMcu.id,
        name: defMcu.name,
        symbol: defMcu.symbol,
        color: defMcu.color,
        accentColor: defMcu.accentColor,
        category: defMcu.category,
        pins: defMcu.pins,
        specs: defMcu.specs || {},
        properties: defMcu.properties || {},
        x: 240,
        y: 130,
        width: defMcu.width,
        height: defMcu.height,
        rotation: 0,
        label: `${defMcu.symbol}1`,
      });
    }

    const wired = autoWireCircuit(components);
    wires = wired.wires;
    firmwareCode = generateFirmwareCode(components, wires);
    return { components, wires, firmwareCode };
  }

  // 4. Fallback based on project name / category keywords
  const title = (project.name || '').toLowerCase();
  let defaultIds = ['arduino-uno', 'led', 'resistor'];

  if (title.includes('irrigation') || title.includes('water')) {
    defaultIds = ['esp32', 'soil-moisture', 'relay', 'servo'];
  } else if (title.includes('weather') || title.includes('temp') || title.includes('air')) {
    defaultIds = ['esp32', 'dht22', 'oled-128x64'];
  } else if (title.includes('robot') || title.includes('gesture')) {
    defaultIds = ['arduino-uno', 'mpu6050', 'dc-motor', 'buzzer'];
  } else if (title.includes('matrix') || title.includes('plotter')) {
    defaultIds = ['rp2040', 'stepper', 'led', 'push-button'];
  } else if (title.includes('alarm') || title.includes('pir') || title.includes('motion')) {
    defaultIds = ['arduino-uno', 'pir', 'buzzer', 'led'];
  } else if (title.includes('synth') || title.includes('sound') || title.includes('midi')) {
    defaultIds = ['arduino-uno', 'buzzer', 'potentiometer', 'push-button', 'resistor', 'led'];
  } else if (title.includes('speed') || title.includes('bluetooth')) {
    defaultIds = ['arduino-uno', 'hc-05', 'ldr', 'lcd-16x2', 'resistor'];
  }

  let idCounter = 1;
  defaultIds.forEach((id, idx) => {
    const def = COMPONENTS.find(c => c.id === id);
    if (def) {
      const isMcu = ['arduino-uno', 'esp32', 'rp2040', 'arduino-nano', 'stm32'].includes(getCompBaseType(def));
      components.push({
        id: `comp_fork_${Date.now()}_${idCounter++}`,
        defId: def.id,
        name: def.name,
        symbol: def.symbol,
        color: def.color,
        accentColor: def.accentColor,
        category: def.category,
        pins: def.pins,
        specs: def.specs || {},
        properties: def.properties || {},
        x: isMcu ? 240 : idx % 2 === 0 ? 80 : 430,
        y: isMcu ? 130 : 90 + Math.floor(idx / 2) * 90,
        width: def.width,
        height: def.height,
        rotation: 0,
        label: `${def.symbol}${idCounter}`,
      });
    }
  });

  const wired = autoWireCircuit(components);
  wires = wired.wires;
  firmwareCode = generateFirmwareCode(components, wires);
  return { components, wires, firmwareCode };
}

/**
 * Core Forking Action:
 * Creates a complete fork from any project (Community or Gallery or Current Editor Canvas)
 * and loads the full circuit into the editor.
 */
export function forkProjectToEditor(project) {
  const { components, wires, firmwareCode } = instantiateProjectCircuit(project);

  const forkId = `fork_${Date.now()}`;
  const forkName = project.name.startsWith('Fork of ') ? project.name : `Fork of ${project.name}`;

  const targetMcu = components.find(c => (c.defId || c.id || '').includes('esp32'))
    ? 'ESP32'
    : components.find(c => (c.defId || c.id || '').includes('pico') || (c.defId || c.id || '').includes('rp2040'))
    ? 'RP2040'
    : 'Arduino Uno';

  const forkRecord = {
    id: forkId,
    name: forkName,
    desc: project.desc || `Forked from @${project.author || 'maker'} on VoltCraft`,
    forkedFrom: project.name,
    forkedFromAuthor: project.author || 'VoltCraft Community',
    forkedAt: new Date().toISOString(),
    isFork: true,
    status: 'Draft',
    targetMcu,
    tags: Array.from(new Set([...(project.tags || []), 'fork'])),
    components,
    wires,
    firmwareCode,
    componentsCount: components.length,
    wiresCount: wires.length,
    updatedAt: 'Just now',
  };

  // 1. Save to persistent forks list and gallery
  saveUserFork(forkRecord);

  // 2. Load into Circuit Store
  useCircuitStore.setState({
    projectId: forkRecord.id,
    projectName: forkRecord.name,
    projectStatus: 'Draft',
    components: forkRecord.components,
    wires: forkRecord.wires,
    firmwareCode: forkRecord.firmwareCode,
    isDirty: false,
    selectedIds: [],
    canvasOffset: { x: 40, y: 30 },
    zoom: 1,
  });

  // 3. Switch view to Editor
  useAppStore.getState().setActivePanel('editor');

  toast.success(`✓ Forked "${project.name}"! Loaded ${components.length} components into editor.`);

  return forkRecord;
}

/**
 * Load an existing fork directly into the editor
 */
export function loadExistingForkIntoEditor(fork) {
  useCircuitStore.setState({
    projectId: fork.id,
    projectName: fork.name,
    projectStatus: fork.status || 'Draft',
    components: fork.components || [],
    wires: fork.wires || [],
    firmwareCode: fork.firmwareCode || '',
    isDirty: false,
    selectedIds: [],
    canvasOffset: { x: 40, y: 30 },
    zoom: 1,
  });

  useAppStore.getState().setActivePanel('editor');
  toast.success(`Opened "${fork.name}" in editor`);
}
