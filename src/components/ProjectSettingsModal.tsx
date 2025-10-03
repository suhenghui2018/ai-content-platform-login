import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectSettings } from '../types/contentPack';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectSettings) => void;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProjectSettings>({
    brandPackId: '',
    targetAudience: '',
    brandVoice: '',
    brandTone: '',
    title: '',
    goal: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const brandVoiceOptions = [
    '专业',
    '随意',
    '友好',
    '权威',
    '创意',
    '技术',
    '对话式',
    '正式'
  ];

  const audienceOptions = [
    '普通受众',
    '商务专业人士',
    '学生',
    '科技爱好者',
    '创意专业人士',
    '医疗工作者',
    '教育工作者',
    '企业家'
  ];

  const languageOptions = [
    '英语（美式）',
    '英语（英式）',
    '中文（简体）',
    '中文（繁体）',
    '西班牙语',
    '法语',
    '德语',
    '日语'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入项目标题';
    }

    if (!formData.goal.trim()) {
      newErrors.goal = '请输入项目目标';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof ProjectSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddContext = () => {
    // 这里可以添加文件上传或其他添加上下文的功能
    console.log('添加上下文');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{t('projectSettings')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 项目基本信息 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                标题
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="为您的项目命名"
                autoFocus
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                目标
              </label>
              <textarea
                id="goal"
                value={formData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.goal ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="描述您的项目、目标等..."
              />
              {errors.goal && <p className="mt-1 text-sm text-red-600">{errors.goal}</p>}
            </div>
          </div>

          {/* 设置语音、受众和语言 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('setVoiceAudienceLanguage')}
              </h3>
              <button
                type="button"
                className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-500 transition-colors"
                title="更多信息"
              >
                ⓘ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 品牌语音 */}
              <div>
                <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>品牌语音</span>
                  </div>
                </label>
                <select
                  id="brandVoice"
                  value={formData.brandVoice}
                  onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">选择一个品牌语音</option>
                  {brandVoiceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 受众 */}
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>受众</span>
                  </div>
                </label>
                <select
                  id="audience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">选择一个受众</option>
                  {audienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 语言 */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    <span>语言</span>
                  </div>
                </label>
                <select
                  id="language"
                  value={formData.brandTone}
                  onChange={(e) => handleInputChange('brandTone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {languageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 上传上下文 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              上传上下文以帮助AI提供更好的响应
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-500 mb-4">
                您的项目上下文将在这里显示
              </div>
              <button
                type="button"
                onClick={handleAddContext}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加上下文
              </button>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('saveAndContinue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSettingsModal;
