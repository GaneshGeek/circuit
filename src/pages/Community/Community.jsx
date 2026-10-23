import React, { useState, useEffect } from 'react';
import {
  Search, Star, GitFork, Eye, Filter, TrendingUp, Clock,
  Tag, Plus, Upload, Users, Globe, Lock, Share2, Cpu,
  CircuitBoard, Heart, MessageCircle, Play, ExternalLink, Trash2
} from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import { forkProjectToEditor, getUserForks, loadExistingForkIntoEditor, deleteUserFork } from '../../utils/forkManager';
import { toast } from 'react-hot-toast';
import './Community.css';

const COMMUNITY_PROJECTS = [
  {
    id: 'comm_irrigation',
    name: 'Smart Irrigation System',
    author: 'iot_maker_raj',
    desc: 'Automated plant watering using soil moisture sensor, servo valve, and ESP32 with live status monitoring',
    tags: ['esp32', 'iot', 'soil', 'servo', 'relay'],
    stars: 1247,
    forks: 342,
    views: 8930,
    category: 'IoT',
    targetMcu: 'ESP32',
    componentIds: ['esp32', 'soil-moisture', 'relay', 'servo', 'led'],
    featured: true,
    verified: true,
  },
  {
    id: 'comm_midi_synth',
    name: 'Arduino MIDI Synthesizer',
    author: 'audio_circuits',
    desc: 'Full 8-tone audio generator with potentiometer pitch, push button triggers, and passive buzzer output',
    tags: ['arduino', 'audio', 'pwm', 'midi'],
    stars: 892,
    forks: 201,
    views: 5430,
    category: 'Audio',
    targetMcu: 'Arduino Uno',
    componentIds: ['arduino-uno', 'buzzer', 'potentiometer', 'push-button', 'resistor', 'led'],
    featured: false,
    verified: true,
  },
  {
    id: 'comm_gesture_robot',
    name: 'Gesture Controlled Robot',
    author: 'robo_ganesh',
    desc: 'MPU-6050 accelerometer orientation tracker driving dual DC motors via L298N H-bridge driver',
    tags: ['arduino', 'robotics', 'imu', 'motor'],
    stars: 678,
    forks: 189,
    views: 4120,
    category: 'Robotics',
    targetMcu: 'Arduino Uno',
    componentIds: ['arduino-uno', 'mpu6050', 'dc-motor', 'l298n', 'buzzer'],
    featured: false,
    verified: false,
  },
  {
    id: 'comm_air_monitor',
    name: 'ESP32 Air Quality Station',
    author: 'enviro_tech',
    desc: 'Real-time air quality monitoring with MQ-2 smoke/gas detector, BME280 sensor, and SSD1306 OLED screen',
    tags: ['esp32', 'bme280', 'mq2', 'oled'],
    stars: 543,
    forks: 167,
    views: 3200,
    category: 'Environmental',
    targetMcu: 'ESP32',
    componentIds: ['esp32', 'bme280', 'mq2-gas', 'oled-128x64'],
    featured: false,
    verified: true,
  },
  {
    id: 'comm_cnc_plotter',
    name: 'CNC Plotter Machine',
    author: 'maker_lab_vk',
    desc: '2-axis stepper precision controller using 28BYJ-48 stepper motor and Raspberry Pi Pico',
    tags: ['rp2040', 'stepper', 'cnc', 'mechanical'],
    stars: 1089,
    forks: 445,
    views: 12000,
    category: 'Mechanical',
    targetMcu: 'RP2040',
    componentIds: ['rp2040', 'stepper', 'push-button', 'resistor', 'led'],
    featured: true,
    verified: false,
  },
  {
    id: 'comm_speed_meter',
    name: 'Bluetooth Telemetry Hub',
    author: 'embedded_dev',
    desc: 'HC-05 serial Bluetooth module broadcasting ambient sensor readings to 16x2 LCD display',
    tags: ['arduino', 'bluetooth', 'lcd', 'ldr'],
    stars: 334,
    forks: 98,
    views: 2100,
    category: 'Measurement',
    targetMcu: 'Arduino Uno',
    componentIds: ['arduino-uno', 'hc-05', 'ldr', 'lcd-16x2', 'resistor'],
    featured: false,
    verified: false,
  },
];

const CATEGORIES = ['All', 'IoT', 'Robotics', 'Audio', 'Environmental', 'Mechanical', 'Measurement', 'Display'];
const SORT_OPTIONS = ['Most Stars', 'Most Forks', 'Most Recent', 'Most Viewed'];

