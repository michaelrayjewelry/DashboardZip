import React, { useState, useMemo } from 'react';

export default function DataTable({
  columns,
  data,
  onRowClick,
  searchQuery = '',
  emptyMessage = 'No data found',
  pageSize = 10,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pagedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(1);
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={col.sortable !== false ? 'data-table__th--sortable' : ''}
                style={col.width ? { width: col.width } : undefined}
              >
                <span>{col.label}</span>
                {sortKey === col.key && (
                  <span className="data-table__sort-icon">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">{emptyMessage}</td>
            </tr>
          ) : (
            pagedData.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'data-table__row--clickable' : ''}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="data-table__pagination">
          <span className="data-table__page-info">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="data-table__page-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="btn btn--sm btn--ghost"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`btn btn--sm ${p === currentPage ? 'btn--primary' : 'btn--ghost'}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="btn btn--sm btn--ghost"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
