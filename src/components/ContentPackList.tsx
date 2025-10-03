import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentPack } from '../types/contentPack';

interface ContentPackListProps {
  contentPack: ContentPack;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onViewDetail?: (contentPack: ContentPack) => void;
}

const ContentPackList: React.FC<ContentPackListProps> = ({ 
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

  const handleItemClick = () => {
    console.log('点击内容包列表项:', contentPack.name);
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
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 group relative cursor-pointer"
      onClick={handleItemClick}
    >
      {/* 右上角操作菜单 */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200"
        >
          <span className="text-sm">⋯</span>
        </button>
        
        {showMenu && (
          <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
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

      <div className="flex items-center space-x-4">
        {/* 封面图片 */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📦</span>
              </div>
            </div>
          )}
        </div>

        {/* 内容信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{contentPack.name}</h3>
            <div className="flex items-center space-x-2 ml-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contentPack.status)}`}>
                {getStatusText(contentPack.status)}
              </span>
              {contentPack.isShared && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔗</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{contentPack.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{contentPack.contentCount} {t('contents')}</span>
            <span>•</span>
            <span>{t('updatedAt')} {contentPack.updatedAt}</span>
          </div>
        </div>

        {/* 创建者信息 */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{contentPack.creator}</p>
            <p className="text-xs text-gray-500">
              {contentPack.isShared ? `${t('sharedBy')} ${contentPack.sharedBy}` : t('creator')}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src={contentPack.creatorAvatar} 
              alt={contentPack.creator}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPackList;
