import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How do I use voice commands?",
    answer: "Click the AI assistant button in the bottom left corner and start speaking. You can say commands like 'Show me technology news', 'Read this article', or 'Next article'. The AI will respond and execute your commands."
  },
  {
    question: "What languages are supported?",
    answer: "We support 12+ languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, and Hindi. You can set different languages for reading and speaking."
  },
  {
    question: "How does the translation work?",
    answer: "Articles are automatically translated to your preferred reading language using advanced translation services. The original content is preserved, and you can switch between languages anytime."
  },
  {
    question: "Can I control speech playback?",
    answer: "Yes! You can pause, resume, and stop article reading using voice commands or the control buttons. Say 'Pause reading' or 'Resume reading' to control playback."
  },
  {
    question: "What news sources are available?",
    answer: "We aggregate news from multiple reliable sources worldwide, including major news outlets, technology publications, and regional news providers. You can filter by category and country."
  },
  {
    question: "Is my voice data stored?",
    answer: "No, voice commands are processed locally in your browser using the Web Speech API. No voice data is stored or transmitted to our servers."
  },
  {
    question: "How often is news updated?",
    answer: "News is fetched in real-time from our sources. You can refresh the feed anytime using the refresh button or by saying 'Refresh news' to get the latest articles."
  },
  {
    question: "Can I save my language preferences?",
    answer: "Yes, your language preferences are automatically saved in your browser's local storage and will be remembered for future visits."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-800">Frequently Asked Questions</h2>
            </div>
            <p className="text-xl text-gray-600">
              Everything you need to know about AI News
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
