import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const NavigationItem = ({ to, icon, label, badge, isCollapsed = false }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-primary text-white shadow-primary'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`
      }
    >
      {({ isActive }) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3 w-full"
        >
          <ApperIcon name={icon} className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="font-medium">{label}</span>
              {badge && (
                <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-600'
                }`}>
                  {badge}
                </span>
              )}
            </>
          )}
        </motion.div>
      )}
    </NavLink>
  );
};

export default NavigationItem;