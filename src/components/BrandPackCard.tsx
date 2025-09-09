import React, { useState, useRef, useEffect } from 'react';
import { BrandPack } from '../types/brandPack';

interface BrandPackCardProps {
  brandPack: BrandPack;
  onToggleStatus: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetail?: (brandPack: BrandPack) => void;
}

const BrandPackCard: React.FC<BrandPackCardProps> = ({ 
  brandPack, 
  onToggleStatus, 
  onEdit, 
  onDelete,
  onViewDetail
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    onToggleStatus(brandPack.id);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(brandPack.id);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(brandPack.id);
    }
    setShowMenu(false);
  };

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(brandPack);
    }
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

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 品牌包Logo和状态 */}
      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
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
                  编辑
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left flex items-center"
                >
                  <span className="mr-2">🗑️</span>
                  删除
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div className="flex items-end space-x-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-white shadow-lg">
              <img 
                src={brandPack.logo} 
                alt={brandPack.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=6b7280&size=80';
                }}
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                brandPack.isEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {brandPack.isEnabled ? '已启用' : '已禁用'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  brandPack.isEnabled ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  brandPack.isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{brandPack.name}</h3>
        {brandPack.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{brandPack.description}</p>
        )}
      </div>

      {/* 标签 */}
      {brandPack.tags && brandPack.tags.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {brandPack.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
              <img 
                src={brandPack.creatorAvatar} 
                alt={brandPack.creator}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{brandPack.creator}</p>
              <p className="text-xs text-gray-500">
                {brandPack.sharedBy ? `分享自 ${brandPack.sharedBy}` : '创建者'}
              </p>
            </div>
          </div>
          <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700 transition-colors">
            查看详情
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">创建时间</p>
            <p className="text-sm font-medium text-gray-900">{brandPack.createdAt}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BrandPackCard;
