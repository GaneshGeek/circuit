import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Folder, Star, Zap, Eye,
  CircuitBoard, Cpu, GitFork, TrendingUp,
  CheckCircle2, LogIn, Layers
} from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProjects } from '../../firebase/projects';
import ProjectGallery from '../../components/Dashboard/ProjectGallery';
import './Dashboard.css';

const STATS = [
  { label: 'Circuits Created', value: '14', icon: Folder, color: '#6366f1' },
  { label: 'Components Library', value: '50+', icon: Cpu, color: '#06b6d4' },
  { label: 'Community Forks', value: '128', icon: GitFork, color: '#10b981' },
  { label: 'Stars Received', value: '94', icon: Star, color: '#f59e0b' },
];

const TRENDING = [
  { name: 'Arduino Mega Weather Monitor', author: 'rahul_dev', forks: 234, stars: 891, tags: ['sensors', 'display'] },
  { name: 'ESP32 Plant Watering Bot', author: 'iot_ganesh', forks: 156, stars: 672, tags: ['esp32', 'servo', 'soil'] },
  { name: 'Raspberry Pico Synthesizer', author: 'synth_lab', forks: 98, stars: 445, tags: ['audio', 'pico', 'music'] },
];

export default function Dashboard() {
  const { setActivePanel } = useAppStore();
  const { newProject, setProjectName } = useCircuitStore();
  const { user, loginWithGoogle } = useAuth();
  const [cloudProjects, setCloudProjects] = useState([]);
  const [_loadingProjects, setLoadingProjects] = useState(false);

  const loadCloudProjects = useCallback(() => {
    if (user) {
      setLoadingProjects(true);
      fetchUserProjects()
        .then(projects => setCloudProjects(projects))
        .catch(err => console.warn('Could not load user projects:', err))
        .finally(() => setLoadingProjects(false));
    } else {
      setCloudProjects([]);
    }
  }, [user]);

  useEffect(() => {
    loadCloudProjects();
  }, [loadCloudProjects]);

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
            {user ? (
              <>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="dash-user-avatar"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span>👋 Welcome back, <span className="glow-text">{user.displayName || 'Maker'}</span></span>
                <span className="dash-cloud-badge">
                  <CheckCircle2 size={11} /> Cloud Synced
                </span>
              </>
            ) : (
              <>
                <span>👋</span> Welcome to <span className="glow-text">VoltCraft</span>
              </>
            )}
          </div>
          <h1 className="dash-title">
            Design, Simulate &amp; Deploy
            <br />
            <span className="glow-cyan">Electronics in the Browser</span>
          </h1>
          <p className="dash-subtitle">
            100% free cloud EDA · Visual PCB &amp; schematic previews · Status tracking · Web Serial hardware flashing
          </p>
          <div className="dash-cta">
            <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => handleNewProject()}>
              <Plus size={18} />
              New Circuit
            </button>
            {!user && (
              <button
                className="btn-dash-google"
                style={{ padding: '12px 22px', fontSize: 14.5 }}
                onClick={() => loginWithGoogle()}
                title="Sign in with your Google account"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            )}
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

      {/* Auth Banner for Unauthenticated Users */}
      {!user && (
        <div className="dash-auth-banner">
          <div className="dash-auth-content">
            <div className="dash-auth-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div className="dash-auth-title">Sync your circuit designs to Google Cloud</div>
              <div className="dash-auth-desc">Sign in with your Google account to save custom circuits, export firmware, and share with the maker community.</div>
            </div>
          </div>
          <div className="dash-auth-actions">
            <button className="btn-dash-google" onClick={() => loginWithGoogle()}>
              <LogIn size={15} />
              <span>Sign in with Google ID</span>
            </button>
            <button className="btn-ghost" onClick={() => handleNewProject()}>
              <span>Explore as Guest</span>
            </button>
          </div>
        </div>
      )}

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

      {/* DASHBOARD PROJECT GALLERY (Visual Thumbnails with Status Badges) */}
      <ProjectGallery
        cloudProjects={cloudProjects}
        onRefreshCloud={loadCloudProjects}
      />

      {/* Trending Community & Features */}
      <div className="dash-main">
        {/* Trending Community */}
        <div className="dash-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={16} />
              Trending in Maker Community
            </h2>
            <button className="btn-ghost" onClick={() => setActivePanel('community')}>
              View all <Eye size={13} />
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
                <button
                  className="btn-secondary"
                  style={{ fontSize: 11, padding: '5px 12px' }}
                  onClick={() => handleNewProject(p.name)}
                >
                  Fork
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features callout */}
        <div className="dash-section">
          <div className="section-header">
            <h2 className="section-title">
              <Layers size={16} />
              Platform Capabilities
            </h2>
          </div>

          <div className="features-row">
            {[
              { icon: '🤖', title: 'AI Auto-Wire', desc: 'Describe your circuit, AI routes connections' },
              { icon: '🔌', title: 'Web Serial Flash', desc: 'Upload firmware directly, no IDE needed' },
              { icon: '▶️', title: 'Live Simulation', desc: 'Run MCU code in browser with avr8js' },
              { icon: '☁️', title: 'Google Cloud Sync', desc: 'Auto-save your projects with Google ID' },
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
