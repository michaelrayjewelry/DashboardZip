import React from 'react';

export default function KpiCard({ title, value, subtitle, icon, trend, trendLabel }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__header">
        <span className="kpi-card__title">{title}</span>
        {icon && <div className="kpi-card__icon">{icon}</div>}
      </div>
      <div className="kpi-card__value">{value}</div>
      <div className="kpi-card__footer">
        {trend != null && (
          <span className={`kpi-card__trend ${trend >= 0 ? 'kpi-card__trend--up' : 'kpi-card__trend--down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
        {(subtitle || trendLabel) && (
          <span className="kpi-card__subtitle">{trendLabel || subtitle}</span>
        )}
      </div>
    </div>
  );
}
