import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateContentPackData, ContentPack, ProjectSettings, Expert } from '../types/contentPack';
import ServiceAgreementModal from './ServiceAgreementModal';
import ProjectSettingsModal from './ProjectSettingsModal';

interface CreateContentPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateContentPackData) => ContentPack | void;
}

const CreateContentPackModal: React.FC<CreateContentPackModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate 
}) => {
  const { t, i18n } = useTranslation();
  // 模拟专家数据 - 使用翻译键，根据语言变化更新
  const experts = useMemo<Expert[]>(() => [
    { id: '1', name: t('expertJohnDewey'), type: 'consumerPsychologist' },
    { id: '2', name: t('expertRobertCialdini'), type: 'consumerPsychologist' },
    { id: '3', name: t('expertDavidOgilvy'), type: 'copywritingExpert' },
    { id: '4', name: t('expertJosephSugarman'), type: 'copywritingExpert' },
    { id: '5', name: t('expertPhilipKotler'), type: 'marketingExpert' },
    { id: '6', name: t('expertNeilPatel'), type: 'marketingExpert' },
    { id: '7', name: t('expertNeilRackham'), type: 'salesExpert' },
    { id: '8', name: t('expertJeffreyGitomer'), type: 'salesExpert' },
    { id: '9', name: t('expertAdamSmith'), type: 'economist' },
    { id: '10', name: t('expertJohnMaynardKeynes'), type: 'economist' }
  ], [t, i18n.language]);

  const [formData, setFormData] = useState<CreateContentPackData>({
    name: '',
    description: '',
    coverImage: '',
    selectedExperts: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAgreement, setShowAgreement] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [projectSettingsData, setProjectSettingsData] = useState<ProjectSettings | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // 先显示项目设置弹窗
    setShowProjectSettings(true);
  };

  const handleAgreementAgree = () => {
    // 用户同意协议后，执行创建操作
    // 将项目设置数据和选中的专家合并到表单数据中
    const enhancedFormData = {
      ...formData,
      projectSettings: projectSettingsData || undefined,
      selectedExperts: formData.selectedExperts
    };
    
    const newContentPack = onCreate(enhancedFormData);
    
    // 创建成功后，在当前标签页打开内容创建页面
    if (newContentPack) {
      const url = `/content-creation/${newContentPack.id}?name=${encodeURIComponent(newContentPack.name)}`;
      window.location.href = url;
    }
    
    setFormData({
      name: '',
      description: '',
      coverImage: '',
      selectedExperts: []
    });
    setErrors({});
    setProjectSettingsData(null);
    setShowAgreement(false);
    onClose();
  };

  const handleAgreementClose = () => {
    setShowAgreement(false);
  };

  const handleProjectSettingsSave = (settingsData: ProjectSettings) => {
    // 保存项目设置数据
    setProjectSettingsData(settingsData);
    
    // 关闭项目设置弹窗，显示服务协议弹窗
    setShowProjectSettings(false);
    setShowAgreement(true);
  };

  const handleProjectSettingsClose = () => {
    setShowProjectSettings(false);
  };

  const handleInputChange = (field: keyof CreateContentPackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleExpertToggle = (expert: Expert) => {
    setFormData(prev => {
      const currentExperts = prev.selectedExperts || [];
      const isSelected = currentExperts.some(e => e.id === expert.id);
      
      if (isSelected) {
        // 移除专家
        return {
          ...prev,
          selectedExperts: currentExperts.filter(e => e.id !== expert.id)
        };
      } else {
        // 添加专家
        return {
          ...prev,
          selectedExperts: [...currentExperts, expert]
        };
      }
    });
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 内容包名称 */}
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

          {/* 内容包描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              {t('contentPackDescription')} *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('pleaseEnterBrandPackDescription')}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>


          {/* 封面图片 */}
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
            {formData.coverImage && (
              <div className="mt-3">
                <img
                  src={formData.coverImage}
                  alt={t('coverPreview')}
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* 专家选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contentExpertSelection')}
            </label>
            <div className="flex flex-wrap gap-2">
              {experts.map((expert) => {
                const isSelected = formData.selectedExperts?.some(e => e.id === expert.id) || false;
                return (
                  <button
                    key={expert.id}
                    type="button"
                    onClick={() => handleExpertToggle(expert)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${
                      isSelected 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {expert.name}
                    <span className="text-xs opacity-70">({t(expert.type) || expert.type})</span>
                  </button>
                );
              })}
            </div>
            {(formData.selectedExperts && formData.selectedExperts.length > 0) && (
              <p className="mt-2 text-xs text-gray-500">
                {t('selectedExperts', { count: formData.selectedExperts.length })}
              </p>
            )}
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
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('createContentPack')}
            </button>
          </div>
        </form>

        {/* 项目设置弹窗 */}
        <ProjectSettingsModal
          isOpen={showProjectSettings}
          onClose={handleProjectSettingsClose}
          onSave={handleProjectSettingsSave}
        />

        {/* 服务协议弹窗 */}
        <ServiceAgreementModal
          isOpen={showAgreement}
          onClose={handleAgreementClose}
          onAgree={handleAgreementAgree}
          title={t('contentCreationServiceAgreement')}
        />
      </div>
    </div>
  );
};

export default CreateContentPackModal;
