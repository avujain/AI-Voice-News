import React, { useState, useEffect, useRef } from 'react';
import { NewsProvider } from './contexts/NewsContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import VoiceAgent from './components/VoiceAgent';
import { LanguageSettings } from './components/LanguageSettings';
import { NewsFilters } from './components/NewsFilters';
import { NewsCard } from './components/NewsCard';
import { HelpModal } from './components/HelpModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SkeletonCard } from './components/LoadingSpinner';
import { useNews } from './contexts/NewsContext';
import { fetchNews } from './services/newsService';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;


const NewsApp = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const newsRef = useRef(null);
  const faqRef = useRef(null);

  const {
    articles,
    setArticles,
    currentArticleIndex,
    setCurrentArticleIndex,
    loading,
    setLoading,
    error,
    setError,
    selectedCategory,
    selectedCountry
  } = useNews();

  const loadNews = async (category = selectedCategory, country = selectedCountry) => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await fetchNews(category, country);
      setArticles(newsData.articles);
      setCurrentArticleIndex(0);
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedCountry]);

  const handleRefresh = () => {
    loadNews();
  };

  const handleArticleClick = (index) => {
    setCurrentArticleIndex(index);
  };

  const scrollToNews = () => {
    newsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AI News</h1>
          <p className="text-gray-600">Loading your personalized news feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        onShowHelp={() => setShowHelp(true)}
        onScrollToFAQ={scrollToFAQ}
        onScrollToNews={scrollToNews}
      />

      {/* Hero Section */}
      <HeroSection onScrollToNews={scrollToNews} />

      {/* News Section */}
      <section ref={newsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-8">
            <LanguageSettings />
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <NewsFilters onRefresh={handleRefresh} isLoading={loading} />
          </div>

          {error && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto">
            {loading && !isInitialLoad ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <NewsCard
                    key={index}
                    article={article}
                    index={index}
                    isActive={index === currentArticleIndex}
                    onClick={() => handleArticleClick(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No news available</h3>
                <p className="text-gray-500 mb-4">Try refreshing or changing your filters</p>
                <button
                  onClick={handleRefresh}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Refresh News
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div ref={faqRef}>
        <FAQSection />
      </div>

      <Footer />
      <VoiceAgent />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <NewsProvider>
        <NewsApp />
      </NewsProvider>
    </LanguageProvider>
  );
};

export default App;
