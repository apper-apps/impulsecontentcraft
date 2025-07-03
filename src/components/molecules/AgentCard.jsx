import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const AgentCard = ({ 
  agent, 
  isSubscribed = false, 
  onSubscribe, 
  onUnsubscribe, 
  onChat,
  showSubscribeButton = true,
  className = '' 
}) => {
  const handleAction = () => {
    if (isSubscribed) {
      if (onChat) onChat(agent);
    } else {
      if (onSubscribe) onSubscribe(agent);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Content Writing': 'primary',
      'Social Media': 'secondary',
      'Email Marketing': 'accent',
      'SEO': 'success',
      'Copywriting': 'warning',
      'Video Scripts': 'danger',
    };
    return colors[category] || 'default';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all duration-200 ${className}`}
    >
<div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center overflow-hidden">
          {agent.profileImage ? (
            <img
              src={agent.profileImage}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ApperIcon name={agent.icon} className="w-6 h-6 text-white" />
          )}
        </div>
        <Badge variant={getCategoryColor(agent.category)} size="sm">
          {agent.category}
        </Badge>
      </div>

      <h3 className="font-display font-semibold text-gray-900 mb-2">
        {agent.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {agent.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-lg font-bold text-gray-900">
            ${agent.price}
          </span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>
        
        {showSubscribeButton && (
          <Button
            variant={isSubscribed ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleAction}
            icon={isSubscribed ? 'MessageCircle' : 'Plus'}
          >
            {isSubscribed ? 'Chat' : 'Subscribe'}
          </Button>
        )}
      </div>

      {isSubscribed && onUnsubscribe && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUnsubscribe(agent)}
          icon="X"
          className="w-full mt-3 text-gray-500 hover:text-red-600"
        >
          Unsubscribe
        </Button>
      )}
    </motion.div>
  );
};

export default AgentCard;