import React from 'react';
import { Bot, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI News
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-center max-w-md">
            Your intelligent voice-controlled multilingual news companion, 
            bringing you the latest news with AI-powered features.
          </p>

          {/* Copyright */}
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>© 2025 AI News. Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for news enthusiasts worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
