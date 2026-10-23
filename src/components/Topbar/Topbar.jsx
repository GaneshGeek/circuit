import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, Users, Zap, Plus,
  CircuitBoard, Wifi, WifiOff, Activity, Code, Box,
  Sun, Moon, LogIn, LogOut, GitFork, ChevronDown, Trash2, ExternalLink
} from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import { useAuth } from '../../context/AuthContext';
import { getUserForks, loadExistingForkIntoEditor, deleteUserFork, forkProjectToEditor } from '../../utils/forkManager';
import { toast } from 'react-hot-toast';
import './Topbar.css';

export default function Topbar({ onNewProject, onSaveProject }) {
  const {
    activePanel, setActivePanel,
    aiPanelOpen, toggleAiPanel,
    codePanelOpen, toggleCodePanel,
    leftPanelOpen, toggleLeftPanel,
    theme, toggleTheme
  } = useAppStore();
  const { projectName, projectId, components, wires, firmwareCode, isDirty, isSimulating, serialConnected, setProjectName } = useCircuitStore();
  const { user, logout, setLoginModalOpen } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [forksMenuOpen, setForksMenuOpen] = useState(false);
  const [userForks, setUserForks] = useState(() => getUserForks());

  const menuRef = useRef(null);
  const forksRef = useRef(null);

  useEffect(() => {
    const handleForksUpdated = () => {
      setUserForks(getUserForks());
    };
    window.addEventListener('voltcraft_forks_updated', handleForksUpdated);
    return () => window.removeEventListener('voltcraft_forks_updated', handleForksUpdated);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (forksRef.current && !forksRef.current.contains(event.target)) {
        setForksMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getUserInitials = () => {
    if (!user?.displayName) return 'G';
    const parts = user.displayName.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return user.displayName.slice(0, 2).toUpperCase();
  };

  const handleForkCurrent = () => {
    forkProjectToEditor({
      name: projectName,
      components,
      wires,
      firmwareCode,
      author: user?.displayName || 'You',
    });
    setForksMenuOpen(false);
  };

  const handleSelectFork = (fork) => {
    loadExistingForkIntoEditor(fork);
    setForksMenuOpen(false);
  };

  const handleDeleteFork = (forkId, e) => {
    e.stopPropagation();
    deleteUserFork(forkId);
    setUserForks(getUserForks());
    toast.success('Fork removed');
  };

  return (
    <header className="topbar">
      {/* Logo */}
      <div className="topbar-logo" onClick={() => setActivePanel('dashboard')} style={{ cursor: 'pointer' }}>
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

      {/* Project Name & Forks Quick Switcher (Editor Mode) */}
      {activePanel === 'editor' && (
        <div className="topbar-project-container">
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
              <button className="project-name-btn" onClick={handleNameClick} title="Click to rename circuit">
                <span className="project-name-text">{projectName}</span>
                {isDirty && <span className="dirty-dot" title="Unsaved changes" />}
              </button>
            )}
          </div>

          {/* Forks Quick Switcher Dropdown */}
          <div className="topbar-forks-container" ref={forksRef}>
            <button
              className={`topbar-forks-pill ${forksMenuOpen ? 'active' : ''}`}
              onClick={() => setForksMenuOpen(v => !v)}
              title="View existing circuit forks or branch current circuit"
            >
              <GitFork size={13} className="forks-pill-icon" />
              <span>Forks</span>
              <span className="forks-count-tag">{userForks.length}</span>
              <ChevronDown size={11} className={`forks-pill-arrow ${forksMenuOpen ? 'open' : ''}`} />
            </button>

            {forksMenuOpen && (
              <div className="topbar-forks-dropdown card animate-fadeIn">
                <div className="forks-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GitFork size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      Circuit Forks ({userForks.length})
                    </span>
                  </div>
                  <button className="btn-fork-now" onClick={handleForkCurrent} title="Create a new fork of current canvas">
                    <Plus size={12} />
                    <span>Fork Current</span>
                  </button>
                </div>

                <div className="forks-dropdown-list">
                  {userForks.length === 0 ? (
                    <div className="forks-empty-notice">
                      <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--text-muted)' }}>
                        No forks created yet.
                      </p>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: 11, padding: '4px 10px', width: '100%' }}
                        onClick={() => { setForksMenuOpen(false); setActivePanel('community'); }}
                      >
                        Explore Community Circuits
                      </button>
                    </div>
                  ) : (
                    userForks.map(f => {
                      const isActive = projectId === f.id;
                      return (
                        <div
                          key={f.id}
                          className={`fork-item-row ${isActive ? 'active-fork' : ''}`}
                          onClick={() => handleSelectFork(f)}
                          title={`Click to load "${f.name}" into editor`}
                        >
                          <div className="fork-item-icon">
                            <GitFork size={13} />
                          </div>
                          <div className="fork-item-info">
                            <div className="fork-item-name-row">
                              <span className="fork-item-name">{f.name}</span>
                              {isActive && (
                                <span className="fork-active-badge">Active</span>
                              )}
                            </div>
                            <div className="fork-item-sub">
                              <span>{f.targetMcu || 'MCU'}</span>
                              <span>·</span>
                              <span>{f.componentsCount || f.components?.length || 0} parts</span>
                              {f.forkedFrom && (
                                <>
                                  <span>·</span>
                                  <span style={{ color: 'var(--accent-cyan)' }}>from {f.forkedFrom}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            className="fork-delete-btn"
                            onClick={(e) => handleDeleteFork(f.id, e)}
                            title="Delete this fork"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="forks-dropdown-footer">
                  <button
                    className="forks-footer-btn"
                    onClick={() => { setForksMenuOpen(false); setActivePanel('community'); }}
                  >
                    <span>Browse All Community Designs</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            )}
          </div>
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
        <button
          className="btn-icon topbar-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Auth / Profile */}
        <div className="user-profile-wrapper" ref={menuRef} style={{ position: 'relative' }}>
          {user ? (
            <div
              className="topbar-avatar"
              onClick={() => setUserMenuOpen(s => !s)}
              title={user.displayName || user.email}
              style={{ cursor: 'pointer' }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="topbar-avatar-img"
                  referrerPolicy="no-referrer"
                />
              ) : (
                getUserInitials()
              )}
            </div>
          ) : (
            <button
              className="btn-primary topbar-btn auth-cta-btn"
              onClick={() => setLoginModalOpen(true)}
              style={{ gap: 6, padding: '6px 14px' }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* User Popover Menu */}
          {userMenuOpen && user && (
            <div className="user-dropdown-menu card animate-fadeIn">
              <div className="dropdown-user-info">
                <div className="dropdown-name">{user.displayName || 'Maker'}</div>
                <div className="dropdown-email">{user.email}</div>
                {user.isAnonymous && <span className="badge badge-amber mt-1">Guest Account</span>}
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => { setActivePanel('dashboard'); setUserMenuOpen(false); }}
              >
                <LayoutDashboard size={14} />
                <span>Dashboard &amp; Gallery</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => { setActivePanel('community'); setUserMenuOpen(false); }}
              >
                <Users size={14} />
                <span>Community &amp; Forks</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item text-danger"
                onClick={() => { logout(); setUserMenuOpen(false); }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
