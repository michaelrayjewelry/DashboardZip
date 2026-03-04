import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CUSTOMER_TIERS } from '../../data/sampleData';

export default function CustomersView() {
  const { state, dispatch, toast } = useApp();
  const [tierFilter, setTierFilter] = useState('All');

  const filtered = state.customers.filter(c => {
    if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'lastName', label: 'Name',
      render: (_, row) => <span className="font-medium">{row.firstName} {row.lastName}</span>,
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', width: '140px' },
    { key: 'tier', label: 'Tier', width: '90px', render: val => <StatusBadge status={val} /> },
    { key: 'totalSpent', label: 'Total Spent', width: '120px', render: val => formatCurrency(val) },
    { key: 'orderCount', label: 'Orders', width: '70px' },
    { key: 'lastVisit', label: 'Last Visit', width: '100px', render: val => formatDate(val) },
  ];

  function handleRowClick(customer) {
    const customerOrders = state.orders.filter(o => o.customerId === customer.id);
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: `${customer.firstName} ${customer.lastName}`,
        content: <CustomerDetail customer={customer} orders={customerOrders} />,
      },
    });
  }

  function handleAddCustomer() {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: 'Add New Customer',
        content: <CustomerForm onSave={(newCustomer) => {
          dispatch({
            type: 'ADD_CUSTOMER',
            payload: {
              ...newCustomer,
              id: `CUS-${String(state.customers.length + 1).padStart(3, '0')}`,
              totalSpent: 0, orderCount: 0,
              joinDate: new Date().toISOString().slice(0, 10),
              lastVisit: new Date().toISOString().slice(0, 10),
            },
          });
          dispatch({ type: 'CLOSE_MODAL' });
          toast('Customer added successfully', 'success');
        }} />,
      },
    });
  }

  return (
    <div className="customers-view">
      <div className="view-header">
        <div>
          <h1>Customers</h1>
          <p className="text-muted">{filtered.length} customers &middot; {state.customers.filter(c => c.tier === 'VIP').length} VIP</p>
        </div>
        <button className="btn btn--primary" onClick={handleAddCustomer}>+ Add Customer</button>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Tier</label>
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
            <option value="All">All Tiers</option>
            {CUSTOMER_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filtered} onRowClick={handleRowClick} searchQuery={state.searchQuery} />
      </div>
    </div>
  );
}

function CustomerDetail({ customer, orders }) {
  return (
    <div className="detail-grid">
      <div className="detail-row"><span className="detail-label">Email</span><span>{customer.email}</span></div>
      <div className="detail-row"><span className="detail-label">Phone</span><span>{customer.phone}</span></div>
      <div className="detail-row"><span className="detail-label">Address</span><span>{customer.address}</span></div>
      <div className="detail-row"><span className="detail-label">Tier</span><StatusBadge status={customer.tier} /></div>
      <div className="detail-row"><span className="detail-label">Total Spent</span><span className="font-bold">{formatCurrency(customer.totalSpent)}</span></div>
      <div className="detail-row"><span className="detail-label">Member Since</span><span>{formatDate(customer.joinDate)}</span></div>
      {customer.birthday && <div className="detail-row"><span className="detail-label">Birthday</span><span>{formatDate(customer.birthday)}</span></div>}
      {customer.anniversary && <div className="detail-row"><span className="detail-label">Anniversary</span><span>{formatDate(customer.anniversary)}</span></div>}
      {customer.preferences && <div className="detail-row detail-row--full"><span className="detail-label">Preferences</span><p>{customer.preferences}</p></div>}
      {customer.notes && <div className="detail-row detail-row--full"><span className="detail-label">Notes</span><p>{customer.notes}</p></div>}

      {orders.length > 0 && (
        <div className="detail-row detail-row--full">
          <span className="detail-label">Order History</span>
          <table className="data-table data-table--compact" style={{ marginTop: '8px' }}>
            <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="font-medium">{o.id}</td>
                  <td>{formatDate(o.orderDate)}</td>
                  <td>{formatCurrency(o.total)}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CustomerForm({ onSave }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', tier: 'Standard', birthday: '', anniversary: '',
    preferences: '', notes: '',
  });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName) return;
    onSave(form);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field"><label>First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} required /></div>
      <div className="form-field"><label>Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} required /></div>
      <div className="form-field"><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} /></div>
      <div className="form-field"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} /></div>
      <div className="form-field form-field--full"><label>Address</label><input name="address" value={form.address} onChange={handleChange} /></div>
      <div className="form-field"><label>Tier</label>
        <select name="tier" value={form.tier} onChange={handleChange}>
          {CUSTOMER_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="form-field"><label>Birthday</label><input name="birthday" type="date" value={form.birthday} onChange={handleChange} /></div>
      <div className="form-field form-field--full"><label>Preferences</label><textarea name="preferences" value={form.preferences} onChange={handleChange} rows={2} /></div>
      <div className="form-field form-field--full"><label>Notes</label><textarea name="notes" value={form.notes} onChange={handleChange} rows={2} /></div>
      <div className="form-actions"><button type="submit" className="btn btn--primary">Save Customer</button></div>
    </form>
  );
}
