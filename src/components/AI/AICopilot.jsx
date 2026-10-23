import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Trash2, Mic, MicOff, X } from 'lucide-react';
import { useAppStore, useCircuitStore } from '../../store/store';
import { COMPONENTS } from '../../data/components';
import './AICopilot.css';

function buildSystemPrompt(components, wires, projectName) {
  return `You are VoltCraft AI, an expert electronics design assistant embedded in the VoltCraft cloud EDA platform. You help users design circuits, write Arduino/ESP32/RP2040 firmware, debug issues, explain components, and auto-generate wiring plans.

Current project: "${projectName}"
Components on canvas: ${components.map(c => `${c.label} (${c.name})`).join(', ') || 'none'}
Wires: ${wires.length} connections

Available component library: ${COMPONENTS.map(c => c.name).join(', ')}

Capabilities you have:
- Suggest circuit designs with specific component recommendations
- Generate complete Arduino/C++ sketch code
- Explain how components work
- Debug circuit issues
- Suggest wire connections between components
- Recommend component values (resistor, capacitor, etc.)

When recommending components to add, format them as: [ADD: ComponentName]
When writing code, always use markdown code blocks with the language.
Be concise, technical, and practical.`;
}

async function callGemini(messages, systemPrompt) {
  const res = await fetch('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server responded with ${res.status}`);
  }

  const data = await res.json();
  return data.reply || 'No response.';
}

function MarkdownMessage({ content }) {
  // Basic markdown rendering
  const html = content
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="ai-code-block"><code class="lang-$1">$2</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(/^### (.*)/gm, '<h4>$1</h4>')
    .replace(/^## (.*)/gm, '<h3>$1</h3>')
    .replace(/^# (.*)/gm, '<h2>$1</h2>')
    .replace(/^[-*] (.*)/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>');

  return <div className="ai-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function AICopilot() {
  const {
    aiMessages, aiLoading, appendAiMessage, setAiLoading, clearAiMessages,
    toggleAiPanel
  } = useAppStore();
  const { components, wires, projectName, setFirmwareCode } = useCircuitStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, aiLoading]);

  // Web Speech API
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return;

    const userMsg = { role: 'user', content: input.trim(), ts: Date.now() };
    appendAiMessage(userMsg);
    setInput('');
    setAiLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(components, wires, projectName);
      const allMessages = [...aiMessages, userMsg];
      const reply = await callGemini(allMessages, systemPrompt);

      // Extract code blocks to offer adding to editor
      const codeMatch = reply.match(/```(?:cpp|arduino|c\+\+)?\n?([\s\S]*?)```/);
      const hasCode = !!codeMatch;

      appendAiMessage({
        role: 'assistant',
        content: reply,
        ts: Date.now(),
        hasCode,
        code: codeMatch?.[1]?.trim(),
      });
    } catch (err) {
      appendAiMessage({
        role: 'assistant',
        content: `❌ **Error**: ${err.message}`,
        ts: Date.now(),
      });
    } finally {
      setAiLoading(false);
    }
  };

  const quickPrompts = [
    'How do I connect DHT11 to Arduino?',
    'Write blink code for ESP32',
    'Add ultrasonic distance sensor',
    'Debug my circuit connections',
    'What resistor for LED with 5V?',
  ];

  return (
    <div className="ai-copilot">
      {/* Tab bar matching Code Editor */}
      <div className="code-tabs ai-tabs">
        <button
          className="code-tab active"
          onClick={toggleAiPanel}
          title="Touch 'AI Copilot' to close"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span className="ai-star" style={{ fontSize: 14 }}>✦</span>
          AI Copilot
          <span className="badge badge-primary" style={{ fontSize: 9, padding: '1px 5px', marginLeft: 2 }}>Gemini</span>
        </button>

        <div className="code-toolbar-right" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="btn-icon" onClick={clearAiMessages} title="Clear chat">
            <Trash2 size={13} />
          </button>
          <button
            className="btn-icon"
            style={{ width: 28, height: 28, marginLeft: 2 }}
            onClick={toggleAiPanel}
            title="Touch to close AI Copilot"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {aiMessages.map((msg, i) => (
          <div key={i} className={`ai-msg ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="ai-avatar">✦</div>
            )}
            <div className="ai-bubble">
              <MarkdownMessage content={msg.content} />
              {msg.hasCode && msg.code && (
                <button
                  className="ai-code-action"
                  onClick={() => setFirmwareCode(msg.code)}
                >
                  <Zap size={12} />
                  Load code into editor
                </button>
              )}
            </div>
          </div>
        ))}

        {aiLoading && (
          <div className="ai-msg assistant">
            <div className="ai-avatar">✦</div>
            <div className="ai-bubble ai-loading">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {aiMessages.length <= 1 && (
        <div className="ai-quick-prompts">
          {quickPrompts.map(p => (
            <button key={p} className="quick-prompt-btn" onClick={() => setInput(p)}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-input-area">
        <div className="ai-input-wrapper">
          <textarea
            className="ai-textarea"
            placeholder="Ask anything about your circuit..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            rows={1}
          />
          <div className="ai-input-actions">
            <button
              className={`btn-icon ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Voice input'}
              style={isListening ? { color: 'var(--accent-rose)', animation: 'pulse-glow 1s infinite' } : {}}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button
              className="ai-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || aiLoading}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <p className="ai-hint">Enter to send · Shift+Enter newline · 🎤 voice input</p>
      </div>
    </div>
  );
}
