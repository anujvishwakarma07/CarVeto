import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import ContractAnalyser from './components/ContractAnalyser.jsx';
import VinLookup from './components/VinLookup.jsx';
import NegotiationCoach from './components/NegotiationCoach.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contractResult, setContractResult] = useState(null); // Shared analysis state
  
  // Lifted Chat memory states (Preserves conversation across tab switching!)
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'bot', 
      text: 'Hello! I am your AI Car Negotiation Coach.\n\nI can help you review dealer pricing sheets, draft professional emails to salespeople, or advice you on specific terms like acquisition fees, doc fees, and money factors.\n\nIf you have uploaded a contract in the Contract Analyzer tab, I will automatically use its numbers to give you custom negotiation counter-offers!' 
    }
  ]);
  const [chatHistory, setChatHistory] = useState([]); // Format: [{ role: 'user'|'model', parts: [{ text }] }]

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Header (hidden on desktop) */}
      <div className="mobile-header">
        <Sparkles size={18} style={{ color: 'var(--primary)' }} />
        <span>CarLease AI</span>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Pane */}
      <div className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView setActiveTab={setActiveTab} />
        )}
        
        {activeTab === 'analyzer' && (
          <ContractAnalyser 
            contractResult={contractResult} 
            setContractResult={setContractResult} 
            setChatMessages={setChatMessages} // Allow analyzer to send context notes to the chat
          />
        )}
        
        {activeTab === 'vin' && (
          <VinLookup />
        )}
        
        {activeTab === 'coach' && (
          <NegotiationCoach 
            contractResult={contractResult} 
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        )}
      </div>
    </div>
  );
}

export default App;
