import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import FloatingCopilot from '../components/FloatingCopilot';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''} relative`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
      <FloatingCopilot />
    </div>
  );
};

export default Dashboard;