import React, { useCallback, useEffect } from 'react';
import Topbar from './components/Topbar/Topbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Editor from './pages/Editor/Editor';
import Community from './pages/Community/Community';
import LoginModal from './components/Auth/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveProjectToCloud } from './firebase/projects';
import { useAppStore, useCircuitStore } from './store/store';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

function AppContent() {
  const { activePanel, theme } = useAppStore();
  const {
    newProject, exportProject, importProject, projectName,
    markSaved, isDirty, components, wires, firmwareCode, projectId, projectStatus
  } = useCircuitStore();
  const { user, loading, isGuest, loginModalOpen, setLoginModalOpen } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleNewProject = useCallback(() => {
    newProject();
    toast.success('New project created');
    useAppStore.getState().setActivePanel('editor');
  }, [newProject]);

  const handleSave = useCallback(async () => {
    // 1. Export JSON file
    const data = exportProject();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.vc.json`;
    a.click();
    URL.revokeObjectURL(url);
    markSaved();

    // 2. If logged in with Google, also sync to Firestore Cloud!
    if (user) {
      try {
        await saveProjectToCloud({
          id: projectId,
          name: projectName,
          status: projectStatus || 'Draft',
          components,
          wires,
          firmwareCode,
        });
        toast.success('Project saved & synced to Google Cloud! ☁️');
      } catch (err) {
        console.warn('Could not sync to cloud:', err);
        toast.success('Project downloaded locally');
      }
    } else {
      toast.success('Project saved locally. Sign in with Google to sync to Cloud!', {
        duration: 4000,
        icon: '💾',
      });
    }
  }, [exportProject, projectName, markSaved, user, projectId, components, wires, firmwareCode, projectStatus]);

  const handleOpen = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.vc.json';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const ok = importProject(text);
      if (ok) {
        toast.success('Project loaded');
        useAppStore.getState().setActivePanel('editor');
      } else {
        toast.error('Failed to load project file');
      }
    };
    input.click();
  }, [importProject]);

  const isLight = theme === 'light';

  // For a new user opening the app, show login prompt right over the dashboard
  const shouldShowLoginModal = loginModalOpen || (!loading && !user && !isGuest);

  return (
    <div className="app" data-theme={theme}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isLight ? '#ffffff' : '#1e293b',
            color: isLight ? '#0f172a' : '#f8fafc',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(99,102,241,0.3)',
            boxShadow: isLight ? '0 8px 24px rgba(0,0,0,0.08)' : '0 8px 24px rgba(0,0,0,0.5)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Topbar
        onNewProject={handleNewProject}
        onSaveProject={handleSave}
        onOpenProject={handleOpen}
      />

      <main className="app-main">
        {activePanel === 'dashboard' && <Dashboard />}
        {activePanel === 'editor' && <Editor />}
        {activePanel === 'community' && <Community />}
      </main>

      {/* Login Modal for new user or when requested */}
      <LoginModal
        isOpen={shouldShowLoginModal}
        onClose={() => setLoginModalOpen(false)}
        canDismiss={true}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
