import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Filter, Play, ExternalLink, Cpu, GitBranch,
  Star, Trash2, Copy, Sparkles, LayoutGrid, List, CheckCircle2,
  Activity, Edit3, MoreVertical, Cloud, FolderOpen, GitFork
} from 'lucide-react';
import CircuitThumbnail from './CircuitThumbnail';
import StatusBadge from './StatusBadge';
import { useAppStore, useCircuitStore } from '../../store/store';
import { useAuth } from '../../context/AuthContext';
import { updateProjectStatusInCloud, deleteProjectFromCloud } from '../../firebase/projects';
import { PRESET_PROJECTS } from '../../utils/circuitEngine';
import { forkProjectToEditor, getUserForks } from '../../utils/forkManager';
import { toast } from 'react-hot-toast';
import './ProjectGallery.css';

// Default enriched gallery projects with realistic layouts and diverse statuses
export const DEFAULT_GALLERY_PROJECTS = [
  {
    id: 'proj_weather_station',
    presetId: 'weather-station-oled',
    name: 'Smart Home Weather Station',
    desc: 'DHT22 temperature & humidity monitoring with OLED display and MQTT reporting.',
    status: 'Simulating',
    starred: true,
    targetMcu: 'ESP32',
    tags: ['esp32', 'iot', 'sensors', 'oled'],
    componentsCount: 6,
    wiresCount: 8,
    updatedAt: '20 minutes ago',
  },
  {
    id: 'proj_line_robot',
    presetId: 'servo-potentiometer',
    name: 'Line Following Autonomous Robot',
    desc: 'L298N dual H-bridge motor driver with IR reflectance line tracking array.',
    status: 'Completed',
    starred: false,
    targetMcu: 'Arduino Uno',
    tags: ['arduino', 'robotics', 'motor', 'pwm'],
    componentsCount: 9,
    wiresCount: 14,
    updatedAt: '1 day ago',
  },
  {
    id: 'proj_matrix_display',
    presetId: 'button-led-toggle',
    name: 'MAX7219 LED Matrix Visualizer',
    desc: 'Cascaded 8x8 dot matrix display controlled via SPI bus with animation sketch.',
    status: 'Draft',
    starred: true,
    targetMcu: 'Arduino Uno',
    tags: ['led', 'matrix', 'spi', 'graphics'],
    componentsCount: 4,
    wiresCount: 6,
    updatedAt: '3 days ago',
  },
  {
    id: 'proj_plant_irrigation',
    presetId: 'plant-watering',
    name: 'Automated Plant Watering System',
    desc: 'Capacitive soil moisture threshold detector driving a 5V relay irrigation valve.',
    status: 'Completed',
    starred: false,
    targetMcu: 'Arduino Uno',
    tags: ['soil', 'relay', 'automation', 'green-tech'],
    componentsCount: 5,
    wiresCount: 8,
    updatedAt: '4 days ago',
  },
  {
    id: 'proj_pir_alarm',
    presetId: 'pir-security-alarm',
    name: 'PIR Intruder Motion Siren',
    desc: 'Dual-element pyroelectric sensor triggering piezo alert buzzer and strobe warning.',
    status: 'Simulating',
    starred: false,
    targetMcu: 'Arduino Uno',
    tags: ['pir', 'buzzer', 'security', 'gpio'],
    componentsCount: 5,
    wiresCount: 7,
    updatedAt: '1 week ago',
  },
];

