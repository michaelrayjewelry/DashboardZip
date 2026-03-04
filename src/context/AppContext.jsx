import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  sampleProjects, sampleProducts, sampleOrders, sampleUsers,
  sampleCustomers, sampleInventory, sampleRepairs, sampleAppraisals,
  sampleCustomOrders, sampleNotifications,
} from '../data/sampleData';

const AppContext = createContext(null);

const initialState = {
  activeRoute: 'dashboard',
  selectedProjectId: null,
  projectTab: 'overview',
  selectedProductId: null,
  productCollectionFilter: 'all',
  orderPipelineFilter: 'all',
  orderPaymentFilter: 'all',
  orderSort: 'newest',
  orderSearch: '',
  searchQuery: '',
  sidebarCollapsed: false,

  projects: sampleProjects,
  products: sampleProducts,
  orders: sampleOrders,
  users: sampleUsers,
  customers: sampleCustomers,
  inventory: sampleInventory,
  repairs: sampleRepairs,
  appraisals: sampleAppraisals,
  customOrders: sampleCustomOrders,
  notifications: sampleNotifications,
  plugins: [],

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

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };

    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };

    case 'UPDATE_REPAIR':
      return {
        ...state,
        repairs: state.repairs.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };

    case 'UPDATE_APPRAISAL':
      return {
        ...state,
        appraisals: state.appraisals.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      };

    case 'UPDATE_CUSTOM_ORDER':
      return {
        ...state,
        customOrders: state.customOrders.map(co =>
          co.id === action.payload.id ? { ...co, ...action.payload } : co
        ),
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'REGISTER_PLUGIN':
      return { ...state, plugins: [...state.plugins, action.payload] };

    case 'UNREGISTER_PLUGIN':
      return { ...state, plugins: state.plugins.filter(p => p.id !== action.payload) };

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
