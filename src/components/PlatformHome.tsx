import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { getChatHistory, deleteChatHistory, clearAllChatHistory, ChatHistory } from '../utils/chatHistory';
import { getKnowledgeItemsByBrandPack, KnowledgeItem } from '../utils/knowledgeBaseData';
import AIChatView from './AIChatView';
import LanguageSelector from './LanguageSelector';
import BrandPackCard from './BrandPackCard';
import BrandPackList from './BrandPackList';
import CreateBrandPackModal from './CreateBrandPackModal';
import BrandPackDetail from './BrandPackDetail';
import ContentPackCard from './ContentPackCard';
import ContentPackList from './ContentPackList';
import ContentPackCreationModal from './ContentPackCreationModal';
import ABTestModal from './ABTestModal';
import ContentReviewPage from './ContentReviewPage';
import ExpertSelectionPage from './ExpertSelectionPage';
import ExpertConfigPage from './ExpertConfigPage';
import TrendingTopicsModal from './TrendingTopicsModal';
import KnowledgeBasePage from './KnowledgeBasePage';
import ContentLanguageSelector from './ContentLanguageSelector';
import { BrandPack, CreateBrandPackData } from '../types/brandPack';
import { getBrandPacks, createBrandPack } from '../utils/brandPackData';
import { ContentPack, CreateContentPackData, ProjectSettings } from '../types/contentPack';
import { getContentPacks, createContentPack, deleteContentPack, toggleContentPackStatus, getContentPackSettings, setContentPacks as setContentPacksData } from '../utils/contentPackData';

