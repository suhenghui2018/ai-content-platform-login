import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface App {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  category: string;
}

const AppNavigationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  
  // 当前选中的分类
  const [selectedCategory, setSelectedCategory] = useState('All');
  // 排序方式
  const [sortBy, setSortBy] = useState('Recommend');

  // 应用数据
  const apps: App[] = [
    {
      id: 'facebook-post',
      title: 'Facebook Post',
      description: 'Foster engagement and amplify reach using engaging Facebook updates',
      icon: '👍',
      tags: ['POPULAR'],
      category: 'Social Media Marketing'
    },
    {
      id: 'content-rewriter',
      title: 'Content Rewriter',
      description: 'Transform your content to meet specific goals, including altering its format or tone',
      icon: '🔄',
      tags: ['POPULAR'],
      category: 'Content Marketing'
    },
    {
      id: 'social-media-campaign',
      title: 'Social Media Campaign',
      description: 'Amplify your brand and engage followers with a cohesive social media campaign',
      icon: '💬',
      tags: ['UPGRADE', 'Business'],
      category: 'Social Media Marketing'
    },
    {
      id: 'instagram-caption',
      title: 'Instagram Caption',
      description: 'Boost engagement with captions that perfectly accompany your Instagram posts',
      icon: '📷',
      tags: ['POPULAR'],
      category: 'Social Media Marketing'
    },
    {
      id: 'content-translator',
      title: 'Content Translator',
      description: 'Translate your content into multiple languages while preserving its core message',
      icon: '🅰️',
      tags: ['UPGRADE', 'Business'],
      category: 'Content Marketing'
    },
    {
      id: 'background-remover',
      title: 'Background Remover',
      description: 'Effortlessly remove backgrounds from any image',
      icon: '✂️',
      tags: ['NEW', 'POPULAR'],
      category: 'Content Marketing'
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Create compelling email campaigns that drive engagement and conversions',
      icon: '📧',
      tags: ['POPULAR'],
      category: 'Performance Marketing'
    },
    {
      id: 'brand-voice',
      title: 'Brand Voice',
      description: 'Maintain consistent brand messaging across all your content',
      icon: '🎯',
      tags: ['UPGRADE'],
      category: 'Brand Marketing'
    },
    {
      id: 'product-launch',
      title: 'Product Launch',
      description: 'Plan and execute successful product launches with strategic content',
      icon: '🚀',
      tags: ['Business'],
      category: 'Product Marketing'
    },
    {
      id: 'ab-test',
      title: 'A/B Test',
      description: 'Create and analyze A/B tests to optimize your marketing campaigns and content',
      icon: '🧪',
      tags: ['NEW'],
      category: '工具APP'
    }
  ];

  // 分类列表
  const categories = [
    'Social Media Marketing',
    'Product Marketing',
    'Performance Marketing',
    'Brand Marketing',
    'Content Marketing',
    'Field Marketing',
    'Lifecycle Marketing',
    'Partner Marketing',
    'PR & Comms',
    '工具APP'
  ];

  // 排序选项
  const sortOptions = ['Recommend', 'Popular', 'New', 'A-Z'];

  // 过滤应用
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 排序应用
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'Popular':
        return b.tags.includes('POPULAR') ? 1 : -1;
      case 'New':
        return b.tags.includes('NEW') ? 1 : -1;
      case 'A-Z':
        return a.title.localeCompare(b.title);
      default:
        return 0; // Recommend - 保持原始顺序
    }
  });

  // 获取标签样式 - 简约风格
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'POPULAR':
        return 'bg-pink-50 text-pink-700 border border-pink-200';
      case 'NEW':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'UPGRADE':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Business':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // 获取分类描述
  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      'Social Media Marketing': 'Boost your social media impact with apps that ensure brand consistency, generate fresh content ideas, and foster community growth.',
      'Content Marketing': 'Create compelling content that resonates with your audience and drives engagement across all channels.',
      'Performance Marketing': 'Optimize your marketing performance with data-driven tools and analytics.',
      'Brand Marketing': 'Build and maintain a strong brand presence with consistent messaging and visual identity.',
      'Product Marketing': 'Launch and promote your products effectively with targeted marketing strategies.',
      'Field Marketing': 'Connect with your local audience through field marketing and events.',
      'Lifecycle Marketing': 'Engage customers throughout their entire journey with personalized marketing.',
      'Partner Marketing': 'Leverage partnerships to expand your reach and grow your business.',
      'PR & Comms': 'Manage your public relations and communications with professional tools.',
      '工具APP': '提供各类营销工具，帮助您优化营销策略和提升营销效果。'
    };
    return descriptions[category] || 'Discover powerful marketing tools for your business.';
  };

  const handleAppClick = (appId: string) => {
    // 导航到应用详情页面或直接打开应用
    console.log('Opening app:', appId);
    // navigate(`/app/${appId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 - 参考菜单栏简约风格 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard?menu=home')}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                aria-label="返回"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Apps</h1>
            </div>
          </div>

          {/* 搜索和筛选栏 - 简约风格 */}
          <div className="flex items-center space-x-3">
            {/* 搜索栏 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* 分类和排序选择 */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="px-8 py-6">
        {/* 结果统计 - 简化 */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            {sortedApps.length} {sortedApps.length === 1 ? 'app' : 'apps'}
          </span>
        </div>

        {/* 应用列表 - 简约列表式设计，参考菜单栏风格 */}
        <div className="space-y-1">
          {sortedApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                {/* 图标 */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                
                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {app.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 ml-2">
                      {app.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-0.5 text-xs font-medium rounded ${getTagStyle(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {app.description}
                  </p>
                </div>
                
                {/* 箭头图标 */}
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 空状态 - 简约风格 */}
        {sortedApps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-4xl mb-3">🔍</div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No apps found</h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}

        {/* 底部提示 - 简化 */}
        {sortedApps.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Need a Custom App?
              </p>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppNavigationPage;





