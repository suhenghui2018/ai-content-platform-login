import React from 'react';
import { useTranslation } from 'react-i18next';

interface ServiceAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  title?: string;
}

const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({ 
  isOpen, 
  onClose, 
  onAgree,
  title
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title || t('serviceAgreement')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 协议内容 */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-600 leading-relaxed">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('aiContentServiceAgreement')}</h3>
            
            <div className="space-y-3">
              <p><strong>1. 服务说明</strong></p>
              <p>本平台提供AI驱动的全渠道内容创作服务，包括但不限于文本生成、图像创作、视频制作等功能。</p>
              
              <p><strong>2. 用户责任</strong></p>
              <p>用户应确保所创作的内容符合相关法律法规，不得包含违法违规、有害或不当信息。</p>
              
              <p><strong>3. 知识产权</strong></p>
              <p>用户通过本平台创作的内容，其知识产权归用户所有。平台仅提供技术服务支持。</p>
              
              <p><strong>4. 服务限制</strong></p>
              <p>平台有权根据服务条款限制或暂停用户的使用权限，以维护服务质量和平台安全。</p>
              
              <p><strong>5. 隐私保护</strong></p>
              <p>平台承诺保护用户隐私，不会未经授权使用或泄露用户个人信息和创作内容。</p>
              
              <p><strong>6. 免责声明</strong></p>
              <p>用户使用AI生成的内容，应自行承担相应的法律责任和风险。</p>
              
              <p><strong>7. 协议修改</strong></p>
              <p>平台有权根据业务需要修改本协议，修改后的协议将在平台公布后生效。</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{t('importantNotice')}</strong>{t('agreementNotice')}
              </p>
            </div>
          </div>
        </div>

        {/* 按钮区域 */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onAgree}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('agreeAndContinue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAgreementModal;



