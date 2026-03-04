import React from 'react';
import { useApp } from '../../context/AppContext';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { REPAIR_STATUSES } from '../../data/sampleData';

export default function RepairsView() {
  const { state, dispatch, toast } = useApp();

  const columns = [
    { key: 'id', label: 'Repair #', width: '100px', render: v => <span className="font-medium">{v}</span> },
    { key: 'customerName', label: 'Customer' },
    { key: 'itemDescription', label: 'Item' },
    { key: 'repairType', label: 'Type', width: '130px' },
    { key: 'status', label: 'Status', width: '140px', render: v => <StatusBadge status={v} /> },
    { key: 'cost', label: 'Cost', width: '90px', render: v => formatCurrency(v) },
    { key: 'estimatedCompletion', label: 'Est. Complete', width: '110px', render: v => formatDate(v) },
  ];

  function handleRowClick(repair) {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: `Repair ${repair.id}`,
        content: (
          <div className="detail-grid">
            <div className="detail-row"><span className="detail-label">Customer</span><span>{repair.customerName}</span></div>
            <div className="detail-row"><span className="detail-label">Item</span><span>{repair.itemDescription}</span></div>
            <div className="detail-row"><span className="detail-label">Repair Type</span><span>{repair.repairType}</span></div>
            <div className="detail-row"><span className="detail-label">Status</span><StatusBadge status={repair.status} /></div>
            <div className="detail-row"><span className="detail-label">Received</span><span>{formatDate(repair.receivedDate)}</span></div>
            <div className="detail-row"><span className="detail-label">Est. Completion</span><span>{formatDate(repair.estimatedCompletion)}</span></div>
            {repair.completedDate && <div className="detail-row"><span className="detail-label">Completed</span><span>{formatDate(repair.completedDate)}</span></div>}
            <div className="detail-row"><span className="detail-label">Cost</span><span className="font-bold">{formatCurrency(repair.cost)}</span></div>
            {repair.notes && <div className="detail-row detail-row--full"><span className="detail-label">Notes</span><p>{repair.notes}</p></div>}
            <div className="detail-actions">
              <span className="detail-label">Update Status:</span>
              <div className="btn-group">
                {REPAIR_STATUSES.filter(s => s !== repair.status).map(s => (
                  <button key={s} className="btn btn--sm btn--outline" onClick={() => {
                    dispatch({ type: 'UPDATE_REPAIR', payload: { id: repair.id, status: s } });
                    dispatch({ type: 'CLOSE_MODAL' });
                    toast(`Repair ${repair.id} updated to ${s}`, 'success');
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
    <div className="repairs-view">
      <div className="view-header">
        <div>
          <h1>Repairs</h1>
          <p className="text-muted">
            {state.repairs.length} total &middot; {state.repairs.filter(r => r.status === 'In Progress' || r.status === 'Waiting for Parts').length} active
          </p>
        </div>
      </div>
      <div className="card">
        <DataTable columns={columns} data={state.repairs} onRowClick={handleRowClick} searchQuery={state.searchQuery} />
      </div>
    </div>
  );
}
