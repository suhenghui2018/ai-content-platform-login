import React from 'react';
import { BrandPack } from '../types/brandPack';

interface BrandPackDetailProps {
  brandPack: BrandPack;
  onBack: () => void;
}

const BrandPackDetail: React.FC<BrandPackDetailProps> = ({ brandPack, onBack }) => {

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
        {/* 聊天气泡卡片 */}
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
      </div>
    </div>
  );
};

export default BrandPackDetail;
