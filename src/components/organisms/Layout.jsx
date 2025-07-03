import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const paths = {
      '/': 'Dashboard',
      '/personalization': 'Personalization Hub',
      '/my-agents': 'My Agents',
      '/marketplace': 'Agent Marketplace',
      '/chat': 'Chat Interface',
      '/billing': 'Billing & Subscriptions',
      '/settings': 'Settings',
      '/admin': 'Admin Dashboard',
      '/admin/create-agent': 'Create Agent',
      '/admin/users': 'User Management',
      '/admin/api-keys': 'API Key Management',
    };
    return paths[location.pathname] || 'ContentCraft AI';
  };

  const showSearch = ['/marketplace', '/my-agents', '/chat'].includes(location.pathname);

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole="admin" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          title={getPageTitle()}
          showSearch={showSearch}
          onSearch={handleSearch}
        />
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;