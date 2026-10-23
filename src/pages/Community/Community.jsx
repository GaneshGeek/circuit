import React, { useState } from 'react';
import {
  Search, Star, GitFork, Eye, Filter, TrendingUp, Clock,
  Tag, Plus, Upload, Users, Globe, Lock, Share2, Cpu,
  CircuitBoard, Heart, MessageCircle
} from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import './Community.css';

const COMMUNITY_PROJECTS = [
  {
    id: 1, name: 'Smart Irrigation System', author: 'iot_maker_raj',
    desc: 'Automated plant watering using soil moisture sensor, servo valve, and ESP32 with Blynk IoT dashboard',
    tags: ['esp32', 'iot', 'soil', 'servo', 'wifi'], stars: 1247, forks: 342, views: 8930,
    components: 8, wires: 12, category: 'IoT',
    featured: true, verified: true,
  },
  {
    id: 2, name: 'Arduino MIDI Synthesizer', author: 'audio_circuits',
    desc: 'Full MIDI-compatible synthesizer with waveform generation, ADSR envelope, and 8 simultaneous voices',
    tags: ['arduino', 'audio', 'pwm', 'midi'], stars: 892, forks: 201, views: 5430,
    components: 12, wires: 18, category: 'Audio',
    featured: false, verified: true,
  },
  {
    id: 3, name: 'Gesture Controlled Robot', author: 'robo_ganesh',
    desc: 'MPU6050 accelerometer glove controls DC motors via NRF24L01 wireless, with obstacle avoidance',
    tags: ['arduino', 'robotics', 'imu', 'wireless'], stars: 678, forks: 189, views: 4120,
    components: 11, wires: 16, category: 'Robotics',
    featured: false, verified: false,
  },
  {
    id: 4, name: 'ESP32 Air Quality Monitor', author: 'enviro_tech',
    desc: 'Real-time air quality monitoring with MQ135, BMP280, DHT22, and live OLED dashboard',
    tags: ['esp32', 'sensors', 'oled', 'iot'], stars: 543, forks: 167, views: 3200,
    components: 7, wires: 10, category: 'Environmental',
    featured: false, verified: true,
  },
  {
    id: 5, name: 'CNC Plotter Machine', author: 'maker_lab_vk',
    desc: '2-axis pen plotter using 28BYJ-48 stepper motors and Raspberry Pi Pico with G-code interpreter',
    tags: ['pico', 'stepper', 'cnc', 'mechanical'], stars: 1089, forks: 445, views: 12000,
    components: 6, wires: 9, category: 'Mechanical',
    featured: true, verified: false,
  },
  {
    id: 6, name: 'Bluetooth Speed Meter', author: 'embedded_dev',
    desc: 'Hall effect sensor + HC-05 Bluetooth sends real-time RPM data to Android app',
    tags: ['arduino', 'bluetooth', 'sensor'], stars: 334, forks: 98, views: 2100,
    components: 5, wires: 7, category: 'Measurement',
    featured: false, verified: false,
  },
];

const CATEGORIES = ['All', 'IoT', 'Robotics', 'Audio', 'Environmental', 'Mechanical', 'Measurement', 'Display'];
const SORT_OPTIONS = ['Most Stars', 'Most Forks', 'Most Recent', 'Most Viewed'];

export default function Community() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Stars');
  const [activeTab, setActiveTab] = useState('explore'); // explore | my-projects | org

  const { setActivePanel } = useAppStore();
  const { newProject, setProjectName } = useCircuitStore();

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
      return b.id - a.id;
    });

  const handleFork = (project) => {
    newProject();
    setProjectName(`Fork of ${project.name}`);
    setActivePanel('editor');
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
          Publish Project
        </button>
      </div>

      {/* Tabs */}
      <div className="community-tabs">
        {[
          { id: 'explore', label: 'Explore', icon: Globe },
          { id: 'my-projects', label: 'My Projects', icon: CircuitBoard },
          { id: 'org', label: 'Organizations', icon: Users },
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

      {/* Featured banner */}
      {activeTab === 'explore' && (
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
                  Fork
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <span><GitFork size={13} /> 48,230 total forks</span>
        <span><Star size={13} /> Free forever · No credits</span>
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
              <span><Cpu size={11} /> {p.components} components</span>
              <span>·</span>
              <span>{p.wires} wires</span>
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
    </div>
  );
}
