import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ type = 'default', onAction, actionText = 'Get Started' }) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'agents':
        return {
          icon: 'Bot',
          title: 'No agents yet',
          description: 'Subscribe to AI agents from the marketplace to start creating amazing content.',
          actionText: 'Browse Marketplace',
        };
      case 'chat':
        return {
          icon: 'MessageCircle',
          title: 'No conversations yet',
          description: 'Start a conversation with one of your AI agents to begin creating content.',
          actionText: 'Start Chatting',
        };
      case 'billing':
        return {
          icon: 'CreditCard',
          title: 'No billing history',
          description: 'Your billing history will appear here once you make your first purchase.',
          actionText: 'View Plans',
        };
      case 'marketplace':
        return {
          icon: 'Package',
          title: 'No agents found',
          description: 'Try adjusting your filters or search terms to find the perfect AI agent.',
          actionText: 'Clear Filters',
        };
      case 'users':
        return {
          icon: 'Users',
          title: 'No users found',
          description: 'User accounts will appear here as they register for the platform.',
          actionText: 'Refresh',
        };
      default:
        return {
          icon: 'FileQuestion',
          title: 'Nothing here yet',
          description: 'Content will appear here once you start using the platform.',
          actionText: actionText,
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-subtle rounded-3xl flex items-center justify-center mb-6">
        <ApperIcon name={emptyContent.icon} className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
        {emptyContent.title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {emptyContent.description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="ArrowRight" className="w-4 h-4" />
          <span>{emptyContent.actionText}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;