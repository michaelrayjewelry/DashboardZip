import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Modal() {
  const { state, dispatch } = useApp();
  const { open, title, content, footer } = state.modal;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape' && open) {
        dispatch({ type: 'CLOSE_MODAL' });
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, dispatch]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="modal__body">{content}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
