import React from 'react';
import { X, Mic, Volume2, ArrowRight } from 'lucide-react';
import { voiceCommands } from '../utils/voiceCommands';

export const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Voice Commands Help</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Introduction */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use Voice Control</h3>
            <div className="space-y-2 text-blue-700">
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span>Click the microphone button to start listening</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <span>Use the speaker button to control article reading</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4" />
                <span>Speak clearly and wait for the command to process</span>
              </div>
            </div>
          </div>

          {/* Voice Commands */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Available Voice Commands</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voiceCommands.map((command, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-800 mb-2">
                    {command.description}
                  </div>
                  <div className="text-xs text-gray-600 bg-white p-2 rounded border font-mono">
                    {command.pattern.source
                      .replace(/[()\\]/g, '')
                      .replace(/\.\*/g, '[topic]')
                      .replace(/\\d\+/g, '[number]')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Example Commands</h3>
            <div className="space-y-2 text-green-700">
              {[
                "Show me technology news",
                "Open article number 3",
                "Read this article",
                "Set reading language to Spanish",
                "Next article"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>"{text}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Tips for Better Voice Recognition</h3>
            <ul className="space-y-2 text-yellow-700">
              {[
                "Speak clearly and at a moderate pace",
                "Use a quiet environment for better accuracy",
                "Wait for the microphone to stop listening before speaking again",
                "Try rephrasing if a command isn't recognized"
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
