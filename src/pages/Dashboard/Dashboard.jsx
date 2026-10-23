import React, { useState } from 'react';
import {
  Plus, Folder, Clock, Star, Users, Zap, ArrowRight,
  CircuitBoard, Cpu, GitFork, Eye, ChevronRight, TrendingUp
} from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import './Dashboard.css';

const SAMPLE_PROJECTS = [
  { id: 1, name: 'Smart Home Weather Station', desc: 'DHT22 + BMP280 + OLED display with MQTT reporting', components: 6, wires: 8, starred: true, updated: '2h ago', tags: ['esp32', 'iot', 'sensors'] },
  { id: 2, name: 'Line Following Robot', desc: 'L298N motor driver with IR sensors and PID control', components: 9, wires: 14, starred: false, updated: '1d ago', tags: ['arduino', 'robotics', 'motor'] },
  { id: 3, name: 'LED Matrix Display', desc: 'MAX7219 8x8 LED matrix controlled via SPI', components: 4, wires: 6, starred: true, updated: '3d ago', tags: ['led', 'matrix', 'spi'] },
];

const STATS = [
  { label: 'Projects', value: '3', icon: Folder, color: '#6366f1' },
  { label: 'Components Used', value: '47', icon: Cpu, color: '#06b6d4' },
  { label: 'Community Forks', value: '12', icon: GitFork, color: '#10b981' },
  { label: 'Stars Received', value: '89', icon: Star, color: '#f59e0b' },
];

const TRENDING = [
  { name: 'Arduino Mega Weather Monitor', author: 'rahul_dev', forks: 234, stars: 891, tags: ['sensors', 'display'] },
  { name: 'ESP32 Plant Watering Bot', author: 'iot_ganesh', forks: 156, stars: 672, tags: ['esp32', 'servo', 'soil'] },
  { name: 'Raspberry Pico Synthesizer', author: 'synth_lab', forks: 98, stars: 445, tags: ['audio', 'pico', 'music'] },
];

export default function Dashboard() {
  const { setActivePanel } = useAppStore();
  const { newProject, setProjectName } = useCircuitStore();

  const handleNewProject = (name = 'Untitled Project') => {
    newProject();
    setProjectName(name);
    setActivePanel('editor');
  };

  return (
    <div className="dashboard">
      {/* Hero */}
      <div className="dash-hero">
        <div className="dash-hero-content">
          <div className="dash-greeting">
            <span>👋</span> Welcome back, <span className="glow-text">Ganesh</span>
          </div>
          <h1 className="dash-title">
            Design, Simulate &amp; Deploy
            <br />
            <span className="glow-cyan">Electronics in the Browser</span>
          </h1>
          <p className="dash-subtitle">
            100% free platform · AI-powered wiring · Live simulation · Direct hardware flashing via Web Serial
          </p>
          <div className="dash-cta">
            <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => handleNewProject()}>
              <Plus size={18} />
              New Project
            </button>
            <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: 15 }} onClick={() => setActivePanel('community')}>
              <Eye size={16} />
              Browse Community
            </button>
          </div>
        </div>
        <div className="dash-hero-visual">
          <div className="hero-circuit">
            {['Arduino Uno', 'DHT11', 'LCD 16x2', 'HC-SR04', 'LED', 'Servo'].map((name, i) => (
              <div
                key={i}
                className="hero-chip"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  '--chip-color': ['#6366f1','#06b6d4','#10b981','#8b5cf6','#f59e0b','#ef4444'][i],
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {STATS.map(stat => (
          <div key={stat.label} className="stat-card card">
            <div className="stat-icon" style={{ background: stat.color + '22', color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-main">
        {/* Recent Projects */}
        <div className="dash-section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={16} />
              Recent Projects
            </h2>
            <button className="btn-ghost" onClick={() => handleNewProject()}>
              <Plus size={14} /> New
            </button>
          </div>

          <div className="project-list">
            {SAMPLE_PROJECTS.map(p => (
              <div key={p.id} className="project-card card" onClick={() => setActivePanel('editor')}>
                <div className="project-icon">
                  <CircuitBoard size={22} />
                </div>
                <div className="project-info">
                  <div className="project-header">
                    <span className="project-name">{p.name}</span>
                    {p.starred && <Star size={13} className="project-star" />}
                  </div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-meta">
                    <span><Cpu size={11} /> {p.components} components</span>
                    <span>·</span>
                    <span>{p.wires} wires</span>
                    <span>·</span>
                    <span>{p.updated}</span>
                  </div>
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="badge badge-primary" style={{ fontSize: 9 }}>{t}</span>)}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            ))}

            {/* New project card */}
            <div className="project-card card new-card" onClick={() => handleNewProject()}>
              <div className="new-card-icon">
                <Plus size={24} />
              </div>
              <span>Start New Project</span>
            </div>
          </div>
        </div>

        {/* Trending Community */}
        <div className="dash-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={16} />
              Trending in Community
            </h2>
            <button className="btn-ghost" onClick={() => setActivePanel('community')}>
              View all <ArrowRight size={13} />
            </button>
          </div>

          <div className="trending-list">
            {TRENDING.map((p, i) => (
              <div key={i} className="trending-card card">
                <div className="trending-rank">#{i + 1}</div>
                <div className="trending-info">
                  <div className="trending-name">{p.name}</div>
                  <div className="trending-author">by @{p.author}</div>
                  <div className="trending-tags">
                    {p.tags.map(t => <span key={t} className="badge badge-cyan" style={{ fontSize: 9 }}>{t}</span>)}
                  </div>
                </div>
                <div className="trending-stats">
                  <span><GitFork size={12} /> {p.forks}</span>
                  <span><Star size={12} /> {p.stars}</span>
                </div>
                <button className="btn-secondary" style={{ fontSize: 11, padding: '5px 12px' }}>
                  Fork
                </button>
              </div>
            ))}
          </div>

          {/* Features callout */}
          <div className="features-row">
            {[
              { icon: '🤖', title: 'AI Auto-Wire', desc: 'Describe your circuit, AI routes connections' },
              { icon: '🔌', title: 'Web Serial Flash', desc: 'Upload firmware directly, no IDE needed' },
              { icon: '▶️', title: 'Live Simulation', desc: 'Run MCU code in browser with avr8js' },
              { icon: '🌐', title: '100% Free', desc: 'No credits, no paywalls, ever' },
            ].map(f => (
              <div key={f.title} className="feature-chip card">
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
