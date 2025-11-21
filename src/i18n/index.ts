import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入各语言的翻译资源
import en from './en';
import zhCN from './zh-CN';
import zhTW from './zh-TW';

const resources = {
  'en': {
    translation: en
  },
  'zh-CN': {
    translation: zhCN
  },
  'zh-TW': {
    translation: zhTW
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false // React 已经安全地转义了
    },
    compatibilityJSON: 'v3' // 修复 React 18 中的警告
  });

export default i18n;
