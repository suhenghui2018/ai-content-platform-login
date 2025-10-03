import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateContentPackData, ContentPack, ProjectSettings } from '../types/contentPack';
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateContentPackData>({
    name: '',
    description: '',
    coverImage: ''
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
    // 将项目设置数据合并到表单数据中
    const enhancedFormData = {
      ...formData,
      projectSettings: projectSettingsData || undefined
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
      coverImage: ''
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
              封面图片 (可选)
            </label>
            <input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={(e) => handleInputChange('coverImage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="请输入图片URL"
            />
            {formData.coverImage && (
              <div className="mt-3">
                <img
                  src={formData.coverImage}
                  alt="封面预览"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
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
          title="内容创作服务协议"
        />
      </div>
    </div>
  );
};

export default CreateContentPackModal;
