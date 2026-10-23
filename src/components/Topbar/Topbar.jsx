import React, { useState } from 'react';
import {
  Cpu, LayoutDashboard, Users, Zap, Menu, X,
  ChevronDown, Bell, Settings, Search, Plus,
  CircuitBoard, Wifi, WifiOff, Activity, Code, Box
} from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import './Topbar.css';

export default function Topbar({ onNewProject, onSaveProject, onOpenProject }) {
  const {
    activePanel, setActivePanel,
    aiPanelOpen, toggleAiPanel,
    codePanelOpen, toggleCodePanel,
    leftPanelOpen, toggleLeftPanel
  } = useAppStore();
  const { projectName, isDirty, isSimulating, serialConnected, setProjectName } = useCircuitStore();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: 'Editor', icon: CircuitBoard },
    { id: 'community', label: 'Community', icon: Users },
  ];

  const handleNameClick = () => {
    setTempName(projectName);
    setEditingName(true);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) setProjectName(tempName.trim());
    setEditingName(false);
  };

  return (
    <header className="topbar">
      {/* Logo */}
      <div className="topbar-logo">
        <div className="logo-icon">
          <Zap size={18} />
        </div>
        <span className="logo-text">VoltCraft</span>
        <span className="logo-badge">BETA</span>
      </div>

      {/* Nav */}
      <nav className="topbar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`topbar-nav-item ${activePanel === item.id ? 'active' : ''}`}
            onClick={() => setActivePanel(item.id)}
          >
            <item.icon size={15} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Project Name */}
      {activePanel === 'editor' && (
        <div className="topbar-project">
          {editingName ? (
            <input
              autoFocus
              className="project-name-input"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={e => { if (e.key === 'Enter') handleNameSubmit(); if (e.key === 'Escape') setEditingName(false); }}
            />
          ) : (
            <button className="project-name-btn" onClick={handleNameClick}>
              {projectName}
              {isDirty && <span className="dirty-dot" title="Unsaved changes" />}
            </button>
          )}
        </div>
      )}

      {/* Right actions */}
      <div className="topbar-actions">
        {/* Status pills */}
        {activePanel === 'editor' && (
          <div className="status-pills">
            <div className={`status-pill ${isSimulating ? 'active' : ''}`}>
              <Activity size={12} />
              {isSimulating ? 'Running' : 'Stopped'}
            </div>
            <div className={`status-pill ${serialConnected ? 'connected' : ''}`}>
              {serialConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              {serialConnected ? 'COM Connected' : 'No Port'}
            </div>
          </div>
        )}

        {/* Panel Toggles (Editor mode) */}
        {activePanel === 'editor' && (
          <>
            <button
              className={`btn-ghost topbar-btn ${leftPanelOpen ? 'active' : ''}`}
              onClick={toggleLeftPanel}
              title="Touch to toggle Component Library"
            >
              <Box size={14} />
              Components
            </button>
            <button
              className={`btn-ghost topbar-btn ${codePanelOpen ? 'active' : ''}`}
              onClick={toggleCodePanel}
              title="Touch to toggle Code Editor"
            >
              <Code size={14} />
              Code Editor
            </button>
          </>
        )}

        <button className="btn-ghost topbar-btn" onClick={onNewProject}>
          <Plus size={15} />
          New
        </button>
        <button className="btn-secondary topbar-btn" onClick={onSaveProject}>
          Save{isDirty ? '*' : ''}
        </button>
        <button
          className={`btn-ghost topbar-btn ${aiPanelOpen ? 'active' : ''}`}
          onClick={toggleAiPanel}
          title="Touch to toggle AI Copilot"
        >
          <span className="ai-icon">✦</span>
          AI Copilot
        </button>
        <button className="btn-icon topbar-btn" title="Settings">
          <Settings size={16} />
        </button>
        <div className="topbar-avatar" title="Profile">G</div>
      </div>
    </header>
  );
}
