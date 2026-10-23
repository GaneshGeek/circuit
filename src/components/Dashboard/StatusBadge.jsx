import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Activity, Edit3, ChevronDown, Check } from 'lucide-react';
import './StatusBadge.css';

export const STATUS_CONFIG = {
  Draft: {
    label: 'Draft',
    icon: Edit3,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.35)',
    desc: 'Work in progress',
  },
  Simulating: {
    label: 'Simulating',
    icon: Activity,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.16)',
    border: 'rgba(6, 182, 212, 0.4)',
    desc: 'Live execution & test',
  },
  Completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.16)',
    border: 'rgba(16, 185, 129, 0.4)',
    desc: 'Verified & ready',
  },
};

export default function StatusBadge({ status = 'Draft', onStatusChange, isEditable = true }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentStatus = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
  const IconComponent = currentStatus.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (newStatus, e) => {
    e.stopPropagation();
    if (onStatusChange && newStatus !== status) {
      onStatusChange(newStatus);
    }
    setOpen(false);
  };

  return (
    <div className="status-badge-container" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button
        className={`status-badge-pill ${open ? 'open' : ''} ${status.toLowerCase()}`}
        style={{
          background: currentStatus.bg,
          borderColor: currentStatus.border,
          color: currentStatus.color,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isEditable) setOpen(!open);
        }}
        title={isEditable ? 'Click to change status' : currentStatus.desc}
      >
        <span className="status-badge-icon-wrapper">
          <IconComponent size={12} className={status === 'Simulating' ? 'pulse-icon' : ''} />
          {status === 'Simulating' && <span className="status-pulse-dot" />}
        </span>
        <span className="status-badge-text">{currentStatus.label}</span>
        {isEditable && <ChevronDown size={11} className="status-chevron" />}
      </button>

      {open && isEditable && (
        <div className="status-dropdown-menu">
          <div className="status-dropdown-header">Update Status</div>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const ItemIcon = config.icon;
            const isSelected = key === status;
            return (
              <button
                key={key}
                className={`status-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={(e) => handleSelect(key, e)}
              >
                <div className="item-icon-circle" style={{ background: config.bg, color: config.color }}>
                  <ItemIcon size={12} />
                </div>
                <div className="item-labels">
                  <span className="item-title" style={{ color: isSelected ? config.color : undefined }}>
                    {config.label}
                  </span>
                  <span className="item-desc">{config.desc}</span>
                </div>
                {isSelected && <Check size={13} style={{ color: config.color, marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