export default function Community() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Stars');
  const [activeTab, setActiveTab] = useState('explore'); // explore | my-projects | org
  const [userForks, setUserForks] = useState(() => getUserForks());

  const { setActivePanel } = useAppStore();
  const { startSimulation } = useCircuitStore();

  useEffect(() => {
    const handleForksUpdated = () => {
      setUserForks(getUserForks());
    };
    window.addEventListener('voltcraft_forks_updated', handleForksUpdated);
    return () => window.removeEventListener('voltcraft_forks_updated', handleForksUpdated);
  }, []);

  const filtered = COMMUNITY_PROJECTS
    .filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.desc.toLowerCase().includes(search.toLowerCase()) ||
       p.tags.some(t => t.includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === 'Most Stars') return b.stars - a.stars;
      if (sortBy === 'Most Forks') return b.forks - a.forks;
      if (sortBy === 'Most Viewed') return b.views - a.views;
      return 0;
    });

  const handleFork = (project) => {
    forkProjectToEditor(project);
    setUserForks(getUserForks());
  };

  const handleOpenFork = (fork) => {
    loadExistingForkIntoEditor(fork);
  };

  const handleSimulateFork = (fork) => {
    loadExistingForkIntoEditor(fork);
    setTimeout(() => {
      startSimulation();
      toast.success(`Running simulation for ${fork.name}! ⚡`);
    }, 150);
  };

  const handleDeleteFork = (forkId, e) => {
    e.stopPropagation();
    deleteUserFork(forkId);
    setUserForks(getUserForks());
    toast.success('Fork removed');
  };

  return (
    <div className="community">
      {/* Header */}
      <div className="community-header">
        <div>
          <h1 className="community-title">
            <Globe size={24} />
            Community Hub
          </h1>
          <p className="community-subtitle">
            Discover, fork, and build on open-source circuit designs from makers worldwide
          </p>
        </div>
        <button className="btn-primary" onClick={() => setActivePanel('editor')}>
          <Upload size={15} />
          Create / Publish
        </button>
      </div>

      {/* Tabs */}
      <div className="community-tabs">
        {[
          { id: 'explore', label: 'Explore Community', icon: Globe },
          { id: 'my-projects', label: `My Forks & Projects (${userForks.length})`, icon: GitFork },
          { id: 'org', label: 'Maker Teams', icon: Users },
        ].map(t => (
          <button
            key={t.id}
            className={`comm-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: My Forks / My Projects */}
      {activeTab === 'my-projects' && (
        <div className="my-forks-section animate-fadeIn" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Your Forked Circuits ({userForks.length})
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                All circuits you have forked are saved here and readily accessible in the editor.
              </p>
            </div>
            <button className="btn-primary" onClick={() => setActiveTab('explore')} style={{ fontSize: 12 }}>
              <Plus size={14} />
              Fork More Circuits
            </button>
          </div>

          {userForks.length === 0 ? (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <GitFork size={36} style={{ color: 'var(--accent)', opacity: 0.8, margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                No forked circuits yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto 18px auto' }}>
                Browse the community designs or dashboard gallery, and click <strong>"Fork"</strong> to clone any circuit directly into your editor!
              </p>
              <button className="btn-secondary" onClick={() => setActiveTab('explore')}>
                Explore Community Circuits
              </button>
            </div>
          ) : (
            <div className="project-grid">
              {userForks.map(fork => (
                <div key={fork.id} className="community-card card" onClick={() => handleOpenFork(fork)} style={{ cursor: 'pointer' }}>
                  <div className="cc-header">
                    <div className="cc-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      <GitFork size={18} />
                    </div>
                    <div className="cc-meta">
                      <div className="cc-name">{fork.name}</div>
                      <div className="cc-author" style={{ color: '#06b6d4' }}>
                        Forked from {fork.forkedFrom || 'Community'}
                      </div>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: 10, padding: '2px 8px' }}>Fork</span>
                  </div>

                  <p className="cc-desc">{fork.desc || 'Custom forked schematic with components and firmware.'}</p>

                  <div className="cc-tags">
                    {(fork.tags || ['fork', 'circuit']).map(t => (
                      <span key={t} className="badge badge-cyan" style={{ fontSize: 9 }}>{t}</span>
                    ))}
                  </div>

                  <div className="cc-circuit-info">
                    <span><Cpu size={11} /> {fork.componentsCount || fork.components?.length || 0} parts</span>
                    <span>·</span>
                    <span>{fork.wiresCount || fork.wires?.length || 0} wires</span>
                    <span className="cc-category">{fork.targetMcu || 'MCU'}</span>
                  </div>

                  <div className="cc-actions" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => handleSimulateFork(fork)}
                        title="Open and run simulation"
                      >
                        <Play size={11} fill="#06b6d4" />
                        Simulate
                      </button>
                      <button
                        className="btn-primary"
                        style={{ fontSize: 11, padding: '5px 14px' }}
                        onClick={() => handleOpenFork(fork)}
                      >
                        <ExternalLink size={11} />
                        Open in Editor
                      </button>
                    </div>
                    <button
                      className="btn-icon danger"
                      style={{ width: 28, height: 28 }}
                      onClick={e => handleDeleteFork(fork.id, e)}
                      title="Delete this fork"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Organizations */}
      {activeTab === 'org' && (
        <div className="card animate-fadeIn" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: 32 }}>
          <Users size={36} style={{ color: '#06b6d4', margin: '0 auto 12px auto' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Maker Organizations &amp; Labs
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 20px auto' }}>
            Collaborate on open hardware repositories with university labs, robotics clubs, and maker communities.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <span className="badge badge-primary">Stanford Robotics</span>
            <span className="badge badge-emerald">OpenHW Initiative</span>
            <span className="badge badge-cyan">Maker Faire Creators</span>
          </div>
        </div>
      )}

      {/* Tab: Explore */}
      {activeTab === 'explore' && (
        <>
          {/* Featured banner */}
          <div className="featured-banner">
            <div className="featured-label"><TrendingUp size={13} /> Featured this week</div>
            <div className="featured-projects">
              {COMMUNITY_PROJECTS.filter(p => p.featured).map(p => (
                <div key={p.id} className="featured-card card">
                  <div className="featured-icon">
                    <CircuitBoard size={20} />
                  </div>
                  <div>
                    <div className="featured-name">{p.name}</div>
                    <div className="featured-author">by @{p.author}</div>
                  </div>
                  <div className="featured-stats">
                    <span><Star size={12} /> {p.stars.toLocaleString()}</span>
                    <span><GitFork size={12} /> {p.forks}</span>
                  </div>
                  <button className="btn-secondary" style={{ fontSize: 12, padding: '5px 14px' }} onClick={() => handleFork(p)}>
                    <GitFork size={12} />
                    Fork
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="community-filters">
            <div className="search-wrapper" style={{ flex: 1, padding: 0 }}>
              <Search size={15} className="search-icon" style={{ top: '50%', left: 14 }} />
              <input
                className="search-input"
                placeholder="Search circuits, components, authors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input"
              style={{ width: 160, fontSize: 13 }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Category pills */}
          <div className="category-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="community-stats-row">
            <span><Globe size={13} /> {COMMUNITY_PROJECTS.length.toLocaleString()} public projects</span>
            <span><Users size={13} /> 12,450 makers</span>
            <span><GitFork size={13} /> {userForks.length > 0 ? `${userForks.length} forked by you` : '48,230 total forks'}</span>
            <span><Star size={13} /> Free open-source circuits</span>
          </div>

          {/* Project grid */}
          <div className="project-grid">
            {filtered.map(p => (
              <div key={p.id} className="community-card card">
                {/* Card header */}
                <div className="cc-header">
                  <div className="cc-icon">
                    <CircuitBoard size={18} />
                  </div>
                  <div className="cc-meta">
                    <div className="cc-name">{p.name}</div>
                    <div className="cc-author">by @{p.author}</div>
                  </div>
                  {p.verified && <span className="verified-badge">✓</span>}
                </div>

                {/* Description */}
                <p className="cc-desc">{p.desc}</p>

                {/* Tags */}
                <div className="cc-tags">
                  {p.tags.slice(0, 4).map(t => (
                    <span key={t} className="badge badge-cyan" style={{ fontSize: 9 }}>{t}</span>
                  ))}
                </div>

                {/* Component info */}
                <div className="cc-circuit-info">
                  <span><Cpu size={11} /> {p.componentIds ? p.componentIds.length : p.components} components</span>
                  <span>·</span>
                  <span>{p.targetMcu || 'MCU'}</span>
                  <span className="cc-category">{p.category}</span>
                </div>

                {/* Actions */}
                <div className="cc-actions">
                  <div className="cc-stats">
                    <span><Star size={12} /> {p.stars.toLocaleString()}</span>
                    <span><GitFork size={12} /> {p.forks}</span>
                    <span><Eye size={12} /> {p.views.toLocaleString()}</span>
                  </div>
                  <button className="btn-primary" style={{ fontSize: 11, padding: '5px 14px' }} onClick={() => handleFork(p)}>
                    <GitFork size={12} />
                    Fork
                  </button>
                </div>
              </div>
            ))}

            {/* Publish CTA */}
            <div className="publish-card card" onClick={() => setActivePanel('editor')}>
              <div className="publish-icon"><Upload size={28} /></div>
              <div className="publish-title">Share Your Design</div>
              <p className="publish-desc">Publish your circuit to the community. Help other makers build amazing things.</p>
              <button className="btn-primary" style={{ marginTop: 16 }}>
                <Plus size={15} />
                New Project
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
