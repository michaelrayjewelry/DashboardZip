import React from 'react';
import { useApp } from '../../context/AppContext';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function CustomOrdersView() {
  const { state, dispatch, toast } = useApp();

  const columns = [
    { key: 'id', label: 'ID', width: '90px', render: v => <span className="font-medium">{v}</span> },
    { key: 'customerName', label: 'Customer', width: '130px' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status', width: '140px', render: v => <StatusBadge status={v} /> },
    { key: 'estimatedCost', label: 'Est. Cost', width: '100px', render: v => formatCurrency(v) },
    {
      key: 'depositPaid', label: 'Deposit', width: '100px',
      render: (v, row) => v ? <span className="text-success">{formatCurrency(row.deposit)}</span> : <span className="text-danger">Unpaid</span>,
    },
    { key: 'estimatedCompletion', label: 'Est. Complete', width: '110px', render: v => formatDate(v) },
  ];

  function handleRowClick(co) {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: `Custom Order ${co.id}`,
        content: (
          <div className="detail-grid">
            <div className="detail-row"><span className="detail-label">Customer</span><span>{co.customerName}</span></div>
            <div className="detail-row"><span className="detail-label">Description</span><span>{co.description}</span></div>
            <div className="detail-row detail-row--full"><span className="detail-label">Specifications</span><p>{co.specifications}</p></div>
            <div className="detail-row"><span className="detail-label">Status</span><StatusBadge status={co.status} /></div>
            <div className="detail-row"><span className="detail-label">Requested</span><span>{formatDate(co.requestDate)}</span></div>
            <div className="detail-row"><span className="detail-label">Est. Completion</span><span>{formatDate(co.estimatedCompletion)}</span></div>
            <div className="detail-row"><span className="detail-label">Estimated Cost</span><span className="font-bold">{formatCurrency(co.estimatedCost)}</span></div>
            <div className="detail-row"><span className="detail-label">Deposit</span>
              <span>{co.depositPaid ? <span className="text-success">{formatCurrency(co.deposit)} paid</span> : <span className="text-danger">Not paid</span>}</span>
            </div>
            {co.notes && <div className="detail-row detail-row--full"><span className="detail-label">Notes</span><p>{co.notes}</p></div>}
            <div className="detail-actions">
              <span className="detail-label">Update Status:</span>
              <div className="btn-group">
                {['Pending Approval', 'Design Phase', 'Production', 'Completed'].filter(s => s !== co.status).map(s => (
                  <button key={s} className="btn btn--sm btn--outline" onClick={() => {
                    dispatch({ type: 'UPDATE_CUSTOM_ORDER', payload: { id: co.id, status: s } });
                    dispatch({ type: 'CLOSE_MODAL' });
                    toast(`Custom order ${co.id} updated`, 'success');
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        ),
      },
    });
  }

  return (
    <div className="custom-orders-view">
      <div className="view-header">
        <div>
          <h1>Custom Orders</h1>
          <p className="text-muted">{state.customOrders.length} orders &middot; {state.customOrders.filter(co => co.status !== 'Completed').length} active</p>
        </div>
      </div>
      <div className="card">
        <DataTable columns={columns} data={state.customOrders} onRowClick={handleRowClick} searchQuery={state.searchQuery} />
      </div>
    </div>
  );
}
