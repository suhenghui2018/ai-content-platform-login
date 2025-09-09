import React, { useState, useRef, useEffect } from 'react';
import { BrandPack } from '../types/brandPack';

interface BrandPackListProps {
  brandPack: BrandPack;
  onToggleStatus: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetail?: (brandPack: BrandPack) => void;
}

const BrandPackList: React.FC<BrandPackListProps> = ({ 
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

  const handleItemClick = () => {
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

      <div className="flex items-center space-x-4">
        {/* Logo和开关 */}
        <div className="flex items-end space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
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
          <div className="flex flex-col items-start space-y-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              brandPack.isEnabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {brandPack.isEnabled ? '已启用' : '已禁用'}
            </span>
            <button
              onClick={handleToggle}
              className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                brandPack.isEnabled ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                brandPack.isEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* 品牌包信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{brandPack.name}</h3>
          </div>
          {brandPack.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{brandPack.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>创建者: {brandPack.creator}</span>
            <span>创建时间: {brandPack.createdAt}</span>
            {brandPack.sharedBy && <span>分享自: {brandPack.sharedBy}</span>}
          </div>
        </div>

        {/* 标签 */}
        {brandPack.tags && brandPack.tags.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1 max-w-32">
            {brandPack.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {brandPack.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{brandPack.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPackList;
