import React from 'react';
import { Section, ImageSlot, FileCard } from '../ProjectComponents';

export default function DesignTab({ project }) {
  const renderFiles = (project.files || []).filter(f => f.type === 'Render' || f.type === 'Image');
  const refFiles = (project.files || []).filter(f => f.type === 'Reference');

  return (
    <div className="design-tab">
      <Section label="AI-Generated Concepts" count={0}
        rightAction={<button className="btn btn--sm btn--primary">Generate New</button>}
      >
        <div className="image-grid">
          <ImageSlot label="Generate concept" />
          <ImageSlot label="Generate concept" />
          <ImageSlot label="Generate concept" />
        </div>
      </Section>

      <Section label="Sketches & Drawings" count={renderFiles.length}
        rightAction={<button className="btn btn--sm btn--outline">Upload</button>}
      >
        {renderFiles.length > 0 ? (
          <div className="file-list">
            {renderFiles.map(f => <FileCard key={f.id} file={f} />)}
          </div>
        ) : (
          <p className="text-muted">No sketches uploaded yet.</p>
        )}
      </Section>

      <Section label="Photorealistic Renders" count={0}
        rightAction={<button className="btn btn--sm btn--primary">Generate Render</button>}
      >
        <div className="image-grid">
          <ImageSlot label="Generate render" />
          <ImageSlot label="Generate render" />
        </div>
      </Section>

      <Section label="Mood Board & References" count={project.referenceImages?.length || 0}>
        {refFiles.length > 0 ? (
          <div className="file-list">
            {refFiles.map(f => <FileCard key={f.id} file={f} />)}
          </div>
        ) : (
          <div className="image-grid">
            <ImageSlot label="Add reference" />
            <ImageSlot label="Add reference" />
          </div>
        )}
      </Section>
    </div>
  );
}
