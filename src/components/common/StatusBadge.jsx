import React from 'react';

const STATUS_STYLES = {
  'In Stock':         'badge--success',
  'Low Stock':        'badge--warning',
  'Out of Stock':     'badge--danger',
  'Completed':        'badge--success',
  'Paid':             'badge--success',
  'Processing':       'badge--info',
  'In Progress':      'badge--info',
  'Pending':          'badge--warning',
  'Pending Approval': 'badge--warning',
  'Design Phase':     'badge--info',
  'Production':       'badge--info',
  'Ready for Pickup': 'badge--gold',
  'Shipped':          'badge--info',
  'Waiting for Parts':'badge--warning',
  'Cancelled':        'badge--danger',
  'Returned':         'badge--danger',
  'Partial':          'badge--warning',
  'Unpaid':           'badge--danger',
  'Approved':         'badge--success',
  'Received':         'badge--info',
  'VIP':              'badge--gold',
  'Gold':             'badge--warning',
  'Standard':         'badge--default',
};

export default function StatusBadge({ status }) {
  const className = STATUS_STYLES[status] || 'badge--default';
  return <span className={`badge ${className}`}>{status}</span>;
}
