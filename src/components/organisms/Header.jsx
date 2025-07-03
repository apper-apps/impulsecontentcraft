import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onMenuToggle, title, showSearch = false, onSearch }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuToggle}
            className="lg:hidden"
          />
          <div>
            <h1 className="text-xl font-display font-semibold text-gray-900">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block w-80">
              <SearchBar
                onSearch={onSearch}
                placeholder="Search agents, conversations..."
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full transform translate-x-1 -translate-y-1"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="HelpCircle"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;