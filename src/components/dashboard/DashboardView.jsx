import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import KpiCard from '../common/KpiCard';
import StatusBadge from '../common/StatusBadge';
import ToolModal from './ToolModal';

const AI_TOOLS = [
  { id: 'imagine', title: 'Imagine Something New', sub: 'Begin Custom Jewelry Concept' },
  { id: 'convert', title: 'Convert to Render', sub: 'Generate High-Quality Render' },
  { id: 'estimate', title: 'Appraise & Estimate', sub: 'Approximate Pricing Only' },
  { id: 'gallery', title: 'Inspiration Gallery', sub: 'View Recent Creations' },
];

const MORE_TOOLS = [
  { id: 'sketch', title: 'Sketch to Jewelry', sub: 'Hand-drawn to photorealistic' },
  { id: 'marketing', title: 'Image to Marketing', sub: 'Generate campaign content' },
  { id: '3d', title: '3D Model Gen', sub: 'Export-ready meshes' },
  { id: 'files', title: 'File Hub', sub: 'CAD, certs, specs' },
];

export default function DashboardView() {
  const { state, dispatch } = useApp();
  const [activeTool, setActiveTool] = useState(null);

  const activeProjects = state.projects.filter(p => p.status === 'In Progress').length;
  const totalProducts = state.products.length;

  return (
    <div className="dashboard-view">
      <div className="view-header">
        <h1>Dashboard</h1>
        <div className="view-header__actions">
          <button
            className="btn btn--primary"
            onClick={() => {
              dispatch({ type: 'SET_ROUTE', payload: 'projects' });
              dispatch({ type: 'SELECT_PROJECT', payload: null });
            }}
          >
            + New Project
          </button>
        </div>
      </div>

      {/* AI-Assisted Tools — 2x2 Grid */}
      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <span className="dashboard-section__label">AI-Assisted Tools</span>
        </div>
        <div className="ai-tools-grid">
          {AI_TOOLS.map(tool => (
            <button
              key={tool.id}
              className="ai-tool-card"
              onClick={() => setActiveTool(tool)}
            >
              <div className="ai-tool-card__title">{tool.title}</div>
              <div className="ai-tool-card__sub">{tool.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* More Tools — Horizontal Row */}
      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <span className="dashboard-section__label">More Tools</span>
        </div>
        <div className="more-tools-row">
          {MORE_TOOLS.map(tool => (
            <button
              key={tool.id}
              className="mini-tool-card"
              onClick={() => setActiveTool(tool)}
            >
              <div className="mini-tool-card__title">{tool.title}</div>
              <div className="mini-tool-card__sub">{tool.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <span className="dashboard-section__label">Recent Projects</span>
          <span
            className="dashboard-section__link"
            onClick={() => dispatch({ type: 'SET_ROUTE', payload: 'projects' })}
          >
            View All &rarr;
          </span>
        </div>
        <div className="project-list">
          {state.projects.map(project => (
            <div
              key={project.id}
              className="project-row"
              onClick={() => {
                dispatch({ type: 'SET_ROUTE', payload: 'projects' });
                dispatch({ type: 'SELECT_PROJECT', payload: project.id });
              }}
            >
              <div className="project-row__thumb">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" />
                </svg>
              </div>
              <div className="project-row__info">
                <div className="project-row__name">{project.name}</div>
                <div className="project-row__meta">{project.collection} &middot; {project.stage}</div>
              </div>
              <StatusBadge status={project.status} />
              <span className="project-row__time">
                {project.activity?.[0]?.time || 'No activity'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <span className="dashboard-section__label">Overview</span>
        </div>
        <div className="kpi-grid kpi-grid--4">
          <KpiCard title="Active Projects" value={activeProjects} />
          <KpiCard title="Pieces Created" value={totalProducts} />
          <KpiCard title="AI Generations" value={143} />
          <KpiCard title="Avg. Turnaround" value="4.2d" />
        </div>
      </div>

      {/* Footer tagline */}
      <div className="dashboard-footer">
        <div className="dashboard-footer__line" />
        <div className="dashboard-footer__text">Every piece. Every order. Organized.</div>
      </div>

      {/* Tool Modal */}
      {activeTool && (
        <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
}
