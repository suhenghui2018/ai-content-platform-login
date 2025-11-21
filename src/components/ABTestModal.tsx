import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ABTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreation: (testType: string, importMethod: string) => void;
}

const ABTestModal = ({ isOpen, onClose, onStartCreation }: ABTestModalProps) => {
  const { t } = useTranslation();
  const [selectedTestType, setSelectedTestType] = useState<string>('email');
  const [selectedImportMethod, setSelectedImportMethod] = useState<string>('upload');
  const [htmlCode, setHtmlCode] = useState<string>('');

  // 测试类型选项
  const testTypes = [
    { id: 'email', name: t('emailABTest'), isAvailable: true },
    { id: 'ig', name: t('instagramABTest'), isAvailable: false },
    { id: 'sms', name: t('smsABTest'), isAvailable: false },
    { id: 'rcs', name: t('rcsABTest'), isAvailable: false },
    { id: 'fb', name: t('facebookABTest'), isAvailable: false },
  ];

  // 导入方式选项
  const importMethods = [
    { id: 'upload', name: t('uploadHtmlFile') },
    { id: 'paste', name: t('pasteHtmlCode') },
    { id: 'hubspot', name: t('importFromHubspot') },
    { id: 'radica', name: t('importFromRadica') },
  ];



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{t('abTestSettings')}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={t('close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 测试类型选择部分 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{t('selectTestType')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {testTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => type.isAvailable && setSelectedTestType(type.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedTestType === type.id ? 'border-blue-500 bg-blue-50' : type.isAvailable ? 'border-gray-200 hover:border-blue-300' : 'border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed'}`}
              >
                <p className="font-medium text-gray-800 mb-1">{type.name}</p>
                {!type.isAvailable && (
                  <span className="text-xs text-gray-500">{t('comingSoon')}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 导入方式选择部分 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{t('selectImportMethod')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {importMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedImportMethod(method.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedImportMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <p className="font-medium text-gray-800">{method.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 导入方式的对应输入区域 */}
        <div className="mb-6">
          {selectedImportMethod === 'upload' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-500 mb-2">{t('dragAndDrop')}</p>
              <p className="text-sm text-gray-400 mb-4">{t('supportedFormats')}</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                {t('browseFiles')}
              </button>
              <input type="file" className="hidden" accept=".html,.htm" />
            </div>
          )}

          {selectedImportMethod === 'code' && (
            <div>
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('pasteHtmlCodeHere')}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
              />
            </div>
          )}

          {selectedImportMethod === 'hubspot' && (
            <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-2">{t('connectHubspotAccount')}</h4>
              <p className="text-gray-600 mb-4">{t('hubspotDescription')}</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                {t('connectHubspot')}
              </button>
            </div>
          )}

          {selectedImportMethod === 'radica' && (
            <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-2">{t('connectRadicaAccount')}</h4>
              <p className="text-gray-600 mb-4">{t('radicaDescription')}</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                {t('connectRadica')}
              </button>
            </div>
          )}
        </div>

        {/* 按钮区域 */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => onStartCreation(selectedTestType, selectedImportMethod)}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            disabled={!testTypes.find(t => t.id === selectedTestType)?.isAvailable}
          >
            {t('startCreation')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ABTestModal;