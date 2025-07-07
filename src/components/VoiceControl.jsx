import React, { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, Play, Pause, Square } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useNews } from '../contexts/NewsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { parseVoiceCommand, getLanguageFromName, getSpeechLanguageFromName } from '../utils/voiceCommands';
import { searchNews, fetchNews, categories } from '../services/newsService';

export const VoiceControl = ({ onShowHelp }) => {
  const [lastCommand, setLastCommand] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
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

  const {
    readingLanguage,
    speakingLanguage,
    setReadingLanguage,
    setSpeakingLanguage
  } = useLanguage();

  const {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported: speechSupported
  } = useSpeechSynthesis();

  const handleVoiceCommand = useCallback(async (transcript) => {
    setLastCommand(transcript);
    setIsProcessing(true);

    const command = parseVoiceCommand(transcript);

    if (!command) {
      setFeedbackMessage('Command not recognized. Try saying "Show help" for available commands.');
      setIsProcessing(false);
      return;
    }

    try {
      switch (command.action) {
        case 'search_news':
          if (command.param) {
            setFeedbackMessage(`Searching for ${command.param} news...`);
            setLoading(true);
            const searchResults = await searchNews(command.param, readingLanguage);
            setArticles(searchResults.articles);
            setCurrentArticleIndex(0);
            setFeedbackMessage(`Found ${searchResults.articles.length} articles about ${command.param}`);
          }
          break;

        case 'open_article':
          if (command.param) {
            const index = parseInt(command.param, 10) - 1;
            if (index >= 0 && index < articles.length) {
              setCurrentArticleIndex(index);
              setFeedbackMessage(`Opening article ${command.param}`);
            } else {
              setFeedbackMessage(`Article ${command.param} not found. Available articles: 1 to ${articles.length}`);
            }
          }
          break;

        case 'next_article':
          if (currentArticleIndex < articles.length - 1) {
            setCurrentArticleIndex(currentArticleIndex + 1);
            setFeedbackMessage('Moving to next article');
          } else {
            setFeedbackMessage('This is the last article');
          }
          break;

        case 'previous_article':
          if (currentArticleIndex > 0) {
            setCurrentArticleIndex(currentArticleIndex - 1);
            setFeedbackMessage('Moving to previous article');
          } else {
            setFeedbackMessage('This is the first article');
          }
          break;

        case 'read_article':
          const article = articles[currentArticleIndex];
          if (article) {
            const text = article.translatedTitle || article.title;
            speak(text, speakingLanguage);
            setFeedbackMessage('Reading article...');
          }
          break;

        case 'stop_reading':
          stop();
          setFeedbackMessage('Stopped reading');
          break;

        case 'pause_reading':
          pause();
          setFeedbackMessage('Paused reading');
          break;

        case 'resume_reading':
          resume();
          setFeedbackMessage('Resumed reading');
          break;

        case 'set_reading_language':
          if (command.param) {
            const langCode = getLanguageFromName(command.param);
            setReadingLanguage(langCode);
            setFeedbackMessage(`Reading language set to ${command.param}`);
          }
          break;

        case 'set_speaking_language':
          if (command.param) {
            const langCode = getSpeechLanguageFromName(command.param);
            setSpeakingLanguage(langCode);
            setFeedbackMessage(`Speaking language set to ${command.param}`);
          }
          break;

        case 'change_category':
          if (command.param) {
            const category = command.param.toLowerCase();
            if (categories.includes(category)) {
              setSelectedCategory(category);
              setFeedbackMessage(`Loading ${category} news...`);
              setLoading(true);
              const newsData = await fetchNews(category, selectedCountry);
              setArticles(newsData.articles);
              setCurrentArticleIndex(0);
              setFeedbackMessage(`Loaded ${category} news`);
            } else {
              setFeedbackMessage(`Category ${command.param} not found. Available categories: ${categories.join(', ')}`);
            }
          }
          break;

        case 'refresh_news':
          setFeedbackMessage('Refreshing news...');
          setLoading(true);
          const newsData = await fetchNews(selectedCategory, selectedCountry);
          setArticles(newsData.articles);
          setCurrentArticleIndex(0);
          setFeedbackMessage('News refreshed');
          break;

        case 'show_help':
          onShowHelp();
          setFeedbackMessage('Showing help');
          break;

        default:
          setFeedbackMessage('Command not recognized');
      }
    } catch (error) {
      setError('Error processing voice command');
      setFeedbackMessage('Error processing command');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  }, [
    articles,
    currentArticleIndex,
    readingLanguage,
    speakingLanguage,
    selectedCategory,
    selectedCountry
  ]);

  const {
    isListening,
    isSupported: voiceSupported,
    startListening,
    stopListening
  } = useVoiceRecognition({
    onResult: handleVoiceCommand,
    onError: (error) => {
      setFeedbackMessage(`Voice recognition error: ${error}`);
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handleMicClick = () => {
    isListening ? stopListening() : startListening();
  };

  const handleSpeechControl = () => {
    if (isSpeaking) {
      isPaused ? resume() : pause();
    } else {
      stop();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Voice Control</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMicClick}
            disabled={!voiceSupported || isProcessing}
            className={`p-3 rounded-full ${
              isListening
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } ${!voiceSupported || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleSpeechControl}
            disabled={!speechSupported}
            className={`p-3 rounded-full ${
              isSpeaking
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSpeaking ? (
              isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={stop}
              className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <Square className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isListening ? 'bg-red-500 animate-pulse' :
          isSpeaking ? 'bg-green-500 animate-pulse' :
          'bg-gray-300'
        }`} />
        <span className="text-sm text-gray-600">
          {isListening ? 'Listening...' :
           isSpeaking ? 'Speaking...' :
           'Ready'}
        </span>
      </div>

      {lastCommand && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>You said:</strong> "{lastCommand}"
          </p>
        </div>
      )}

      {feedbackMessage && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">{feedbackMessage}</p>
        </div>
      )}

      {isProcessing && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">Processing command...</p>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${voiceSupported ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Voice Recognition: {voiceSupported ? 'Supported' : 'Not Supported'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${speechSupported ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Speech Synthesis: {speechSupported ? 'Supported' : 'Not Supported'}</span>
        </div>
      </div>
    </div>
  );
};
