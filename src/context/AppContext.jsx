import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { sampleInventory, sampleOrders, sampleCustomers, sampleRepairs, sampleAppraisals, sampleCustomOrders } from '../data/sampleData';

const AppContext = createContext(null);

const initialState = {
  // Navigation
  activeRoute: 'dashboard',
  sidebarCollapsed: false,

  // Data
  inventory: sampleInventory,
  orders: sampleOrders,
  customers: sampleCustomers,
  repairs: sampleRepairs,
  appraisals: sampleAppraisals,
  customOrders: sampleCustomOrders,

  // UI
  modal: { open: false, title: '', content: null, footer: null },
  toasts: [],
  searchQuery: '',
  notifications: [
    { id: 1, text: 'New custom order request from Sarah Chen', time: '10m ago', read: false },
    { id: 2, text: 'Repair #R-1047 ready for pickup', time: '1h ago', read: false },
    { id: 3, text: 'Low stock alert: 14K Gold Chain (2 remaining)', time: '3h ago', read: false },
  ],

  // Plugin System
  plugins: [],
  toolRegistry: {},
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROUTE':
      return { ...state, activeRoute: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'OPEN_MODAL':
      return { ...state, modal: { open: true, ...action.payload } };

    case 'CLOSE_MODAL':
      return { ...state, modal: { ...state.modal, open: false } };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    // Inventory
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };

    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };

    case 'DELETE_INVENTORY_ITEM':
      return { ...state, inventory: state.inventory.filter(item => item.id !== action.payload) };

    // Orders
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };

    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        ),
      };

    // Customers
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };

    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };

    // Repairs
    case 'ADD_REPAIR':
      return { ...state, repairs: [...state.repairs, action.payload] };

    case 'UPDATE_REPAIR':
      return {
        ...state,
        repairs: state.repairs.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };

    // Appraisals
    case 'ADD_APPRAISAL':
      return { ...state, appraisals: [...state.appraisals, action.payload] };

    case 'UPDATE_APPRAISAL':
      return {
        ...state,
        appraisals: state.appraisals.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      };

    // Custom Orders
    case 'ADD_CUSTOM_ORDER':
      return { ...state, customOrders: [...state.customOrders, action.payload] };

    case 'UPDATE_CUSTOM_ORDER':
      return {
        ...state,
        customOrders: state.customOrders.map(co =>
          co.id === action.payload.id ? { ...co, ...action.payload } : co
        ),
      };

    // Data import (XML)
    case 'IMPORT_DATA':
      return { ...state, ...action.payload };

    // Plugins
    case 'REGISTER_PLUGIN':
      return { ...state, plugins: [...state.plugins, action.payload] };

    case 'UNREGISTER_PLUGIN':
      return { ...state, plugins: state.plugins.filter(p => p.id !== action.payload) };

    case 'REGISTER_TOOL':
      return {
        ...state,
        toolRegistry: { ...state.toolRegistry, [action.payload.id]: action.payload },
      };

    case 'UNREGISTER_TOOL':
      const { [action.payload]: _, ...remainingTools } = state.toolRegistry;
      return { ...state, toolRegistry: remainingTools };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
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
    dispatch({ type: 'ADD_TOAST', payload: { message, type, duration } });
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
