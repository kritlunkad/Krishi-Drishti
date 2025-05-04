import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '/Users/kritlunkad/Downloads/finetunellama3.2/frontend/src/en.json';
import hiTranslation from '/Users/kritlunkad/Downloads/finetunellama3.2/frontend/src/hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;