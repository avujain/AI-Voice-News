import React from 'react';
import { Bot, Home, HelpCircle, MessageCircle } from 'lucide-react';

export const Navigation = ({ onShowHelp, onScrollToFAQ, onScrollToNews }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI News
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onScrollToNews}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={onShowHelp}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Voice Commands</span>
            </button>

            <button
              onClick={onScrollToFAQ}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQs</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
