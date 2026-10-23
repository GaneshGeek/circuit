import React, { useState } from 'react';
import { Code, Terminal, Sparkles, Box, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ComponentPanel from '../../components/Canvas/ComponentPanel';
import CircuitCanvas from '../../components/Canvas/CircuitCanvas';
import CodePanel from '../../components/Editor/CodePanel';
import AICopilot from '../../components/AI/AICopilot';
import ComponentIllustration from '../../components/Common/ComponentImage';
import { useAppStore, useCircuitStore } from '../../store/store';
import './Editor.css';

export default function Editor() {
  const {
    leftPanelOpen, toggleLeftPanel,
    codePanelOpen, toggleCodePanel, setCodePanelOpen,
    aiPanelOpen, toggleAiPanel,
    setRightPanelTab,
  } = useAppStore();

  const { selectedIds } = useCircuitStore();
  const [selectedComp, setSelectedComp] = useState(null);

  const handleComponentClick = (comp) => {
    setSelectedComp(comp);
  };

  return (
    <div className="editor-layout">
      {/* Left: Component Panel with Pictures or Collapsed Tab */}
      {leftPanelOpen ? (
        <ComponentPanel />
      ) : (
        <div
          className="collapsed-side-tab left-collapsed"
          onClick={toggleLeftPanel}
          title="Touch 'Component Library' to open"
        >
          <Box size={14} className="collapsed-icon" />
          <span className="collapsed-text">Component Library</span>
          <ChevronRight size={13} className="collapsed-arrow" />
        </div>
      )}

      {/* Center: Canvas */}
      <div className="editor-center">
        <CircuitCanvas onComponentClick={handleComponentClick} />

        {/* Properties panel for selected component */}
        {selectedComp && selectedIds.includes(selectedComp.id) && (
          <div className="properties-panel animate-fadeIn">
            <div
              className="props-header"
              onClick={() => setSelectedComp(null)}
              style={{ cursor: 'pointer' }}
              title="Touch component name to close properties"
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  background: selectedComp.color + '33',
                  border: `1px solid ${selectedComp.color}55`,
                  borderRadius: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  color: selectedComp.accentColor,
                }}
              >
                {selectedComp.symbol}
              </span>
              <div className="props-name">{selectedComp.name}</div>
              <button
                className="btn-icon"
                style={{ marginLeft: 'auto', width: 24, height: 24 }}
                onClick={(e) => { e.stopPropagation(); setSelectedComp(null); }}
                title="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Visual picture preview of selected component */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 8px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), rgba(15, 23, 42, 0.85))',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              margin: '8px 0',
            }}>
              <ComponentIllustration
                componentId={selectedComp.defId || selectedComp.id}
                width={120}
                height={80}
              />
            </div>

            {/* Specs */}
            {selectedComp.specs && Object.keys(selectedComp.specs).length > 0 && (
              <div className="props-section">
                <div className="props-section-title">Specifications</div>
                {Object.entries(selectedComp.specs).map(([k, v]) => (
                  <div key={k} className="props-row">
                    <span className="props-key">{k}</span>
                    <span className="props-val">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pins */}
            {selectedComp.pins && (
              <div className="props-section">
                <div className="props-section-title">Pins</div>
                {Object.entries(selectedComp.pins).map(([group, pins]) => (
                  <div key={group}>
                    <div className="props-pin-group">{group}</div>
                    <div className="props-pin-list">
                      {(pins || []).map(p => (
                        <span key={p} className="props-pin">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Code + Serial Panel or Collapsed Side Strip */}
      {codePanelOpen ? (
        <CodePanel />
      ) : (
        <div className="collapsed-side-tab right-collapsed">
          <button
            className="collapsed-action-btn"
            onClick={() => { setRightPanelTab('code'); setCodePanelOpen(true); }}
            title="Touch 'Code Editor' to open"
          >
            <Code size={14} className="collapsed-icon" />
            <span className="collapsed-text">Code Editor</span>
            <ChevronLeft size={13} className="collapsed-arrow" />
          </button>
          <button
            className="collapsed-action-btn"
            onClick={() => { setRightPanelTab('serial'); setCodePanelOpen(true); }}
            title="Touch 'Serial Monitor' to open"
          >
            <Terminal size={14} className="collapsed-icon" />
            <span className="collapsed-text">Serial Monitor</span>
          </button>
        </div>
      )}

      {/* Far right: AI Copilot or Collapsed Strip */}
      {aiPanelOpen ? (
        <AICopilot />
      ) : (
        <div
          className="collapsed-side-tab ai-collapsed"
          onClick={toggleAiPanel}
          title="Touch 'AI Copilot' to open"
        >
          <Sparkles size={14} className="collapsed-icon" style={{ color: '#818cf8' }} />
          <span className="collapsed-text">AI Copilot</span>
          <ChevronLeft size={13} className="collapsed-arrow" />
        </div>
      )}
    </div>
  );
}
