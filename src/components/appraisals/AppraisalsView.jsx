import React from 'react';
import { useApp } from '../../context/AppContext';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AppraisalsView() {
  const { state, dispatch, toast } = useApp();

  const columns = [
    { key: 'id', label: 'ID', width: '90px', render: v => <span className="font-medium">{v}</span> },
    { key: 'customerName', label: 'Customer' },
    { key: 'itemDescription', label: 'Item' },
    { key: 'purpose', label: 'Purpose', width: '120px' },
    { key: 'status', label: 'Status', width: '110px', render: v => <StatusBadge status={v} /> },
    {
      key: 'appraisedValue', label: 'Value', width: '120px',
      render: v => v ? formatCurrency(v) : <span className="text-muted">Pending</span>,
    },
    { key: 'requestDate', label: 'Requested', width: '100px', render: v => formatDate(v) },
  ];

  function handleRowClick(appraisal) {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: `Appraisal ${appraisal.id}`,
        content: (
          <div className="detail-grid">
            <div className="detail-row"><span className="detail-label">Customer</span><span>{appraisal.customerName}</span></div>
            <div className="detail-row"><span className="detail-label">Item</span><span>{appraisal.itemDescription}</span></div>
            <div className="detail-row"><span className="detail-label">Purpose</span><span>{appraisal.purpose}</span></div>
            <div className="detail-row"><span className="detail-label">Status</span><StatusBadge status={appraisal.status} /></div>
            <div className="detail-row"><span className="detail-label">Requested</span><span>{formatDate(appraisal.requestDate)}</span></div>
            {appraisal.completedDate && <div className="detail-row"><span className="detail-label">Completed</span><span>{formatDate(appraisal.completedDate)}</span></div>}
            {appraisal.appraisedValue && <div className="detail-row"><span className="detail-label">Appraised Value</span><span className="font-bold text-gold">{formatCurrency(appraisal.appraisedValue)}</span></div>}
            {appraisal.notes && <div className="detail-row detail-row--full"><span className="detail-label">Notes</span><p>{appraisal.notes}</p></div>}
            <div className="detail-actions">
              <span className="detail-label">Update Status:</span>
              <div className="btn-group">
                {['Pending', 'In Progress', 'Completed'].filter(s => s !== appraisal.status).map(s => (
                  <button key={s} className="btn btn--sm btn--outline" onClick={() => {
                    dispatch({ type: 'UPDATE_APPRAISAL', payload: { id: appraisal.id, status: s } });
                    dispatch({ type: 'CLOSE_MODAL' });
                    toast(`Appraisal ${appraisal.id} updated`, 'success');
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
    <div className="appraisals-view">
      <div className="view-header">
        <div>
          <h1>Appraisals</h1>
          <p className="text-muted">{state.appraisals.length} total &middot; {state.appraisals.filter(a => a.status !== 'Completed').length} active</p>
        </div>
      </div>
      <div className="card">
        <DataTable columns={columns} data={state.appraisals} onRowClick={handleRowClick} searchQuery={state.searchQuery} />
      </div>
    </div>
  );
}
