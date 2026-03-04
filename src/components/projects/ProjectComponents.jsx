import React, { useState } from 'react';
import { PROJECT_STAGES, PROJECT_STAGE_LABELS } from '../../data/sampleData';

const STAGE_ICONS = {
  concept: '💡', design: '✏️', cad: '📐', approval: '✓',
  casting: '🔥', setting: '💎', finishing: '✨', delivery: '📦',
};

export function PipelineBar({ currentStage }) {
  const currentIdx = PROJECT_STAGES.indexOf(currentStage);
  return (
    <div className="pipeline-bar">
      {PROJECT_STAGES.map((stage, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div
            key={stage}
            className={`pipeline-bar__stage ${isDone ? 'pipeline-bar__stage--done' : ''} ${isActive ? 'pipeline-bar__stage--active' : ''}`}
          >
            <span className="pipeline-bar__icon">{STAGE_ICONS[stage]}</span>
            <span className="pipeline-bar__label">{PROJECT_STAGE_LABELS[stage]}</span>
            {i < PROJECT_STAGES.length - 1 && <span className="pipeline-bar__connector" />}
          </div>
        );
      })}
    </div>
  );
}

export function Section({ label, children, rightAction, collapsed, onToggle, count, noPad }) {
  const isCollapsible = typeof collapsed === 'boolean';
  return (
    <div className="project-section">
      {(label || rightAction) && (
        <div
          className="project-section__header"
          onClick={isCollapsible ? onToggle : undefined}
          style={{ cursor: isCollapsible ? 'pointer' : 'default' }}
        >
          <div className="project-section__header-left">
            {isCollapsible && (
              <svg className={`project-section__chevron ${collapsed ? 'project-section__chevron--collapsed' : ''}`} width="10" height="10" viewBox="0 0 10 10">
                <path d="M2 3L5 6L8 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
            <span className="project-section__label">{label}</span>
            {count !== undefined && <span className="project-section__count">{count}</span>}
          </div>
          {rightAction}
        </div>
      )}
      {(!isCollapsible || !collapsed) && (
        <div className={`project-section__body ${noPad ? 'project-section__body--no-pad' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function Field({ label, value = '', wide, textarea, readOnly }) {
  return (
    <div className={`field-group ${wide ? 'field-group--wide' : ''}`}>
      <label className="field-group__label">{label}</label>
      {textarea ? (
        <textarea className="field-group__textarea" defaultValue={value} readOnly={readOnly} rows={3} />
      ) : (
        <input className="field-group__input" defaultValue={value} readOnly={readOnly} />
      )}
    </div>
  );
}

export function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <div className="info-field__label">{label}</div>
      <div className="info-field__value">{value || '—'}</div>
    </div>
  );
}

export function FileCard({ file }) {
  const typeIcons = { CAD: '📐', Render: '🖼', Image: '🖼', Reference: '📷', Document: '📄' };
  return (
    <div className="file-card">
      <div className="file-card__icon">{typeIcons[file.type] || '📄'}</div>
      <div className="file-card__info">
        <div className="file-card__name">{file.name}</div>
        <div className="file-card__meta">{file.size} &middot; {file.date}</div>
      </div>
      {file.status && <span className={`badge badge--${file.status.toLowerCase()}`}>{file.status}</span>}
    </div>
  );
}

export function ChatBubble({ message }) {
  return (
    <div className={`chat-bubble ${message.isMe ? 'chat-bubble--sent' : ''}`}>
      <div className="chat-bubble__header">
        <span className="chat-bubble__from">{message.from}</span>
        <span className="chat-bubble__time">{message.time}</span>
      </div>
      <div className="chat-bubble__text">{message.message}</div>
    </div>
  );
}

export function TimelineItem({ entry }) {
  return (
    <div className="timeline-item">
      <div className="timeline-item__icon" style={{ borderColor: entry.accent || 'var(--color-border)' }}>
        {entry.icon}
      </div>
      <div className="timeline-item__content">
        <div className="timeline-item__title">{entry.title}</div>
        <div className="timeline-item__detail">{entry.detail}</div>
      </div>
      <div className="timeline-item__time">{entry.time}</div>
    </div>
  );
}

export function ImageSlot({ label }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      className={`image-slot ${dragOver ? 'image-slot--active' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="image-slot__label">{label || 'Drop image'}</span>
    </div>
  );
}
