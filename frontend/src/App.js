import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import NotificationProvider from './contexts/NotificationContext';
import NotificationSystem from './components/notifications/NotificationSystem';

function App() {
  return (
    <NotificationProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
        <NotificationSystem />
      </div>
    </NotificationProvider>
  );
}

export default App;