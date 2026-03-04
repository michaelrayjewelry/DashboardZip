import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export default function ReportsView() {
  const { state } = useApp();
  const [activeReport, setActiveReport] = useState('sales');

  const salesData = useMemo(() => {
    const completed = state.orders.filter(o => o.status === 'Completed');
    const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
    const totalCost = completed.reduce((s, o) => {
      return s + o.items.reduce((is, item) => {
        const inv = state.inventory.find(i => i.id === item.inventoryId);
        return is + (inv ? inv.costPrice * item.quantity : 0);
      }, 0);
    }, 0);

    const byCategory = {};
    completed.forEach(o => {
      o.items.forEach(item => {
        const inv = state.inventory.find(i => i.id === item.inventoryId);
        const cat = inv?.category || 'Other';
        byCategory[cat] = (byCategory[cat] || 0) + item.price * item.quantity;
      });
    });

    const byPayment = {};
    completed.forEach(o => {
      byPayment[o.paymentMethod] = (byPayment[o.paymentMethod] || 0) + o.total;
    });

    return { totalRevenue, totalCost, grossProfit: totalRevenue - totalCost, margin: totalCost > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100) : 0, byCategory, byPayment, count: completed.length };
  }, [state.orders, state.inventory]);

  const inventoryData = useMemo(() => {
    const totalItems = state.inventory.reduce((s, i) => s + i.quantity, 0);
    const totalRetail = state.inventory.reduce((s, i) => s + i.retailPrice * i.quantity, 0);
    const totalCost = state.inventory.reduce((s, i) => s + i.costPrice * i.quantity, 0);
    const byCategory = {};
    state.inventory.forEach(i => {
      if (!byCategory[i.category]) byCategory[i.category] = { count: 0, value: 0 };
      byCategory[i.category].count += i.quantity;
      byCategory[i.category].value += i.retailPrice * i.quantity;
    });
    const lowStock = state.inventory.filter(i => i.quantity <= 2 && i.quantity > 0);
    return { totalItems, totalRetail, totalCost, byCategory, lowStock };
  }, [state.inventory]);

  const customerData = useMemo(() => {
    const topCustomers = [...state.customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
    const byTier = {};
    state.customers.forEach(c => { byTier[c.tier] = (byTier[c.tier] || 0) + 1; });
    const totalSpent = state.customers.reduce((s, c) => s + c.totalSpent, 0);
    return { topCustomers, byTier, totalSpent, avgSpend: totalSpent / Math.max(state.customers.length, 1) };
  }, [state.customers]);

  return (
    <div className="reports-view">
      <div className="view-header">
        <h1>Reports</h1>
      </div>

      <div className="tab-bar">
        {[
          { id: 'sales', label: 'Sales Report' },
          { id: 'inventory', label: 'Inventory Report' },
          { id: 'customers', label: 'Customer Report' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeReport === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveReport(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeReport === 'sales' && (
        <div className="report-content">
          <div className="kpi-grid kpi-grid--3">
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Total Revenue</span></div><div className="kpi-card__value">{formatCurrency(salesData.totalRevenue)}</div><div className="kpi-card__footer"><span className="kpi-card__subtitle">{salesData.count} completed orders</span></div></div>
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Gross Profit</span></div><div className="kpi-card__value text-success">{formatCurrency(salesData.grossProfit)}</div><div className="kpi-card__footer"><span className="kpi-card__subtitle">{salesData.margin.toFixed(1)}% margin</span></div></div>
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Avg. Order Value</span></div><div className="kpi-card__value">{formatCurrency(salesData.totalRevenue / Math.max(salesData.count, 1))}</div></div>
          </div>

          <div className="report-grid">
            <div className="card">
              <div className="card__header"><h3>Revenue by Category</h3></div>
              <div className="card__body">
                <div className="bar-chart">
                  {Object.entries(salesData.byCategory).sort(([,a],[,b]) => b - a).map(([cat, val]) => (
                    <div key={cat} className="bar-chart__row">
                      <span className="bar-chart__label">{cat}</span>
                      <div className="bar-chart__bar-wrapper">
                        <div className="bar-chart__bar" style={{ width: `${(val / Math.max(...Object.values(salesData.byCategory), 1)) * 100}%` }} />
                      </div>
                      <span className="bar-chart__value">{formatCurrency(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__header"><h3>Payment Methods</h3></div>
              <div className="card__body">
                <div className="stat-list">
                  {Object.entries(salesData.byPayment).sort(([,a],[,b]) => b - a).map(([method, val]) => (
                    <div key={method} className="stat-list__item">
                      <span className="stat-list__label">{method}</span>
                      <span className="stat-list__value">{formatCurrency(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'inventory' && (
        <div className="report-content">
          <div className="kpi-grid kpi-grid--3">
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Total Items</span></div><div className="kpi-card__value">{inventoryData.totalItems}</div></div>
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Retail Value</span></div><div className="kpi-card__value">{formatCurrency(inventoryData.totalRetail)}</div></div>
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Cost Basis</span></div><div className="kpi-card__value">{formatCurrency(inventoryData.totalCost)}</div></div>
          </div>

          <div className="report-grid">
            <div className="card">
              <div className="card__header"><h3>By Category</h3></div>
              <div className="card__body">
                <div className="bar-chart">
                  {Object.entries(inventoryData.byCategory).sort(([,a],[,b]) => b.value - a.value).map(([cat, data]) => (
                    <div key={cat} className="bar-chart__row">
                      <span className="bar-chart__label">{cat} ({data.count})</span>
                      <div className="bar-chart__bar-wrapper">
                        <div className="bar-chart__bar" style={{ width: `${(data.value / Math.max(...Object.values(inventoryData.byCategory).map(d => d.value), 1)) * 100}%` }} />
                      </div>
                      <span className="bar-chart__value">{formatCurrency(data.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__header"><h3>Low Stock Items</h3></div>
              <div className="card__body">
                {inventoryData.lowStock.length > 0 ? (
                  <div className="stat-list">
                    {inventoryData.lowStock.map(item => (
                      <div key={item.id} className="stat-list__item">
                        <span className="stat-list__label">{item.name}</span>
                        <span className="stat-list__value text-danger">{item.quantity} left</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted">All items well stocked</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'customers' && (
        <div className="report-content">
          <div className="kpi-grid kpi-grid--3">
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Total Customers</span></div><div className="kpi-card__value">{state.customers.length}</div></div>
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Total Revenue</span></div><div className="kpi-card__value">{formatCurrency(customerData.totalSpent)}</div></div>
            <div className="kpi-card"><div className="kpi-card__header"><span className="kpi-card__title">Avg. Spend</span></div><div className="kpi-card__value">{formatCurrency(customerData.avgSpend)}</div></div>
          </div>

          <div className="report-grid">
            <div className="card">
              <div className="card__header"><h3>Top Customers</h3></div>
              <div className="card__body">
                <div className="bar-chart">
                  {customerData.topCustomers.map(c => (
                    <div key={c.id} className="bar-chart__row">
                      <span className="bar-chart__label">{c.firstName} {c.lastName}</span>
                      <div className="bar-chart__bar-wrapper">
                        <div className="bar-chart__bar" style={{ width: `${(c.totalSpent / Math.max(customerData.topCustomers[0]?.totalSpent, 1)) * 100}%` }} />
                      </div>
                      <span className="bar-chart__value">{formatCurrency(c.totalSpent)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card__header"><h3>Customer Tiers</h3></div>
              <div className="card__body">
                <div className="stat-list">
                  {Object.entries(customerData.byTier).map(([tier, count]) => (
                    <div key={tier} className="stat-list__item">
                      <span className="stat-list__label">{tier}</span>
                      <span className="stat-list__value">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
