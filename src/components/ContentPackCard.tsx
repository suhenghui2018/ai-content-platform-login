import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentPack } from '../types/contentPack';

interface ContentPackCardProps {
  contentPack: ContentPack;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onViewDetail?: (contentPack: ContentPack) => void;
}

const ContentPackCard: React.FC<ContentPackCardProps> = ({ 
  contentPack, 
  onEdit, 
  onDelete,
  onToggleStatus,
  onViewDetail: _onViewDetail
}) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(contentPack.id);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(contentPack.id);
    }
    setShowMenu(false);
  };

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(contentPack.id);
    }
  };

  const handleCardClick = () => {
    console.log('点击内容包卡片:', contentPack.name);
    // 在当前标签页打开内容创建页面
    const url = `/content-creation/${contentPack.id}?name=${encodeURIComponent(contentPack.name)}`;
    console.log('打开URL:', url);
    window.location.href = url;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return t('published');
      case 'draft':
        return t('draft');
      case 'archived':
        return t('archived');
      default:
        return t('unknown');
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 封面图片 */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {contentPack.coverImage ? (
          <img 
            src={contentPack.coverImage} 
            alt={contentPack.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl text-white">📦</span>
            </div>
          </div>
        )}
        
        {/* 右上角操作菜单 */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <span className="text-lg">⋯</span>
          </button>
          
          {showMenu && (
            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left flex items-center"
                >
                  <span className="mr-2">✏️</span>
                  {t('edit')}
                </button>
              )}
              {onToggleStatus && (
                <button
                  onClick={handleToggleStatus}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left flex items-center"
                >
                  <span className="mr-2">🔄</span>
                  {contentPack.status === 'published' ? t('setToDraft') : t('publish')}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left flex items-center"
                >
                  <span className="mr-2">🗑️</span>
                  {t('delete')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 状态标签 */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contentPack.status)}`}>
            {getStatusText(contentPack.status)}
          </span>
        </div>

        {/* 共享标识 */}
        {contentPack.isShared && (
          <div className="absolute bottom-4 right-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔗</span>
            </div>
          </div>
        )}
      </div>

      {/* 内容信息 */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{contentPack.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contentPack.description}</p>

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{contentPack.contentCount} {t('contents')}</span>
          <span>{t('updatedAt')} {contentPack.updatedAt}</span>
        </div>

        {/* 创建者信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
              <img 
                src={contentPack.creatorAvatar} 
                alt={contentPack.creator}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{contentPack.creator}</p>
              <p className="text-xs text-gray-500">
                {contentPack.isShared ? `${t('sharedBy')} ${contentPack.sharedBy}` : t('creator')}
              </p>
            </div>
          </div>
          <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700 transition-colors">
            {t('viewDetails')}
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPackCard;
