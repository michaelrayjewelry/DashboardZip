import React, { useState } from 'react';

export default function ToolModal({ tool, onClose }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="tool-modal-overlay" onClick={onClose}>
      <div className="tool-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tool-modal__header">
          <h2 className="tool-modal__title">{tool.title}</h2>
          <div className="tool-modal__header-actions">
            <select className="tool-modal__status-select">
              <option>Draft</option>
              <option>In Progress</option>
              <option>Complete</option>
            </select>
            <button className="tool-modal__close" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="tool-modal__body">
          {/* Client Section */}
          <div className="tool-modal__section">
            <div className="tool-modal__section-header">
              <span className="tool-modal__section-label">Client</span>
            </div>
            <div className="tool-modal__fields-row">
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Email</label>
                <input className="tool-modal__field-input" placeholder="client@email.com" />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Name</label>
                <input className="tool-modal__field-input" placeholder="Client name" />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Phone</label>
                <input className="tool-modal__field-input" placeholder="(555) 000-0000" />
              </div>
            </div>
          </div>

          {/* Reference Image */}
          <div className="tool-modal__section">
            <div className="tool-modal__section-header">
              <span className="tool-modal__section-label">Reference Image</span>
            </div>
            <div
              className={`upload-zone ${dragOver ? 'upload-zone--active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="upload-zone__text">Drop image or click to upload</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="tool-modal__section">
            <div className="tool-modal__section-header">
              <span className="tool-modal__section-label">Specifications</span>
            </div>
            <div className="tool-modal__fields-grid">
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Jewelry Type</label>
                <input className="tool-modal__field-input" placeholder="Ring, Pendant, Bracelet..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Name</label>
                <input className="tool-modal__field-input" placeholder="Piece name" />
              </div>
              <div className="tool-modal__field tool-modal__field--full">
                <label className="tool-modal__field-label">Description</label>
                <textarea className="tool-modal__field-textarea" placeholder="Describe the piece..." rows={3} />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Budget</label>
                <input className="tool-modal__field-input" placeholder="$0.00" />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Size</label>
                <input className="tool-modal__field-input" placeholder="Ring size, chain length..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Metal</label>
                <input className="tool-modal__field-input" placeholder="Gold, Platinum..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Metal Karat</label>
                <input className="tool-modal__field-input" placeholder="14k, 18k, Pt950..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Main Gemstone</label>
                <input className="tool-modal__field-input" placeholder="Diamond, Emerald..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Gemstone Shape</label>
                <input className="tool-modal__field-input" placeholder="Round, Emerald Cut..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Setting Type</label>
                <input className="tool-modal__field-input" placeholder="Prong, Bezel, Pave..." />
              </div>
              <div className="tool-modal__field">
                <label className="tool-modal__field-label">Band Style</label>
                <input className="tool-modal__field-input" placeholder="Cathedral, Comfort Fit..." />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="tool-modal__actions">
            <button className="btn btn--primary btn--lg">Generate with AI</button>
            <button className="btn btn--outline">Save Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
}
