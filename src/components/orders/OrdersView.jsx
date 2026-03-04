import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../data/sampleData';

export default function OrdersView() {
  const { state, dispatch, toast } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const filtered = state.orders.filter(order => {
    if (statusFilter !== 'All' && order.status !== statusFilter) return false;
    if (paymentFilter !== 'All' && order.paymentStatus !== paymentFilter) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: state.orders.length,
    pending: state.orders.filter(o => o.status === 'Pending').length,
    processing: state.orders.filter(o => o.status === 'Processing').length,
    completed: state.orders.filter(o => o.status === 'Completed').length,
    revenue: state.orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total, 0),
  }), [state.orders]);

  const columns = [
    { key: 'id', label: 'Order #', width: '100px', render: val => <span className="font-medium">{val}</span> },
    { key: 'customerName', label: 'Customer' },
    {
      key: 'items', label: 'Items', sortable: false,
      render: (val) => (
        <span className="truncate" style={{ maxWidth: '200px', display: 'inline-block' }}>
          {val.map(i => i.name).join(', ')}
        </span>
      ),
    },
    { key: 'total', label: 'Total', width: '110px', render: val => formatCurrency(val) },
    { key: 'status', label: 'Status', width: '130px', render: val => <StatusBadge status={val} /> },
    { key: 'paymentStatus', label: 'Payment', width: '100px', render: val => <StatusBadge status={val} /> },
    { key: 'orderDate', label: 'Date', width: '100px', render: val => formatDate(val) },
  ];

  function handleRowClick(order) {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: `Order ${order.id}`,
        content: <OrderDetail order={order} dispatch={dispatch} toast={toast} />,
      },
    });
  }

  return (
    <div className="orders-view">
      <div className="view-header">
        <div>
          <h1>Orders</h1>
          <p className="text-muted">
            {stats.total} orders &middot; {stats.pending} pending &middot; Revenue: {formatCurrency(stats.revenue)}
          </p>
        </div>
      </div>

      <div className="stat-cards-row">
        <div className="mini-stat"><span className="mini-stat__value">{stats.pending}</span><span className="mini-stat__label">Pending</span></div>
        <div className="mini-stat"><span className="mini-stat__value">{stats.processing}</span><span className="mini-stat__label">Processing</span></div>
        <div className="mini-stat"><span className="mini-stat__value">{stats.completed}</span><span className="mini-stat__label">Completed</span></div>
        <div className="mini-stat"><span className="mini-stat__value">{formatCurrency(stats.revenue)}</span><span className="mini-stat__label">Revenue</span></div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Payment</label>
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filtered} onRowClick={handleRowClick} searchQuery={state.searchQuery} />
      </div>
    </div>
  );
}

function OrderDetail({ order, dispatch, toast }) {
  function updateStatus(newStatus) {
    dispatch({ type: 'UPDATE_ORDER', payload: { id: order.id, status: newStatus } });
    dispatch({ type: 'CLOSE_MODAL' });
    toast(`Order ${order.id} updated to ${newStatus}`, 'success');
  }

  return (
    <div className="detail-grid">
      <div className="detail-row"><span className="detail-label">Customer</span><span>{order.customerName}</span></div>
      <div className="detail-row"><span className="detail-label">Order Date</span><span>{formatDate(order.orderDate)}</span></div>
      <div className="detail-row"><span className="detail-label">Status</span><StatusBadge status={order.status} /></div>
      <div className="detail-row"><span className="detail-label">Payment</span><span>{order.paymentMethod} — <StatusBadge status={order.paymentStatus} /></span></div>

      <div className="detail-row detail-row--full">
        <span className="detail-label">Items</span>
        <table className="data-table data-table--compact" style={{ marginTop: '8px' }}>
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}><td>{item.name}</td><td>{item.quantity}</td><td>{formatCurrency(item.price)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="detail-row"><span className="detail-label">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
      <div className="detail-row"><span className="detail-label">Tax</span><span>{formatCurrency(order.tax)}</span></div>
      <div className="detail-row"><span className="detail-label">Total</span><span className="font-bold">{formatCurrency(order.total)}</span></div>

      {order.notes && (
        <div className="detail-row detail-row--full"><span className="detail-label">Notes</span><p>{order.notes}</p></div>
      )}

      <div className="detail-actions">
        <span className="detail-label">Update Status:</span>
        <div className="btn-group">
          {ORDER_STATUSES.filter(s => s !== order.status).slice(0, 4).map(s => (
            <button key={s} className="btn btn--sm btn--outline" onClick={() => updateStatus(s)}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
