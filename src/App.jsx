import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Modal from './components/common/Modal';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <MainContent />
      <Modal />
      <ToastContainer />
    </div>
  );
}
