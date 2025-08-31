// src/App.js
import React, { useState, useEffect } from "react";
import { ArrowLeftRight, Volume2, Copy, Check, Globe } from "lucide-react";
import { translateText, LANGUAGES, getLanguageName } from "./utils/translate";
import "./App.css";

function App() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Handle translation with debouncing
  useEffect(() => {
    const delayedTranslate = setTimeout(async () => {
      if (sourceText.trim() && sourceLang !== targetLang) {
        setLoading(true);
        setError("");
        try {
          const result = await translateText(
            sourceText,
            sourceLang,
            targetLang
          );
          setTranslatedText(result);
        } catch (err) {
          setError("Translation failed. Please try again.");
          setTranslatedText("");
        } finally {
          setLoading(false);
        }
      } else if (!sourceText.trim()) {
        setTranslatedText("");
      } else if (sourceLang === targetLang) {
        setTranslatedText(sourceText);
      }
    }, 500);

    return () => clearTimeout(delayedTranslate);
  }, [sourceText, sourceLang, targetLang]);

  // Swap languages
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text");
    }
  };

  // Text to speech
  const speakText = (text, lang) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  // Clear all text
  const clearText = () => {
    setSourceText("");
    setTranslatedText("");
    setError("");
  };

  const examplePhrases = [
    "hello",
    "goodbye",
    "thank you",
    "how are you",
    "good morning",
  ];

  return (
    <div className="App">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">
                Language Translator
              </h1>
            </div>
            <p className="text-gray-600">
        
            </p>
          </div>

          {/* Main Translator Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* Language Selection Header */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swapLanguages}
                  className="mx-4 p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-200 hover:scale-105"
                  title="Swap languages"
                >
                  <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Translation Area */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              {/* Source Text */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700">Enter text</h3>
                  <div className="flex space-x-2">
                    {sourceText && (
                      <>
                        <button
                          onClick={() => speakText(sourceText, sourceLang)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={clearText}
                          className="px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Clear text"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Type something to translate..."
                  className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={5000}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500">
                    {getLanguageName(sourceLang)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {sourceText.length}/5000
                  </div>
                </div>
              </div>

              {/* Translated Text */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700">Translation</h3>
                  <div className="flex space-x-2">
                    {translatedText && !loading && (
                      <>
                        <button
                          onClick={() => speakText(translatedText, targetLang)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Copy translation"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full h-40 p-4 bg-white border border-gray-200 rounded-lg overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">
                          Translating...
                        </span>
                      </div>
                    ) : error ? (
                      <div className="text-red-500 text-center h-full flex items-center justify-center">
                        <div>
                          <p className="font-medium">Translation Error</p>
                          <p className="text-sm mt-1">{error}</p>
                        </div>
                      </div>
                    ) : translatedText ? (
                      <p className="text-gray-800 leading-relaxed">
                        {translatedText}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-center h-full flex items-center justify-center">
                        Translation will appear here...
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      {getLanguageName(targetLang)}
                    </div>
                    {translatedText && (
                      <div className="text-sm text-gray-500">
                        {translatedText.length} characters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-green-50 p-4 text-center border-t">
              <p className="text-sm text-green-700">
            
              </p>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Try these examples:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {examplePhrases.map((example) => (
                <button
                  key={example}
                  onClick={() => setSourceText(example)}
                  className="p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300 hover:shadow-md"
                >
                  <span className="text-gray-700 capitalize font-medium">
                    {example}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
