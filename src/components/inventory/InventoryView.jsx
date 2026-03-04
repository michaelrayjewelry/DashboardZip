import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORIES, METALS } from '../../data/sampleData';

export default function InventoryView() {
  const { state, dispatch, toast } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = state.inventory.filter(item => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { key: 'sku', label: 'SKU', width: '120px' },
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category', width: '110px' },
    { key: 'metal', label: 'Metal', width: '130px' },
    {
      key: 'retailPrice', label: 'Price', width: '110px',
      render: val => formatCurrency(val),
    },
    {
      key: 'quantity', label: 'Qty', width: '60px',
      render: val => <span className={val <= 2 ? 'text-danger font-bold' : ''}>{val}</span>,
    },
    {
      key: 'status', label: 'Status', width: '110px',
      render: val => <StatusBadge status={val} />,
    },
    { key: 'location', label: 'Location', width: '120px' },
  ];

  function handleRowClick(item) {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: item.name,
        content: <InventoryDetail item={item} />,
      },
    });
  }

  function handleAddItem() {
    dispatch({
      type: 'OPEN_MODAL',
      payload: {
        title: 'Add New Inventory Item',
        content: <InventoryForm onSave={(newItem) => {
          dispatch({ type: 'ADD_INVENTORY_ITEM', payload: { ...newItem, id: `INV-${String(state.inventory.length + 1).padStart(3, '0')}` } });
          dispatch({ type: 'CLOSE_MODAL' });
          toast('Item added to inventory', 'success');
        }} />,
      },
    });
  }

  const totalValue = filtered.reduce((s, i) => s + i.retailPrice * i.quantity, 0);

  return (
    <div className="inventory-view">
      <div className="view-header">
        <div>
          <h1>Inventory</h1>
          <p className="text-muted">{filtered.length} items &middot; Total value: {formatCurrency(totalValue)}</p>
        </div>
        <button className="btn btn--primary" onClick={handleAddItem}>+ Add Item</button>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Category</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={handleRowClick}
          searchQuery={state.searchQuery}
        />
      </div>
    </div>
  );
}

function InventoryDetail({ item }) {
  return (
    <div className="detail-grid">
      <div className="detail-row"><span className="detail-label">SKU</span><span>{item.sku}</span></div>
      <div className="detail-row"><span className="detail-label">Category</span><span>{item.category} / {item.subcategory}</span></div>
      <div className="detail-row"><span className="detail-label">Metal</span><span>{item.metal}</span></div>
      <div className="detail-row"><span className="detail-label">Gemstone</span><span>{item.gemstone}</span></div>
      {item.caratWeight > 0 && <div className="detail-row"><span className="detail-label">Carat Weight</span><span>{item.caratWeight} ct</span></div>}
      {item.clarity !== 'N/A' && <div className="detail-row"><span className="detail-label">Clarity</span><span>{item.clarity}</span></div>}
      {item.color !== 'N/A' && <div className="detail-row"><span className="detail-label">Color</span><span>{item.color}</span></div>}
      {item.cut !== 'N/A' && <div className="detail-row"><span className="detail-label">Cut</span><span>{item.cut}</span></div>}
      <div className="detail-row"><span className="detail-label">Cost Price</span><span>{formatCurrency(item.costPrice)}</span></div>
      <div className="detail-row"><span className="detail-label">Retail Price</span><span>{formatCurrency(item.retailPrice)}</span></div>
      <div className="detail-row"><span className="detail-label">Margin</span><span className="text-success">{((1 - item.costPrice / item.retailPrice) * 100).toFixed(1)}%</span></div>
      <div className="detail-row"><span className="detail-label">Quantity</span><span>{item.quantity}</span></div>
      <div className="detail-row"><span className="detail-label">Location</span><span>{item.location}</span></div>
      <div className="detail-row"><span className="detail-label">Status</span><StatusBadge status={item.status} /></div>
      {item.certNumber && <div className="detail-row"><span className="detail-label">Certificate</span><span className="font-mono">{item.certNumber}</span></div>}
      <div className="detail-row detail-row--full"><span className="detail-label">Description</span><p>{item.description}</p></div>
    </div>
  );
}

function InventoryForm({ onSave }) {
  const [form, setForm] = useState({
    sku: '', name: '', category: 'Rings', subcategory: '',
    metal: '14K Yellow Gold', gemstone: 'None', caratWeight: 0,
    clarity: 'N/A', color: 'N/A', cut: 'N/A',
    costPrice: 0, retailPrice: 0, quantity: 1,
    supplier: '', location: '', status: 'In Stock',
    certNumber: '', description: '',
    dateAdded: new Date().toISOString().slice(0, 10),
    lastUpdated: new Date().toISOString().slice(0, 10),
    images: [],
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.sku) return;
    onSave({
      ...form,
      costPrice: parseFloat(form.costPrice),
      retailPrice: parseFloat(form.retailPrice),
      quantity: parseInt(form.quantity, 10),
      caratWeight: parseFloat(form.caratWeight),
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>SKU *</label>
        <input name="sku" value={form.sku} onChange={handleChange} required placeholder="MRJ-RNG-004" />
      </div>
      <div className="form-field">
        <label>Item Name *</label>
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Item name" />
      </div>
      <div className="form-field">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label>Metal</label>
        <select name="metal" value={form.metal} onChange={handleChange}>
          {METALS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label>Cost Price</label>
        <input name="costPrice" type="number" step="0.01" value={form.costPrice} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label>Retail Price</label>
        <input name="retailPrice" type="number" step="0.01" value={form.retailPrice} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label>Quantity</label>
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} placeholder="Display Case / Vault" />
      </div>
      <div className="form-field form-field--full">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn--primary">Save Item</button>
      </div>
    </form>
  );
}
