import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NavigationItem from '@/components/molecules/NavigationItem';

const Sidebar = ({ isOpen, onClose, userRole = 'user' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getUserNavigation = () => {
    const baseNav = [
      { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
      { to: '/personalization', icon: 'User', label: 'Personalization Hub' },
      { to: '/my-agents', icon: 'Bot', label: 'My Agents' },
      { to: '/marketplace', icon: 'Store', label: 'Agent Marketplace' },
      { to: '/chat', icon: 'MessageCircle', label: 'Chat' },
      { to: '/billing', icon: 'CreditCard', label: 'Billing' },
      { to: '/settings', icon: 'Settings', label: 'Settings' },
    ];

    if (userRole === 'admin' || userRole === 'superadmin') {
      baseNav.push(
        { to: '/admin', icon: 'Shield', label: 'Admin Dashboard' },
        { to: '/admin/create-agent', icon: 'Plus', label: 'Create Agent' },
        { to: '/admin/users', icon: 'Users', label: 'User Management' }
      );
    }

    if (userRole === 'superadmin') {
      baseNav.push(
        { to: '/admin/api-keys', icon: 'Key', label: 'API Keys' }
      );
    }

    return baseNav;
  };

  const navigation = getUserNavigation();

  // Desktop Sidebar - Static positioning
  const DesktopSidebar = () => (
    <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">
              ContentCraft AI
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ApperIcon 
            name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
            className="w-4 h-4 text-gray-600" 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavigationItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Mobile Sidebar - Overlay with transforms
  const MobileSidebar = () => (
    <div className="lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-bold text-xl gradient-text">
                    ContentCraft AI
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => (
                  <NavigationItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                  />
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;