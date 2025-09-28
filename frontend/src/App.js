import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import NotificationProvider from './contexts/NotificationContext';
import NotificationSystem from './components/notifications/NotificationSystem';
import AuthProvider from './contexts/messenger/AuthContext';
import WebSocketProvider from './contexts/messenger/WebSocketContext';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <WebSocketProvider>
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </BrowserRouter>
            <NotificationSystem />
          </div>
        </WebSocketProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;