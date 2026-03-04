import React from 'react';
import { Section, FileCard, Field } from '../ProjectComponents';

export default function ManufacturingTab({ project }) {
  const specs = project.specs || {};
  const cadFiles = (project.files || []).filter(f => f.type === 'CAD');
  const qaChecklist = project.qaChecklist || [];

  return (
    <div className="manufacturing-tab">
      <Section label="CAD Files" count={cadFiles.length}
        rightAction={<button className="btn btn--sm btn--outline">Upload CAD</button>}
      >
        {cadFiles.length > 0 ? (
          <div className="file-list">
            {cadFiles.map(f => <FileCard key={f.id} file={f} />)}
          </div>
        ) : (
          <p className="text-muted">No CAD files uploaded yet.</p>
        )}
      </Section>

      <Section label="3D Models" count={0}
        rightAction={<button className="btn btn--sm btn--primary">Generate 3D Model</button>}
      >
        <p className="text-muted">No 3D models generated yet. Use the AI tool to generate from CAD or specs.</p>
      </Section>

      <Section label="Production Notes">
        <div className="fields-wrap">
          <Field label="Casting Method" value={specs.castingMethod} />
          <Field label="Production Notes" value={specs.productionNotes} wide textarea readOnly />
        </div>
      </Section>

      {qaChecklist.length > 0 && (
        <Section label="Quality Checklist" count={`${qaChecklist.filter(q => q.checked).length}/${qaChecklist.length}`}>
          <div className="qa-checklist">
            {qaChecklist.map((item, i) => (
              <label key={i} className="qa-checklist__item">
                <input type="checkbox" defaultChecked={item.checked} />
                <span className={item.checked ? 'qa-checklist__text--done' : ''}>{item.item}</span>
              </label>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
