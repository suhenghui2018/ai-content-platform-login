import React, { useState } from 'react';
import { BrandPack } from '../types/brandPack';

interface BrandPackDetailProps {
  brandPack: BrandPack;
  onBack: () => void;
}

const BrandPackDetail: React.FC<BrandPackDetailProps> = ({ brandPack, onBack }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge'>('chat');

  // 7个聊天气泡卡片数据
  const chatBubbles = [
    {
      id: 1,
      title: '品牌核心身份',
      description: '定义品牌名称、口号、故事和使命',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: '品牌声音与语调',
      description: '确定品牌的语言风格和沟通方式',
      icon: '🎭',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 3,
      title: '目标受众画像',
      description: '分析目标客户的特征和需求',
      icon: '👥',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 4,
      title: '品牌视觉系统',
      description: '设计Logo、色彩和视觉元素',
      icon: '🎨',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 5,
      title: '内容与产品信息',
      description: '整理产品清单和独特卖点',
      icon: '📦',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 6,
      title: 'SEO优化策略',
      description: '制定搜索引擎优化关键词',
      icon: '🔍',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 7,
      title: '社交媒体策略',
      description: '规划社交媒体平台和内容',
      icon: '📱',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  ];

  const handleBubbleClick = (bubbleId: number) => {
    // 这里可以跳转到具体的聊天气泡页面
    console.log('点击聊天气泡:', bubbleId);
    // 可以添加具体的跳转逻辑
  };

  // const handleKnowledgeBaseClick = () => {
  //   setActiveTab('knowledge');
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回品牌包列表
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={brandPack.logo}
                  alt={brandPack.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{brandPack.name}</h1>
                  <p className="text-sm text-gray-500">品牌包详情</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签页切换 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chat'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                聊天气泡 (7)
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'knowledge'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                品牌知识库
              </button>
            </nav>
          </div>
        </div>

        {/* 聊天气泡卡片 */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chatBubbles.map((bubble) => (
              <div
                key={bubble.id}
                onClick={() => handleBubbleClick(bubble.id)}
                className={`${bubble.bgColor} ${bubble.borderColor} border-2 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${bubble.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white">{bubble.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{bubble.title}</h3>
                    <div className="w-8 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{bubble.description}</p>
                <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
                  开始对话
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 品牌知识库卡片 */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            {/* 知识库概览卡片 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl text-white">📚</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">品牌知识库</h2>
                  <p className="text-gray-600">管理您的品牌相关文档、图片和参考资料</p>
                </div>
              </div>

              {/* 知识库统计 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-blue-600">文档文件</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-green-600">图片资源</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-purple-600">网址参考</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-orange-600">Email模板</div>
                </div>
              </div>

              {/* 添加内容按钮 */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  上传文件
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  添加文字
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email HTML
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  网址参考
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  上传图片
                </button>
              </div>
            </div>

            {/* 知识库内容列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 示例文档卡片 */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">品牌指南.pdf</h4>
                    <p className="text-sm text-gray-500">2.3 MB • 2024-01-15</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">包含品牌标识、色彩规范和字体使用指南</p>
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">查看</button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">下载</button>
                  <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </div>
              </div>

              {/* 示例图片卡片 */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Logo设计.png</h4>
                    <p className="text-sm text-gray-500">1.8 MB • 2024-01-14</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">品牌Logo的多种变体和尺寸</p>
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">查看</button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">下载</button>
                  <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </div>
              </div>

              {/* 示例网址参考卡片 */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">竞品分析参考</h4>
                    <p className="text-sm text-gray-500">链接 • 2024-01-13</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">https://example.com/competitor-analysis</p>
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">访问</button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">编辑</button>
                  <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPackDetail;
