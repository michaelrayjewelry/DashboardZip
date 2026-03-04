import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { exportToXml } from '../../utils/xmlEngine';

export default function Topbar() {
  const { state, dispatch, toast } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const fileInputRef = useRef(null);

  const unreadCount = state.notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e) {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(event.target.result, 'text/xml');
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          toast('Invalid XML file format', 'error');
          return;
        }
        toast('XML data imported successfully', 'success');
      } catch (err) {
        toast('Failed to import XML: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleExport() {
    const xml = exportToXml(state);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zip-jeweler-export-${new Date().toISOString().slice(0, 10)}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported to XML', 'success');
  }

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          className="topbar__menu-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="topbar__brand">
          <svg className="topbar__logo" width="32" height="32" viewBox="0 0 32 32">
            <polygon points="16,2 28,10 24,28 8,28 4,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="16,6 23,11 21,24 11,24 9,11" fill="currentColor" opacity="0.15" />
            <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.4" />
          </svg>
          <span className="topbar__title">Zip Jeweler</span>
        </div>
      </div>

      <div className="topbar__center">
        <div className="search-bar">
          <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search inventory, orders, customers..."
            value={state.searchQuery}
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="topbar__right">
        <button className="topbar__action" onClick={handleImportClick} title="Import XML Data">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
        <button className="topbar__action" onClick={handleExport} title="Export XML Data">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        <div className="topbar__divider" />

        <div className="topbar__notification-wrapper" ref={notifRef}>
          <button
            className="topbar__action"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="topbar__badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown__header">
                <h4>Notifications</h4>
                <span className="text-muted">{unreadCount} unread</span>
              </div>
              <div className="notification-dropdown__list">
                {state.notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notification-item ${n.read ? '' : 'notification-item--unread'}`}
                    onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                  >
                    <p className="notification-item__text">{n.text}</p>
                    <span className="notification-item__time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="topbar__action"
          onClick={() => dispatch({ type: 'SET_ROUTE', payload: 'tools' })}
          title="Manage Tools & Plugins"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        <div className="topbar__divider" />

        <div className="topbar__user">
          <div className="topbar__avatar">MR</div>
          <span className="topbar__username">Michael Ray</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xml"
        style={{ display: 'none' }}
        onChange={handleFileImport}
      />
    </header>
  );
}
