import React from 'react';
import { ArrowDown, Sparkles, Globe, Mic } from 'lucide-react';

export const HeroSection = ({ onScrollToNews }) => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Your intelligent{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              voice-controlled
            </span>{' '}
            multilingual news companion
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Experience the future of news consumption with AI-powered voice commands, 
            real-time translation, and intelligent content delivery tailored to your preferences.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Mic className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">Voice Control</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Globe className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 font-medium">Multilingual</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 font-medium">AI-Powered</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onScrollToNews}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Read News</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </button>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};
