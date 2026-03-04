import React from 'react';
import { useApp } from '../../context/AppContext';
import { PROJECT_STAGES, PROJECT_STAGE_LABELS } from '../../data/sampleData';
import { formatCurrency } from '../../utils/formatters';

const STAGE_ICONS = {
  concept: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
    </svg>
  ),
  design: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  ),
  cad: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  approval: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  casting: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  setting: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  finishing: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 00-6 6c0 7 6 12 6 12s6-5 6-12a6 6 0 00-6-6z" /><circle cx="12" cy="9" r="2" />
    </svg>
  ),
  delivery: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
};

function StageProgress({ currentStage }) {
  const currentIdx = PROJECT_STAGES.indexOf(currentStage);

  return (
    <div className="stage-progress">
      {PROJECT_STAGES.map((stage, idx) => {
        let stageClass = 'stage-progress__step';
        if (idx < currentIdx) stageClass += ' stage-progress__step--completed';
        else if (idx === currentIdx) stageClass += ' stage-progress__step--current';
        else stageClass += ' stage-progress__step--future';

        return (
          <React.Fragment key={stage}>
            {idx > 0 && <div className={`stage-progress__line ${idx <= currentIdx ? 'stage-progress__line--filled' : ''}`} />}
            <div className={stageClass}>
              <div className="stage-progress__icon">
                {STAGE_ICONS[stage]}
              </div>
              <span className="stage-progress__label">{PROJECT_STAGE_LABELS[stage]}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ProjectOverview({ project }) {

  return (
    <div className="project-overview">
      <div className="project-section">
        <div className="project-section__header">
          <h3 className="section-title">CLIENT</h3>
          <button className="btn btn--sm btn--outline">EDIT CLIENT</button>
        </div>
        <div className="client-info-grid">
          <div className="client-info__item">
            <span className="client-info__label">EMAIL</span>
            <span className="client-info__value">{project.client.email}</span>
          </div>
          <div className="client-info__item">
            <span className="client-info__label">NAME</span>
            <span className="client-info__value">{project.client.name}</span>
          </div>
          <div className="client-info__item">
            <span className="client-info__label">PHONE</span>
            <span className="client-info__value">{project.client.phone || '—'}</span>
          </div>
          <div className="client-info__item">
            <span className="client-info__label">CREATED</span>
            <span className="client-info__value">{new Date(project.client.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="spec-cards">
        <div className="spec-card">
          <span className="spec-card__label">TYPE</span>
          <span className="spec-card__value">{project.type}</span>
        </div>
        <div className="spec-card">
          <span className="spec-card__label">METAL</span>
          <span className="spec-card__value">{project.metal}</span>
        </div>
        <div className="spec-card">
          <span className="spec-card__label">EST. WEIGHT</span>
          <span className="spec-card__value">{project.estWeight}</span>
        </div>
        <div className="spec-card">
          <span className="spec-card__label">EST. COST</span>
          <span className="spec-card__value">{formatCurrency(project.estCost)}</span>
        </div>
      </div>

      <div className="project-section">
        <div className="project-section__header">
          <h3 className="section-title">
            REFERENCE IMAGES
            {project.referenceImages.length > 0 && (
              <span className="section-count">{project.referenceImages.length}</span>
            )}
          </h3>
          <button className="btn btn--sm btn--outline">UPLOAD</button>
        </div>
        <div className="reference-images">
          {project.referenceImages.length > 0 ? (
            project.referenceImages.map((img, i) => (
              <div key={i} className="reference-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{img}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">No reference images uploaded yet</p>
          )}
        </div>
      </div>

      <div className="project-section">
        <div className="project-section__header">
          <h3 className="section-title">RECENT ACTIVITY</h3>
          <button className="btn btn--sm btn--ghost">VIEW ALL</button>
        </div>
        <div className="activity-feed">
          {project.activity.map(item => (
            <div key={item.id} className="activity-item">
              <div className={`activity-item__dot activity-item__dot--${item.type}`} />
              <div className="activity-item__content">
                <p className="activity-item__text">{item.text}</p>
                <p className="activity-item__detail">{item.detail}</p>
                <span className="activity-item__time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectTabContent({ project }) {
  const { state } = useApp();

  switch (state.projectTab) {
    case 'overview':
      return <ProjectOverview project={project} />;
    case 'design':
      return <PlaceholderTab title="Design & Assets" description="CAD files, sketches, and design assets for this project" />;
    case 'specifications':
      return <PlaceholderTab title="Specifications" description="Detailed technical specifications and measurements" />;
    case 'materials':
      return <PlaceholderTab title="Materials & Cost" description="Bill of materials, costs, and pricing breakdown" />;
    case 'manufacturing':
      return <PlaceholderTab title="Manufacturing" description="Production notes, bench assignments, and workflow" />;
    case 'communication':
      return <PlaceholderTab title="Communication" description="Messages and correspondence with the client" />;
    case 'documents':
      return <PlaceholderTab title="Documents" description="Contracts, invoices, and related documents" />;
    case 'timeline':
      return <PlaceholderTab title="Timeline" description="Project timeline, milestones, and history" />;
    default:
      return <ProjectOverview project={project} />;
  }
}

function PlaceholderTab({ title, description }) {
  return (
    <div className="placeholder-tab">
      <h3>{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}

export default function ProjectsView() {
  const { state, dispatch } = useApp();
  const project = state.projects.find(p => p.id === state.selectedProjectId);

  if (!project) {
    return (
      <div className="projects-list">
        <div className="view-header">
          <h1 className="page-title">PROJECTS</h1>
        </div>
        <div className="projects-grid">
          {state.projects.map(p => (
            <div
              key={p.id}
              className="project-list-card"
              onClick={() => dispatch({ type: 'SELECT_PROJECT', payload: p.id })}
            >
              <h3>{p.name}</h3>
              <p className="text-muted">{p.collection}</p>
              <span className={`badge badge--${p.status === 'In Progress' ? 'info' : 'success'}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="project-detail">
      <div className="project-detail__header">
        <div className="project-detail__header-left">
          <button
            className="back-link"
            onClick={() => dispatch({ type: 'SELECT_PROJECT', payload: null })}
          >
            &larr; All Projects
          </button>
          <h1 className="page-title">{project.name.toUpperCase()}</h1>
          <p className="project-detail__subtitle">
            {project.collection} &middot; Created {formatDate(project.createdDate)} &middot; Last updated {formatDate(project.lastUpdated)}
          </p>
        </div>
        <div className="project-detail__header-right">
          <span className={`badge badge--${project.status === 'In Progress' ? 'info' : project.status === 'Completed' ? 'success' : 'default'} badge--lg`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            {project.status.toUpperCase()}
          </span>
          <button className="btn btn--primary">SEND UPDATE EMAIL</button>
        </div>
      </div>

      <StageProgress currentStage={project.stage} />

      <div className="project-detail__tabs">
        {['overview', 'design', 'specifications', 'materials', 'manufacturing', 'communication', 'documents', 'timeline'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${state.projectTab === tab ? 'tab-btn--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_PROJECT_TAB', payload: tab })}
          >
            {tab === 'overview' ? 'OVERVIEW' :
             tab === 'design' ? 'DESIGN & ASSETS' :
             tab === 'specifications' ? 'SPECIFICATIONS' :
             tab === 'materials' ? 'MATERIALS & COST' :
             tab === 'manufacturing' ? 'MANUFACTURING' :
             tab === 'communication' ? 'COMMUNICATION' :
             tab === 'documents' ? 'DOCUMENTS' :
             'TIMELINE'}
          </button>
        ))}
      </div>

      <ProjectTabContent project={project} />
    </div>
  );
}
