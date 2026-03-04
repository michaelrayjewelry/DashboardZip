import React from 'react';
import { useApp } from '../../context/AppContext';
import { ORDER_STAGES, ORDER_STAGE_LABELS, COLLECTIONS } from '../../data/sampleData';

const PROJECT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'design', label: 'Design & Assets' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'materials', label: 'Materials & Cost' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'communication', label: 'Communication' },
  { id: 'documents', label: 'Documents' },
  { id: 'timeline', label: 'Timeline' },
];

const STAGE_COLORS = {
  confirmed: '#3b82f6',
  manufacturing: '#8b5cf6',
  qc: '#f59e0b',
  'auth-card': '#06b6d4',
  packaging: '#10b981',
  shipped: '#6366f1',
  delivered: '#22c55e',
};

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: 'dashboard', label: 'DASHBOARD' },
      { id: 'projects', label: 'PROJECTS' },
      { id: 'products', label: 'PRODUCTS' },
      { id: 'orders', label: 'ORDERS' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { id: 'customers', label: 'CUSTOMERS' },
      { id: 'inventory', label: 'INVENTORY' },
      { id: 'repairs', label: 'REPAIRS' },
      { id: 'appraisals', label: 'APPRAISALS' },
      { id: 'custom-orders', label: 'CUSTOM ORDERS' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'reports', label: 'REPORTS' },
      { id: 'tools', label: 'TOOLS & PLUGINS' },
      { id: 'settings', label: 'SETTINGS' },
      { id: 'users', label: 'USERS' },
    ],
  },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  function getOrderCountForStage(stage) {
    return state.orders.filter(o => o.stage === stage).length;
  }

  function getProductCountForCollection(collection) {
    if (collection === 'all') return state.products.length;
    return state.products.filter(p => p.collection === collection).length;
  }

  return (
    <aside className={`sidebar ${state.sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-zip">ZIP</span>
        <span className="sidebar__brand-jeweler">JEWELER</span>
      </div>

      <nav className="sidebar__nav">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="sidebar__group">
            {group.label && (
              <div className="sidebar__section-header">{group.label}</div>
            )}
            <ul className="sidebar__menu">
              {group.items.map(item => (
                <li
                  key={item.id}
                  className={`sidebar__item ${state.activeRoute === item.id ? 'sidebar__item--active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_ROUTE', payload: item.id })}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {state.activeRoute === 'projects' && state.selectedProjectId && (
          <div className="sidebar__subnav">
            <div className="sidebar__subnav-header">THIS PROJECT</div>
            <ul className="sidebar__submenu">
              {PROJECT_TABS.map(tab => (
                <li
                  key={tab.id}
                  className={`sidebar__subitem ${state.projectTab === tab.id ? 'sidebar__subitem--active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_PROJECT_TAB', payload: tab.id })}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.activeRoute === 'orders' && (
          <div className="sidebar__subnav">
            <div className="sidebar__subnav-header">PIPELINE</div>
            <ul className="sidebar__submenu">
              <li
                className={`sidebar__subitem ${state.orderPipelineFilter === 'all' ? 'sidebar__subitem--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ORDER_PIPELINE_FILTER', payload: 'all' })}
              >
                All Orders
                <span className="sidebar__count">{state.orders.length}</span>
              </li>
              {ORDER_STAGES.map(stage => (
                <li
                  key={stage}
                  className={`sidebar__subitem ${state.orderPipelineFilter === stage ? 'sidebar__subitem--active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_ORDER_PIPELINE_FILTER', payload: stage })}
                >
                  <span className="sidebar__stage-dot" style={{ background: STAGE_COLORS[stage] }} />
                  {ORDER_STAGE_LABELS[stage]}
                  <span className="sidebar__count">{getOrderCountForStage(stage)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.activeRoute === 'products' && (
          <div className="sidebar__subnav">
            <div className="sidebar__subnav-header">COLLECTIONS</div>
            <ul className="sidebar__submenu">
              <li
                className={`sidebar__subitem ${state.productCollectionFilter === 'all' ? 'sidebar__subitem--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_PRODUCT_COLLECTION_FILTER', payload: 'all' })}
              >
                All Products
                <span className="sidebar__count">{getProductCountForCollection('all')}</span>
              </li>
              {COLLECTIONS.map(col => (
                <li
                  key={col}
                  className={`sidebar__subitem ${state.productCollectionFilter === col ? 'sidebar__subitem--active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_PRODUCT_COLLECTION_FILTER', payload: col })}
                >
                  {col}
                  <span className="sidebar__count">{getProductCountForCollection(col)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.activeRoute === 'dashboard' && (
          <div className="sidebar__subnav">
            <div className="sidebar__subnav-header">COLLECTIONS</div>
            <ul className="sidebar__submenu">
              {COLLECTIONS.map(col => (
                <li key={col} className="sidebar__subitem">
                  {col}
                  <span className="sidebar__count">{getProductCountForCollection(col)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__footer-text">ZIPJEWELER.COM</span>
      </div>
    </aside>
  );
}
