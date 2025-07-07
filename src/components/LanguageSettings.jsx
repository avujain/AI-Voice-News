import React from 'react';
import { Globe, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supportedLanguages, speechLanguages } from '../services/translationService';

export const LanguageSettings = () => {
  const {
    readingLanguage,
    speakingLanguage,
    setReadingLanguage,
    setSpeakingLanguage,
  } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Language Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reading Language */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Globe className="w-4 h-4" />
            <span>Reading Language</span>
          </label>
          <select
            value={readingLanguage}
            onChange={(e) => setReadingLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Articles will be translated to this language
          </p>
        </div>

        {/* Speaking Language */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Volume2 className="w-4 h-4" />
            <span>Speaking Language</span>
          </label>
          <select
            value={speakingLanguage}
            onChange={(e) => setSpeakingLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {speechLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Articles will be read aloud in this language
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Tip:</span> You can also change languages using voice commands like 
          "Set reading language to Spanish" or "Set speaking language to French"
        </p>
      </div>
    </div>
  );
};
