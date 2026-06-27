import React from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  Car, 
  MessageSquare, 
  Sparkles 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      {/* Brand Logo */}
      <div className="sidebar-logo">
        <Sparkles size={24} />
        <span>CarLease AI</span>
      </div>

      {/* Menu Options */}
      <div className="sidebar-menu">
        <div 
          className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        
        <div 
          className={`sidebar-item ${activeTab === 'analyzer' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyzer')}
        >
          <FileSearch size={20} />
          <span>Contract Analyzer</span>
        </div>

        <div 
          className={`sidebar-item ${activeTab === 'vin' ? 'active' : ''}`}
          onClick={() => setActiveTab('vin')}
        >
          <Car size={20} />
          <span>VIN Lookup</span>
        </div>

        <div 
          className={`sidebar-item ${activeTab === 'coach' ? 'active' : ''}`}
          onClick={() => setActiveTab('coach')}
        >
          <MessageSquare size={20} />
          <span>Negotiation Coach</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