interface PlatformHomeProps {
  onLogout: () => void;
}
type MenuItem = 'home' | 'content-pack' | 'app' | 'brand-pack' | 'content-review' | 'content-experts' | 'expert-config' | 'data-analysis' | 'knowledge-base' | 'channel-configuration' | 'platform-settings' | 'account-settings';
type ViewMode = 'home' | 'ai-chat';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [aiChatData, setAiChatData] = useState<{
    textContent?: string;
    files?: Array<{ name: string; size: number; type: string; data: string }>;
    selectedChannels?: string[];
    brandPackId?: string;
    historyId?: string;
  } | null>(null);
  // 这个逻辑已经合并到下面的 useEffect 中了
  const [brandPacks, setBrandPacks] = useState<BrandPack[]>(getBrandPacks());
  const [contentPacks, setContentPacks] = useState<ContentPack[]>(getContentPacks());
  const [listViewMode, setListViewMode] = useState<'card' | 'list'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContentPackCreationModal, setShowContentPackCreationModal] = useState(false);
  const [selectedBrandPack, setSelectedBrandPack] = useState<BrandPack | null>(null);
  const [isABTestModalOpen, setIsABTestModalOpen] = useState(false);  
  // 处理AB测试弹窗
  const openABTestModal = () => {
    setIsABTestModalOpen(true);
  };

  const closeABTestModal = () => {
    setIsABTestModalOpen(false);
  };
  
  // 首页创作模板相关状态
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [showExpertSelector, setShowExpertSelector] = useState(false);
  const [isTrendingTopicsModalOpen, setIsTrendingTopicsModalOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showChannelManageModal, setShowChannelManageModal] = useState(false);
  const [selectedChannelForManage, setSelectedChannelForManage] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30days');
  const [selectedExperts, setSelectedExperts] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<any[]>([]);
  const [selectedBrandPackId, setSelectedBrandPackId] = useState<string | null>(null);
  const [showBrandPackSelector, setShowBrandPackSelector] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showExpertDropdown, setShowExpertDropdown] = useState(false);
  const [showKnowledgeDropdown, setShowKnowledgeDropdown] = useState(false);
  const [selectedKnowledgeItems, setSelectedKnowledgeItems] = useState<string[]>(['all']); // 存储选中的知识库文件ID，['all']表示"全部文件"
  const brandPackDropdownRef = useRef<HTMLDivElement>(null);
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const expertDropdownRef = useRef<HTMLDivElement>(null);
  const knowledgeDropdownRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 加载聊天历史
  const loadChatHistories = () => {
    const histories = getChatHistory();
    setChatHistories(histories.slice(0, 10)); // 只显示最近10条
  };

  useEffect(() => {
    loadChatHistories();
  }, []);

  // 删除聊天历史
  const handleDeleteChatHistory = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发点击历史项
    if (window.confirm(t('confirmDeleteChatHistory') || '确定要删除这条聊天历史吗？')) {
      deleteChatHistory(historyId);
      loadChatHistories(); // 重新加载聊天历史
    }
  };

  // 清空所有聊天历史
  const handleClearAllChatHistory = () => {
    setShowClearConfirmModal(true);
  };

  // 确认清空所有聊天历史
  const handleConfirmClearAll = () => {
    clearAllChatHistory();
    loadChatHistories(); // 重新加载聊天历史
    setShowClearConfirmModal(false);
    setShowChatHistory(false);
  };

  // 点击外部关闭聊天历史卡片和下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatHistoryRef.current && !chatHistoryRef.current.contains(event.target as Node)) {
        setShowChatHistory(false);
      }
      if (brandPackDropdownRef.current && !brandPackDropdownRef.current.contains(event.target as Node)) {
        setShowBrandPackSelector(false);
      }
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(event.target as Node)) {
        setShowChannelDropdown(false);
      }
      if (expertDropdownRef.current && !expertDropdownRef.current.contains(event.target as Node)) {
        setShowExpertDropdown(false);
      }
      if (knowledgeDropdownRef.current && !knowledgeDropdownRef.current.contains(event.target as Node)) {
        setShowKnowledgeDropdown(false);
      }
    };

    if (showChatHistory || showBrandPackSelector || showChannelDropdown || showExpertDropdown || showKnowledgeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChatHistory, showBrandPackSelector, showChannelDropdown, showExpertDropdown, showKnowledgeDropdown]);
  
  // 从localStorage获取已选专家
  useEffect(() => {
    const loadSelectedExperts = () => {
      try {
        // 从localStorage中获取已选专家数据
        const contentPacksStr = localStorage.getItem('contentPacks');
        if (contentPacksStr) {
          const contentPacks = JSON.parse(contentPacksStr);
          // 从最近创建的内容包中获取专家
          const latestPack = contentPacks[contentPacks.length - 1];
          if (latestPack && latestPack.selectedExperts) {
            setSelectedExperts(latestPack.selectedExperts);
          }
        }
      } catch (error) {
        console.error('Failed to load selected experts:', error);
      }
    };
    loadSelectedExperts();
  }, []);

  // 当语言切换时，更新内容包数据
  useEffect(() => {
    setContentPacksData(t);
    const updatedPacks = getContentPacks();
    setContentPacks(updatedPacks);
  }, [i18n.language, t]);
  
  // 内容渠道选项
  const channelOptions = [
    { id: 'all-channels', name: t('allChannels'), icon: '🌐' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'facebook', name: t('facebook'), icon: '👍' },
    { id: 'instagram', name: t('instagram'), icon: '📷' },
    { id: 'xiaohongshu', name: t('xiaohongshu'), icon: '📕' },
    { id: 'sms', name: 'SMS', icon: '💬' },
    { id: 'rcs', name: 'RCS', icon: '📱' }
  ];
  
  // 处理渠道选择（支持多选）
  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };
  
  // 删除选中的渠道
  const handleRemoveChannel = (channelId: string) => {
    setSelectedChannels(prev => prev.filter(id => id !== channelId));
  };
  
  // 处理专家选择（支持多选）
  const handleExpertToggle = (expert: any) => {
    setSelectedExperts(prev => {
      const isSelected = prev.some(e => e.id === expert.id);
      if (isSelected) {
        return prev.filter(e => e.id !== expert.id);
      } else {
        return [...prev, expert];
      }
    });
  };
  
  // 删除选中的专家
  const handleRemoveExpert = (expertId: string) => {
    setSelectedExperts(prev => prev.filter(e => e.id !== expertId));
  };
  
  // 处理话题选择（支持多选）
  const handleTopicToggle = (topic: any) => {
    setSelectedTopics(prev => {
      const isSelected = prev.some(t => t.id === topic.id);
      if (isSelected) {
        return prev.filter(t => t.id !== topic.id);
      } else {
        return [...prev, topic];
      }
    });
  };
  
  // 删除选中的话题
  const handleRemoveTopic = (topicId: string) => {
    setSelectedTopics(prev => prev.filter(t => t.id !== topicId));
  };
  
  // 打开热点创作弹窗
  const openTrendingTopicsModal = () => {
    setIsTrendingTopicsModalOpen(true);
  };
  
  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      console.log('上传的文件:', fileArray);
      // 这里可以添加实际的文件上传逻辑
    }
  };
  
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 处理开始创建A/B测试
  const handleStartABTestCreation = (testType: string, importMethod: string) => {
    setIsABTestModalOpen(false);
    // 导航到A/B测试创作页面，并传递参数
    navigate(`/ab-test-creation?testType=${testType}&importMethod=${importMethod}`, {
      state: { testType, importMethod }
    });
  };
  
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
    },
    {
      id: 'ab-test',
      title: t('abTest'),
      description: t('abTestDescription'),
      icon: '🔬',
      tags: [t('newTag')],
      category: t('toolsApp')
    }
  ];  // 分类列表 - 未使用
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
    if (appId === 'ab-test') {
      // 打开A/B测试弹窗
      openABTestModal();
    } else {
      // 其他应用的通用逻辑
      console.log('打开应用:', appId);
      // 这里可以添加打开其他应用的逻辑
    }
  };

  // 从URL参数或状态中恢复菜单状态
  useEffect(() => {
    // 首先检查是否有从其他页面传递过来的状态
    if (location.state && location.state.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    } else {
      // 然后检查URL参数
      const menuFromUrl = searchParams.get('menu') as MenuItem;
      // 确保包含专家相关的菜单项
      const validMenus = ['home', 'content-pack', 'app', 'brand-pack', 'content-review', 'content-experts', 'expert-config', 'data-analysis', 'knowledge-base', 'channel-configuration', 'platform-settings', 'account-settings'];
      
      if (menuFromUrl && validMenus.includes(menuFromUrl)) {
        setActiveMenu(menuFromUrl);
      } else if (!searchParams.get('menu')) {
        // 如果没有URL参数，设置默认菜单并更新URL
        setSearchParams({ menu: 'home' });
      } else if (location.pathname.includes('/expert-config')) {
        // 直接匹配专家配置页面的路径
        setActiveMenu('expert-config');
      } else if (location.pathname.includes('/content-experts')) {
        // 直接匹配专家选择页面的路径
        setActiveMenu('content-experts');
      }
    }
  }, [searchParams, setSearchParams, location]);

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

  // 菜单图标组件
  const MenuIcon = ({ iconType, className }: { iconType: string; className?: string }) => {
    const iconClasses = `w-5 h-5 ${className || ''}`;
    switch (iconType) {
      case 'home':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'content-pack':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'app':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'brand-pack':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'content-review':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'content-experts':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'data-analysis':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'knowledge-base':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'channel-configuration':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'platform-settings':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'account-settings':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 使用useMemo确保语言切换时菜单项重新计算
  const menuItems = useMemo(() => [
    { key: 'home' as MenuItem, iconType: 'home', label: t('home'), hasSubmenu: false },
    { key: 'content-pack' as MenuItem, iconType: 'content-pack', label: t('contentPack'), hasSubmenu: false },
    { key: 'app' as MenuItem, iconType: 'app', label: t('app'), hasSubmenu: false },
    { key: 'brand-pack' as MenuItem, iconType: 'brand-pack', label: t('brandPack'), hasSubmenu: false },
    { key: 'content-review' as MenuItem, iconType: 'content-review', label: t('contentCompliance'), hasSubmenu: false },
    { key: 'content-experts' as MenuItem, iconType: 'content-experts', label: t('contentExperts'), hasSubmenu: false },
    { key: 'data-analysis' as MenuItem, iconType: 'data-analysis', label: t('dataAnalysis'), hasSubmenu: false },
    { key: 'knowledge-base' as MenuItem, iconType: 'knowledge-base', label: t('knowledgeBase'), hasSubmenu: false },
    { key: 'channel-configuration' as MenuItem, iconType: 'channel-configuration', label: t('channels'), hasSubmenu: false },
    { key: 'platform-settings' as MenuItem, iconType: 'platform-settings', label: t('platformSettings'), hasSubmenu: false },
  ], [t, i18n.language]);

  // 品牌包管理函数
  const handleToggleBrandPack = (id: string) => {
    setBrandPacks(prevPacks => 
      prevPacks.map(pack => 
        pack.id === id ? { ...pack, isEnabled: !pack.isEnabled } : pack
      )
    );
  };

  const handleCreateBrandPack = (data: CreateBrandPackData) => {
    const newPack = createBrandPack({ ...data, t });
    setBrandPacks([newPack, ...brandPacks]);
    return newPack;
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
    const newPack = createContentPack(data, t);
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

          {/* 工具APP */}
          <div 
            onClick={() => setSelectedAppCategory(selectedAppCategory === 'toolsApp' ? '' : 'toolsApp')}
            className={`flex flex-col items-center p-4 bg-white rounded-lg border transition-all cursor-pointer ${
              selectedAppCategory === 'toolsApp' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{t('toolsApp')}</span>
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
          <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* 装饰性背景元素 */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col items-center justify-center h-full p-8">
              {/* 顶部装饰线条 */}
              <div className="absolute top-32 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              
              {/* 主标题 */}
              <div className="text-center mb-12 space-y-4">
                <h1 className="text-5xl md:text-6xl font-light tracking-wide">
                  <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {t('homeTitle')}
                  </span>
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
                  {t('homeSubtitle')}
                </h2>
              </div>

              {/* 问候语 */}
              <p className="text-gray-800 text-xl mb-8 text-center">
                {t('homeGreeting', { name: 'suhenghui2018' })}
              </p>

              {/* 主输入区域 */}
              <div className="w-full max-w-4xl mb-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow relative">
                  {/* 右上角按钮组：热点创作和创作语言 */}
                  <div className="absolute top-4 right-8 flex items-center space-x-2">
                    {/* 热点创作按钮 */}
                    <button
                      onClick={openTrendingTopicsModal}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                      title={t('trendingCreation')}
                    >
                      <span className="text-xl">🔥</span>
                      <span className="text-sm font-medium">{t('trendingCreation')}</span>
                    </button>
                    {/* 创作语言选择器 - 紧邻热点创作按钮 */}
                    <ContentLanguageSelector />
                  </div>
                  
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('homeInputPlaceholder')}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-lg resize-none outline-none min-h-[200px] pr-64"
                    style={{ caretColor: '#1f2937' }}
                  />
                  
                  {/* 底部工具栏 */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      {/* 附件按钮 */}
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.csv"
                        />
                        <button 
                          onClick={handleAttachmentClick}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          title={t('uploadFile')}
                        >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                        {/* 显示已上传文件数量 */}
                        {uploadedFiles.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                            {uploadedFiles.length}
                          </span>
                        )}
                      </div>
                      
                      {/* 品牌包下拉选择 */}
                      <div className="relative" ref={brandPackDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowBrandPackSelector(!showBrandPackSelector)}
                          className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex items-center justify-between whitespace-nowrap"
                          style={{ height: '38px' }}
                        >
                          <span>
                            {selectedBrandPackId 
                              ? brandPacks.find(p => p.id === selectedBrandPackId)?.name || t('selectBrandPack')
                              : t('selectBrandPack')
                            }
                          </span>
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showBrandPackSelector && (
                          <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto min-w-full">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBrandPackId(null);
                                setShowBrandPackSelector(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                                !selectedBrandPackId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                            >
                              {t('selectBrandPack')}
                            </button>
                            {brandPacks.map((pack) => (
                              <button
                                key={pack.id}
                                type="button"
                                onClick={() => {
                                  setSelectedBrandPackId(pack.id);
                                  setSelectedKnowledgeItems(['all']); // 重置知识库选择
                                  setShowBrandPackSelector(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                                  selectedBrandPackId === pack.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                {pack.logo && (
                                  <img src={pack.logo} alt={pack.name} className="w-4 h-4 object-contain" />
                                )}
                                <span>{pack.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* 知识库选择 - 只在选中品牌包后显示 */}
                      {selectedBrandPackId && (
                        <div className="relative" ref={knowledgeDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowKnowledgeDropdown(!showKnowledgeDropdown)}
                            className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex items-center justify-between whitespace-nowrap"
                            style={{ height: '38px' }}
                          >
                            <span>
                              {selectedKnowledgeItems.length === 0 
                                ? t('selectKnowledgeBase') || '选择知识库'
                                : selectedKnowledgeItems.length === 1 && selectedKnowledgeItems[0] === 'all'
                                ? t('allFiles') || '全部文件'
                                : `${selectedKnowledgeItems.length} ${t('filesSelected') || '个文件'}`
                              }
                            </span>
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {showKnowledgeDropdown && (() => {
                            const knowledgeItems = getKnowledgeItemsByBrandPack(selectedBrandPackId);
                            const isAllSelected = selectedKnowledgeItems.length === 1 && selectedKnowledgeItems[0] === 'all';
                            return (
                              <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto min-w-full">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedKnowledgeItems(['all']);
                                    setShowKnowledgeDropdown(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                                    isAllSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="flex items-center space-x-2">
                                    <span>📚</span>
                                    <span>{t('allFiles') || '全部文件'}</span>
                                    {isAllSelected && (
                                      <svg className="w-4 h-4 text-blue-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                </button>
                                {knowledgeItems.length > 0 && (
                                  <div className="border-t border-gray-200">
                                    {knowledgeItems.map((item) => {
                                      const isSelected = selectedKnowledgeItems.includes(item.id);
                                      const getFileIcon = (type: KnowledgeItem['type']) => {
                                        switch (type) {
                                          case 'document': return '📄';
                                          case 'image': return '🖼️';
                                          case 'email': return '📧';
                                          case 'media': return '🎬';
                                          default: return '📎';
                                        }
                                      };
                                      return (
                                        <button
                                          key={item.id}
                                          type="button"
                                          onClick={() => {
                                            if (isSelected) {
                                              // 取消选中
                                              const newSelected = selectedKnowledgeItems.filter(id => id !== item.id);
                                              setSelectedKnowledgeItems(newSelected.length === 0 ? ['all'] : newSelected);
                                            } else {
                                              // 选中
                                              const newSelected = selectedKnowledgeItems.filter(id => id !== 'all');
                                              setSelectedKnowledgeItems([...newSelected, item.id]);
                                            }
                                            setShowKnowledgeDropdown(false);
                                          }}
                                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                                            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                          }`}
                                        >
                                          <span>{getFileIcon(item.type)}</span>
                                          <span className="flex-1 truncate">{item.name}</span>
                                          {isSelected && (
                                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {knowledgeItems.length === 0 && (
                                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                                    {t('noKnowledgeItems') || '暂无知识库文件'}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      
                      {/* 内容渠道下拉选择 */}
                      <div className="relative" ref={channelDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                          className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex items-center justify-between whitespace-nowrap"
                          style={{ height: '38px' }}
                        >
                          <span>
                            {selectedChannels.length > 0 
                              ? selectedChannels.length === 1
                                ? channelOptions.find(c => c.id === selectedChannels[0])?.name || t('addContentChannel')
                                : `${selectedChannels.length} ${t('selectedChannels') || '个渠道'}`
                              : t('addContentChannel')
                            }
                          </span>
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showChannelDropdown && (
                          <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto min-w-full">
                            {channelOptions.filter(ch => ch.id !== 'all-channels').map((channel) => {
                              const isSelected = selectedChannels.includes(channel.id);
                              return (
                                <button
                                  key={channel.id}
                                  type="button"
                                  onClick={() => {
                                    handleChannelToggle(channel.id);
                                    setShowChannelDropdown(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                  }`}
                                >
                                  <span>{channel.icon}</span>
                                  <span className="flex-1">{channel.name}</span>
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      {/* 内容专家下拉选择 */}
                      <div className="relative" ref={expertDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowExpertDropdown(!showExpertDropdown)}
                          className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex items-center justify-between whitespace-nowrap"
                          style={{ height: '38px' }}
                        >
                          <span>
                            {selectedExperts.length > 0 
                              ? selectedExperts.length === 1
                                ? selectedExperts[0].name
                                : `${selectedExperts.length} ${t('selectedExperts') || '个专家'}`
                              : t('addContentExpert')
                            }
                          </span>
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showExpertDropdown && (
                          <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto min-w-full">
                            {availableExperts.map((expert) => {
                              const isSelected = selectedExperts.some(e => e.id === expert.id);
                              return (
                                <button
                                  key={expert.id}
                                  type="button"
                                  onClick={() => {
                                    handleExpertToggle(expert);
                                    setShowExpertDropdown(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                  }`}
                                >
                                  <span>{expert.icon}</span>
                                  <span className="flex-1">{expert.name}</span>
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* 聊天历史图标按钮 */}
                      <div className="relative" ref={chatHistoryRef}>
                        <button
                          onClick={() => setShowChatHistory(!showChatHistory)}
                          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-blue-50"
                          title={t('chatHistory') || '聊天历史'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        
                        {/* 聊天历史悬浮卡片 */}
                        {showChatHistory && (
                          <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[320px] max-w-[400px] max-h-[500px] overflow-hidden">
                            {/* 卡片头部 */}
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {t('chatHistory') || '聊天历史'}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {chatHistories.length > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearAllChatHistory();
                                      }}
                                      className="text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                                      title={t('clearAllChatHistory') || '一键清空'}
                                    >
                                      {t('clearAll') || '清空'}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setShowChatHistory(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* 聊天历史列表 */}
                            <div className="overflow-y-auto max-h-[420px]">
                              {chatHistories.length > 0 ? (
                                <div className="py-2">
                                  {chatHistories.map((history) => (
                                    <div
                                      key={history.id}
                                      className="group relative px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      <button
                                        onClick={() => {
                                          setShowChatHistory(false);
                                          setAiChatData({
                                            historyId: history.id
                                          });
                                          setViewMode('ai-chat');
                                        }}
                                        className="w-full text-left"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1 min-w-0 pr-8">
                                            <p className="text-sm font-medium text-gray-900 truncate mb-1">
                                              {history.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mb-2">
                                              {history.preview}
                                            </p>
                                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                                              <span>{history.messageCount} 条消息</span>
                                              <span>•</span>
                                              <span>{history.timestamp.toLocaleDateString('zh-CN', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}</span>
                                            </div>
                                          </div>
                                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                      </button>
                                      {/* 删除按钮 */}
                                      <button
                                        onClick={(e) => handleDeleteChatHistory(history.id, e)}
                                        className="absolute top-3 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title={t('delete') || '删除'}
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-12 px-4 text-center">
                                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm text-gray-500 font-medium mb-2">
                                    {t('noChatHistory') || '暂无聊天历史'}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {t('noChatHistoryDesc') || '开始新的对话后，聊天记录将显示在这里'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* 提交按钮 */}
                      <button 
                        onClick={async () => {
                        // 将文件转换为可传输的格式
                        const fileDataPromises = uploadedFiles.map(async (file) => {
                          return new Promise<{ name: string; size: number; type: string; data: string }>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                data: reader.result as string
                              });
                            };
                            reader.readAsDataURL(file);
                          });
                        });
                        const fileData = await Promise.all(fileDataPromises);
                        
                        // 在首页框架内切换到AI对话视图
                        setAiChatData({
                          textContent: inputText,
                          files: fileData,
                          selectedChannels: selectedChannels,
                          brandPackId: selectedBrandPackId || undefined
                        });
                        setViewMode('ai-chat');
                      }}
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                    </div>
                  </div>
                  
                  {/* 已上传文件列表 */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-gray-700 max-w-xs truncate">{file.name}</span>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title={t('delete')}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 选中项集中展示区域 */}
              {(selectedBrandPackId || selectedChannels.length > 0 || selectedExperts.length > 0 || (selectedKnowledgeItems.length > 0 && selectedKnowledgeItems[0] !== 'all')) && (
                <div className="w-full max-w-4xl mb-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('selectedItems')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* 已选品牌包 */}
                      {selectedBrandPackId && (() => {
                        const brandPack = brandPacks.find(p => p.id === selectedBrandPackId);
                        if (!brandPack) return null;
                        return (
                          <div key="brand-pack" className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                            {brandPack.logo && (
                              <img src={brandPack.logo} alt={brandPack.name} className="w-4 h-4 object-contain" />
                            )}
                            <span className="text-purple-700 font-medium">{brandPack.name}</span>
                            <button
                              onClick={() => {
                                setSelectedBrandPackId(null);
                                setSelectedKnowledgeItems(['all']);
                              }}
                              className="text-purple-400 hover:text-purple-600 transition-colors ml-1"
                              title={t('delete')}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })()}
                      
                      {/* 已选知识库 */}
                      {selectedBrandPackId && selectedKnowledgeItems.length > 0 && selectedKnowledgeItems[0] !== 'all' && (() => {
                        const knowledgeItems = getKnowledgeItemsByBrandPack(selectedBrandPackId);
                        const getFileIcon = (type: KnowledgeItem['type']) => {
                          switch (type) {
                            case 'document': return '📄';
                            case 'image': return '🖼️';
                            case 'email': return '📧';
                            case 'media': return '🎬';
                            default: return '📎';
                          }
                        };
                        return selectedKnowledgeItems.map((itemId) => {
                          const item = knowledgeItems.find(k => k.id === itemId);
                          if (!item) return null;
                          return (
                            <div key={itemId} className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                              <span>{getFileIcon(item.type)}</span>
                              <span className="text-blue-700 font-medium truncate max-w-xs">{item.name}</span>
                              <button
                                onClick={() => {
                                  const newSelected = selectedKnowledgeItems.filter(id => id !== itemId);
                                  setSelectedKnowledgeItems(newSelected.length === 0 ? ['all'] : newSelected);
                                }}
                                className="text-blue-400 hover:text-blue-600 transition-colors ml-1"
                                title={t('delete')}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          );
                        });
                      })()}
                      
                      {/* 已选渠道 */}
                      {selectedChannels.map((channelId) => {
                        const channel = channelOptions.find(c => c.id === channelId);
                        if (!channel) return null;
                        return (
                          <div
                            key={channelId}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg text-sm"
                          >
                            <span className="text-base">{channel.icon}</span>
                            <span className="text-primary-700 font-medium">{channel.name}</span>
                            <button
                              onClick={() => handleRemoveChannel(channelId)}
                              className="text-primary-400 hover:text-primary-600 transition-colors ml-1"
                              title={t('delete')}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                      
                      {/* 已选专家 */}
                      {selectedExperts.map((expert) => (
                        <div
                          key={expert.id}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-sm"
                        >
                          <span className="text-base">{expert.icon}</span>
                          <span className="text-purple-700 font-medium">{expert.name}</span>
                          <button
                            onClick={() => handleRemoveExpert(expert.id)}
                            className="text-purple-400 hover:text-purple-600 transition-colors ml-1"
                            title={t('delete')}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 已选话题展示区域 */}
              {selectedTopics.length > 0 && (
                <div className="w-full max-w-4xl mb-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('selectedItems')}</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-medium text-gray-500 mr-2">{t('selectedTopics')}:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopics.map((topic) => {
                        const getPlatformName = (platform: string) => {
                          switch (platform) {
                            case 'xiaohongshu':
                              return t('xiaohongshu');
                            case 'facebook':
                              return t('facebook');
                            case 'instagram':
                              return t('instagram');
                            default:
                              return platform;
                          }
                        };
                        return (
                          <div
                            key={topic.id}
                            className="flex items-center space-x-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm"
                          >
                            <span className="text-lg">🔥</span>
                            <span className="text-orange-700 font-medium">{topic.hashtag}</span>
                            <span className="text-xs text-orange-600 opacity-70">({getPlatformName(topic.platform)})</span>
                            <button
                              onClick={() => handleRemoveTopic(topic.id)}
                              className="text-orange-400 hover:text-orange-600 transition-colors ml-1"
                              title={t('delete')}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'content-pack':
        return (
          <div className="h-full flex flex-col">
              {/* 页面头部 */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setListViewMode('card')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        listViewMode === 'card'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t('cardView')}
                    </button>
                    <button
                      onClick={() => setListViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        listViewMode === 'list'
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
              </div>

              {/* 内容包列表 */}
            <div className="flex-1 overflow-auto px-8 py-6">
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
                    listViewMode === 'card' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {contentPacks.map((contentPack) => (
                      listViewMode === 'card' ? (
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
          <div className="h-full flex flex-col">
              {/* 页面头部 */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setListViewMode('card')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        listViewMode === 'card'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t('cardView')}
                    </button>
                    <button
                      onClick={() => setListViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        listViewMode === 'list'
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
              </div>

              {/* 品牌包列表 */}
            <div className="flex-1 overflow-auto px-8 py-6">
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
                    listViewMode === 'card' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {brandPacks.map((brandPack) => (
                      listViewMode === 'card' ? (
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
          <div className="h-full">
              <ContentReviewPage />
          </div>
        );
      case 'content-experts':
        return <ExpertSelectionPage />;
      case 'expert-config':
        return <ExpertConfigPage />;
      case 'data-analysis':
        // 模拟已连接的平台数据
        const connectedPlatforms = [
          { id: 'radica', name: t('radica'), accounts: 2, icon: 'R', bgColor: 'bg-blue-500', textColor: 'text-blue-600' },
          { id: 'braze', name: t('braze'), accounts: 1, icon: 'B', bgColor: 'bg-[#FF6B35]', textColor: 'text-[#FF6B35]' }
        ];

        // 模拟各平台的数据统计
        const platformData: Record<string, {
          totalContent: number;
          published: number;
          scheduled: number;
          engagement: {
            views: number;
            likes: number;
            shares: number;
            comments: number;
          };
          growth: number;
          trends: Array<{ date: string; value: number }>;
        }> = {
          'radica': {
            totalContent: 156,
            published: 142,
            scheduled: 14,
            engagement: {
              views: 125000,
              likes: 8900,
              shares: 2100,
              comments: 3400
            },
            growth: 12.5,
            trends: [
              { date: '2024-01', value: 12000 },
              { date: '2024-02', value: 15000 },
              { date: '2024-03', value: 18000 },
              { date: '2024-04', value: 21000 },
              { date: '2024-05', value: 25000 },
              { date: '2024-06', value: 28000 }
            ]
          },
          'braze': {
            totalContent: 89,
            published: 85,
            scheduled: 4,
            engagement: {
              views: 68000,
              likes: 5200,
              shares: 1200,
              comments: 1800
            },
            growth: 8.3,
            trends: [
              { date: '2024-01', value: 8000 },
              { date: '2024-02', value: 9500 },
              { date: '2024-03', value: 11000 },
              { date: '2024-04', value: 12500 },
              { date: '2024-05', value: 14000 },
              { date: '2024-06', value: 16000 }
            ]
          }
        };

        // 计算总览数据
        const totalStats = {
          totalContent: Object.values(platformData).reduce((sum, p) => sum + p.totalContent, 0),
          totalPublished: Object.values(platformData).reduce((sum, p) => sum + p.published, 0),
          totalViews: Object.values(platformData).reduce((sum, p) => sum + p.engagement.views, 0),
          totalEngagement: Object.values(platformData).reduce((sum, p) => 
            sum + p.engagement.likes + p.engagement.shares + p.engagement.comments, 0)
        };

        return (
          <div className="h-full flex flex-col bg-gray-50">
            {/* 页面头部 */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('dataAnalysis')}</h2>
                  <p className="text-gray-600">{t('platformContentDataOverview')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7days">{t('last7Days')}</option>
                    <option value="30days">{t('last30Days')}</option>
                    <option value="90days">{t('last90Days')}</option>
                    <option value="all">{t('allTime')}</option>
                  </select>
              </div>
            </div>

              {/* 平台筛选 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedPlatform('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlatform === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('allPlatforms')}
                </button>
                {connectedPlatforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      selectedPlatform === platform.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${platform.bgColor}`}></span>
                    <span>{platform.name}</span>
                  </button>
                ))}
          </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {/* 总览统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{t('totalContent')}</span>
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{totalStats.totalContent}</div>
                  <div className="text-xs text-green-600 mt-1">+{totalStats.totalPublished} {t('published')}</div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{t('totalViews')}</span>
                    <span className="text-2xl">👁️</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStats.totalViews >= 1000000 
                      ? `${(totalStats.totalViews / 1000000).toFixed(1)}M`
                      : totalStats.totalViews >= 1000
                      ? `${(totalStats.totalViews / 1000).toFixed(1)}K`
                      : totalStats.totalViews}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">+12.5% {t('vsLastMonth')}</div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{t('totalEngagement')}</span>
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStats.totalEngagement >= 10000
                      ? `${(totalStats.totalEngagement / 1000).toFixed(1)}K`
                      : totalStats.totalEngagement}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">+8.3% {t('vsLastMonth')}</div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{t('connectedPlatforms')}</span>
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{connectedPlatforms.length}</div>
                  <div className="text-xs text-gray-500 mt-1">{connectedPlatforms.reduce((sum, p) => sum + p.accounts, 0)} {t('accounts')}</div>
                </div>
              </div>

              {/* 平台数据卡片 */}
              <div className="space-y-4">
                {(selectedPlatform === 'all' ? connectedPlatforms : connectedPlatforms.filter(p => p.id === selectedPlatform)).map(platform => {
                  const data = platformData[platform.id];
                  if (!data) return null;
                  
                  const maxTrendValue = Math.max(...data.trends.map(t => t.value));
                  
        return (
                    <div key={platform.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* 平台头部 */}
                      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${platform.bgColor} rounded-lg flex items-center justify-center text-white font-bold`}>
                              {platform.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                              <p className="text-sm text-gray-500">{platform.accounts} {t('accounts')} {t('connected')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{t('growthRate')}</div>
                            <div className="text-lg font-bold text-green-600">+{data.growth}%</div>
                          </div>
                        </div>
                </div>
                
                      {/* 平台数据内容 */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                          {/* 内容统计 */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">{t('totalContent')}</div>
                            <div className="text-2xl font-bold text-gray-900">{data.totalContent}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {data.published} {t('published')} · {data.scheduled} {t('scheduled')}
                            </div>
                          </div>

                          {/* 浏览量 */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">{t('views')}</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {data.engagement.views >= 100000
                                ? `${(data.engagement.views / 100000).toFixed(1)}M`
                                : data.engagement.views >= 1000
                                ? `${(data.engagement.views / 1000).toFixed(1)}K`
                                : data.engagement.views}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">+{data.growth}% {t('vsLastMonth')}</div>
                          </div>

                          {/* 互动数 */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">{t('engagement')}</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {data.engagement.likes + data.engagement.shares + data.engagement.comments >= 10000
                                ? `${((data.engagement.likes + data.engagement.shares + data.engagement.comments) / 1000).toFixed(1)}K`
                                : data.engagement.likes + data.engagement.shares + data.engagement.comments}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              👍 {data.engagement.likes.toLocaleString()} · 💬 {data.engagement.comments.toLocaleString()}
                            </div>
                          </div>

                          {/* 分享数 */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">{t('shares')}</div>
                            <div className="text-2xl font-bold text-gray-900">{data.engagement.shares.toLocaleString()}</div>
                            <div className="text-xs text-purple-600 mt-1">+{data.growth * 0.8}% {t('vsLastMonth')}</div>
                          </div>
                        </div>

                        {/* 趋势图表 */}
                        <div className="border-t border-gray-200 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-900">{t('viewsTrend')}</h4>
                            <span className="text-xs text-gray-500">{t('last6Months')}</span>
                          </div>
                          <div className="h-32 flex items-end space-x-2">
                            {data.trends.map((trend, index) => {
                              const height = (trend.value / maxTrendValue) * 100;
                              return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className={`w-full ${platform.bgColor} rounded-t-lg transition-all hover:opacity-80`}
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                    title={`${trend.date}: ${trend.value.toLocaleString()}`}
                                  ></div>
                                  <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                                    {trend.date.split('-')[1]}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 空状态 */}
              {connectedPlatforms.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noPlatformsConnected')}</h3>
                  <p className="text-gray-600 mb-6">{t('connectPlatformsToViewData')}</p>
                  <button 
                    onClick={() => setActiveMenu('channel-configuration')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t('goToChannelConfiguration')}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'knowledge-base':
        return <KnowledgeBasePage />;
      case 'channel-configuration':
        // 模拟已绑定的账号数据
        const channelAccounts: Record<string, Array<{ id: string; name: string; email?: string; avatar?: string; status: 'connected' | 'disconnected' }>> = {
          'radica': [
            { id: '1', name: 'Radica Account 1', email: 'account1@radica.com', status: 'connected' },
            { id: '2', name: 'Radica Account 2', email: 'account2@radica.com', status: 'connected' }
          ],
          'braze': [
            { id: '1', name: 'Braze Account 1', email: 'account1@braze.com', status: 'connected' }
          ],
          'facebook': [],
          'instagram': [],
          'hubspot': [],
          'xiaohongshu': []
        };

        return (
          <div className="h-full flex flex-col bg-gray-50">
            {/* 页面头部 */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('channelConfiguration')}</h2>
                  <p className="text-gray-600">{t('manageChannelAccounts')}</p>
                </div>
              </div>
            </div>
            
            {/* 渠道列表 - 更现代的列表式设计 */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-4">
                    {[
                      { 
                        id: 'radica', 
                        name: t('radica'), 
                    accounts: channelAccounts['radica'] || [],
                    icon: 'image',
                    iconImage: '/ai-content-platform-login/Image831/logo/radica.png',
                    bgColor: 'bg-white',
                    iconColor: 'text-blue-600'
                      },
                      { 
                        id: 'facebook', 
                        name: t('facebook'), 
                    accounts: channelAccounts['facebook'] || [],
                    icon: (
                      <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        ),
                    bgColor: 'bg-[#1877F2]',
                    iconColor: 'text-[#1877F2]'
                      },
                      { 
                        id: 'instagram', 
                        name: t('instagram'), 
                    accounts: channelAccounts['instagram'] || [],
                    icon: (
                      <svg className="w-6 h-6" fill="url(#instagram-gradient)" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#833AB4" />
                            <stop offset="50%" stopColor="#E1306C" />
                            <stop offset="100%" stopColor="#F77737" />
                          </linearGradient>
                        </defs>
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        ),
                    bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
                    iconColor: 'text-pink-600'
                      },
                      { 
                        id: 'hubspot', 
                        name: t('hubspot'), 
                    accounts: channelAccounts['hubspot'] || [],
                    icon: (
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                        <path d="M17.081 9.416a4.79 4.79 0 0 1-1.753 3.702 4.819 4.819 0 0 1-3.702 1.182h-.12v-3.264h.12a4.819 4.819 0 0 1 3.702 1.182 4.79 4.79 0 0 1 1.753-3.702zm-8.804 0a4.79 4.79 0 0 1-1.753 3.702 4.819 4.819 0 0 1-3.701 1.182h-.121v-3.264h.121a4.819 4.819 0 0 1 3.701 1.182 4.79 4.79 0 0 1 1.753-3.702zm4.362 0a4.79 4.79 0 0 1-1.753 3.702 4.819 4.819 0 0 1-3.701 1.182h-.12v-3.264h.12a4.819 4.819 0 0 1 3.701 1.182 4.79 4.79 0 0 1 1.753-3.702zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                      </svg>
                        ),
                    bgColor: 'bg-[#FF7A59]',
                    iconColor: 'text-[#FF7A59]'
                      },
                      { 
                        id: 'braze', 
                        name: t('braze'), 
                    accounts: channelAccounts['braze'] || [],
                    icon: (
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                        ),
                    bgColor: 'bg-[#FF6B35]',
                    iconColor: 'text-[#FF6B35]'
                      },
                      { 
                        id: 'xiaohongshu', 
                        name: t('xiaohongshu'), 
                    accounts: channelAccounts['xiaohongshu'] || [],
                    icon: (
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                        ),
                    bgColor: 'bg-[#FF2442]',
                    iconColor: 'text-[#FF2442]'
                      }
                    ].map(channel => (
                  <div key={channel.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                    <div className="p-5">
                      {/* 渠道头部 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-12 h-12 ${channel.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                            {channel.iconImage ? (
                              <img src={channel.iconImage} alt={channel.name} className="w-full h-full object-contain p-1" />
                            ) : typeof channel.icon === 'string' ? (
                              <span className="text-white font-bold text-lg">{channel.icon}</span>
                            ) : (
                              <div className="text-white">{channel.icon}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-sm text-gray-500">
                                {channel.accounts.length > 0 
                                  ? `${channel.accounts.length} ${channel.accounts.length === 1 ? t('account') : t('accounts')} ${t('connected')}`
                                  : t('noAccountsConnected')
                                }
                              </span>
                              {channel.accounts.length > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                  {t('active')}
                                </span>
                              )}
                        </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedChannelForManage(channel);
                            setShowChannelManageModal(true);
                          }}
                          className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {channel.accounts.length > 0 ? t('manage') : t('connect')}
                        </button>
                      </div>
                      
                      {/* 账号列表 */}
                      {channel.accounts.length > 0 && (
                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <div className="space-y-2">
                            {channel.accounts.slice(0, 3).map((account) => (
                              <div key={account.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-600 text-xs font-semibold">
                                      {account.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{account.name}</p>
                                    {account.email && (
                                      <p className="text-xs text-gray-500 truncate">{account.email}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                    {t('connected')}
                                  </span>
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                  </button>
                                </div>
                      </div>
                    ))}
                            {channel.accounts.length > 3 && (
                              <div className="text-center pt-2">
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                  {t('viewAllAccounts', { count: channel.accounts.length })}
                                </button>
                  </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'platform-settings':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('platformSettings')}</h2>
              <div className="flex-1 space-y-8">
                {/* 语言设置 */}
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">🌐</span>
                    </span>
                    {t('languageSettings')}
                  </h3>
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        );
      case 'account-settings':
        return (
          <div className="p-8 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('accountSettings')}</h2>
              <div className="flex-1 space-y-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm">⚙️</span>
                    </span>
                    {t('accountPreferences')}
                  </h3>
                  <p className="text-gray-600">{t('accountSettingsInDevelopment')}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  // 获取可用专家列表（从专家选择页面获取）
  const availableExperts = [
    { id: 'economist', name: t('economist'), icon: '📊', type: 'economist' },
    { id: 'psychologist', name: t('consumerPsychologist'), icon: '🧠', type: 'psychologist' },
    { id: 'copywriter', name: t('copywritingExpert'), icon: '✍️', type: 'copywriter' },
    { id: 'designer', name: t('designExpert'), icon: '🎨', type: 'designer' },
    { id: 'marketer', name: t('marketingExpert'), icon: '🚀', type: 'marketer' },
    { id: 'sales', name: t('salesExpert'), icon: '💰', type: 'sales' }
  ];

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* A/B测试弹窗 */}
      <ABTestModal
        isOpen={isABTestModalOpen}
        onClose={closeABTestModal}
        onStartCreation={handleStartABTestCreation}
      />
      
      {/* 热点创作弹窗 */}
      <TrendingTopicsModal
        isOpen={isTrendingTopicsModalOpen}
        onClose={() => setIsTrendingTopicsModalOpen(false)}
        selectedTopics={selectedTopics}
        onTopicToggle={handleTopicToggle}
      />
      
      {/* 渠道管理弹窗 */}
      {showChannelManageModal && selectedChannelForManage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${selectedChannelForManage.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                  {selectedChannelForManage.iconImage ? (
                    <img src={selectedChannelForManage.iconImage} alt={selectedChannelForManage.name} className="w-full h-full object-contain p-1" />
                  ) : typeof selectedChannelForManage.icon === 'string' ? (
                    <span className="text-white font-bold text-lg">{selectedChannelForManage.icon}</span>
                  ) : (
                    <div className="text-white">{selectedChannelForManage.icon}</div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedChannelForManage.name}</h2>
                  <p className="text-sm text-gray-500">{t('manageChannelAccounts')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChannelManageModal(false);
                  setSelectedChannelForManage(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 space-y-6">
              {/* 连接状态 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedChannelForManage.accounts.length > 0 ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-700">{t('connected')}</span>
                        <span className="text-sm text-gray-500">
                          {selectedChannelForManage.accounts.length} {selectedChannelForManage.accounts.length === 1 ? t('account') : t('accounts')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-700">{t('notConnected')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 已连接账号列表 */}
              {selectedChannelForManage.accounts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{t('connectedAccounts')}</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedChannelForManage.accounts.map((account: any) => (
                      <div key={account.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {account.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{account.name}</p>
                            {account.email && (
                              <p className="text-sm text-gray-500 truncate">{account.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            {t('active')}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 添加账号区域 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedChannelForManage.accounts.length > 0 ? t('addNewAccount') : t('connectAccount')}
                </h3>
                
                {selectedChannelForManage.accounts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">{t('noAccountsConnectedDescription')}</p>
                    <button 
                      onClick={() => {
                        if (selectedChannelForManage.id === 'radica') {
                          window.open('https://uat.rimanggis.com/?division=495', '_blank');
                        } else {
                          // 其他平台的处理逻辑，暂时显示提示
                          alert(t('connectNow'));
                        }
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>{t('connectNow')}</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      if (selectedChannelForManage.id === 'radica') {
                        window.open('https://uat.rimanggis.com/?division=495', '_blank');
                      } else {
                        // 其他平台的处理逻辑，暂时显示提示
                        alert(t('addAccount'));
                      }
                    }}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{t('addAccount')}</span>
                  </button>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowChannelManageModal(false);
                    setSelectedChannelForManage(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  {t('close')}
                </button>
                {selectedChannelForManage.accounts.length > 0 && (
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    {t('saveChanges')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 左侧菜单 */}
      <div className="relative w-64 bg-white flex flex-col border-r border-gray-200 h-screen flex-shrink-0">
        {/* 左侧渐变边框 */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200"></div>
        
        {/* Logo区域 */}
        <div className="px-6 py-0 border-b border-gray-100">
          <div className="flex items-center justify-center py-2">
            {/* Logo图标 */}
            <img 
              src="/Memacreate.ai/memalogo.png" 
              alt="Mema Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
        
        {/* 菜单项 */}
        <nav className="flex-1 overflow-y-auto px-4 py-0">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.key;
              return (
              <li key={item.key}>
                <button
                  onClick={() => handleMenuClick(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MenuIcon 
                        iconType={item.iconType} 
                        className={isActive ? 'text-blue-600' : 'text-gray-500'} 
                      />
                  <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.hasSubmenu && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                </button>
              </li>
              );
            })}
          </ul>
        </nav>
        
        {/* 账号设置 */}
        <div className="px-4 py-2 border-t border-gray-100">
          <button
            onClick={() => handleMenuClick('account-settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
              activeMenu === 'account-settings'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <MenuIcon 
              iconType="account-settings" 
              className={activeMenu === 'account-settings' ? 'text-blue-600' : 'text-gray-500'} 
            />
            <span className="text-sm font-medium">{t('accountSettings')}</span>
          </button>
        </div>
        
        {/* 底部工具区 */}
        <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between space-x-2">
            {/* Light/Dark模式切换 */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 flex-1">
              <button className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-white rounded text-gray-700 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded text-gray-400 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark</span>
              </button>
            </div>
            
            {/* 帮助图标 */}
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {/* 返回箭头 */}
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
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
        <div className="flex-1 overflow-hidden">
          {viewMode === 'ai-chat' ? (
            <AIChatView 
              initialData={aiChatData}
              onBack={() => setViewMode('home')}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              {renderContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformHome;

