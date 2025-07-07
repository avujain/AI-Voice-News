import React, { useState, useCallback, useEffect } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useNews } from '../contexts/NewsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { parseVoiceCommand, getLanguageFromName, getSpeechLanguageFromName } from '../utils/voiceCommands';
import { searchNews, fetchNews, categories } from '../services/newsService';

const VoiceAgent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    articles,
    setArticles,
    currentArticleIndex,
    setCurrentArticleIndex,
    setLoading,
    setError,
    selectedCategory,
    setSelectedCategory,
    selectedCountry
  } = useNews();

  const { readingLanguage, speakingLanguage, setReadingLanguage, setSpeakingLanguage } = useLanguage();
  const { speak, pause, resume, stop, isSpeaking, isPaused } = useSpeechSynthesis();

  const handleVoiceCommand = useCallback(async (transcript) => {
    setLastCommand(transcript);
    setIsProcessing(true);

    const command = parseVoiceCommand(transcript);

    if (!command) {
      const response = "I didn't understand that command. You can say things like 'Show me technology news' or 'Read this article'.";
      setAgentResponse(response);
      speak(response, speakingLanguage);
      setIsProcessing(false);
      return;
    }

    try {
      let response = '';

      switch (command.action) {
        case 'search_news':
          if (command.param) {
            response = `Searching for ${command.param} news...`;
            setAgentResponse(response);
            speak(response, speakingLanguage);
            setLoading(true);
            const searchResults = await searchNews(command.param, readingLanguage);
            setArticles(searchResults.articles);
            setCurrentArticleIndex(0);
            response = `Found ${searchResults.articles.length} articles about ${command.param}`;
            setAgentResponse(response);
            speak(response, speakingLanguage);
          }
          break;

        case 'open_article':
          if (command.param) {
            const articleNumber = parseInt(command.param) - 1;
            if (articleNumber >= 0 && articleNumber < articles.length) {
              setCurrentArticleIndex(articleNumber);
              response = `Opening article ${parseInt(command.param)}`;
              setAgentResponse(response);
              speak(response, speakingLanguage);
            } else {
              response = `Article ${command.param} not found. Available articles: 1 to ${articles.length}`;
              setAgentResponse(response);
              speak(response, speakingLanguage);
            }
          }
          break;

        case 'next_article':
          if (currentArticleIndex < articles.length - 1) {
            setCurrentArticleIndex(currentArticleIndex + 1);
            response = 'Moving to next article';
          } else {
            response = 'This is the last article';
          }
          setAgentResponse(response);
          speak(response, speakingLanguage);
          break;

        case 'previous_article':
          if (currentArticleIndex > 0) {
            setCurrentArticleIndex(currentArticleIndex - 1);
            response = 'Moving to previous article';
          } else {
            response = 'This is the first article';
          }
          setAgentResponse(response);
          speak(response, speakingLanguage);
          break;

        case 'read_article':
          if (articles[currentArticleIndex]) {
            const article = articles[currentArticleIndex];
            const textToRead = article.translatedTitle || article.title;
            response = 'Reading article...';
            setAgentResponse(response);
            speak(response, speakingLanguage);
            setTimeout(() => {
              speak(textToRead, speakingLanguage);
            }, 1000);
          }
          break;

        case 'stop_reading':
          stop();
          response = 'Stopped reading';
          setAgentResponse(response);
          speak(response, speakingLanguage);
          break;

        case 'pause_reading':
          pause();
          response = 'Paused reading';
          setAgentResponse(response);
          speak(response, speakingLanguage);
          break;

        case 'resume_reading':
          resume();
          response = 'Resumed reading';
          setAgentResponse(response);
          speak(response, speakingLanguage);
          break;

        case 'set_reading_language':
          if (command.param) {
            const langCode = getLanguageFromName(command.param);
            setReadingLanguage(langCode);
            response = `Reading language set to ${command.param}`;
            setAgentResponse(response);
            speak(response, speakingLanguage);
          }
          break;

        case 'set_speaking_language':
          if (command.param) {
            const langCode = getSpeechLanguageFromName(command.param);
            setSpeakingLanguage(langCode);
            response = `Speaking language set to ${command.param}`;
            setAgentResponse(response);
            speak(response, speakingLanguage);
          }
          break;

        case 'change_category':
          if (command.param) {
            const category = command.param.toLowerCase();
            if (categories.includes(category)) {
              setSelectedCategory(category);
              response = `Loading ${category} news...`;
              setAgentResponse(response);
              speak(response, speakingLanguage);
              setLoading(true);
              const newsData = await fetchNews(category, selectedCountry);
              setArticles(newsData.articles);
              setCurrentArticleIndex(0);
              response = `Loaded ${category} news`;
              setAgentResponse(response);
              speak(response, speakingLanguage);
            } else {
              response = `Category ${command.param} not found. Available categories include business, technology, sports, and health.`;
              setAgentResponse(response);
              speak(response, speakingLanguage);
            }
          }
          break;

        case 'refresh_news':
          response = 'Refreshing news...';
          setAgentResponse(response);
          speak(response, speakingLanguage);
          setLoading(true);
          const newsData = await fetchNews(selectedCategory, selectedCountry);
          setArticles(newsData.articles);
          setCurrentArticleIndex(0);
          response = 'News refreshed';
          setAgentResponse(response);
          speak(response, speakingLanguage);
          break;

        default:
          response = "I'm not sure how to help with that. Try asking me to show news, read an article, or change settings.";
          setAgentResponse(response);
          speak(response, speakingLanguage);
      }
    } catch (error) {
      const errorResponse = 'Sorry, I encountered an error processing your request.';
      setError('Error processing voice command');
      setAgentResponse(errorResponse);
      speak(errorResponse, speakingLanguage);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  }, [articles, currentArticleIndex, readingLanguage, speakingLanguage, selectedCategory, selectedCountry]);

  const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition({
    onResult: handleVoiceCommand,
    onError: (error) => {
      const errorResponse = 'Sorry, I had trouble hearing you. Please try again.';
      setAgentResponse(errorResponse);
      speak(errorResponse, speakingLanguage);
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    if (agentResponse) {
      const timer = setTimeout(() => {
        setAgentResponse('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [agentResponse]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setAgentResponse('Listening...');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center ${
            isListening ? 'animate-pulse scale-110' : 'hover:scale-105'
          }`}
        >
          <Bot className="w-8 h-8" />
        </button>

        {(isListening || isSpeaking || isProcessing) && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="absolute bottom-20 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                isListening ? 'bg-red-500 animate-pulse' :
                isSpeaking ? 'bg-green-500 animate-pulse' :
                isProcessing ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isListening ? 'Listening...' :
                 isSpeaking ? 'Speaking...' :
                 isProcessing ? 'Processing...' :
                 'Ready to help'}
              </span>
            </div>
          </div>

          {lastCommand && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">You said:</span> "{lastCommand}"
              </p>
            </div>
          )}

          {agentResponse && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <span className="font-semibold">AI:</span> {agentResponse}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={handleMicClick}
              disabled={!isSupported || isProcessing}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
              } ${!isSupported || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => isSpeaking ? stop() : null}
              disabled={!isSpeaking}
              className={`p-3 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <VolumeX className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p className="font-semibold mb-1">Try saying:</p>
            <ul className="space-y-1">
              <li>"Show me technology news"</li>
              <li>"Read this article"</li>
              <li>"Next article"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;
