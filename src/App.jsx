import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import PersonalizationHub from '@/components/pages/PersonalizationHub';
import MyAgents from '@/components/pages/MyAgents';
import AgentMarketplace from '@/components/pages/AgentMarketplace';
import ChatInterface from '@/components/pages/ChatInterface';
import Billing from '@/components/pages/Billing';
import Settings from '@/components/pages/Settings';
import AdminDashboard from '@/components/pages/AdminDashboard';
import AgentCreation from '@/components/pages/AgentCreation';
import UserManagement from '@/components/pages/UserManagement';
import ApiKeyManagement from '@/components/pages/ApiKeyManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="personalization" element={<PersonalizationHub />} />
            <Route path="my-agents" element={<MyAgents />} />
            <Route path="marketplace" element={<AgentMarketplace />} />
            <Route path="chat/:agentId?" element={<ChatInterface />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/create-agent" element={<AgentCreation />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/api-keys" element={<ApiKeyManagement />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;