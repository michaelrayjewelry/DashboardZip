import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../common/StatusBadge';

// Built-in tools that ship with Zip Jeweler
const BUILT_IN_TOOLS = [
  {
    id: 'xml-import-export',
    name: 'XML Import/Export',
    description: 'Import and export inventory, orders, and customer data in XML format. Compatible with industry-standard jewelry management systems.',
    category: 'Data',
    version: '1.0.0',
    enabled: true,
    builtin: true,
  },
  {
    id: 'price-calculator',
    name: 'Price Calculator',
    description: 'Calculate retail prices based on metal weight, gemstone value, labor costs, and desired margin. Supports live metal price lookups.',
    category: 'Pricing',
    version: '1.0.0',
    enabled: true,
    builtin: true,
  },
  {
    id: 'label-printer',
    name: 'Label & Tag Printer',
    description: 'Generate and print jewelry tags, barcodes, and price labels. Supports Dymo and Zebra printers.',
    category: 'Operations',
    version: '1.0.0',
    enabled: false,
    builtin: true,
  },
  {
    id: 'appraisal-generator',
    name: 'Appraisal Document Generator',
    description: 'Create professional appraisal documents with item photos, specifications, and valuations. PDF export included.',
    category: 'Documents',
    version: '1.0.0',
    enabled: true,
    builtin: true,
  },
  {
    id: 'customer-notifications',
    name: 'Customer Notifications',
    description: 'Send automated email and SMS notifications for order updates, repair completion, appointment reminders, and birthday wishes.',
    category: 'Communication',
    version: '1.0.0',
    enabled: false,
    builtin: true,
  },
  {
    id: 'metal-price-tracker',
    name: 'Metal Price Tracker',
    description: 'Track live gold, silver, platinum, and palladium spot prices. Set alerts for price thresholds.',
    category: 'Market Data',
    version: '1.0.0',
    enabled: true,
    builtin: true,
  },
];

// Available plugins for installation
const AVAILABLE_PLUGINS = [
  {
    id: 'gia-lookup',
    name: 'GIA Certificate Lookup',
    description: 'Verify and pull gemstone certification data directly from GIA. Auto-populate inventory fields.',
    category: 'Verification',
    version: '1.2.0',
    author: 'Zip Jeweler Labs',
  },
  {
    id: 'insurance-integration',
    name: 'Insurance Integration',
    description: 'Connect with Jewelers Mutual and other insurance providers for streamlined claims and coverage management.',
    category: 'Insurance',
    version: '2.0.1',
    author: 'InsureTech Partners',
  },
  {
    id: 'ecommerce-sync',
    name: 'E-Commerce Sync',
    description: 'Sync inventory and orders with Shopify, WooCommerce, and Etsy storefronts. Real-time stock updates.',
    category: 'E-Commerce',
    version: '1.5.0',
    author: 'Zip Jeweler Labs',
  },
  {
    id: 'cad-viewer',
    name: 'CAD Model Viewer',
    description: '3D CAD file viewer for custom order designs. Supports STL, OBJ, and 3DM formats with customer sharing.',
    category: 'Design',
    version: '1.0.0',
    author: 'DesignView Inc',
  },
];

