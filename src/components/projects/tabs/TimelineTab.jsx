import React from 'react';
import { Section, TimelineItem } from '../ProjectComponents';

export default function TimelineTab({ project }) {
  const timeline = project.timeline || [];

  return (
    <div className="timeline-tab">
      <Section label="Project Timeline" count={timeline.length}>
        {timeline.length > 0 ? (
          <div className="timeline-list">
            {timeline.map((entry, i) => (
              <TimelineItem key={i} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No timeline entries yet.</p>
        )}
      </Section>
    </div>
  );
}
