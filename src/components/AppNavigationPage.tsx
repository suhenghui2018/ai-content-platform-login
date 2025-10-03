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
  const [selectedCategory, setSelectedCategory] = useState('Social Media Marketing');
  
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
    'PR & Comms'
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

  // 获取标签样式
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'POPULAR':
        return 'bg-pink-100 text-pink-800';
      case 'NEW':
        return 'bg-green-100 text-green-800';
      case 'UPGRADE':
        return 'bg-blue-100 text-blue-800';
      case 'Business':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      'PR & Comms': 'Manage your public relations and communications with professional tools.'
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
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 搜索栏 */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Q Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 分类选择 */}
            <div className="ml-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 返回按钮 */}
            <div className="ml-6">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 分类标题和描述 */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg className="w-full h-full text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="relative">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedCategory}
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl">
                {getCategoryDescription(selectedCategory)}
              </p>
            </div>
          </div>
        </div>

        {/* 排序和结果统计 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {sortedApps.length} apps found
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 应用网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTagStyle(tag)}`}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need a Custom App?
            </h3>
            <p className="text-gray-600 mb-4">
              Request a tailored App built by our team to meet your specific marketing needs.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppNavigationPage;





