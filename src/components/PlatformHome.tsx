import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import UserProfile from './UserProfile';
import BrandPackCard from './BrandPackCard';
import BrandPackList from './BrandPackList';
import CreateBrandPackModal from './CreateBrandPackModal';
import { BrandPack, CreateBrandPackData } from '../types/brandPack';
import { getBrandPacks, toggleBrandPackStatus, createBrandPack } from '../utils/brandPackData';

interface PlatformHomeProps {
  onLogout: () => void;
}

type MenuItem = 'home' | 'contentPack' | 'app' | 'brandPack' | 'contentReview' | 'dataAnalysis' | 'platformSettings' | 'accountSettings';

const PlatformHome: React.FC<PlatformHomeProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('home');
  const [brandPacks, setBrandPacks] = useState<BrandPack[]>(getBrandPacks());
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 从URL参数中恢复菜单状态
  useEffect(() => {
    const menuFromUrl = searchParams.get('menu') as MenuItem;
    if (menuFromUrl && ['home', 'contentPack', 'app', 'brandPack', 'contentReview', 'dataAnalysis', 'platformSettings', 'accountSettings'].includes(menuFromUrl)) {
      setActiveMenu(menuFromUrl);
    } else if (!searchParams.get('menu')) {
      // 如果没有URL参数，设置默认菜单并更新URL
      setSearchParams({ menu: 'home' });
    }
  }, [searchParams, setSearchParams]);

  // 菜单点击处理函数
  const handleMenuClick = (menu: MenuItem) => {
    setActiveMenu(menu);
    setSearchParams({ menu });
  };

  const menuItems = [
    { key: 'home' as MenuItem, icon: '●', label: t('home') },
    { key: 'contentPack' as MenuItem, icon: '■', label: t('contentPack') },
    { key: 'app' as MenuItem, icon: '▲', label: t('app') },
    { key: 'brandPack' as MenuItem, icon: '◆', label: t('brandPack') },
    { key: 'contentReview' as MenuItem, icon: '◐', label: t('contentReview') },
    { key: 'dataAnalysis' as MenuItem, icon: '◈', label: t('dataAnalysis') },
    { key: 'platformSettings' as MenuItem, icon: '◉', label: t('platformSettings') },
  ];

  // 品牌包管理函数
  const handleToggleBrandPack = (id: string) => {
    setBrandPacks(prevPacks => 
      prevPacks.map(pack => 
        pack.id === id ? { ...pack, isEnabled: !pack.isEnabled } : pack
      )
    );
  };

  const handleCreateBrandPack = (data: CreateBrandPackData) => {
    const newPack = createBrandPack(data);
    setBrandPacks([newPack, ...brandPacks]);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleEditBrandPack = (id: string) => {
    // 编辑功能待实现
    console.log('编辑品牌包:', id);
  };

  const handleDeleteBrandPack = (id: string) => {
    if (window.confirm('确定要删除这个品牌包吗？')) {
      setBrandPacks(prevPacks => prevPacks.filter(pack => pack.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return (
          <div className="p-8 h-full">
            {/* 欢迎区域 */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-3">
                欢迎使用 Mema 平台
              </h2>
              <p className="text-primary-100 text-lg">
                您的资料登记已完成，现在可以开始使用我们的AI全渠道内容生成服务
              </p>
            </div>
            
            {/* 功能卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl text-white">●</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">AI内容生成</h3>
                <p className="text-gray-600 mb-4">
                  使用先进的AI技术，快速生成高质量的内容
                </p>
                <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  了解更多 →
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl text-white">■</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">多平台发布</h3>
                <p className="text-gray-600 mb-4">
                  一键发布到多个社交媒体平台
                </p>
                <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  了解更多 →
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl text-white">▲</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">数据分析</h3>
                <p className="text-gray-600 mb-4">
                  详细的数据分析和性能报告
                </p>
                <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  了解更多 →
                </button>
              </div>
            </div>
            
            {/* 快速开始按钮 */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                开始创建内容
              </button>
            </div>
          </div>
        );
      case 'contentPack':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">内容包管理</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">📦</span>
                </div>
                <p className="text-gray-600 text-lg">内容包功能开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'app':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">📱</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">APP管理</h2>
                <p className="text-gray-600 text-lg">APP功能开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'brandPack':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
              {/* 页面头部 */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">品牌包管理</h2>
                  <p className="text-gray-600">管理您的品牌包，创建和分享品牌内容</p>
                </div>
                                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          + 创建品牌包
                        </button>
              </div>

              {/* 视图切换和统计 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('card')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'card'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      卡片视图
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      列表视图
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  共 {brandPacks.length} 个品牌包
                </div>
              </div>

              {/* 品牌包列表 */}
              <div className="flex-1 overflow-auto">
                {brandPacks.length === 0 ? (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">🎨</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有品牌包</h3>
                    <p className="text-gray-600 mb-6">创建您的第一个品牌包来开始管理品牌内容</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      创建品牌包
                    </button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'card' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {brandPacks.map((brandPack) => (
                      viewMode === 'card' ? (
                        <BrandPackCard
                          key={brandPack.id}
                          brandPack={brandPack}
                          onToggleStatus={handleToggleBrandPack}
                          onEdit={handleEditBrandPack}
                          onDelete={handleDeleteBrandPack}
                        />
                      ) : (
                        <BrandPackList
                          key={brandPack.id}
                          brandPack={brandPack}
                          onToggleStatus={handleToggleBrandPack}
                          onEdit={handleEditBrandPack}
                          onDelete={handleDeleteBrandPack}
                        />
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 创建品牌包模态框 */}
            <CreateBrandPackModal
              isOpen={showCreateModal}
              onClose={handleCreateModalClose}
              onCreate={handleCreateBrandPack}
            />
          </div>
        );
      case 'contentReview':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">内容审查</h2>
                <p className="text-gray-600 text-lg">内容审查功能开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'dataAnalysis':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">数据分析</h2>
                <p className="text-gray-600 text-lg">数据分析功能开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'platformSettings':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">⚙️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">平台设置</h2>
                <p className="text-gray-600 text-lg">平台设置功能开发中...</p>
              </div>
            </div>
          </div>
        );
      case 'accountSettings':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">账号设置</h2>
              <div className="flex-1 space-y-8">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">🌐</span>
                    </span>
                    语言设置
                  </h3>
                  <LanguageSelector />
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">⚙️</span>
                    </span>
                    其他设置
                  </h3>
                  <p className="text-gray-600">其他账号设置功能开发中...</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* 左侧菜单 */}
      <div className="w-64 bg-white shadow-xl flex flex-col border-r border-gray-200 h-screen">
        {/* Logo区域 */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold text-primary-700">
              Mema
            </h1>
          </div>
          <p className="text-xs text-primary-600 mt-1">AI内容生成平台</p>
        </div>
        
        {/* 菜单项 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleMenuClick(item.key)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    activeMenu === item.key
                      ? 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 shadow-md transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* 账号设置 */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => handleMenuClick('accountSettings')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
              activeMenu === 'accountSettings'
                ? 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 shadow-md transform scale-105'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
            }`}
          >
            <span className="text-lg mr-3">◯</span>
            <span className="text-sm font-medium">{t('accountSettings')}</span>
          </button>
        </div>
        
        {/* 账号信息 */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <UserProfile onLogout={onLogout} />
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 overflow-auto h-screen">
        {renderContent()}
      </div>
    </div>
  );
};

export default PlatformHome;

