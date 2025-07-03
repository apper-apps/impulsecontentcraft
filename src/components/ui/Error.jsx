import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry, type = 'default' }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'Wifi',
          title: 'Connection Error',
          description: 'Please check your internet connection and try again.',
        };
      case 'notFound':
        return {
          icon: 'SearchX',
          title: 'Not Found',
          description: 'The item you\'re looking for doesn\'t exist or has been removed.',
        };
      case 'permission':
        return {
          icon: 'Shield',
          title: 'Access Denied',
          description: 'You don\'t have permission to access this resource.',
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Something went wrong',
          description: message,
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4">
        <ApperIcon name={errorContent.icon} className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        {errorContent.title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {errorContent.description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default Error;