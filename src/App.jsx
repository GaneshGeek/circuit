import React, { useCallback } from 'react';
import Topbar from './components/Topbar/Topbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Editor from './pages/Editor/Editor';
import Community from './pages/Community/Community';
import { useAppStore, useCircuitStore } from './store/store';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

export default function App() {
  const { activePanel } = useAppStore();
  const { newProject, exportProject, importProject, projectName, markSaved } = useCircuitStore();

  const handleNewProject = useCallback(() => {
    if (window.confirm('Start a new project? Unsaved changes will be lost.')) {
      newProject();
      toast.success('New project created');
      useAppStore.getState().setActivePanel('editor');
    }
  }, [newProject]);

  const handleSave = useCallback(() => {
    const data = exportProject();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.vc.json`;
    a.click();
    URL.revokeObjectURL(url);
    markSaved();
    toast.success('Project saved');
  }, [exportProject, projectName, markSaved]);

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

  return (
    <div className="app">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(99,102,241,0.3)',
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
    </div>
  );
}
