export const voiceCommands = [
  {
    pattern: /show me (.*) news/i,
    action: 'search_news',
    description: 'Search for news by topic (e.g., "Show me technology news")'
  },
  {
    pattern: /what's new in (.*)/i,
    action: 'search_news',
    description: 'Search for news by topic (e.g., "What\'s new in sports")'
  },
  {
    pattern: /open article (?:number )?(\d+)/i,
    action: 'open_article',
    description: 'Open a specific article by number (e.g., "Open article 2")'
  },
  {
    pattern: /(?:go to|show) article (?:number )?(\d+)/i,
    action: 'open_article',
    description: 'Navigate to a specific article (e.g., "Go to article 3")'
  },
  {
    pattern: /next article?/i,
    action: 'next_article',
    description: 'Go to the next article'
  },
  {
    pattern: /previous article?/i,
    action: 'previous_article',
    description: 'Go to the previous article'
  },
  {
    pattern: /read (?:this )?article/i,
    action: 'read_article',
    description: 'Read the current article aloud'
  },
  {
    pattern: /stop reading/i,
    action: 'stop_reading',
    description: 'Stop reading the current article'
  },
  {
    pattern: /pause reading/i,
    action: 'pause_reading',
    description: 'Pause reading the current article'
  },
  {
    pattern: /resume reading/i,
    action: 'resume_reading',
    description: 'Resume reading the current article'
  },
  {
    pattern: /set reading language to (.*)/i,
    action: 'set_reading_language',
    description: 'Change the reading language (e.g., "Set reading language to Spanish")'
  },
  {
    pattern: /set speaking language to (.*)/i,
    action: 'set_speaking_language',
    description: 'Change the speaking language (e.g., "Set speaking language to English")'
  },
  {
    pattern: /show (.*) category/i,
    action: 'change_category',
    description: 'Change news category (e.g., "Show business category")'
  },
  {
    pattern: /refresh news/i,
    action: 'refresh_news',
    description: 'Refresh the news feed'
  },
  {
    pattern: /show help/i,
    action: 'show_help',
    description: 'Show available voice commands'
  }
];

export const parseVoiceCommand = (transcript) => {
  for (const command of voiceCommands) {
    const match = transcript.match(command.pattern);
    if (match) {
      return {
        action: command.action,
        param: match[1] || undefined
      };
    }
  }
  return null;
};

export const getLanguageFromName = (languageName) => {
  const languageMap = {
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'russian': 'ru',
    'japanese': 'ja',
    'korean': 'ko',
    'chinese': 'zh',
    'arabic': 'ar',
    'hindi': 'hi'
  };

  return languageMap[languageName.toLowerCase()] || 'en';
};

export const getSpeechLanguageFromName = (languageName) => {
  const speechLanguageMap = {
    'english': 'en-US',
    'spanish': 'es-ES',
    'french': 'fr-FR',
    'german': 'de-DE',
    'italian': 'it-IT',
    'portuguese': 'pt-BR',
    'russian': 'ru-RU',
    'japanese': 'ja-JP',
    'korean': 'ko-KR',
    'chinese': 'zh-CN',
    'arabic': 'ar-SA',
    'hindi': 'hi-IN'
  };

  return speechLanguageMap[languageName.toLowerCase()] || 'en-US';
};
