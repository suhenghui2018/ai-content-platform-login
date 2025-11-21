import { useTranslation } from 'react-i18next';

interface ContentPreviewModalProps {
  isOpen: boolean;
  content: string;
  isHTML?: boolean;
  onClose: () => void;
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  content,
  isHTML = false,
  onClose
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 弹窗头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('preview') || '内容预览'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 预览内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isHTML ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                srcDoc={content}
                className="w-full"
                style={{ minHeight: '600px', border: 'none' }}
                title="Content Preview"
              />
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
            </div>
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('close') || '关闭'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal;











