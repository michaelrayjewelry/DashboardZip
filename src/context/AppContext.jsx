import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { sampleProjects, sampleProducts, sampleOrders, sampleUsers } from '../data/sampleData';

const AppContext = createContext(null);

const initialState = {
  activeRoute: 'projects',
  selectedProjectId: 'PRJ-001',
  projectTab: 'overview',
  selectedProductId: null,
  productCollectionFilter: 'all',
  orderPipelineFilter: 'all',
  orderPaymentFilter: 'all',
  orderSort: 'newest',
  orderSearch: '',

  projects: sampleProjects,
  products: sampleProducts,
  orders: sampleOrders,
  users: sampleUsers,

  modal: { open: false, title: '', content: null, footer: null },
  toasts: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROUTE':
      return { ...state, activeRoute: action.payload, selectedProductId: null };

    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload, projectTab: 'overview' };

    case 'SET_PROJECT_TAB':
      return { ...state, projectTab: action.payload };

    case 'SELECT_PRODUCT':
      return { ...state, selectedProductId: action.payload };

    case 'SET_PRODUCT_COLLECTION_FILTER':
      return { ...state, productCollectionFilter: action.payload, selectedProductId: null };

    case 'SET_ORDER_PIPELINE_FILTER':
      return { ...state, orderPipelineFilter: action.payload };

    case 'SET_ORDER_PAYMENT_FILTER':
      return { ...state, orderPaymentFilter: action.payload };

    case 'SET_ORDER_SORT':
      return { ...state, orderSort: action.payload };

    case 'SET_ORDER_SEARCH':
      return { ...state, orderSearch: action.payload };

    case 'OPEN_MODAL':
      return { ...state, modal: { open: true, ...action.payload } };

    case 'CLOSE_MODAL':
      return { ...state, modal: { ...state.modal, open: false } };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };

    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, ...action.payload } : o
        ),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type, duration } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), duration);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, toast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
