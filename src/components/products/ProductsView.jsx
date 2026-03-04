import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

function ProductCard({ product, isSelected, onClick }) {
  return (
    <div className={`product-card ${isSelected ? 'product-card--selected' : ''}`} onClick={onClick}>
      <div className="product-card__image">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="product-card__sku-tag">{product.sku}</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__collection">{product.collection}</p>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__specs">
          <div className="product-card__spec">
            <span className="product-card__spec-label">TYPE</span>
            <span className="product-card__spec-value">{product.type}</span>
          </div>
          <div className="product-card__spec">
            <span className="product-card__spec-label">METAL</span>
            <span className="product-card__spec-value">{product.metal}</span>
          </div>
          <div className="product-card__spec">
            <span className="product-card__spec-label">EST. PRICE</span>
            <span className="product-card__spec-value">{formatCurrency(product.estPrice)}</span>
          </div>
        </div>
        <div className="product-card__tags">
          {product.tags.map((tag, i) => (
            <span key={i} className="badge badge--default">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ product, onClose }) {
  return (
    <div className="product-detail-panel">
      <div className="product-detail-panel__header">
        <div>
          <h2 className="product-detail-panel__name">{product.name}</h2>
          <p className="product-detail-panel__sub">{product.collection} &middot; {product.sku}</p>
        </div>
        <button className="product-detail-panel__close" onClick={onClose}>&times;</button>
      </div>

      <div className="product-detail-panel__badges">
        <span className="badge badge--success">{product.status}</span>
        <span className="badge badge--default">{product.type}</span>
      </div>

      <div className="product-detail-panel__image">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      <div className="product-detail-panel__section">
        <h4 className="section-title">DESCRIPTION</h4>
        <p>{product.description}</p>
      </div>

      <div className="product-detail-panel__section">
        <h4 className="section-title">SPECIFICATIONS</h4>
        <div className="spec-table">
          <div className="spec-table__row">
            <span className="spec-table__label">Metal</span>
            <span className="spec-table__value">{product.metal}</span>
          </div>
          <div className="spec-table__row">
            <span className="spec-table__label">Weight</span>
            <span className="spec-table__value">{product.weight}</span>
          </div>
          <div className="spec-table__row">
            <span className="spec-table__label">Stones</span>
            <span className="spec-table__value">{product.stones}</span>
          </div>
          <div className="spec-table__row">
            <span className="spec-table__label">Size</span>
            <span className="spec-table__value">{product.size}</span>
          </div>
          <div className="spec-table__row">
            <span className="spec-table__label">Est. Price</span>
            <span className="spec-table__value">{formatCurrency(product.estPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsView() {
  const { state, dispatch } = useApp();

  const filtered = state.productCollectionFilter === 'all'
    ? state.products
    : state.products.filter(p => p.collection === state.productCollectionFilter);

  const selectedProduct = state.selectedProductId
    ? state.products.find(p => p.id === state.selectedProductId)
    : null;

  return (
    <div className={`products-view ${selectedProduct ? 'products-view--with-detail' : ''}`}>
      <div className="products-view__main">
        <div className="view-header">
          <h1 className="page-title">PRODUCTS</h1>
        </div>

        <div className="products-grid">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={state.selectedProductId === product.id}
              onClick={() => dispatch({ type: 'SELECT_PRODUCT', payload: product.id })}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => dispatch({ type: 'SELECT_PRODUCT', payload: null })}
        />
      )}
    </div>
  );
}
