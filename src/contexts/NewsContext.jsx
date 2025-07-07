import React, { createContext, useContext, useState } from 'react';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedCountry, setSelectedCountry] = useState('us');

  return (
    <NewsContext.Provider
      value={{
        articles,
        setArticles,
        currentArticleIndex,
        setCurrentArticleIndex,
        loading,
        setLoading,
        error,
        setError,
        selectedCategory,
        setSelectedCategory,
        selectedCountry,
        setSelectedCountry,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
