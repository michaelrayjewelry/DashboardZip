import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import KpiCard from '../common/KpiCard';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DashboardView() {
  const { state, dispatch } = useApp();

  const metrics = useMemo(() => {
    const totalRevenue = state.orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = state.orders.filter(
      o => o.status === 'Pending' || o.status === 'Processing'
    ).length;

    const inventoryValue = state.inventory.reduce(
      (sum, item) => sum + item.retailPrice * item.quantity, 0
    );

    const activeRepairs = state.repairs.filter(
      r => r.status !== 'Completed'
    ).length;

    const lowStockItems = state.inventory.filter(
      i => i.quantity <= 2 && i.quantity > 0
    ).length;

    const totalCustomers = state.customers.length;
    const vipCustomers = state.customers.filter(c => c.tier === 'VIP').length;

    return { totalRevenue, pendingOrders, inventoryValue, activeRepairs, lowStockItems, totalCustomers, vipCustomers };
  }, [state.orders, state.inventory, state.repairs, state.customers]);

  const recentOrders = useMemo(() =>
    [...state.orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5),
    [state.orders]
  );

  const recentActivity = useMemo(() => {
    const items = [];
    state.orders.forEach(o => {
      items.push({
        id: `order-${o.id}`,
        type: 'order',
        text: `Order ${o.id} — ${o.customerName}`,
        detail: formatCurrency(o.total),
        status: o.status,
        date: o.orderDate,
      });
    });
    state.repairs.forEach(r => {
      items.push({
        id: `repair-${r.id}`,
        type: 'repair',
        text: `Repair ${r.id} — ${r.customerName}`,
        detail: r.repairType,
        status: r.status,
        date: r.receivedDate,
      });
    });
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, [state.orders, state.repairs]);

  return (
    <div className="dashboard-view">
      <div className="view-header">
        <h1>Dashboard</h1>
        <p className="text-muted">Welcome back, Michael. Here's your store overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          trend={12.5}
          trendLabel="vs last month"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <KpiCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          subtitle="require attention"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
            </svg>
          }
        />
        <KpiCard
          title="Inventory Value"
          value={formatCurrency(metrics.inventoryValue)}
          subtitle={`${state.inventory.length} items in stock`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          }
        />
        <KpiCard
          title="Active Repairs"
          value={metrics.activeRepairs}
          subtitle={`${metrics.lowStockItems} low stock alerts`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          }
        />
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="card">
          <div className="card__header">
            <h3>Recent Orders</h3>
            <button className="btn btn--sm btn--ghost" onClick={() => dispatch({ type: 'SET_ROUTE', payload: 'orders' })}>
              View All
            </button>
          </div>
          <div className="card__body card__body--flush">
            <table className="data-table data-table--compact">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr
                    key={order.id}
                    className="data-table__row--clickable"
                    onClick={() => dispatch({ type: 'SET_ROUTE', payload: 'orders' })}
                  >
                    <td className="font-medium">{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <div className="card__header">
            <h3>Recent Activity</h3>
          </div>
          <div className="card__body">
            <div className="activity-feed">
              {recentActivity.map(item => (
                <div key={item.id} className="activity-item">
                  <div className={`activity-item__dot activity-item__dot--${item.type}`} />
                  <div className="activity-item__content">
                    <p className="activity-item__text">{item.text}</p>
                    <div className="activity-item__meta">
                      <span>{item.detail}</span>
                      <StatusBadge status={item.status} />
                      <span className="text-muted">{formatDate(item.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card__header">
            <h3>Customer Insights</h3>
          </div>
          <div className="card__body">
            <div className="stat-list">
              <div className="stat-list__item">
                <span className="stat-list__label">Total Customers</span>
                <span className="stat-list__value">{metrics.totalCustomers}</span>
              </div>
              <div className="stat-list__item">
                <span className="stat-list__label">VIP Customers</span>
                <span className="stat-list__value text-gold">{metrics.vipCustomers}</span>
              </div>
              <div className="stat-list__item">
                <span className="stat-list__label">Avg. Order Value</span>
                <span className="stat-list__value">
                  {formatCurrency(metrics.totalRevenue / Math.max(state.orders.filter(o => o.status === 'Completed').length, 1))}
                </span>
              </div>
              <div className="stat-list__item">
                <span className="stat-list__label">Custom Orders Active</span>
                <span className="stat-list__value">{state.customOrders.filter(co => co.status !== 'Completed').length}</span>
              </div>
              <div className="stat-list__item">
                <span className="stat-list__label">Pending Appraisals</span>
                <span className="stat-list__value">{state.appraisals.filter(a => a.status !== 'Completed').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card__header">
            <h3>Low Stock Alerts</h3>
            <button className="btn btn--sm btn--ghost" onClick={() => dispatch({ type: 'SET_ROUTE', payload: 'inventory' })}>
              View Inventory
            </button>
          </div>
          <div className="card__body">
            {state.inventory
              .filter(i => i.quantity <= 2 && i.quantity > 0)
              .map(item => (
                <div key={item.id} className="alert-item">
                  <div className="alert-item__info">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted">{item.sku}</p>
                  </div>
                  <div className="alert-item__qty">
                    <StatusBadge status="Low Stock" />
                    <span className="font-semibold">{item.quantity} left</span>
                  </div>
                </div>
              ))}
            {state.inventory.filter(i => i.quantity <= 2 && i.quantity > 0).length === 0 && (
              <p className="text-muted">No low stock alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
