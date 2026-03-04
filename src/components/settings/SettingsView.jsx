import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function SettingsView() {
  const { toast } = useApp();
  const [settings, setSettings] = useState({
    storeName: 'Michael Ray Jewelry',
    storeAddress: '123 Diamond Way, Beverly Hills, CA 90210',
    storePhone: '(310) 555-0100',
    storeEmail: 'info@michaelrayjewelry.com',
    taxRate: 8.0,
    currency: 'USD',
    lowStockThreshold: 2,
    defaultMarkup: 2.5,
    autoBackup: true,
    backupFrequency: 'daily',
    emailNotifications: true,
    smsNotifications: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSave(e) {
    e.preventDefault();
    toast('Settings saved successfully', 'success');
  }

  return (
    <div className="settings-view">
      <div className="view-header">
        <h1>Settings</h1>
      </div>

      <form onSubmit={handleSave}>
        {/* Store Information */}
        <div className="card settings-section">
          <div className="card__header"><h3>Store Information</h3></div>
          <div className="card__body">
            <div className="form-grid">
              <div className="form-field">
                <label>Store Name</label>
                <input name="storeName" value={settings.storeName} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input name="storePhone" value={settings.storePhone} onChange={handleChange} />
              </div>
              <div className="form-field form-field--full">
                <label>Address</label>
                <input name="storeAddress" value={settings.storeAddress} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input name="storeEmail" type="email" value={settings.storeEmail} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Tax */}
        <div className="card settings-section">
          <div className="card__header"><h3>Pricing & Tax</h3></div>
          <div className="card__body">
            <div className="form-grid">
              <div className="form-field">
                <label>Tax Rate (%)</label>
                <input name="taxRate" type="number" step="0.1" value={settings.taxRate} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Currency</label>
                <select name="currency" value={settings.currency} onChange={handleChange}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div className="form-field">
                <label>Default Markup (x)</label>
                <input name="defaultMarkup" type="number" step="0.1" value={settings.defaultMarkup} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Low Stock Threshold</label>
                <input name="lowStockThreshold" type="number" value={settings.lowStockThreshold} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card settings-section">
          <div className="card__header"><h3>Notifications</h3></div>
          <div className="card__body">
            <div className="form-grid">
              <div className="form-field">
                <label className="checkbox-label">
                  <input name="emailNotifications" type="checkbox" checked={settings.emailNotifications} onChange={handleChange} />
                  <span>Email Notifications</span>
                </label>
              </div>
              <div className="form-field">
                <label className="checkbox-label">
                  <input name="smsNotifications" type="checkbox" checked={settings.smsNotifications} onChange={handleChange} />
                  <span>SMS Notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="card settings-section">
          <div className="card__header"><h3>Data & Backup</h3></div>
          <div className="card__body">
            <div className="form-grid">
              <div className="form-field">
                <label className="checkbox-label">
                  <input name="autoBackup" type="checkbox" checked={settings.autoBackup} onChange={handleChange} />
                  <span>Automatic Backup</span>
                </label>
              </div>
              <div className="form-field">
                <label>Backup Frequency</label>
                <select name="backupFrequency" value={settings.backupFrequency} onChange={handleChange}>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '24px' }}>
          <button type="submit" className="btn btn--primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
