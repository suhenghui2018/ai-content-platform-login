import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TargetLanguage = 'zh-CN' | 'zh-TW' | 'en' | 'ja';
export type ConvertOption = 'text-only' | 'text-and-image';

interface LanguageConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetLanguages: TargetLanguage[], convertOption: ConvertOption) => void;
}

const LanguageConvertModal: React.FC<LanguageConvertModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { t } = useTranslation();
  const [targetLanguages, setTargetLanguages] = useState<TargetLanguage[]>([]);
  const [convertOption, setConvertOption] = useState<ConvertOption>('text-only');

  // 当弹窗关闭时重置状态
  const handleClose = () => {
    setTargetLanguages([]);
    setConvertOption('text-only');
    onClose();
  };

  if (!isOpen) return null;

  const languages: Array<{ code: TargetLanguage; name: string; flag: string; nameKey: string }> = [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳', nameKey: 'simplifiedChinese' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼', nameKey: 'traditionalChinese' },
    { code: 'en', name: 'English', flag: '🇺🇸', nameKey: 'english' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', nameKey: 'japanese' }
  ];

  const toggleLanguage = (langCode: TargetLanguage) => {
    setTargetLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(l => l !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  const handleConfirm = () => {
    if (targetLanguages.length === 0) {
      alert(t('convertLanguage.selectAtLeastOne') || '请至少选择一个目标语言');
      return;
    }
    onConfirm(targetLanguages, convertOption);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* 弹窗内容 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span className="text-xl">🌐</span>
              <span>{t('convertLanguage.title') || '转换语言'}</span>
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 选择目标语言 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('convertLanguage.selectTargetLanguages') || '选择目标语言（可多选）'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => {
                  const isSelected = targetLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className={`text-sm font-medium ${
                        isSelected ? 'text-primary-700' : 'text-gray-700'
                      }`}>
                        {t(`convertLanguage.${lang.nameKey}`) || lang.name}
                      </span>
                      {isSelected && (
                        <svg className="w-5 h-5 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 转换选项 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('convertLanguage.convertOption') || '转换选项'}
              </label>
              <div className="space-y-3">
                <label className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  convertOption === 'text-only'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="convertOption"
                    value="text-only"
                    checked={convertOption === 'text-only'}
                    onChange={() => setConvertOption('text-only')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{t('convertLanguage.textOnly') || '仅转换文本'}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('convertLanguage.textOnlyDesc') || '只转换文本内容，保留原始图片'}</div>
                  </div>
                </label>
                <label className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  convertOption === 'text-and-image'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="convertOption"
                    value="text-and-image"
                    checked={convertOption === 'text-and-image'}
                    onChange={() => setConvertOption('text-and-image')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{t('convertLanguage.textAndImage') || '转换文本+图片'}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('convertLanguage.textAndImageDesc') || '同时转换文本内容和图片中的文字'}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('close') || '关闭'}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
            >
              {t('confirm') || '确定'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageConvertModal;

