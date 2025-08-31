// src/utils/translate.js

// Language configuration
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
];

// Translation function with multiple API fallbacks
export const translateText = async (text, sourceLang, targetLang) => {
  // First try MyMemory API (free, no API key needed)
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`,
      {
        method: "GET",
        headers: {
          "User-Agent": "ReactTranslatorApp",
        },
      }
    );

    if (!response.ok) {
      throw new Error("MyMemory API failed");
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    } else {
      throw new Error("Translation not available");
    }
  } catch (error) {
    console.log("MyMemory API failed, trying fallback...");

    // Fallback to enhanced mock translations
    return await enhancedMockTranslate(text, sourceLang, targetLang);
  }
};

// Enhanced mock translation with more comprehensive coverage
const enhancedMockTranslate = async (text, sourceLang, targetLang) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const translations = {
    // Common greetings
    hello: { es: "hola", fr: "bonjour", de: "hallo", it: "ciao", pt: "olá" },
    hi: { es: "hola", fr: "salut", de: "hallo", it: "ciao", pt: "oi" },
    goodbye: {
      es: "adiós",
      fr: "au revoir",
      de: "auf wiedersehen",
      it: "ciao",
      pt: "tchau",
    },
    "good morning": {
      es: "buenos días",
      fr: "bonjour",
      de: "guten morgen",
      it: "buongiorno",
      pt: "bom dia",
    },
    "good night": {
      es: "buenas noches",
      fr: "bonne nuit",
      de: "gute nacht",
      it: "buonanotte",
      pt: "boa noite",
    },

    // Common phrases
    "thank you": {
      es: "gracias",
      fr: "merci",
      de: "danke",
      it: "grazie",
      pt: "obrigado",
    },
    please: {
      es: "por favor",
      fr: "s'il vous plaît",
      de: "bitte",
      it: "per favore",
      pt: "por favor",
    },
    "excuse me": {
      es: "disculpe",
      fr: "excusez-moi",
      de: "entschuldigung",
      it: "scusi",
      pt: "com licença",
    },
    sorry: {
      es: "lo siento",
      fr: "désolé",
      de: "entschuldigung",
      it: "mi dispiace",
      pt: "desculpe",
    },

    // Questions
    "how are you": {
      es: "¿cómo estás?",
      fr: "comment allez-vous?",
      de: "wie geht es dir?",
      it: "come stai?",
      pt: "como você está?",
    },
    "what is your name": {
      es: "¿cuál es tu nombre?",
      fr: "quel est votre nom?",
      de: "wie heißt du?",
      it: "come ti chiami?",
      pt: "qual é o seu nome?",
    },
    "where are you from": {
      es: "¿de dónde eres?",
      fr: "d'où venez-vous?",
      de: "woher kommst du?",
      it: "di dove sei?",
      pt: "de onde você é?",
    },

    // Common words
    yes: { es: "sí", fr: "oui", de: "ja", it: "sì", pt: "sim" },
    no: { es: "no", fr: "non", de: "nein", it: "no", pt: "não" },
    water: { es: "agua", fr: "eau", de: "wasser", it: "acqua", pt: "água" },
    food: {
      es: "comida",
      fr: "nourriture",
      de: "essen",
      it: "cibo",
      pt: "comida",
    },
    love: { es: "amor", fr: "amour", de: "liebe", it: "amore", pt: "amor" },
    beautiful: {
      es: "hermoso",
      fr: "beau",
      de: "schön",
      it: "bello",
      pt: "bonito",
    },

    // Sentences
    "i love you": {
      es: "te amo",
      fr: "je t'aime",
      de: "ich liebe dich",
      it: "ti amo",
      pt: "eu te amo",
    },
    "i am learning": {
      es: "estoy aprendiendo",
      fr: "j'apprends",
      de: "ich lerne",
      it: "sto imparando",
      pt: "estou aprendendo",
    },
    "have a good day": {
      es: "que tengas un buen día",
      fr: "passe une bonne journée",
      de: "hab einen schönen tag",
      it: "buona giornata",
      pt: "tenha um bom dia",
    },
  };

  const lowerText = text.toLowerCase().trim();

  // Check for exact matches
  if (translations[lowerText] && translations[lowerText][targetLang]) {
    return translations[lowerText][targetLang];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(translations)) {
    if (lowerText.includes(key) && value[targetLang]) {
      return `${value[targetLang]} (contains: ${key})`;
    }
  }

  // Simple word-by-word translation attempt
  const words = lowerText.split(" ");
  const translatedWords = words.map((word) => {
    if (translations[word] && translations[word][targetLang]) {
      return translations[word][targetLang];
    }
    return word;
  });

  const targetLanguage = LANGUAGES.find((lang) => lang.code === targetLang);

  // If we translated some words, return that
  if (translatedWords.some((word, index) => word !== words[index])) {
    return translatedWords.join(" ");
  }

  // Otherwise return a helpful message
  return `[${targetLanguage?.name || targetLang} translation of: "${text}"]`;
};

// Backup mock translation function
export const mockTranslateText = async (text, sourceLang, targetLang) => {
  try {
    // Add delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock translations for common phrases
    const mockTranslations = {
      hello: {
        es: "hola",
        fr: "bonjour",
        de: "hallo",
        it: "ciao",
        pt: "olá",
        ru: "привет",
        ja: "こんにちは",
        ko: "안녕하세요",
        zh: "你好",
        ar: "مرحبا",
        hi: "नमस्ते",
      },
      goodbye: {
        es: "adiós",
        fr: "au revoir",
        de: "auf wiedersehen",
        it: "arrivederci",
        pt: "tchau",
        ru: "до свидания",
        ja: "さようなら",
        ko: "안녕히 가세요",
        zh: "再见",
        ar: "وداعا",
        hi: "अलविदा",
      },
      "thank you": {
        es: "gracias",
        fr: "merci",
        de: "danke",
        it: "grazie",
        pt: "obrigado",
        ru: "спасибо",
        ja: "ありがとう",
        ko: "감사합니다",
        zh: "谢谢",
        ar: "شكرا",
        hi: "धन्यवाद",
      },
    };

    const lowerText = text.toLowerCase().trim();

    // Check if we have a mock translation
    if (
      mockTranslations[lowerText] &&
      mockTranslations[lowerText][targetLang]
    ) {
      return mockTranslations[lowerText][targetLang];
    }

    // For other text, return a placeholder
    const targetLanguage = LANGUAGES.find((lang) => lang.code === targetLang);
    return `[Demo: "${text}" translated to ${
      targetLanguage?.name || targetLang
    }]`;
  } catch (error) {
    throw new Error("Translation failed");
  }
};

// Real API integration example (commented out)
/*
// Example with Google Translate API
export const translateTextWithGoogleAPI = async (text, sourceLang, targetLang) => {
  const API_KEY = 'your-google-translate-api-key';
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    throw new Error('Translation API error');
  }
};
*/

// Example with LibreTranslate API (free alternative)
/*
export const translateTextWithLibreTranslate = async (text, sourceLang, targetLang) => {
  const url = 'https://libretranslate.de/translate';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });
    
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    throw new Error('Translation API error');
  }
};
*/

// Utility functions
export const detectLanguage = (text) => {
  // Simple language detection (replace with real API)
  // For now, just return English as default
  return "en";
};

export const getSupportedLanguages = () => {
  return LANGUAGES;
};

export const getLanguageName = (code) => {
  const language = LANGUAGES.find((lang) => lang.code === code);
  return language ? language.name : code;
};
