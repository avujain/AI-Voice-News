import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Play, Pause } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { translateText } from '../services/translationService';

export const NewsCard = ({ article, index, isActive, onClick }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedArticle, setTranslatedArticle] = useState(article);
  const { readingLanguage, speakingLanguage } = useLanguage();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    const translateArticle = async () => {
      if (readingLanguage === 'en') {
        setTranslatedArticle(article);
        return;
      }

      setIsTranslating(true);
      try {
        const [titleResult, descriptionResult] = await Promise.all([
          translateText(article.title, readingLanguage),
          translateText(article.description || '', readingLanguage),
        ]);

        setTranslatedArticle({
          ...article,
          translatedTitle: titleResult.translatedText,
          translatedDescription: descriptionResult.translatedText,
        });
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedArticle(article);
      } finally {
        setIsTranslating(false);
      }
    };

    translateArticle();
  }, [article, readingLanguage]);

  const handleReadArticle = (e) => {
    e.stopPropagation();
    const textToRead = translatedArticle.translatedTitle || translatedArticle.title;
    speak(textToRead, speakingLanguage);
  };

  const handleStopReading = (e) => {
    e.stopPropagation();
    stop();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
        isActive ? 'ring-2 ring-blue-500 shadow-2xl' : ''
      }`}
    >
      {article.urlToImage && (
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={article.urlToImage}
            alt={translatedArticle.translatedTitle || article.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            #{index + 1}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {isTranslating ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                translatedArticle.translatedTitle || article.title
              )}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {article.source.name}
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {isTranslating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : (
            translatedArticle.translatedDescription || article.description
          )}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReadArticle}
              disabled={isSpeaking || isTranslating}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span>Read</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopReading}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Original</span>
          </a>
        </div>
      </div>

      {readingLanguage !== 'en' && (
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${isTranslating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span>{isTranslating ? 'Translating...' : 'Translated'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
