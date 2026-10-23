# Drag-and-Drop Side-Panel Component Library for Common Electronic Parts

A dedicated, high-efficiency side-panel component library for VoltCraft that enables engineers and hobbyists to effortlessly find, inspect, and drag-and-drop common electronic components—resistors, capacitors, logic and timer ICs, diodes, transistors, and sensors—onto the circuit workspace with instant value configuration and grid snapping.

---

> [!IMPORTANT]
> **Confirmed User Decisions (Phase 1 Clarification)**
> - **Organization**: Quick-access common parts shelf positioned at the top for instant dragging, paired with a categorized browser below.
> - **Visual Presentation**: Visual package cards featuring authentic hardware package illustrations, technical specifications, and explicit pin counts.
> - **Value Configuration**: Drops with sensible standard defaults (e.g. 1kΩ, 100µF, Red LED) paired with an instant floating Quick Value Selector near the component for rapid one-click preset switching.

---

## 1. Overview & Core Concept

When designing electronic circuits, over 70% of placed components belong to a small set of foundational parts: standard axial resistors, electrolytic and ceramic capacitors, diodes, transistors, and classic DIP ICs (like the NE555 Timer, 74HC595 Shift Register, and LM358 Op-Amp). 

Currently, users must hunt through general catalogs or manual modals to place parts. This feature delivers:
1. **Quick-Access Common Shelf**: A curated horizontal tray at the top of the side panel containing high-frequency electronic parts ready for instantaneous drag-and-drop.
2. **Visual Hardware Package Cards**: Cards showcasing realistic package outlines (Axial Through-Hole, Radial Can, DIP-8, DIP-16, TO-92), pin counts, and primary ratings.
3. **Smooth Canvas Drag-and-Drop**: Real-time drop-target ghost on the canvas with grid-snapping feedback and mouse coordinate tracking.
4. **Instant Quick Value Selector**: A contextual floating toolbar appearing upon drop (and upon component selection) allowing instant switching of standard values (e.g., 220Ω, 330Ω, 1kΩ, 4.7kΩ, 10kΩ, 100kΩ) with live visual color band/marking updates.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Shelf-to-Canvas Dragging**:
   - The user opens the Editor. At the top of the left panel sits the **Common Parts Shelf** displaying Resistor, Capacitor, Ceramic Cap, LED, Diode, Transistor, 555 Timer, and Shift Register.
   - The user drags a **Resistor** card over the workspace. A subtle semi-transparent ghost with a crosshair and snap-to-grid bounding box follows the cursor.
   - Dropping the component snaps it to the canvas grid, generates unique pin identifiers, and adds it to the circuit state.
2. **Instant Value Selection**:
   - Immediately upon dropping, a floating **Quick Value Selector** popover appears anchored above the component with one-click chips (`220Ω`, `330Ω`, `1kΩ`, `4.7kΩ`, `10kΩ`, `100kΩ`) and an input for custom values.
   - Clicking `10kΩ` instantly updates the component's internal value, changes the visual color bands on the resistor body (Brown-Black-Orange), and updates the circuit engine.
3. **Categorized Deep Library**:
   - Below the common shelf, users can filter by category pills (`All`, `Passives`, `ICs & Logic`, `Microcontrollers`, `Sensors`, `Actuators`, `Power`) or search by keyword/pin name (`"555"`, `"ADC"`, `"pullup"`, `"ceramic"`).
   - Toggling between **Visual Card Grid** and **Compact Technical List** view modes allows high-density browsing for expert users.

### Visual Identity & Theme (Studio Clean White + Dark Mode)
- **Palette**:
  - Light mode surface: `#FFFFFF` card surfaces, `#F8FAFC` background, `#E2E8F0` hairline borders.
  - Dark mode surface: `#111827` cards, `#090D1A` background, `rgba(255,255,255,0.08)` borders.
  - Category accents: Passive parts in warm amber (`#D97706`), ICs in deep slate/indigo (`#4F46E5`), Semiconductors in emerald (`#059669`), Microcontrollers in electric cyan (`#0284C7`).
- **Typography**:
  - Headers: `Outfit` (700 weight) for clear hierarchy.
  - Body & Labels: `Inter` / `Public Sans` (400, 500, 600 weight) for scannable UI.
  - Technical Specs & Values: `JetBrains Mono` with `font-variant-numeric: tabular-nums` for precision alignment.
- **Micro-Interactions**:
  - `cursor: grab` on shelf chips and cards, transforming to `cursor: grabbing` on drag start.
  - Subtle 1.02x scale elevation with soft shadow `box-shadow: 0 4px 12px rgba(0,0,0,0.06)` on card hover.
  - Drag ghost showing live snapping coordinates with green alignment guides.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Quick-Access Shelf vs. Pure Category Accordion
