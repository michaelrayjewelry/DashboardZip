import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ORDER_STAGES, ORDER_STAGE_LABELS } from '../../data/sampleData';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STAGE_COLORS = {
  confirmed: '#3b82f6',
  manufacturing: '#8b5cf6',
  qc: '#f59e0b',
  'auth-card': '#06b6d4',
  packaging: '#10b981',
  shipped: '#6366f1',
  delivered: '#22c55e',
};

function StageDots({ currentStage }) {
  const currentIdx = ORDER_STAGES.indexOf(currentStage);

  return (
    <div className="stage-dots">
      {ORDER_STAGES.map((stage, idx) => {
        let dotClass = 'stage-dots__dot';
        if (idx < currentIdx) dotClass += ' stage-dots__dot--completed';
        else if (idx === currentIdx) dotClass += ' stage-dots__dot--current';
        else dotClass += ' stage-dots__dot--future';

        return (
          <span
            key={stage}
            className={dotClass}
            style={idx <= currentIdx ? { background: STAGE_COLORS[currentStage] } : {}}
            title={ORDER_STAGE_LABELS[stage]}
          />
        );
      })}
    </div>
  );
}

export default function OrdersView() {
  const { state, dispatch } = useApp();

  const filtered = useMemo(() => {
    let result = state.orders;

    if (state.orderPipelineFilter !== 'all') {
      result = result.filter(o => o.stage === state.orderPipelineFilter);
    }

    if (state.orderPaymentFilter === 'paid') {
      result = result.filter(o => o.paymentStatus === 'paid');
    } else if (state.orderPaymentFilter === 'unpaid') {
      result = result.filter(o => o.paymentStatus === 'due');
    }

    if (state.orderSearch) {
      const q = state.orderSearch.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      if (state.orderSort === 'newest') return new Date(b.date) - new Date(a.date);
      return new Date(a.date) - new Date(b.date);
    });

    return result;
  }, [state.orders, state.orderPipelineFilter, state.orderPaymentFilter, state.orderSearch, state.orderSort]);

  const stats = useMemo(() => {
    const active = state.orders.filter(o => o.stage !== 'delivered');
    const totalRevenue = state.orders.reduce((s, o) => s + o.total, 0);
    const outstanding = state.orders.reduce((s, o) => s + o.amountDue, 0);
    const rushCount = state.orders.filter(o => o.rush).length;
    return { active: active.length, totalRevenue, outstanding, rushCount };
  }, [state.orders]);

  return (
    <div className="orders-view">
      <div className="view-header">
        <h1 className="page-title">ORDERS</h1>
        <div className="view-header__actions">
          <button className="btn btn--outline">EXPORT ORDERS</button>
          <button className="btn btn--primary">+ NEW ORDER</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-card__title">ACTIVE ORDERS</span>
          <span className="kpi-card__value">{stats.active}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card__title">TOTAL REVENUE</span>
          <span className="kpi-card__value">{formatCurrency(stats.totalRevenue)}</span>
        </div>
        <div className="kpi-card kpi-card--warning">
          <span className="kpi-card__title">OUTSTANDING BALANCE</span>
          <span className="kpi-card__value">{formatCurrency(stats.outstanding)}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-card__title">RUSH ORDERS</span>
          <span className="kpi-card__value">{stats.rushCount}</span>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="orders-toolbar__left">
          <div className="search-bar search-bar--inline">
            <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search orders..."
              value={state.orderSearch}
              onChange={e => dispatch({ type: 'SET_ORDER_SEARCH', payload: e.target.value })}
            />
          </div>
          <div className="filter-pills">
            {['all', 'paid', 'unpaid'].map(f => (
              <button
                key={f}
                className={`filter-pill ${state.orderPaymentFilter === f ? 'filter-pill--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ORDER_PAYMENT_FILTER', payload: f })}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="orders-toolbar__right">
          <select
            className="sort-select"
            value={state.orderSort}
            onChange={e => dispatch({ type: 'SET_ORDER_SORT', payload: e.target.value })}
          >
            <option value="newest">NEWEST</option>
            <option value="oldest">OLDEST</option>
          </select>
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>PRODUCT / CLIENT</th>
              <th>STAGE</th>
              <th>TOTAL</th>
              <th>PAYMENT</th>
              <th>DUE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="orders-table__row">
                <td>
                  <div className="order-id-cell">
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">{formatDate(order.date)}</span>
                  </div>
                </td>
                <td>
                  <div className="order-product-cell">
                    <span className="order-product">{order.product}</span>
                    <span className="order-client">{order.client} &middot; {order.source}</span>
                  </div>
                </td>
                <td>
                  <div className="order-stage-cell">
                    <StageDots currentStage={order.stage} />
                    <span className="order-stage-label">{ORDER_STAGE_LABELS[order.stage]}</span>
                  </div>
                </td>
                <td className="order-total">{formatCurrency(order.total)}</td>
                <td>
                  {order.paymentStatus === 'paid' ? (
                    <span className="badge badge--success">PAID</span>
                  ) : (
                    <span className="badge badge--warning">{formatCurrency(order.amountDue)} DUE</span>
                  )}
                </td>
                <td>
                  <div className="order-due-cell">
                    <span>{formatDate(order.dueDate)}</span>
                    {order.rush && <span className="rush-badge">RUSH</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="orders-footer">
        <span>{filtered.length} {state.orderPipelineFilter !== 'all' ? ORDER_STAGE_LABELS[state.orderPipelineFilter].toUpperCase() : ''} ORDERS</span>
        <span>&middot;</span>
        <span>{formatCurrency(filtered.reduce((s, o) => s + o.total, 0))} TOTAL REVENUE</span>
      </div>
    </div>
  );
}
