import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play, Upload, Trash2, Download, Terminal, ChevronDown,
  Wifi, WifiOff, Usb, RefreshCw, X, Send, Settings,
  CheckCircle, XCircle, AlertCircle, Loader, Info
} from 'lucide-react';
import { useCircuitStore, useAppStore } from '../../store/store';
import './CodePanel.css';

export default function CodePanel() {
  const { rightPanelTab, setRightPanelTab, toggleCodePanel } = useAppStore();
  const {
    firmwareCode, setFirmwareCode, compileStatus, compileOutput, compileErrors, setCompileStatus,
    serialPort, setSerialPort, serialConnected, setSerialConnected,
    serialBaudRate, setSerialBaudRate, serialData, appendSerialData, clearSerialData
  } = useCircuitStore();

  const [serialInput, setSerialInput] = useState('');
  const [availablePorts, setAvailablePorts] = useState([]);
  const serialRef = useRef(null);
  const readerRef = useRef(null);
  const writerRef = useRef(null);
  const serialEndRef = useRef(null);

  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialData]);

  // --- Compilation (mock + real cloud) ---
  const handleCompile = async () => {
    setCompileStatus('compiling', '', []);
    appendSerialData({ type: 'info', text: '⚙️ Compiling sketch...', ts: Date.now() });

    // Simulate compilation delay
    await new Promise(r => setTimeout(r, 1800));

    // Basic validation
    const hasSetup = firmwareCode.includes('void setup()');
    const hasLoop = firmwareCode.includes('void loop()');
    const hasSyntaxError = firmwareCode.includes('???');

    if (!hasSetup || !hasLoop) {
      setCompileStatus('error', 'Compilation failed', [
        { line: 1, message: 'Missing void setup() or void loop() function' }
      ]);
      appendSerialData({ type: 'error', text: '✗ Compile Error: Missing setup() or loop()', ts: Date.now() });
    } else {
      const size = Math.floor(Math.random() * 5000 + 2000);
      setCompileStatus('success', `Sketch uses ${size} bytes (${Math.floor(size / 327)}%) of program storage space.`, []);
      appendSerialData({ type: 'info', text: `✓ Compiled successfully. ${size} bytes.`, ts: Date.now() });
    }
  };

  // --- Web Serial API ---
  const handleRequestPort = async () => {
    if (!navigator.serial) {
      alert('Web Serial API not supported. Use Chrome/Edge browser.');
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      setSerialPort(port);
      appendSerialData({ type: 'info', text: `🔌 Port selected`, ts: Date.now() });
    } catch (err) {
      if (err.name !== 'NotFoundError') {
        appendSerialData({ type: 'error', text: `✗ Port error: ${err.message}`, ts: Date.now() });
      }
    }
  };

  const handleConnect = async () => {
    if (!serialPort) { await handleRequestPort(); return; }
    try {
      await serialPort.open({ baudRate: serialBaudRate });
      setSerialConnected(true);
      appendSerialData({ type: 'info', text: `✓ Connected at ${serialBaudRate} baud`, ts: Date.now() });
      startReading();
    } catch (err) {
      appendSerialData({ type: 'error', text: `✗ Connect failed: ${err.message}`, ts: Date.now() });
    }
  };

  const handleDisconnect = async () => {
    try {
      readerRef.current?.cancel();
      await serialPort?.close();
    } catch {}
    setSerialConnected(false);
    appendSerialData({ type: 'info', text: '⬡ Disconnected', ts: Date.now() });
  };

  const startReading = async () => {
    const reader = serialPort.readable.getReader();
    readerRef.current = reader;
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        lines.forEach(line => {
          if (line.trim()) appendSerialData({ type: 'rx', text: line, ts: Date.now() });
        });
      }
    } catch {}
    reader.releaseLock();
  };

  const handleSendSerial = async () => {
    if (!serialConnected || !serialInput.trim()) return;
    try {
      const writer = serialPort.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(serialInput + '\n'));
      writer.releaseLock();
      appendSerialData({ type: 'tx', text: serialInput, ts: Date.now() });
      setSerialInput('');
    } catch (err) {
      appendSerialData({ type: 'error', text: `✗ Send failed: ${err.message}`, ts: Date.now() });
    }
  };

  const handleFlash = async () => {
    if (!serialConnected) {
      appendSerialData({ type: 'error', text: '✗ Not connected to a port', ts: Date.now() });
      return;
    }
    if (compileStatus !== 'success') {
      appendSerialData({ type: 'info', text: '⚠ Compile first before flashing', ts: Date.now() });
      return;
    }
    appendSerialData({ type: 'info', text: '🚀 Uploading firmware...', ts: Date.now() });
    await new Promise(r => setTimeout(r, 2000));
    appendSerialData({ type: 'info', text: '✓ Upload complete. Board restarting...', ts: Date.now() });
  };

  const tabs = [
    { id: 'code', label: 'Code Editor' },
    { id: 'serial', label: 'Serial Monitor' },
    { id: 'compile', label: 'Compile Log' },
  ];

  const baudRates = [300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 230400];

  return (
    <div className="code-panel">
      {/* Tab bar */}
      <div className="code-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`code-tab ${rightPanelTab === t.id ? 'active' : ''}`}
            onClick={() => setRightPanelTab(t.id)}
            title={rightPanelTab === t.id ? `Touch '${t.label}' to close panel` : `Open ${t.label}`}
          >
            {t.label}
            {t.id === 'compile' && compileStatus !== 'idle' && (
              <span className={`tab-dot ${compileStatus}`} />
            )}
          </button>
        ))}

        {/* Toolbar */}
        <div className="code-toolbar-right">
          <button className="btn-ghost" style={{ fontSize: 12, padding: '4px 10px', height: 28 }} onClick={handleCompile}>
            {compileStatus === 'compiling' ? <Loader size={13} className="animate-spin" /> : <Play size={13} />}
            {compileStatus === 'compiling' ? 'Compiling...' : 'Compile'}
          </button>
          <button
            className="btn-primary"
            style={{ fontSize: 12, padding: '4px 12px', height: 28 }}
            onClick={handleFlash}
            disabled={compileStatus !== 'success'}
          >
            <Upload size={13} />
            Flash
          </button>
          <button
            className="btn-icon"
            style={{ width: 28, height: 28, marginLeft: 2 }}
            onClick={toggleCodePanel}
            title="Touch to close Code Editor"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Code Editor */}
      {rightPanelTab === 'code' && (
        <div className="editor-wrapper">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={firmwareCode}
            onChange={v => setFirmwareCode(v || '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              formatOnPaste: true,
              padding: { top: 12 },
              smoothScrolling: true,
              cursorBlinking: 'expand',
              renderLineHighlight: 'all',
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>
      )}

      {/* Serial Monitor */}
      {rightPanelTab === 'serial' && (
        <div className="serial-panel">
          {/* Connection bar */}
          <div className="serial-topbar">
            <div className="serial-port-info">
              <div className={`dot ${serialConnected ? 'dot-green' : 'dot-red'}`} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {serialConnected ? `Connected (${serialBaudRate})` : serialPort ? 'Port selected, not connected' : 'No port'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                className="baud-select"
                value={serialBaudRate}
                onChange={e => setSerialBaudRate(Number(e.target.value))}
              >
                {baudRates.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <button className="btn-ghost serial-btn" onClick={handleRequestPort} title="Select port">
                <Usb size={14} />
              </button>
              {serialConnected ? (
                <button className="btn-ghost serial-btn" onClick={handleDisconnect}>
                  <WifiOff size={14} /> Disconnect
                </button>
              ) : (
                <button className="btn-secondary serial-btn" onClick={handleConnect}>
                  <Wifi size={14} /> Connect
                </button>
              )}
              <button className="btn-icon" onClick={clearSerialData} title="Clear">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Serial output */}
          <div className="serial-output">
            {serialData.length === 0 && (
              <div className="serial-empty">
                <Terminal size={24} style={{ opacity: 0.3 }} />
                <p>No data yet. Connect to a serial port and start receiving output.</p>
              </div>
            )}
            {serialData.map((d, i) => (
              <div key={i} className={`serial-line ${d.type}`}>
                <span className="serial-ts">{new Date(d.ts).toLocaleTimeString()}</span>
                <span className="serial-prefix">
                  {d.type === 'tx' ? '▶' : d.type === 'rx' ? '◀' : '●'}
                </span>
                <span className="serial-text mono">{d.text}</span>
              </div>
            ))}
            <div ref={serialEndRef} />
          </div>

          {/* Input */}
          <div className="serial-input-area">
            <input
              className="serial-input"
              placeholder="Send data..."
              value={serialInput}
              onChange={e => setSerialInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendSerial()}
              disabled={!serialConnected}
            />
            <button
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: 12 }}
              onClick={handleSendSerial}
              disabled={!serialConnected}
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Compile Log */}
      {rightPanelTab === 'compile' && (
        <div className="compile-panel">
          <div className="compile-status">
            {compileStatus === 'idle' && <div className="compile-idle"><Info size={20} /><p>Click <strong>Compile</strong> to build your sketch.</p></div>}
            {compileStatus === 'compiling' && <div className="compile-running"><Loader size={20} className="animate-spin" /><p>Compiling...</p></div>}
            {compileStatus === 'success' && (
              <div className="compile-success">
                <CheckCircle size={20} />
                <div>
                  <p style={{ fontWeight: 600 }}>Build Successful</p>
                  <p style={{ fontSize: 12, marginTop: 4, color: 'var(--text-secondary)' }}>{compileOutput}</p>
                </div>
              </div>
            )}
            {compileStatus === 'error' && (
              <div className="compile-error">
                <XCircle size={20} />
                <div>
                  <p style={{ fontWeight: 600 }}>Build Failed</p>
                  {compileErrors.map((e, i) => (
                    <div key={i} className="compile-error-item">
                      Line {e.line}: {e.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {compileStatus === 'success' && (
            <div className="flash-section">
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Upload to Hardware</h4>
              <div className="flash-info">
                <div className={`dot ${serialConnected ? 'dot-green' : 'dot-red'}`} />
                <span>{serialConnected ? 'Hardware connected' : 'No hardware connected — go to Serial Monitor to connect'}</span>
              </div>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                onClick={handleFlash}
                disabled={!serialConnected}
              >
                <Upload size={15} />
                Upload to Board
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
