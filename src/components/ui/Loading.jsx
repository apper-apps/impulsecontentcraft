import React from 'react';

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gradient-subtle rounded-lg animate-pulse"></div>
                <div className="w-16 h-4 bg-gradient-subtle rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-8 bg-gradient-subtle rounded animate-pulse mb-2"></div>
              <div className="w-32 h-3 bg-gradient-subtle rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="w-32 h-6 bg-gradient-subtle rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-subtle rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gradient-subtle rounded animate-pulse"></div>
                  <div className="w-1/2 h-3 bg-gradient-subtle rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-3 bg-gradient-subtle rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'marketplace') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6">
            <div className="w-12 h-12 bg-gradient-subtle rounded-xl animate-pulse mb-4"></div>
            <div className="w-3/4 h-5 bg-gradient-subtle rounded animate-pulse mb-2"></div>
            <div className="w-full h-3 bg-gradient-subtle rounded animate-pulse mb-1"></div>
            <div className="w-2/3 h-3 bg-gradient-subtle rounded animate-pulse mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="w-16 h-4 bg-gradient-subtle rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gradient-primary rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chat') {
    return (
      <div className="flex-1 p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-4 rounded-xl ${i % 2 === 0 ? 'bg-gradient-primary' : 'bg-gray-100'} animate-pulse`}>
              <div className="w-32 h-4 bg-white/30 rounded mb-2"></div>
              <div className="w-24 h-4 bg-white/30 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary-500"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full border-t-secondary-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default Loading;