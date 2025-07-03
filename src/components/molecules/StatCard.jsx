import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  gradient = false,
  className = '' 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            gradient ? 'bg-gradient-primary' : 'bg-gray-100'
          }`}>
            <ApperIcon 
              name={icon} 
              className={`w-6 h-6 ${gradient ? 'text-white' : 'text-gray-600'}`} 
            />
          </div>
        )}
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <ApperIcon name={getChangeIcon()} className="w-4 h-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className={`text-2xl font-display font-bold mb-1 ${
          gradient ? 'gradient-text' : 'text-gray-900'
        }`}>
          {value}
        </h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;