import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBrandPacks } from '../utils/brandPackData';

interface KnowledgeItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'email' | 'media' | 'other';
  brandPackId: string;
  brandPackName: string;
  fileSize: number;
  uploadDate: Date;
  url?: string;
  description?: string;
  tags?: string[];
}

const KnowledgeBasePage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBrandPackId, setSelectedBrandPackId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [previewEmailItem, setPreviewEmailItem] = useState<KnowledgeItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const brandPacks = getBrandPacks();

  // 初始化：如果是Godiva品牌包，加载默认邮件
  useEffect(() => {
    if (hasInitialized.current) return; // 已经初始化过，不再执行
    if (brandPacks.length === 0) return; // 等待品牌包数据加载
    
    const godivaPack = brandPacks.find(p => p.id === '2');
    if (godivaPack) {
      // Godiva品牌包的默认邮件内容
      const godivaDefaultEmails: KnowledgeItem[] = [
        {
          id: 'godiva-email-1',
          name: 'Godiva 2025方形朱古力系列 - 会员尊享预购邮件',
          type: 'email',
          brandPackId: '2',
          brandPackName: godivaPack.name,
          fileSize: 45000,
          uploadDate: new Date('2025-06-01'),
          url: undefined,
          description: '高级会员专属预购邀请邮件，包含倒计时组件和产品亮点展示',
          tags: ['营销推广', '会员专享', '新品发布']
        },
        {
          id: 'godiva-email-2',
          name: 'GODIVA 歌帝梵立方巧克力系列新品预售邮件',
          type: 'email',
          brandPackId: '2',
          brandPackName: godivaPack.name,
          fileSize: 38000,
          uploadDate: new Date('2025-08-15'),
          url: undefined,
          description: '新品预售邀请邮件，包含产品介绍和限时优惠信息',
          tags: ['新品预售', '限时优惠', '产品介绍']
        },
        {
          id: 'godiva-email-3',
          name: 'Godiva 节日祝福邮件模板',
          type: 'email',
          brandPackId: '2',
          brandPackName: godivaPack.name,
          fileSize: 32000,
          uploadDate: new Date('2025-02-14'),
          url: undefined,
          description: '情人节节日祝福邮件，包含节日问候和特别优惠',
          tags: ['节日祝福', '客户关怀', '促销活动']
        }
      ];
      // 只在知识库为空时初始化
      setKnowledgeItems(godivaDefaultEmails);
      hasInitialized.current = true;
    }
  }, [brandPacks]);

  // 获取文件类型
  const getFileType = (file: File): KnowledgeItem['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
      return 'image';
    }
    if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
      return 'document';
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'mp3', 'wav', 'wma'].includes(ext)) {
      return 'media';
    }
    if (ext === 'eml' || file.type.includes('message')) {
      return 'email';
    }
    return 'other';
  };

  // 获取文件图标
  const getFileIcon = (type: KnowledgeItem['type']) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'image':
        return '🖼️';
      case 'email':
        return '📧';
      case 'media':
        return '🎬';
      default:
        return '📎';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadingFiles(Array.from(files));
      setShowUploadModal(true);
    }
  };

  // 处理文件上传
  const handleUpload = () => {
    if (uploadingFiles.length === 0 || selectedBrandPackId === 'all') {
      alert(t('pleaseSelectBrandPack') || '请选择品牌包');
      return;
    }

    const brandPack = brandPacks.find(p => p.id === selectedBrandPackId);
    const newItems: KnowledgeItem[] = uploadingFiles.map((file, index) => ({
      id: `kb-${Date.now()}-${index}`,
      name: file.name,
      type: getFileType(file),
      brandPackId: selectedBrandPackId,
      brandPackName: brandPack?.name || '',
      fileSize: file.size,
      uploadDate: new Date(),
      url: URL.createObjectURL(file),
      description: '',
      tags: []
    }));

    setKnowledgeItems(prev => [...newItems, ...prev]);
    setUploadingFiles([]);
    setShowUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 删除知识项
  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDeleteKnowledge') || '确定要删除这个知识项吗？')) {
      setKnowledgeItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // 显示邮件预览
  const handleShowEmailPreview = (item: KnowledgeItem) => {
    setPreviewEmailItem(item);
    setShowEmailPreview(true);
  };

  // 获取Godiva邮件内容
  const getGodivaEmailContent = (emailId: string): string => {
    const emailContents: Record<string, string> = {
      'godiva-email-1': `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Godiva 2025 方形朱古力 | 會員尊享預購</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
            background-color: #f9f5f0;
            color: #5c3a21;
        }
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #d4af37;
            box-shadow: 0 0 30px rgba(92, 58, 33, 0.2);
        }
        .header {
            text-align: center;
            padding: 25px 20px;
            background: linear-gradient(to bottom, #8c6d46, #5c3a21);
        }
        .hero {
            position: relative;
            text-align: center;
        }
        .hero-image {
            width: 100%;
            height: auto;
        }
        .content {
            padding: 30px 20px;
            line-height: 1.6;
        }
        .cta-button {
            display: inline-block;
            padding: 15px 30px;
            background: #d4af37;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://s1.imagehub.cc/images/2025/08/23/7e1afb810ac8c39809aaf682bd5040f8.png" alt="Godiva" width="180">
        </div>
        <div class="hero">
            <img src="https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg" alt="2025方形朱古力" class="hero-image">
        </div>
        <div class="content">
            <h1>2025方形朱古力系列</h1>
            <p>親愛的會員，您作為Godiva高級會員，我們誠摯邀請您優先預購全新2025方形朱古力系列。</p>
            <a href="#" class="cta-button">立即預購</a>
        </div>
    </div>
</body>
</html>`,
      'godiva-email-2': `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GODIVA 歌帝梵立方巧克力系列新品預售</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .title {
            font-size: 24px;
            color: #8B4513;
            margin-bottom: 20px;
        }
        .cta-button {
            display: inline-block;
            padding: 15px 30px;
            background: #DAA520;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://s1.imagehub.cc/images/2025/08/11/83f64704d62f32ec83807e2d15c2a6db.md.jpg" alt="GODIVA" width="100%">
        <div class="content">
            <h1 class="title">品味匠心之作，預覽甜蜜新篇</h1>
            <p>GODIVA歌帝梵誠邀您率先體驗全新立方巧克力系列，限時預售禮遇僅在2025年8月18日至8月20日期間。</p>
            <a href="#" class="cta-button">立即預訂</a>
        </div>
    </div>
</body>
</html>`,
      'godiva-email-3': `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Godiva 情人节祝福</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #fff5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .title {
            font-size: 28px;
            color: #c41e3a;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1 class="title">💝 情人节快乐</h1>
            <p>在这个充满爱意的节日里，GODIVA为您准备了特别的巧克力礼盒，让每一刻都充满甜蜜。</p>
        </div>
    </div>
</body>
</html>`
    };
    return emailContents[emailId] || '';
  };

  // 过滤知识项
  const filteredItems = selectedBrandPackId === 'all'
    ? knowledgeItems
    : knowledgeItems.filter(item => item.brandPackId === selectedBrandPackId);

  // 按类型分组
  const itemsByType = {
    document: filteredItems.filter(item => item.type === 'document'),
    image: filteredItems.filter(item => item.type === 'image'),
    email: filteredItems.filter(item => item.type === 'email'),
    media: filteredItems.filter(item => item.type === 'media'),
    other: filteredItems.filter(item => item.type === 'other')
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面头部 */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('knowledgeBase') || '知识库'}
            </h2>
            <p className="text-gray-600">
              {t('knowledgeBaseDescription') || '管理和组织品牌包的知识内容，用于AI内容生成时的参考'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* 品牌包选择 */}
            <select
              value={selectedBrandPackId}
              onChange={(e) => setSelectedBrandPackId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('allBrandPacks') || '全部品牌包'}</option>
              {brandPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
            
            {/* 视图切换 */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t('gridView') || '网格视图'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t('listView') || '列表视图'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* 上传按钮 */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{t('uploadKnowledge') || '上传知识'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('noKnowledgeItems') || '暂无知识内容'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {t('noKnowledgeItemsDescription') || '开始上传文档、图片、邮件或媒体内容来构建您的知识库'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('uploadFirstKnowledge') || '上传第一个知识'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 统计信息 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-sm text-gray-500">{t('documents') || '文档'}</div>
                <div className="text-xl font-semibold text-gray-900">{itemsByType.document.length}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-1">🖼️</div>
                <div className="text-sm text-gray-500">{t('images') || '图片'}</div>
                <div className="text-xl font-semibold text-gray-900">{itemsByType.image.length}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-1">📧</div>
                <div className="text-sm text-gray-500">{t('emails') || '邮件'}</div>
                <div className="text-xl font-semibold text-gray-900">{itemsByType.email.length}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-1">🎬</div>
                <div className="text-sm text-gray-500">{t('media') || '媒体'}</div>
                <div className="text-xl font-semibold text-gray-900">{itemsByType.media.length}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl mb-1">📎</div>
                <div className="text-sm text-gray-500">{t('others') || '其他'}</div>
                <div className="text-xl font-semibold text-gray-900">{itemsByType.other.length}</div>
              </div>
            </div>

            {/* 知识项列表 */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
                  >
                    {/* 文件预览 */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {item.type === 'image' && item.url ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : item.type === 'email' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                          <div className="text-5xl mb-2">{getFileIcon(item.type)}</div>
                          <div className="text-xs text-gray-600 text-center px-2 line-clamp-2">
                            {item.name}
                          </div>
                        </div>
                      ) : (
                        <div className="text-6xl">{getFileIcon(item.type)}</div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            if (item.url) {
                              window.open(item.url, '_blank');
                            } else if (item.type === 'email') {
                              handleShowEmailPreview(item);
                            }
                          }}
                          className="px-4 py-2 bg-white text-gray-900 rounded-lg mr-2 hover:bg-gray-100"
                        >
                          {t('view') || '查看'}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          {t('delete') || '删除'}
                        </button>
                      </div>
                    </div>
                    
                    {/* 文件信息 */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate" title={item.name}>
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{item.brandPackName}</span>
                        <span>{formatFileSize(item.fileSize)}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.uploadDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('name') || '名称'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('type') || '类型'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('brandPack') || '品牌包'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('fileSize') || '文件大小'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('uploadDate') || '上传日期'}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        {t('actions') || '操作'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{getFileIcon(item.type)}</span>
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {(() => {
                            const typeMap: Record<string, string> = {
                              document: t('knowledgeType.document') || '文档',
                              image: t('knowledgeType.image') || '图片',
                              email: t('knowledgeType.email') || '邮件',
                              media: t('knowledgeType.media') || '媒体',
                              other: t('knowledgeType.other') || '其他'
                            };
                            return typeMap[item.type] || item.type;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.brandPackName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatFileSize(item.fileSize)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.uploadDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                if (item.url) {
                                  window.open(item.url, '_blank');
                                } else if (item.type === 'email') {
                                  showEmailPreview(item);
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              {t('view') || '查看'}
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              {t('delete') || '删除'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.mp4,.avi,.mov,.wmv,.flv,.mkv,.mp3,.wav,.wma,.eml"
      />

      {/* 上传弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('uploadKnowledge') || '上传知识'}
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadingFiles([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('selectBrandPack') || '选择品牌包'}
                </label>
                <select
                  value={selectedBrandPackId === 'all' ? '' : selectedBrandPackId}
                  onChange={(e) => setSelectedBrandPackId(e.target.value || 'all')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('pleaseSelectBrandPack') || '请选择品牌包'}</option>
                  {brandPacks.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('selectedFiles') || '已选文件'}
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadingFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getFileIcon(getFileType(file))}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadingFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadingFiles([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('cancel') || '取消'}
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadingFiles.length === 0 || selectedBrandPackId === 'all' || !selectedBrandPackId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('upload') || '上传'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 邮件预览弹窗 */}
      {showEmailPreview && previewEmailItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {previewEmailItem.name}
              </h3>
              <button
                onClick={() => {
                  setShowEmailPreview(false);
                  setPreviewEmailItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={getGodivaEmailContent(previewEmailItem.id)}
                  className="w-full"
                  style={{ minHeight: '600px', border: 'none' }}
                  title={previewEmailItem.name}
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEmailPreview(false);
                  setPreviewEmailItem(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('close') || '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage;

