import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreateContentPackData, ContentPack, ProjectSettings } from '../types/contentPack';
import { BrandPack } from '../types/brandPack';
import { getBrandPacks } from '../utils/brandPackData';

interface ContentPackCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateContentPackData) => ContentPack | void;
}

const ContentPackCreationModal: React.FC<ContentPackCreationModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateContentPackData>({
    name: '',
    description: '',
    coverImage: ''
  });
  
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    brandPackId: '',
    targetAudience: '',
    brandVoice: '',
    brandTone: '',
    title: '',
    goal: ''
  });

  const [brandPacks, setBrandPacks] = useState<BrandPack[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 获取品牌包列表
  useEffect(() => {
    const packs = getBrandPacks();
    setBrandPacks(packs);
  }, []);

  const brandVoiceOptions = [
    t('professional'),
    t('casual'),
    t('friendly'),
    t('authoritative'),
    t('creative'),
    t('technical'),
    t('conversational'),
    t('formal')
  ];

  const brandToneOptions = [
    t('warm'),
    t('cool'),
    t('lively'),
    t('stable'),
    t('humorous'),
    t('serious'),
    t('motivational'),
    t('calm')
  ];

  const audienceOptions = [
    t('generalAudience'),
    t('businessProfessionals'),
    t('students'),
    t('techEnthusiasts'),
    t('creativeProfessionals'),
    t('healthcareWorkers'),
    t('educators'),
    t('entrepreneurs')
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contentPackNameRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('contentPackDescriptionRequired');
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateContentPack = () => {
    if (!validateForm()) {
      return;
    }

    // 直接创建内容包并跳转，不显示服务协议弹窗
    const enhancedFormData = {
      ...formData,
      projectSettings: projectSettings
    };
    
    const newContentPack = onCreate(enhancedFormData);
    
    // 创建成功后，直接跳转到内容创建页面
    if (newContentPack) {
      const params = new URLSearchParams();
      params.set('name', newContentPack.name);
      
      // 添加项目设置信息到URL参数
      if (projectSettings.brandPackId) {
        params.set('brandPackId', projectSettings.brandPackId);
      }
      if (projectSettings.targetAudience) {
        params.set('targetAudience', projectSettings.targetAudience);
      }
      if (projectSettings.brandVoice) {
        params.set('brandVoice', projectSettings.brandVoice);
      }
      if (projectSettings.brandTone) {
        params.set('brandTone', projectSettings.brandTone);
      }
      
      const url = `/content-creation/${newContentPack.id}?${params.toString()}`;
      navigate(url);
    }
  };

  const handleSaveDraft = () => {
    if (!formData.name.trim()) {
      setErrors({ name: t('contentPackNameRequired') });
      return;
    }

    // 保存草稿（不包含项目设置）
    const draftData = {
      ...formData,
      projectSettings: undefined
    };
    
    onCreate(draftData);
    onClose();
  };


  const handleInputChange = (field: keyof CreateContentPackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProjectSettingsChange = (field: keyof ProjectSettings, value: string) => {
    setProjectSettings(prev => {
      const newSettings = { ...prev, [field]: value };
      
      // 如果更改了品牌包选择，清空目标受众画像
      if (field === 'brandPackId') {
        newSettings.targetAudience = '';
      }
      
      return newSettings;
    });
    
    if (errors[`project${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`project${field.charAt(0).toUpperCase() + field.slice(1)}`]: '' }));
    }
  };

  // 移除未使用的函数
  // const handleAddContext = () => {
  //   // 这里可以添加文件上传或其他添加上下文的功能
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{t('createContentPack')}</h2>
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
        <form className="p-6 space-y-8">
          {/* 内容包基本信息 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('contentPackBasicInfo')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contentPackName')} *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('pleaseEnterBrandPackName')}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coverImageOptional')}
                </label>
                <input
                  id="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder={t('pleaseEnterImageUrl')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('contentPackDescription')} *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('pleaseEnterBrandPackDescription')}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* 项目设置 */}
          <div className="space-y-6">
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 选择品牌包 */}
              <div>
                <label htmlFor="brandPack" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    <span>{t('selectBrandPack')}</span>
                  </div>
                </label>
                <select
                  id="brandPack"
                  value={projectSettings.brandPackId}
                  onChange={(e) => handleProjectSettingsChange('brandPackId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">{t('selectBrandPack')}</option>
                  {brandPacks.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 目标受众画像 */}
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>{t('targetAudienceProfile')}</span>
                  </div>
                </label>
                <select
                  id="targetAudience"
                  value={projectSettings.targetAudience}
                  onChange={(e) => handleProjectSettingsChange('targetAudience', e.target.value)}
                  disabled={!projectSettings.brandPackId}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                    !projectSettings.brandPackId ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  }`}
                >
                  <option value="">
                    {!projectSettings.brandPackId ? t('pleaseSelectBrandPackFirst') : t('selectTargetAudienceProfile')}
                  </option>
                  {audienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 品牌声音 */}
              <div>
                <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{t('brandVoice')}</span>
                  </div>
                </label>
                <select
                  id="brandVoice"
                  value={projectSettings.brandVoice}
                  onChange={(e) => handleProjectSettingsChange('brandVoice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">{t('selectBrandVoice')}</option>
                  {brandVoiceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 品牌语调 */}
              <div>
                <label htmlFor="brandTone" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{t('brandTone')}</span>
                  </div>
                </label>
                <select
                  id="brandTone"
                  value={projectSettings.brandTone}
                  onChange={(e) => handleProjectSettingsChange('brandTone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">{t('selectBrandTone')}</option>
                  {brandToneOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
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
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t('saveDraft')}
            </button>
            <button
              type="button"
              onClick={handleCreateContentPack}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('createContentPack')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ContentPackCreationModal;