- **Chosen Approach**: Two-tier layout with a persistent horizontal quick-access common shelf at the top, and filterable categorized catalog below.
- **Rationale**: 80% of breadboard prototyping involves repeating common passives and standard ICs. Having them pinned at the top eliminates repeated scrolling and category switching.
- **Alternatives Considered**: Collapsible accordion categories only—rejected because it requires multiple clicks to access resistors and capacitors during rapid prototyping.

### Decision 2: Instant Contextual Floating Value Selector vs. Modal Dialog
- **Chosen Approach**: Floating non-modal quick-select popover attached to the newly dropped component with standard E12/E24 decade presets, dismissing automatically on click-outside or canvas pan.
- **Rationale**: A blocking modal disrupts creative flow, while a silent drop forces users to navigate to the right-hand properties sidebar every time. The floating popover gives immediate 1-click customization without blocking canvas view.
- **Alternatives Considered**: Modal prompt on drop—rejected as disruptive; Sidebar-only configuration—rejected as too distant from the dropped item.

### Decision 3: SVG Component Rendering with Dynamic Markings
- **Chosen Approach**: Enhance `ComponentIllustration` so that changing values (e.g. 220Ω vs 10kΩ vs 100kΩ) dynamically computes and paints real 4-band EIA color codes on the resistor SVG, and laser etch text on ICs.
- **Rationale**: Authentic hardware visuals provide immediate visual validation of circuit wiring without needing to read property tables.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Editor Workspace                              │
├──────────────────────────┬─────────────────────────────────────────────┤
│ ComponentPanel (Left)    │ CircuitCanvas (Center)                      │
│                          │                                             │
│ ┌──────────────────────┐ │  ┌────────────────────────────────────────┐ │
│ │ Quick Common Shelf   │ │  │ Canvas Area (HTML5 Drop Target)        │ │
│ │ [R] [C] [LED] [IC]   │─┼──┼─► Ghost Preview & Grid Snap           │ │
│ └──────────────────────┘ │  │   addComponent(def, { x, y })          │ │
│ ┌──────────────────────┐ │  └────────────────────┬───────────────────┘ │
│ │ Search & Filter Bar  │ │                       │                     │
│ └──────────────────────┘ │  ┌────────────────────▼───────────────────┐ │
│ ┌──────────────────────┐ │  │ Dropped Component                      │ │
│ │ Categorized Grid/List│ │  │ ┌────────────────────────────────────┐ │ │
│ │ • Resistors (Axial)  │ │  │ │ Floating QuickValueSelector Popover │ │ │
│ │ • Capacitors (Can/Cer) │  │ │ [220Ω] [1kΩ] [10kΩ] [Custom...]    │ │ │
│ │ • ICs (555, 74HC595) │ │  │ └────────────────────────────────────┘ │ │
│ └──────────────────────┘ │  └────────────────────────────────────────┘ │
└──────────────────────────┴─────────────────────────────────────────────┘
                                   │
                                   ▼
                 useCircuitStore (Zustand State Store)
                 • components[] (with values, tolerance, pins)
                 • updateComponentValue(id, value, unit)
                 • simulationEngine (evaluates resistance & logic)
```

### Data Model & Component Catalog Extensions
- **Resistor Family**:
  - `resistor`: Axial 1/4W resistor with selectable resistances (`10Ω` to `1MΩ`), dynamic color band generator (`calculateResistorBands(ohms)`).
  - `potentiometer`: Variable 3-pin resistor (`10kΩ`).
- **Capacitor Family**:
  - `capacitor`: Electrolytic radial can (`10µF`, `100µF`, `470µF`, `25V`).
  - `capacitor-ceramic`: 100nF (0.1µF) decoupling ceramic disc capacitor (Marking "104").
- **Semiconductor & IC Family**:
  - `ne555`: DIP-8 precision timer IC (Pins: GND, TRIG, OUT, RST, CV, THR, DIS, VCC).
  - `ic-74hc595`: DIP-16 8-bit serial-in parallel-out shift register.
  - `ic-lm358`: DIP-8 dual low-power operational amplifier.
  - `ic-74hc04`: DIP-14 hex inverter (NOT gates).
  - `diode-1n4007`: 1A power rectifier diode with silver cathode stripe.
  - `transistor-2n2222`: TO-92 NPN switching transistor (E-B-C).

### Interactive State Transitions
1. `onDragStart(e, componentDef)`: Sets mime type `application/component` and drag payload with default electrical properties.
2. `onDragOver(e)`: Calls `e.preventDefault()`, translates mouse cursor to canvas coordinate space, renders snapping ghost.
3. `onDrop(e)`: Computes snapped grid coordinates `snapToGrid(pos.x, pos.y)`, calls `addComponent()`, and sets `activeQuickSelectCompId` to open the quick value popover.
4. `onSelectPresetValue(val)`: Updates component properties, changes visual color bands or printed ratings, and syncs circuit simulation.
