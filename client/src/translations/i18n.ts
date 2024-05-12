import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import pl from './pl.json';


const determineLanguage = (code: string): string[] => {
    switch (true) {
      case code.startsWith('en'): {
        return ['en'];
      }
      case code.startsWith('pl'): {
        return ['pl'];
      }
      default: {
        return ['en'];
      }
    }
  };

const resources = {
  en:{translation:en},
  pl:{translation:pl}
}

 i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: (code) => determineLanguage(code),
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

  export default i18n