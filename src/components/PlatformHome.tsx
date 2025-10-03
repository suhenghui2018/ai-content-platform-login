import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';// import UserProfile from './UserProfile';
import BrandPackCard from './BrandPackCard';
import BrandPackList from './BrandPackList';
import CreateBrandPackModal from './CreateBrandPackModal';
import BrandPackDetail from './BrandPackDetail';
import ContentPackCard from './ContentPackCard';
import ContentPackList from './ContentPackList';
import ContentPackCreationModal from './ContentPackCreationModal';
import { BrandPack, CreateBrandPackData } from '../types/brandPack';
import { getBrandPacks, createBrandPack } from '../utils/brandPackData';
import { ContentPack, CreateContentPackData, ProjectSettings } from '../types/contentPack';
import { getContentPacks, createContentPack, deleteContentPack, toggleContentPackStatus, getContentPackSettings } from '../utils/contentPackData';
interface PlatformHomeProps {
  onLogout: () => void;
}

type MenuItem = 'home' | 'content-pack' | 'app' | 'brand-pack' | 'content-review' | 'data-analysis' | 'platform-settings' | 'account-settings';

interface App {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  category: string;
}

const PlatformHome: React.FC<PlatformHomeProps> = ({ onLogout: _onLogout }) => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // 移除未使用的navigate
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('home');  
  // 这个逻辑已经合并到下面的 useEffect 中了
  const [brandPacks, setBrandPacks] = useState<BrandPack[]>(getBrandPacks());
  const [contentPacks, setContentPacks] = useState<ContentPack[]>(getContentPacks());
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContentPackCreationModal, setShowContentPackCreationModal] = useState(false);
  const [selectedBrandPack, setSelectedBrandPack] = useState<BrandPack | null>(null);
  
  // 项目设置状态
  const [currentProjectSettings, setCurrentProjectSettings] = useState<ProjectSettings | null>(null);
  
  // 应用导航状态
  const [appSearchQuery, setAppSearchQuery] = useState('');
  // 应用排序方式 - 已移除，不再使用
  // const appSortBy = '推荐';
  const [activeAppTab, setActiveAppTab] = useState<'all' | 'workspace' | 'my' | 'favorites'>('all');
  const [selectedAppCategory, setSelectedAppCategory] = useState<string>('');
  // 应用数据
  const apps: App[] = [
    // 社交媒体营销分类
    {
      id: 'facebook-post',
      title: t('facebookPost'),
      description: t('facebookPostDescription'),
      icon: '👍',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'social-media-campaign',
      title: t('socialMediaCampaign'),
      description: t('socialMediaCampaignDescription'),
      icon: '💬',
      tags: [t('upgradeTag'), t('businessTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'instagram-caption',
      title: t('instagramCaption'),
      description: t('instagramCaptionDescription'),
      icon: '📷',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'social-media-ad',
      title: t('socialMediaAd'),
      description: t('socialMediaAdDescription'),
      icon: '👍',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'pinterest-caption',
      title: t('pinterestCaption'),
      description: t('pinterestCaptionDescription'),
      icon: '📍',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'instagram-threads',
      title: t('instagramThreads'),
      description: t('instagramThreadsDescription'),
      icon: '💬',
      tags: [t('newTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'linkedin-post',
      title: t('linkedinPost'),
      description: t('linkedinPostDescription'),
      icon: '💼',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'linkedin-ad',
      title: t('linkedinAd'),
      description: t('linkedinAdDescription'),
      icon: '💼',
      tags: [t('businessTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'snapchat-caption',
      title: t('snapchatCaption'),
      description: t('snapchatCaptionDescription'),
      icon: '📷',
      tags: [t('newTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'social-media-posts',
      title: t('socialMediaPosts'),
      description: t('socialMediaPostsDescription'),
      icon: '💬',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'social-media-snippets',
      title: t('socialMediaSnippets'),
      description: t('socialMediaSnippetsDescription'),
      icon: '👍',
      tags: [t('newTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'tiktok-caption',
      title: t('tiktokCaption'),
      description: t('tiktokCaptionDescription'),
      icon: '🎵',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'tweet',
      title: t('tweet'),
      description: t('tweetDescription'),
      icon: '💬',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'linkedin-article',
      title: t('linkedinArticle'),
      description: t('linkedinArticleDescription'),
      icon: '💼',
      tags: [t('businessTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'photo-post-caption',
      title: t('photoPostCaption'),
      description: t('photoPostCaptionDescription'),
      icon: '📷',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    {
      id: 'reddit-post',
      title: t('redditPost'),
      description: t('redditPostDescription'),
      icon: '💬',
      tags: [t('popularTag')],
      category: t('socialMediaMarketing')
    },
    // 其他分类应用
    {
      id: 'content-rewriter',
      title: t('contentRewriter'),
      description: t('contentRewriterDescription'),
      icon: '🔄',
      tags: [t('popularTag')],
      category: t('contentMarketing')
    },
    {
      id: 'content-translator',
      title: t('contentTranslator'),
      description: t('contentTranslatorDescription'),
      icon: '🅰️',
      tags: [t('upgradeTag'), t('businessTag')],
      category: t('contentMarketing')
    },
    {
      id: 'background-remover',
      title: t('backgroundRemover'),
      description: t('backgroundRemoverDescription'),
      icon: '✂️',
      tags: [t('newTag'), t('popularTag')],
      category: t('contentMarketing')
    },
    {
      id: 'email-marketing',
      title: t('emailMarketing'),
      description: t('emailMarketingDescription'),
      icon: '📧',
      tags: [t('popularTag')],
      category: t('performanceMarketing')
    },
    {
      id: 'brand-voice',
      title: t('brandVoice'),
      description: t('brandVoiceDescription'),
      icon: '🎯',
      tags: [t('upgradeTag')],
      category: t('brandMarketing')
    },
    {
      id: 'product-launch',
      title: t('productLaunch'),
      description: t('productLaunchDescription'),
      icon: '🚀',
      tags: [t('businessTag')],
      category: t('productMarketing')
    }
  ];

  // 分类列表 - 未使用
  // const appCategories = [
  //   { key: 'socialMediaMarketing', name: 'socialMediaMarketing' },
  //   { key: 'productMarketing', name: 'productMarketing' },
  //   { key: 'performanceMarketing', name: 'performanceMarketing' },
  //   { key: 'brandMarketing', name: 'brandMarketing' },
  //   { key: 'contentMarketing', name: 'contentMarketing' },
  //   { key: 'fieldMarketing', name: 'fieldMarketing' },
  //   { key: 'lifecycleMarketing', name: 'lifecycleMarketing' },
  //   { key: 'partnerMarketing', name: 'partnerMarketing' },
  //   { key: 'prCommunications', name: 'prCommunications' }
  // ];

  // 排序选项 - 未使用
  // const appSortOptions = [
  //   { key: 'recommended', name: 'recommended' },
  //   { key: 'popular', name: 'popular' },
  //   { key: 'newest', name: 'newest' },
  //   { key: 'az', name: 'az' }
  // ];

  // 过滤应用
  const filteredApps = apps.filter(app => {
    const matchesSearch = appSearchQuery === '' || 
                         app.title.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(appSearchQuery.toLowerCase());
    const matchesCategory = selectedAppCategory === '' || app.category === t(selectedAppCategory);
    return matchesSearch && matchesCategory;
  });

  // 排序应用
  const sortedApps = [...filteredApps].sort(() => 0); // 保持原始顺序，不使用参数

  // 获取标签样式
  const getAppTagStyle = (tag: string) => {
    if (tag === t('popularTag')) return 'bg-pink-100 text-pink-800';
    if (tag === t('newTag')) return 'bg-green-100 text-green-800';
    if (tag === t('upgradeTag')) return 'bg-blue-100 text-blue-800';
    if (tag === t('businessTag')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 获取分类描述 - 未使用
  // const getAppCategoryDescription = (category: string) => {
  //   // 这里可以根据需要添加分类描述的翻译
  //   return '为您的业务发现强大的营销工具。';
  // };

  const handleAppClick = (appId: string) => {
    console.log('打开应用:', appId);
    // 这里可以添加打开应用的逻辑
  };

  // 从URL参数中恢复菜单状态
  useEffect(() => {
    const menuFromUrl = searchParams.get('menu') as MenuItem;
    if (menuFromUrl && ['home', 'content-pack', 'app', 'brand-pack', 'content-review', 'data-analysis', 'platform-settings', 'account-settings'].includes(menuFromUrl)) {
      setActiveMenu(menuFromUrl);
    } else if (!searchParams.get('menu')) {
      // 如果没有URL参数，设置默认菜单并更新URL
      setSearchParams({ menu: 'home' });
    }
  }, [searchParams, setSearchParams]);

  // 监听路由变化，获取项目设置信息
  useEffect(() => {
    const updateProjectSettings = () => {
      // 检查是否在内容创作页面
      if (location.pathname.includes('/content-creation/')) {
        const contentPackId = location.pathname.split('/content-creation/')[1];
        
        // 首先尝试从URL参数中获取项目设置信息
        const brandPackId = searchParams.get('brandPackId');
        const targetAudience = searchParams.get('targetAudience');
        const brandVoice = searchParams.get('brandVoice');
        const brandTone = searchParams.get('brandTone');

        // 如果URL参数中有项目设置信息，使用URL参数
        if (brandPackId || targetAudience || brandVoice || brandTone) {
          const settings = {
            brandPackId: brandPackId || '',
            targetAudience: targetAudience || '',
            brandVoice: brandVoice || '',
            brandTone: brandTone || '',
            title: '',
            goal: ''
          };
          setCurrentProjectSettings(settings);
        } 
        // 否则从localStorage中获取
        else if (contentPackId) {
          const settings = getContentPackSettings(contentPackId);
          if (settings) {
            setCurrentProjectSettings(settings);
          } else {
            setCurrentProjectSettings(null);
          }
        } else {
          setCurrentProjectSettings(null);
        }
      } else {
        // 不在内容创作页面时，清空项目设置
        setCurrentProjectSettings(null);
      }
    };

    updateProjectSettings();
  }, [location.pathname, searchParams]);

  // 菜单点击处理函数
  const handleMenuClick = (menu: MenuItem) => {
    setActiveMenu(menu);
    setSearchParams({ menu });
  };

  const menuItems = [
    { key: 'home' as MenuItem, icon: '●', label: t('home') },
    { key: 'content-pack' as MenuItem, icon: '■', label: t('contentPack') },
    { key: 'app' as MenuItem, icon: '▲', label: t('app') },
    { key: 'brand-pack' as MenuItem, icon: '◆', label: t('brandPack') },
    { key: 'content-review' as MenuItem, icon: '◐', label: t('contentReview') },
    { key: 'data-analysis' as MenuItem, icon: '◈', label: t('dataAnalysis') },
    { key: 'platform-settings' as MenuItem, icon: '◉', label: t('platformSettings') },
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
    if (window.confirm(t('confirmDeleteBrandPack'))) {
      setBrandPacks(prevPacks => prevPacks.filter(pack => pack.id !== id));
    }
  };

  const handleViewBrandPackDetail = (brandPack: BrandPack) => {
    setSelectedBrandPack(brandPack);
  };

  const handleBackToBrandPackList = () => {
    setSelectedBrandPack(null);
  };

  // 内容包相关处理函数
  const handleCreateContentPack = (data: CreateContentPackData) => {
    const newPack = createContentPack(data);
    setContentPacks([newPack, ...contentPacks]);
    return newPack; // 返回创建的内容包
  };

  const handleContentPackCreationModalClose = () => {
    setShowContentPackCreationModal(false);
  };

  // 显示创建内容包弹窗
  const handleCreateContentPackDirect = () => {
    console.log('点击创建内容包按钮，显示弹窗');
    setShowContentPackCreationModal(true);
  };

  const handleEditContentPack = (id: string) => {
    // 编辑功能待实现
    console.log('编辑内容包:', id);
  };

  const handleDeleteContentPack = (id: string) => {
    if (window.confirm(t('confirmDeleteContentPack'))) {
      if (deleteContentPack(id)) {
        setContentPacks(prevPacks => prevPacks.filter(pack => pack.id !== id));
      }
    }
  };

  const handleToggleContentPackStatus = (id: string) => {
    const updatedPack = toggleContentPackStatus(id);
    if (updatedPack) {
      setContentPacks(prevPacks => 
        prevPacks.map(pack => pack.id === id ? updatedPack : pack)
      );
    }
  };

  const handleViewContentPackDetail = (contentPack: ContentPack) => {
    // 内容包详情功能待实现
    console.log('查看内容包详情:', contentPack);
  };

  // 应用导航内容组件
  const AppNavigationContent = () => (
    <div className="p-8 h-full overflow-auto">
      {/* 页面标题和描述 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('apps')}</h1>
        <p className="text-lg text-gray-600">{t('appsDescription')}</p>
      </div>

      {/* 标签页导航 */}
      <div className="mb-8">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveAppTab('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeAppTab === 'all' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{t('allApps')}</span>
            <span className="ml-2 text-sm text-gray-500">103</span>
          </button>
          <button
            onClick={() => setActiveAppTab('workspace')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeAppTab === 'workspace' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{t('workspaceApps')}</span>
          </button>
          <button
            onClick={() => setActiveAppTab('my')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeAppTab === 'my' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{t('myApps')}</span>
          </button>
          <button
            onClick={() => setActiveAppTab('favorites')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeAppTab === 'favorites' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{t('favorites')}</span>
          </button>
        </div>
      </div>

      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between mb-8">
        {/* 左侧搜索栏 */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('search')}
              value={appSearchQuery}
              onChange={(e) => setAppSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* 右侧操作按钮 */}
        <div className="flex items-center space-x-3">
          {/* 过滤按钮 */}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {t('filter')}
          </button>

          {/* 排序按钮 */}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            {t('sort')}
          </button>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="mb-8">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
          {/* 产品营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'productMarketing' ? '' : 'productMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'productMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('productMarketing')}</span>
          </div>

          {/* 社交媒体营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'socialMediaMarketing' ? '' : 'socialMediaMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'socialMediaMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('socialMediaMarketing')}</span>
          </div>

          {/* 绩效营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'performanceMarketing' ? '' : 'performanceMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'performanceMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('performanceMarketing')}</span>
          </div>

          {/* 品牌营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'brandMarketing' ? '' : 'brandMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'brandMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('brandMarketing')}</span>
          </div>

          {/* 内容营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'contentMarketing' ? '' : 'contentMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'contentMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('contentMarketing')}</span>
          </div>

          {/* 现场营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'fieldMarketing' ? '' : 'fieldMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'fieldMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('fieldMarketing')}</span>
          </div>

          {/* 生命周期营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'lifecycleMarketing' ? '' : 'lifecycleMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'lifecycleMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('lifecycleMarketing')}</span>
          </div>

          {/* 合作伙伴营销 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'partnerMarketing' ? '' : 'partnerMarketing')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'partnerMarketing' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('partnerMarketing')}</span>
          </div>

          {/* 公关传播 */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'prCommunications' ? '' : 'prCommunications')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'prCommunications' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('prCommunications')}</span>
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {t('foundApps', { count: sortedApps.length })}
          </span>
        </div>
      </div>

      {/* 应用网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedApps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleAppClick(app.id)}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{app.icon}</div>
              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getAppTagStyle(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {app.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {app.description}
            </p>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {sortedApps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noAppsFound')}</h3>
          <p className="text-gray-600">
            {t('noAppsFoundDesc')}
          </p>
        </div>
      )}

      {/* 底部提示 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('needCustomApp')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('needCustomAppDesc')}
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );

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
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('dataAnalysis')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('detailedDataAnalysis')}
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
      case 'content-pack':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
              {/* 页面头部 */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('contentPackManagement')}</h2>
                  <p className="text-gray-600">{t('manageYourContentPacks')}</p>
                </div>
                <button
                  onClick={handleCreateContentPackDirect}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  + {t('createContentPack')}
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
                      {t('cardView')}
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t('listView')}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {t('totalContentPacks', { count: contentPacks.length })}
                </div>
              </div>

              {/* 内容包列表 */}
              <div className="flex-1 overflow-auto">
                {contentPacks.length === 0 ? (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noContentPacksYet')}</h3>
                    <p className="text-gray-600 mb-6">{t('createYourFirstContentPack')}</p>
                    <button
                      onClick={handleCreateContentPackDirect}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {t('createContentPack')}
                    </button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'card' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {contentPacks.map((contentPack) => (
                      viewMode === 'card' ? (
                        <ContentPackCard
                          key={contentPack.id}
                          contentPack={contentPack}
                          onEdit={handleEditContentPack}
                          onDelete={handleDeleteContentPack}
                          onToggleStatus={handleToggleContentPackStatus}
                          onViewDetail={handleViewContentPackDetail}
                        />
                      ) : (
                        <ContentPackList
                          key={contentPack.id}
                          contentPack={contentPack}
                          onEdit={handleEditContentPack}
                          onDelete={handleDeleteContentPack}
                          onToggleStatus={handleToggleContentPackStatus}
                          onViewDetail={handleViewContentPackDetail}
                        />
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 创建内容包模态框 */}
            <ContentPackCreationModal
              isOpen={showContentPackCreationModal}
              onClose={handleContentPackCreationModalClose}
              onCreate={handleCreateContentPack}
            />
          </div>
        );
      case 'app':
        return <AppNavigationContent />;
      case 'brand-pack':
        // 如果选择了品牌包，显示详情页面
        if (selectedBrandPack) {
          return (
            <BrandPackDetail
              brandPack={selectedBrandPack}
              onBack={handleBackToBrandPackList}
            />
          );
        }
        
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
              {/* 页面头部 */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('brandPackManagement')}</h2>
                  <p className="text-gray-600">{t('manageYourBrandPacks')}</p>
                </div>
                                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          + {t('createBrandPack')}
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
                      {t('cardView')}
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t('listView')}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {t('totalBrandPacks', { count: brandPacks.length })}
                </div>
              </div>

              {/* 品牌包列表 */}
              <div className="flex-1 overflow-auto">
                {brandPacks.length === 0 ? (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">🎨</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noBrandPacksYet')}</h3>
                    <p className="text-gray-600 mb-6">{t('createYourFirstBrandPack')}</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {t('createBrandPack')}
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
                          key={`${brandPack.id}-${i18n.language}`}
                          brandPack={brandPack}
                          onToggleStatus={handleToggleBrandPack}
                          onEdit={handleEditBrandPack}
                          onDelete={handleDeleteBrandPack}
                          onViewDetail={handleViewBrandPackDetail}
                        />
                      ) : (
                        <BrandPackList
                          key={`${brandPack.id}-${i18n.language}`}
                          brandPack={brandPack}
                          onToggleStatus={handleToggleBrandPack}
                          onEdit={handleEditBrandPack}
                          onDelete={handleDeleteBrandPack}
                          onViewDetail={handleViewBrandPackDetail}
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
      case 'content-review':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contentReview')}</h2>
                <p className="text-gray-600 text-lg">{t('contentReviewInDevelopment')}</p>
              </div>
            </div>
          </div>
        );
      case 'data-analysis':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dataAnalysis')}</h2>
                <p className="text-gray-600 text-lg">{t('dataAnalysisInDevelopment')}</p>
              </div>
            </div>
          </div>
        );
      case 'platform-settings':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">⚙️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('platformSettings')}</h2>
                <p className="text-gray-600 text-lg">{t('platformSettingsInDevelopment')}</p>
              </div>
            </div>
          </div>
        );
      case 'account-settings':
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
        <div className="py-3 px-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center justify-center">
            <img src="/ai-content-platform-login/memalogo.png" alt="Mema Logo" className="w-20 h-auto" />
          </div>
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
            onClick={() => handleMenuClick('account-settings')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
              activeMenu === 'account-settings'
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
          {/* <UserProfile onLogout={onLogout} /> */}
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col h-screen">
        {/* 项目设置信息栏 */}
        {currentProjectSettings && (
          <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                {/* 品牌包 */}
                {currentProjectSettings.brandPackId && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">品牌包:</span>
                    <span className="font-medium text-gray-900">
                      {brandPacks.find(pack => pack.id === currentProjectSettings.brandPackId)?.name || currentProjectSettings.brandPackId}
                    </span>
                  </div>
                )}
                
                {/* 目标受众 */}
                {currentProjectSettings.targetAudience && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">目标受众:</span>
                    <span className="font-medium text-gray-900">{currentProjectSettings.targetAudience}</span>
                  </div>
                )}
                
                {/* 品牌声音 */}
                {currentProjectSettings.brandVoice && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">品牌声音:</span>
                    <span className="font-medium text-gray-900">{currentProjectSettings.brandVoice}</span>
                  </div>
                )}
                
                {/* 品牌语调 */}
                {currentProjectSettings.brandTone && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">品牌语调:</span>
                    <span className="font-medium text-gray-900">{currentProjectSettings.brandTone}</span>
                  </div>
                )}
              </div>
              
              {/* 右侧控制按钮 */}
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <button
                  onClick={_onLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 主要内容区域 */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PlatformHome;

