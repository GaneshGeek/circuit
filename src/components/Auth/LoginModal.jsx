import React, { useState } from 'react';
import { Zap, X, Shield, Cpu, Cloud, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, canDismiss = true }) {
  const { loginWithGoogle, continueAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      if (onClose) onClose();
    } catch {
      // toast already handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    if (onClose) onClose();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        {canDismiss && (
          <button className="login-modal-close" onClick={handleGuest} title="Explore as Guest">
            <X size={18} />
          </button>
        )}

        {/* Header with glowing badge */}
        <div className="login-modal-header">
          <div className="login-logo-glow">
            <div className="login-logo-icon">
              <Zap size={28} />
            </div>
          </div>
          <div className="login-badge">
            <Sparkles size={13} />
            <span>CLOUD ELECTRONICS STUDIO</span>
          </div>
          <h2 className="login-title">Welcome to VoltCraft</h2>
          <p className="login-subtitle">
            Design, simulate, and flash microcontroller circuits right in your browser.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="login-features">
          <div className="login-feature-item">
            <CheckCircle2 size={16} className="feature-icon" />
            <span>AI-assisted auto-wiring &amp; code generation</span>
          </div>
          <div className="login-feature-item">
            <CheckCircle2 size={16} className="feature-icon" />
            <span>Interactive SPICE &amp; MCU live simulation</span>
          </div>
          <div className="login-feature-item">
            <CheckCircle2 size={16} className="feature-icon" />
            <span>Save designs directly to your cloud workspace</span>
          </div>
        </div>

        {/* Main Action: Sign in with Google */}
        <div className="login-actions">
          <button
            className="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="login-spinner" />
            ) : (
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{loading ? 'Signing in with Google...' : 'Continue with Google ID'}</span>
          </button>

          {/* Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Guest access option */}
          <button className="btn-guest-login" onClick={handleGuest}>
            <span>Try without login (Guest Mode)</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Footer info */}
        <div className="login-footer">
          <Shield size={13} />
          <span>Secure Google OAuth authentication powered by Firebase</span>
        </div>
      </div>
    </div>
  );
}
