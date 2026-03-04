import React from 'react';
import { Section } from '../ProjectComponents';
import { formatCurrency } from '../../../utils/formatters';

export default function MaterialsTab({ project }) {
  const materials = project.materials || [];
  const pricing = project.pricing || {};

  return (
    <div className="materials-tab">
      <Section label="Bill of Materials" count={materials.length}>
        {materials.length > 0 ? (
          <table className="data-table data-table--compact">
            <thead>
              <tr>
                <th>Material</th>
                <th>Specification</th>
                <th style={{ width: 60 }}>Qty</th>
                <th style={{ width: 50 }}>Unit</th>
                <th style={{ width: 80 }}>$/Unit</th>
                <th style={{ width: 90 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m, i) => (
                <tr key={i}>
                  <td className="font-medium">{m.name}</td>
                  <td>{m.spec}</td>
                  <td>{m.qty}</td>
                  <td>{m.unit}</td>
                  <td>{formatCurrency(m.unitCost)}</td>
                  <td className="font-bold">{formatCurrency(m.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No materials added yet.</p>
        )}
      </Section>

      <Section label="Pricing">
        <div className="pricing-grid">
          <div className="pricing-item">
            <span className="pricing-item__label">Material Cost</span>
            <span className="pricing-item__value">{formatCurrency(pricing.materialCost || 0)}</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-item__label">Labor Cost</span>
            <span className="pricing-item__value">{formatCurrency(pricing.laborCost || 0)}</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-item__label">Markup</span>
            <span className="pricing-item__value">{pricing.markup || 0}%</span>
          </div>
          <div className="pricing-item pricing-item--highlight">
            <span className="pricing-item__label">Retail Price</span>
            <span className="pricing-item__value">{formatCurrency(pricing.retail || 0)}</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-item__label">Client Budget</span>
            <span className="pricing-item__value">{pricing.budget ? formatCurrency(pricing.budget) : '—'}</span>
          </div>
          <div className="pricing-item">
            <span className="pricing-item__label">Deposit</span>
            <span className="pricing-item__value">{pricing.deposit ? formatCurrency(pricing.deposit) : '—'}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}
