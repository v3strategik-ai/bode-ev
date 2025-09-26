import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import FloatingCopilot from '../components/FloatingCopilot';
import NotificationDemo from '../components/NotificationDemo';

// Import all module components
import ChargingStations from '../components/modules/ChargingStations';
import ServiceAutomation from '../components/modules/ServiceAutomation';
import CustomerSupport from '../components/modules/CustomerSupport';
import SitePlanning from '../components/modules/SitePlanning';
import InstallationJobs from '../components/modules/InstallationJobs';
import ServiceReports from '../components/modules/ServiceReports';
import TechnicianHub from '../components/modules/TechnicianHub';
import PerformanceAnalytics from '../components/modules/PerformanceAnalytics';
import EquipmentInventory from '../components/modules/EquipmentInventory';
import SustainabilityMetrics from '../components/modules/SustainabilityMetrics';
import VoiceCommands from '../components/modules/VoiceCommands';
import SecurityCenter from '../components/modules/SecurityCenter';
import BillingPayments from '../components/modules/BillingPayments';
import SupportCenter from '../components/modules/SupportCenter';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <MainContent />;
      case 'stations':
        return <ChargingStations />;
      case 'automation':
        return <ServiceAutomation />;
      case 'support':
        return <CustomerSupport />;
      case 'planning':
        return <SitePlanning />;
      case 'jobs':
        return <InstallationJobs />;
      case 'reports':
        return <ServiceReports />;
      case 'technicians':
        return <TechnicianHub />;
      case 'analytics':
        return <PerformanceAnalytics />;
      case 'inventory':
        return <EquipmentInventory />;
      case 'sustainability':
        return <SustainabilityMetrics />;
      case 'voice':
        return <VoiceCommands />;
      case 'security':
        return <SecurityCenter />;
      case 'billing':
        return <BillingPayments />;
      case 'help':
        return <SupportCenter />;
      default:
        return <MainContent />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''} relative`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} onModuleChange={setActiveModule} />
      <div className="flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <div className="flex-1">
          {renderModuleContent()}
        </div>
      </div>
      <FloatingCopilot />
      <NotificationDemo />
    </div>
  );
};

export default Dashboard;