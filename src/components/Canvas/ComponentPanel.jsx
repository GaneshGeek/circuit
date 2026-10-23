import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Plus, Zap, LayoutGrid, List, Eye, X, Info } from 'lucide-react';
import { COMPONENTS, COMPONENT_CATEGORIES, searchComponents, getComponentsByCategory } from '../../data/components';
import { useCircuitStore, useAppStore } from '../../store/store';
import ComponentIllustration from '../Common/ComponentImage';
import './ComponentPanel.css';

export default function ComponentPanel() {
  const { toggleLeftPanel } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedCats, setExpandedCats] = useState({ all: true });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (pictures) | 'list'
  const [inspectComp, setInspectComp] = useState(null);

  const filtered = searchQuery
    ? searchComponents(searchQuery)
    : getComponentsByCategory(activeCategory === 'all' ? null : activeCategory);

  const handleDragStart = (e, comp) => {
    e.dataTransfer.setData('application/component', JSON.stringify(comp));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddToCanvas = (comp) => {
    const { addComponent } = useCircuitStore.getState();
    addComponent(comp, {
      x: 100 + Math.random() * 260,
      y: 100 + Math.random() * 180,
    });
  };

  const toggleCat = (id) => setExpandedCats(s => ({ ...s, [id]: !s[id] }));

  const grouped = {};
  if (!searchQuery && activeCategory === 'all') {
    COMPONENT_CATEGORIES.forEach(cat => {
      grouped[cat.id] = COMPONENTS.filter(c => c.category === cat.id);
    });
  }

  return (
    <div className="component-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div
          className="panel-header-left"
          onClick={toggleLeftPanel}
          style={{ cursor: 'pointer' }}
          title="Touch 'Component Library' to close"
        >
          <h3 className="panel-title">Component Library</h3>
          <span className="panel-free-badge">100% Free</span>
        </div>
        <div className="view-mode-toggle" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Visual Card Grid with Pictures"
          >
            <LayoutGrid size={13} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Compact List View"
          >
            <List size={13} />
          </button>
          <button
            className="btn-icon"
            style={{ width: 24, height: 24, marginLeft: 2 }}
            onClick={toggleLeftPanel}
            title="Touch to close Component Library"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Search Input with Pictures Indicator */}
      <div className="search-wrapper">
        <Search size={14} className="search-icon" />
        <input
          className="search-input"
          placeholder="Search by name, pin, specs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Visual Subtitle indicator */}
      <div className="search-subtitle">
        <span>{filtered.length} components with visual illustrations</span>
      </div>

      {/* Category Filter Pills */}
      {!searchQuery && (
        <div className="category-pills">
          <button
            className={`cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All ({COMPONENTS.length})
          </button>
          {COMPONENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.label}
            >
              <span>{cat.icon}</span>
              <span className="cat-pill-label">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Component Cards / List Area */}
      <div className={`comp-list ${viewMode === 'grid' ? 'grid-mode' : 'list-mode'}`}>
        {searchQuery || activeCategory !== 'all' ? (
          // Flat list
          <div className={viewMode === 'grid' ? 'cards-grid' : 'cards-column'}>
            {filtered.map(comp => (
              <ComponentCard
                key={comp.id}
                comp={comp}
                viewMode={viewMode}
                onDragStart={handleDragStart}
                onAdd={handleAddToCanvas}
                onInspect={setInspectComp}
              />
            ))}
          </div>
        ) : (
          // Grouped by Category
          COMPONENT_CATEGORIES.map(cat => {
            const catComps = grouped[cat.id] || [];
            if (!catComps.length) return null;
            const expanded = expandedCats[cat.id] !== false;

            return (
              <div key={cat.id} className="comp-group">
                <button className="comp-group-header" onClick={() => toggleCat(cat.id)}>
                  <span>{cat.icon} {cat.label}</span>
                  <span className="group-meta">
                    <span className="group-count">{catComps.length}</span>
                    {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </span>
                </button>

                {expanded && (
                  <div className={viewMode === 'grid' ? 'cards-grid' : 'cards-column'}>
                    {catComps.map(comp => (
                      <ComponentCard
                        key={comp.id}
                        comp={comp}
                        viewMode={viewMode}
                        onDragStart={handleDragStart}
                        onAdd={handleAddToCanvas}
                        onInspect={setInspectComp}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {filtered.length === 0 && searchQuery && (
          <div className="comp-empty">
            <Zap size={24} />
            <p>No components found for "{searchQuery}"</p>
            <button className="comp-empty-reset" onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
        )}
      </div>

      {/* Full Component Picture & Specs Inspection Modal */}
      {inspectComp && (
        <ComponentDetailModal
          comp={inspectComp}
          onClose={() => setInspectComp(null)}
          onAdd={() => {
            handleAddToCanvas(inspectComp);
            setInspectComp(null);
          }}
        />
      )}
    </div>
  );
}

function ComponentCard({ comp, viewMode, onDragStart, onAdd, onInspect }) {
  const [hovered, setHovered] = useState(false);

  if (viewMode === 'grid') {
    return (
      <div
        className="comp-card-grid"
        draggable
        onDragStart={e => onDragStart(e, comp)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Prominent Image Preview */}
        <div
          className="comp-card-img-wrap"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${comp.color}15, rgba(15, 23, 42, 0.6))`,
            borderColor: hovered ? `${comp.accentColor}55` : 'rgba(255,255,255,0.06)',
          }}
          onClick={() => onInspect(comp)}
          title="Click to zoom picture & see pinout"
        >
          <ComponentIllustration
            componentId={comp.id}
            width={84}
            height={56}
            glow={hovered}
          />
          <button
            className="comp-quick-zoom"
            onClick={(e) => { e.stopPropagation(); onInspect(comp); }}
            title="Inspect component picture & pinout"
          >
            <Eye size={12} />
          </button>
        </div>

        {/* Info & Title */}
        <div className="comp-card-grid-body">
          <div className="comp-card-grid-title" title={comp.name}>
            {comp.name}
          </div>
          <div className="comp-card-grid-desc" title={comp.description}>
            {comp.description}
          </div>

          {/* Quick Specs Badges */}
          {comp.specs && (
            <div className="comp-card-specs">
              {Object.entries(comp.specs).slice(0, 2).map(([k, v]) => (
                <span key={k} className="spec-badge">
                  {typeof v === 'boolean' ? k : `${v}`}
                </span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="comp-card-action-row">
            <span className="comp-symbol-tag" style={{ color: comp.accentColor }}>
              {comp.symbol}
            </span>
            <button
              className="comp-grid-add-btn"
              onClick={(e) => { e.stopPropagation(); onAdd(comp); }}
              title="Add component to canvas"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact List Mode with Thumbnail
  return (
    <div
      className="comp-card-list"
      draggable
      onDragStart={e => onDragStart(e, comp)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual Component Thumbnail */}
      <div
        className="comp-thumb"
        style={{
          background: `radial-gradient(circle, ${comp.color}22, rgba(15, 23, 42, 0.7))`,
          border: `1px solid ${comp.color}44`,
        }}
        onClick={() => onInspect(comp)}
        title="Click to view large picture"
      >
        <ComponentIllustration
          componentId={comp.id}
          width={40}
          height={30}
        />
      </div>

      {/* Info */}
      <div className="comp-info" onClick={() => onInspect(comp)}>
        <div className="comp-name">{comp.name}</div>
        <div className="comp-desc">{comp.description}</div>
      </div>

      {/* Add button */}
      <button
        className="comp-add-btn"
        onClick={(e) => { e.stopPropagation(); onAdd(comp); }}
        title="Add to canvas"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function ComponentDetailModal({ comp, onClose, onAdd }) {
  if (!comp) return null;

  return (
    <div className="comp-modal-overlay" onClick={onClose}>
      <div className="comp-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="comp-modal-header">
          <div className="comp-modal-title-area">
            <span className="comp-modal-cat-tag">{comp.category.toUpperCase()}</span>
            <h2 className="comp-modal-name">{comp.name}</h2>
          </div>
          <button className="comp-modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Large High-Res Picture Display */}
        <div
          className="comp-modal-hero-img"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${comp.color}28, rgba(10, 15, 30, 0.95))`,
            borderColor: `${comp.color}44`,
          }}
        >
          <ComponentIllustration
            componentId={comp.id}
            width={180}
            height={130}
            glow={true}
          />
          <div className="comp-modal-badge-free">
            ⚡ 100% Free Component • Unlimited Simulation
          </div>
        </div>

        {/* Modal Body */}
        <div className="comp-modal-body">
          <p className="comp-modal-desc">{comp.description}</p>

          {/* Specifications */}
          {comp.specs && Object.keys(comp.specs).length > 0 && (
            <div className="comp-modal-section">
              <h4 className="comp-modal-section-title">Hardware Specifications</h4>
              <div className="comp-modal-specs-grid">
                {Object.entries(comp.specs).map(([k, v]) => (
                  <div key={k} className="comp-spec-item">
                    <span className="spec-key">{k}</span>
                    <span className="spec-val">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pinout Information */}
          {comp.pins && (
            <div className="comp-modal-section">
              <h4 className="comp-modal-section-title">Pinout & Signal Channels</h4>
              <div className="comp-modal-pins-wrap">
                {Object.entries(comp.pins).map(([group, pinList]) => (
                  <div key={group} className="comp-pin-group">
                    <span className="pin-group-title">{group}</span>
                    <div className="pin-tags">
                      {(pinList || []).map(p => (
                        <span key={p} className="pin-tag">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="comp-modal-footer">
          <button className="comp-modal-cancel-btn" onClick={onClose}>
            Close
          </button>
          <button className="comp-modal-add-btn" onClick={onAdd}>
            <Plus size={15} />
            <span>Add to Circuit Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
