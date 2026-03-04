import React from 'react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
  },
  {
    id: 'inventory', label: 'Inventory',
    icon: <><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /><line x1="12" y1="22" x2="12" y2="15.5" /><polyline points="22 8.5 12 15.5 2 8.5" /></>,
  },
  {
    id: 'orders', label: 'Orders',
    icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>,
    badgeKey: 'orders',
  },
  {
    id: 'customers', label: 'Customers',
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>,
  },
  { id: '_sep1', separator: true },
  {
    id: 'appraisals', label: 'Appraisals',
    icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  },
  {
    id: 'repairs', label: 'Repairs',
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />,
    badgeKey: 'repairs', badgeType: 'warning',
  },
  {
    id: 'custom-orders', label: 'Custom Orders',
    icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  },
  { id: '_sep2', separator: true },
  {
    id: 'reports', label: 'Reports',
    icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  },
  {
    id: 'tools', label: 'Tools',
    icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>,
  },
  {
    id: 'settings', label: 'Settings',
    icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>,
  },
];

function getBadgeCount(state, key) {
  if (key === 'orders') {
    return state.orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  }
  if (key === 'repairs') {
    return state.repairs.filter(r => r.status !== 'Completed' && r.status !== 'Ready for Pickup').length;
  }
  return 0;
}

export default function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <aside className={`sidebar ${state.sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          {NAV_ITEMS.map(item => {
            if (item.separator) {
              return <li key={item.id} className="sidebar__separator" />;
            }

            const isActive = state.activeRoute === item.id;
            const badgeCount = item.badgeKey ? getBadgeCount(state, item.badgeKey) : 0;

            return (
              <li
                key={item.id}
                className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ROUTE', payload: item.id })}
                title={state.sidebarCollapsed ? item.label : undefined}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {item.icon}
                </svg>
                <span>{item.label}</span>
                {badgeCount > 0 && (
                  <span className={`sidebar__badge ${item.badgeType === 'warning' ? 'sidebar__badge--warning' : ''}`}>
                    {badgeCount}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__version">Zip Jeweler v1.0</div>
      </div>
    </aside>
  );
}
