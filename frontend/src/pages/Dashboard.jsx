import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import AICopilot from '../components/AICopilot';

const Dashboard = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex">
        <Sidebar />
        <MainContent />
        {isCopilotOpen && (
          <AICopilot onClose={() => setIsCopilotOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;