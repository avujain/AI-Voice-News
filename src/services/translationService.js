// For demo purposes, we'll use a mock translation service
// In a real app, you would integrate with Google Translate API, Azure Translator, or similar

export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  try {
    // Mock translation - in reality you'd call an actual translation API
    if (targetLanguage === 'en') {
      return {
        translatedText: text,
        sourceLanguage,
        targetLanguage
      };
    }

    const mockTranslations = {
      'es': '[ES] ' + text,
      'fr': '[FR] ' + text,
      'de': '[DE] ' + text,
      'it': '[IT] ' + text,
      'pt': '[PT] ' + text,
      'ru': '[RU] ' + text,
      'ja': '[JA] ' + text,
      'ko': '[KO] ' + text,
      'zh': '[ZH] ' + text,
      'ar': '[AR] ' + text,
      'hi': '[HI] ' + text
    };

    return {
      translatedText: mockTranslations[targetLanguage] || `[${targetLanguage.toUpperCase()}] ${text}`,
      sourceLanguage,
      targetLanguage
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text,
      sourceLanguage,
      targetLanguage
    };
  }
};

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

export const speechLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' }
];