export default function ToolsView() {
  const { state, dispatch, toast } = useApp();
  const [activeTab, setActiveTab] = useState('installed');
  const [tools, setTools] = useState(BUILT_IN_TOOLS);

  function toggleTool(toolId) {
    setTools(prev => prev.map(t =>
      t.id === toolId ? { ...t, enabled: !t.enabled } : t
    ));
    const tool = tools.find(t => t.id === toolId);
    toast(`${tool.name} ${tool.enabled ? 'disabled' : 'enabled'}`, 'info');
  }

  function installPlugin(plugin) {
    const newTool = {
      ...plugin,
      enabled: true,
      builtin: false,
    };
    setTools(prev => [...prev, newTool]);
    dispatch({ type: 'REGISTER_PLUGIN', payload: { id: plugin.id, name: plugin.name } });
    toast(`${plugin.name} installed successfully`, 'success');
  }

  function uninstallPlugin(toolId) {
    const tool = tools.find(t => t.id === toolId);
    setTools(prev => prev.filter(t => t.id !== toolId));
    dispatch({ type: 'UNREGISTER_PLUGIN', payload: toolId });
    toast(`${tool.name} uninstalled`, 'info');
  }

  const installedPlugins = tools.filter(t => !t.builtin);
  const availablePlugins = AVAILABLE_PLUGINS.filter(p => !tools.find(t => t.id === p.id));

  return (
    <div className="tools-view">
      <div className="view-header">
        <div>
          <h1>Tools & Plugins</h1>
          <p className="text-muted">Manage built-in tools and extend functionality with plugins</p>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'installed' ? 'tab-btn--active' : ''}`} onClick={() => setActiveTab('installed')}>
          Built-in Tools ({tools.filter(t => t.builtin).length})
        </button>
        <button className={`tab-btn ${activeTab === 'plugins' ? 'tab-btn--active' : ''}`} onClick={() => setActiveTab('plugins')}>
          Installed Plugins ({installedPlugins.length})
        </button>
        <button className={`tab-btn ${activeTab === 'marketplace' ? 'tab-btn--active' : ''}`} onClick={() => setActiveTab('marketplace')}>
          Available Plugins ({availablePlugins.length})
        </button>
      </div>

      {activeTab === 'installed' && (
        <div className="tools-grid">
          {tools.filter(t => t.builtin).map(tool => (
            <div key={tool.id} className={`tool-card ${tool.enabled ? 'tool-card--active' : ''}`}>
              <div className="tool-card__header">
                <h3 className="tool-card__name">{tool.name}</h3>
                <label className="toggle-switch">
                  <input type="checkbox" checked={tool.enabled} onChange={() => toggleTool(tool.id)} />
                  <span className="toggle-switch__slider" />
                </label>
              </div>
              <p className="tool-card__desc">{tool.description}</p>
              <div className="tool-card__meta">
                <span className="badge badge--default">{tool.category}</span>
                <span className="text-muted">v{tool.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'plugins' && (
        <div className="tools-grid">
          {installedPlugins.length === 0 ? (
            <div className="empty-state">
              <p>No plugins installed yet.</p>
              <button className="btn btn--primary" onClick={() => setActiveTab('marketplace')}>Browse Available Plugins</button>
            </div>
          ) : (
            installedPlugins.map(plugin => (
              <div key={plugin.id} className="tool-card tool-card--active">
                <div className="tool-card__header">
                  <h3 className="tool-card__name">{plugin.name}</h3>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={plugin.enabled} onChange={() => toggleTool(plugin.id)} />
                    <span className="toggle-switch__slider" />
                  </label>
                </div>
                <p className="tool-card__desc">{plugin.description}</p>
                <div className="tool-card__meta">
                  <span className="badge badge--default">{plugin.category}</span>
                  <span className="text-muted">v{plugin.version}</span>
                </div>
                <div className="tool-card__actions">
                  <button className="btn btn--sm btn--danger" onClick={() => uninstallPlugin(plugin.id)}>Uninstall</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="tools-grid">
          {availablePlugins.length === 0 ? (
            <div className="empty-state">
              <p>All available plugins are already installed!</p>
            </div>
          ) : (
            availablePlugins.map(plugin => (
              <div key={plugin.id} className="tool-card">
                <div className="tool-card__header">
                  <h3 className="tool-card__name">{plugin.name}</h3>
                  <StatusBadge status="Available" />
                </div>
                <p className="tool-card__desc">{plugin.description}</p>
                <div className="tool-card__meta">
                  <span className="badge badge--default">{plugin.category}</span>
                  <span className="text-muted">v{plugin.version} &middot; {plugin.author}</span>
                </div>
                <div className="tool-card__actions">
                  <button className="btn btn--sm btn--primary" onClick={() => installPlugin(plugin)}>Install</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