export default function ProjectGallery({ cloudProjects = [], onRefreshCloud }) {
  const { setActivePanel } = useAppStore();
  const { newProject, loadPresetProject, setProjectName, startSimulation } = useCircuitStore();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [localProjects, setLocalProjects] = useState(() => {
    const saved = localStorage.getItem('voltcraft_gallery_custom');
    return saved ? JSON.parse(saved) : DEFAULT_GALLERY_PROJECTS;
  });

  // Listen to forks creation or deletion
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('voltcraft_gallery_custom');
      if (saved) setLocalProjects(JSON.parse(saved));
    };
    window.addEventListener('voltcraft_forks_updated', handleSync);
    return () => window.removeEventListener('voltcraft_forks_updated', handleSync);
  }, []);

  // Combine user's cloud projects with local gallery projects
  const allProjects = useMemo(() => {
    const mappedCloud = cloudProjects.map(cp => ({
      ...cp,
      isCloud: true,
      status: cp.status || 'Draft',
      componentsCount: cp.components?.length || 0,
      wiresCount: cp.wires?.length || 0,
      targetMcu: cp.components?.find(c => (c.defId || c.id || '').includes('esp32'))
        ? 'ESP32'
        : cp.components?.find(c => (c.defId || c.id || '').includes('pico'))
        ? 'RP2040'
        : 'Arduino Uno',
      tags: cp.tags || ['custom', 'circuit'],
      updatedAt: cp.updatedAt ? new Date(cp.updatedAt).toLocaleDateString() : 'Recently',
    }));

    // Avoid duplicates if same ID exists
    const cloudIds = new Set(mappedCloud.map(c => c.id));
    const nonDuplicatedLocal = localProjects.filter(lp => !cloudIds.has(lp.id));
    return [...mappedCloud, ...nonDuplicatedLocal];
  }, [cloudProjects, localProjects]);

  // Filter projects by status and search query
  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchSearch) return false;

      if (selectedStatus === 'ALL') return true;
      if (selectedStatus === 'CLOUD') return p.isCloud;
      if (selectedStatus === 'FORKS') return Boolean(p.isFork || p.name.startsWith('Fork of '));
      return p.status === selectedStatus;
    });
  }, [allProjects, searchQuery, selectedStatus]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: allProjects.length,
      draft: allProjects.filter(p => p.status === 'Draft').length,
      simulating: allProjects.filter(p => p.status === 'Simulating').length,
      completed: allProjects.filter(p => p.status === 'Completed').length,
      cloud: allProjects.filter(p => p.isCloud).length,
      forks: allProjects.filter(p => p.isFork || p.name.startsWith('Fork of ')).length,
    };
  }, [allProjects]);

  // Handle changing status on any project
  const handleStatusChange = async (projectId, newStatus) => {
    // 1. Update local state
    setLocalProjects(prev => {
      const updated = prev.map(p => (p.id === projectId ? { ...p, status: newStatus } : p));
      localStorage.setItem('voltcraft_gallery_custom', JSON.stringify(updated));
      return updated;
    });

    // 2. If it is a cloud project, update Firestore
    const target = allProjects.find(p => p.id === projectId);
    if (target?.isCloud && user) {
      try {
        await updateProjectStatusInCloud(projectId, newStatus);
        if (onRefreshCloud) onRefreshCloud();
      } catch (err) {
        console.warn('Error updating status in cloud:', err);
      }
    }

    toast.success(`Circuit marked as ${newStatus}`);
  };

  // Open circuit in editor
  const handleOpenCircuit = (project) => {
    if (project.presetId) {
      loadPresetProject(project.presetId);
    } else if (project.components && project.components.length > 0) {
      useCircuitStore.setState({
        projectId: project.id,
        projectName: project.name,
        projectStatus: project.status || 'Draft',
        components: project.components || [],
        wires: project.wires || [],
        firmwareCode: project.firmwareCode || '',
        isDirty: false,
      });
    } else {
      newProject();
      setProjectName(project.name);
    }
    setActivePanel('editor');
  };

  // Open circuit and immediately start simulation
  const handleSimulateCircuit = (project, e) => {
    e.stopPropagation();
    handleOpenCircuit(project);
    setTimeout(() => {
      startSimulation();
      toast.success(`Started live simulation for ${project.name}! ⚡`);
    }, 150);
  };

  // Fork circuit into editor
  const handleForkCircuit = (project, e) => {
    e.stopPropagation();
    forkProjectToEditor(project);
  };

  // Create new project
  const handleCreateNew = () => {
    newProject();
    setActivePanel('editor');
  };

  // Clone/Duplicate circuit
  const handleDuplicate = (project, e) => {
    e.stopPropagation();
    const cloned = {
      ...project,
      id: `proj_${Date.now()}`,
      name: `${project.name} (Copy)`,
      status: 'Draft',
      isCloud: false,
      updatedAt: 'Just now',
    };
    setLocalProjects(prev => {
      const next = [cloned, ...prev];
      localStorage.setItem('voltcraft_gallery_custom', JSON.stringify(next));
      return next;
    });
    toast.success(`Cloned ${project.name} as a new Draft`);
  };

  // Delete circuit
  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    const target = allProjects.find(p => p.id === projectId);
    if (target?.isCloud && user) {
      try {
        await deleteProjectFromCloud(projectId);
        if (onRefreshCloud) onRefreshCloud();
      } catch (err) {
        console.warn('Could not delete from cloud:', err);
      }
    }
    setLocalProjects(prev => {
      const filtered = prev.filter(p => p.id !== projectId);
      localStorage.setItem('voltcraft_gallery_custom', JSON.stringify(filtered));
      return filtered;
    });
    toast.success('Circuit removed from gallery');
  };

  return (
    <section className="project-gallery">
      {/* Gallery Header */}
      <div className="gallery-header">
        <div className="gallery-title-group">
          <div className="gallery-badge">
            <Sparkles size={12} />
            <span>CIRCUIT WORKBENCH</span>
          </div>
          <h2 className="gallery-title">Project Gallery</h2>
          <p className="gallery-subtitle">
            Visual thumbnail catalog of your electronics schematics, simulations, and hardware sketches.
          </p>
        </div>

        <div className="gallery-header-actions">
          <button className="btn-primary" onClick={handleCreateNew}>
            <Plus size={16} />
            <span>New Circuit</span>
          </button>
        </div>
      </div>

      {/* Gallery Toolbar: Search, Filters & View Mode */}
      <div className="gallery-toolbar">
        {/* Search */}
        <div className="gallery-search-box">
          <Search size={15} className="gallery-search-icon" />
          <input
            type="text"
            className="gallery-search-input"
            placeholder="Search circuits by name, tags, or components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="gallery-status-filters">
          <button
            className={`gallery-filter-pill ${selectedStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('ALL')}
          >
            <span>All Circuits</span>
            <span className="filter-count">{counts.all}</span>
          </button>

          {counts.forks > 0 && (
            <button
              className={`gallery-filter-pill ${selectedStatus === 'FORKS' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('FORKS')}
              style={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}
            >
              <GitFork size={12} />
              <span>Forks</span>
              <span className="filter-count" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
                {counts.forks}
              </span>
            </button>
          )}

          <button
            className={`gallery-filter-pill completed ${selectedStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Completed')}
          >
            <CheckCircle2 size={12} />
            <span>Completed</span>
            <span className="filter-count">{counts.completed}</span>
          </button>

          <button
            className={`gallery-filter-pill simulating ${selectedStatus === 'Simulating' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Simulating')}
          >
            <Activity size={12} />
            <span>Simulating</span>
            <span className="filter-count">{counts.simulating}</span>
          </button>

          <button
            className={`gallery-filter-pill draft ${selectedStatus === 'Draft' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Draft')}
          >
            <Edit3 size={12} />
            <span>Draft</span>
            <span className="filter-count">{counts.draft}</span>
          </button>

          {user && counts.cloud > 0 && (
            <button
              className={`gallery-filter-pill cloud ${selectedStatus === 'CLOUD' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('CLOUD')}
            >
              <Cloud size={12} />
              <span>Cloud Synced</span>
              <span className="filter-count">{counts.cloud}</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="gallery-view-mode">
          <button
            className={`gallery-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            className={`gallery-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid or List */}
      {filteredProjects.length === 0 ? (
        <div className="gallery-empty-state card">
          <FolderOpen size={40} className="empty-icon" />
          <h3 className="empty-title">No circuits matched your filter</h3>
          <p className="empty-desc">
            Try clearing your search query or selecting a different status filter above.
          </p>
          <button className="btn-secondary" onClick={() => { setSelectedStatus('ALL'); setSearchQuery(''); }}>
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="gallery-grid">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="gallery-card card"
              onClick={() => handleOpenCircuit(proj)}
            >
              {/* Visual Thumbnail */}
              <div className="gallery-card-thumb">
                <CircuitThumbnail project={proj} status={proj.status} />

                {/* Overlaid Status Badge with interactive menu */}
                <div className="thumb-status-overlay">
                  <StatusBadge
                    status={proj.status || 'Draft'}
                    onStatusChange={newStatus => handleStatusChange(proj.id, newStatus)}
                  />
                </div>

                {/* Overlaid Cloud indicator */}
                {proj.isCloud && (
                  <div className="thumb-cloud-badge" title="Saved to Google Cloud">
                    <Cloud size={11} />
                    <span>Cloud</span>
                  </div>
                )}

                {/* Overlaid Forked indicator */}
                {(proj.isFork || proj.name.startsWith('Fork of ')) && (
                  <div className="thumb-cloud-badge" style={{ left: 10, right: 'auto', background: 'rgba(99, 102, 241, 0.85)', color: '#fff' }} title="Forked circuit">
                    <GitFork size={11} />
                    <span>Fork</span>
                  </div>
                )}

                {/* Hover Quick Actions */}
                <div className="thumb-quick-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="thumb-action-btn simulate"
                    onClick={e => handleSimulateCircuit(proj, e)}
                    title="Run live simulation"
                  >
                    <Play size={13} fill="#06b6d4" />
                    <span>Simulate</span>
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="gallery-card-body">
                <div className="gallery-card-header">
                  <h3 className="gallery-card-title">{proj.name}</h3>
                  <div className="gallery-card-options" onClick={e => e.stopPropagation()}>
                    <button
                      className="card-mini-btn"
                      onClick={e => handleDuplicate(proj, e)}
                      title="Duplicate circuit"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      className="card-mini-btn danger"
                      onClick={e => handleDelete(proj.id, e)}
                      title="Delete circuit"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="gallery-card-desc">{proj.desc || 'Custom circuit schematic and firmware sketch.'}</p>

                {/* Specs Pill Row */}
                <div className="gallery-card-specs">
                  <span className="spec-item" title="Hardware Components">
                    <Cpu size={12} />
                    <span>{proj.componentsCount || proj.components?.length || 0} components</span>
                  </span>
                  <span className="spec-dot">·</span>
                  <span className="spec-item" title="Interconnecting Wires">
                    <GitBranch size={12} />
                    <span>{proj.wiresCount || proj.wires?.length || 0} wires</span>
                  </span>
                  <span className="spec-dot">·</span>
                  <span className="spec-mcu">{proj.targetMcu || 'MCU'}</span>
                </div>

                {/* Tags */}
                {proj.tags && proj.tags.length > 0 && (
                  <div className="gallery-card-tags">
                    {proj.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="badge badge-primary" style={{ fontSize: 9.5 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Footer */}
                <div className="gallery-card-footer">
                  <span className="gallery-card-time">{proj.updatedAt}</span>
                  <div className="gallery-card-actions" onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-card-open"
                      onClick={e => handleForkCircuit(proj, e)}
                      title="Fork this circuit into editor"
                      style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}
                    >
                      <GitFork size={12} />
                      <span>Fork</span>
                    </button>
                    <button
                      className="btn-card-open"
                      onClick={() => handleOpenCircuit(proj)}
                      title="Open in editor"
                    >
                      <span>Open</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="gallery-list-view">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="gallery-list-row card"
              onClick={() => handleOpenCircuit(proj)}
            >
              {/* Mini Thumbnail */}
              <div className="list-thumb-wrapper">
                <CircuitThumbnail project={proj} status={proj.status} />
              </div>

              {/* Title & Info */}
              <div className="list-info">
                <div className="list-title-row">
                  <span className="list-title">{proj.name}</span>
                  {proj.isCloud && (
                    <span className="badge badge-emerald" style={{ fontSize: 9.5 }}>
                      Cloud
                    </span>
                  )}
                  {(proj.isFork || proj.name.startsWith('Fork of ')) && (
                    <span className="badge badge-primary" style={{ fontSize: 9.5 }}>
                      Fork
                    </span>
                  )}
                </div>
                <div className="list-desc">{proj.desc}</div>
              </div>

              {/* Status Badge */}
              <div className="list-status-col" onClick={e => e.stopPropagation()}>
                <StatusBadge
                  status={proj.status || 'Draft'}
                  onStatusChange={newStatus => handleStatusChange(proj.id, newStatus)}
                />
              </div>

              {/* Specs */}
              <div className="list-specs-col">
                <span>{proj.componentsCount || proj.components?.length || 0} parts</span>
                <span>·</span>
                <span>{proj.wiresCount || proj.wires?.length || 0} wires</span>
                <span>·</span>
                <span className="spec-mcu">{proj.targetMcu}</span>
              </div>

              {/* Actions */}
              <div className="list-actions-col" onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6 }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: 12 }}
                  onClick={e => handleForkCircuit(proj, e)}
                  title="Fork circuit"
                >
                  <GitFork size={12} />
                  <span>Fork</span>
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={e => handleSimulateCircuit(proj, e)}
                  title="Simulate immediately"
                >
                  <Play size={12} fill="#06b6d4" />
                  <span>Simulate</span>
                </button>
                <button
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => handleOpenCircuit(proj)}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
