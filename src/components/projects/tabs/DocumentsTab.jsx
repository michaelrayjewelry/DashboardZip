import React from 'react';
import { Section, FileCard } from '../ProjectComponents';

const DOC_CATEGORIES = [
  { key: 'invoices', label: 'Invoices & Quotes' },
  { key: 'certificates', label: 'Certificates & Grading' },
  { key: 'agreements', label: 'Client Agreements' },
  { key: 'shipping', label: 'Shipping & Insurance' },
];

function categorizeFiles(files) {
  const cats = { invoices: [], certificates: [], agreements: [], shipping: [] };
  (files || []).forEach(f => {
    const name = (f.name || '').toLowerCase();
    if (name.includes('invoice') || name.includes('quote') || name.includes('estimate')) {
      cats.invoices.push(f);
    } else if (name.includes('cert') || name.includes('grading') || name.includes('appraisal')) {
      cats.certificates.push(f);
    } else if (name.includes('agreement') || name.includes('contract') || name.includes('consent')) {
      cats.agreements.push(f);
    } else if (name.includes('shipping') || name.includes('insurance') || name.includes('tracking')) {
      cats.shipping.push(f);
    } else {
      cats.invoices.push(f);
    }
  });
  return cats;
}

export default function DocumentsTab({ project }) {
  const docFiles = (project.files || []).filter(f => f.type === 'Document');
  const categorized = categorizeFiles(docFiles);

  return (
    <div className="documents-tab">
      {DOC_CATEGORIES.map(cat => (
        <Section
          key={cat.key}
          label={cat.label}
          count={categorized[cat.key].length}
          rightAction={<button className="btn btn--sm btn--outline">Upload</button>}
        >
          {categorized[cat.key].length > 0 ? (
            categorized[cat.key].map(file => <FileCard key={file.name} file={file} />)
          ) : (
            <p className="text-muted">No {cat.label.toLowerCase()} uploaded yet.</p>
          )}
        </Section>
      ))}
    </div>
  );
}
