import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  return (
    <div className="toast-container">
      {state.toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast__message">{t.message}</span>
          <button
            className="toast__close"
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: t.id })}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
