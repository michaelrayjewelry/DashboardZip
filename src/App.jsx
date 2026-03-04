import React from 'react';
import { useApp } from './context/AppContext';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Modal from './components/common/Modal';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  const { state } = useApp();

  return (
    <div className={`app ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Topbar />
      <Sidebar />
      <MainContent />
      <Modal />
      <ToastContainer />
    </div>
  );
}
