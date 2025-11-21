import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 支持的创作语言类型
export type ContentLanguage = 'zh-TW' | 'zh-CN' | 'en' | 'ja';

// 创作语言上下文接口
interface ContentLanguageContextType {
  contentLanguage: ContentLanguage;
  setContentLanguage: (language: ContentLanguage) => void;
  getLanguageName: (language: ContentLanguage) => string;
}

// 创建创作语言上下文
const ContentLanguageContext = createContext<ContentLanguageContextType | undefined>(undefined);

// 创作语言提供者组件
export function ContentLanguageProvider({ children }: { children: ReactNode }) {
  const [contentLanguage, setContentLanguageState] = useState<ContentLanguage>(() => {
    // 从本地存储读取，如果没有则默认使用繁体中文
    const saved = localStorage.getItem('contentLanguage');
    if (saved && ['zh-TW', 'zh-CN', 'en', 'ja'].includes(saved)) {
      return saved as ContentLanguage;
    }
    return 'zh-TW';
  });

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('contentLanguage', contentLanguage);
  }, [contentLanguage]);

  const setContentLanguage = (language: ContentLanguage) => {
    setContentLanguageState(language);
  };

  const getLanguageName = (language: ContentLanguage): string => {
    const names: Record<ContentLanguage, string> = {
      'zh-TW': '繁體中文',
      'zh-CN': '简体中文',
      'en': 'English',
      'ja': '日本語'
    };
    return names[language];
  };

  const value: ContentLanguageContextType = {
    contentLanguage,
    setContentLanguage,
    getLanguageName
  };

  return (
    <ContentLanguageContext.Provider value={value}>
      {children}
    </ContentLanguageContext.Provider>
  );
}

// 使用创作语言上下文的钩子
export function useContentLanguage() {
  const context = useContext(ContentLanguageContext);
  if (context === undefined) {
    throw new Error('useContentLanguage必须在ContentLanguageProvider内部使用');
  }
  return context;
}





