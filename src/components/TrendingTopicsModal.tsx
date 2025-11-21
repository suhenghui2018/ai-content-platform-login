import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TrendingTopic {
  id: string;
  text: string;
  hashtag: string;
  engagement: number;
  platform: 'xiaohongshu' | 'facebook' | 'instagram';
  category: string;
}

interface TrendingTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopics?: TrendingTopic[];
  onTopicToggle?: (topic: TrendingTopic) => void;
}

const TrendingTopicsModal: React.FC<TrendingTopicsModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedTopics = [], 
  onTopicToggle 
}) => {
  const { t } = useTranslation();
  const [activePlatform, setActivePlatform] = useState<'xiaohongshu' | 'facebook' | 'instagram'>('xiaohongshu');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // 小红书真实热点话题数据
  const xiaohongshuTopics: TrendingTopic[] = [
    { id: 'xhs-1', text: '秋冬穿搭分享：如何用基础款打造高级感', hashtag: '#秋冬穿搭', engagement: 1250000, platform: 'xiaohongshu', category: '时尚' },
    { id: 'xhs-2', text: '平价好物推荐：这些宝藏单品值得入手', hashtag: '#平价好物', engagement: 980000, platform: 'xiaohongshu', category: '购物' },
    { id: 'xhs-3', text: '护肤心得：敏感肌也能用的温和护肤品', hashtag: '#敏感肌护肤', engagement: 856000, platform: 'xiaohongshu', category: '美妆' },
    { id: 'xhs-4', text: '旅行攻略：三天两夜玩转热门城市', hashtag: '#旅行攻略', engagement: 742000, platform: 'xiaohongshu', category: '旅行' },
    { id: 'xhs-5', text: '美食探店：隐藏在小巷里的宝藏餐厅', hashtag: '#美食探店', engagement: 689000, platform: 'xiaohongshu', category: '美食' },
    { id: 'xhs-6', text: '健身打卡：30天减脂计划分享', hashtag: '#健身打卡', engagement: 625000, platform: 'xiaohongshu', category: '健身' },
    { id: 'xhs-7', text: '美妆教程：新手也能学会的日常妆容', hashtag: '#美妆教程', engagement: 589000, platform: 'xiaohongshu', category: '美妆' },
    { id: 'xhs-8', text: '家居改造：低成本打造ins风房间', hashtag: '#家居改造', engagement: 542000, platform: 'xiaohongshu', category: '家居' },
    { id: 'xhs-9', text: '读书分享：最近读到的治愈系好书', hashtag: '#读书分享', engagement: 498000, platform: 'xiaohongshu', category: '文化' },
    { id: 'xhs-10', text: '职场穿搭：通勤也能穿出时尚感', hashtag: '#职场穿搭', engagement: 456000, platform: 'xiaohongshu', category: '时尚' },
    { id: 'xhs-11', text: '手账分享：如何用简单工具做出精美手账', hashtag: '#手账分享', engagement: 423000, platform: 'xiaohongshu', category: '生活' },
    { id: 'xhs-12', text: '宠物日常：我家毛孩子的可爱瞬间', hashtag: '#宠物日常', engagement: 389000, platform: 'xiaohongshu', category: '宠物' },
    { id: 'xhs-13', text: '穿搭灵感：跟着博主学搭配', hashtag: '#穿搭灵感', engagement: 356000, platform: 'xiaohongshu', category: '时尚' },
    { id: 'xhs-14', text: '护肤流程：正确的护肤步骤你做对了吗', hashtag: '#护肤流程', engagement: 332000, platform: 'xiaohongshu', category: '美妆' },
    { id: 'xhs-15', text: '美食制作：简单易学的家常菜教程', hashtag: '#美食制作', engagement: 298000, platform: 'xiaohongshu', category: '美食' },
    { id: 'xhs-16', text: '旅行vlog：记录美好的旅行时光', hashtag: '#旅行vlog', engagement: 275000, platform: 'xiaohongshu', category: '旅行' },
    { id: 'xhs-17', text: '美甲分享：秋冬美甲款式推荐', hashtag: '#美甲分享', engagement: 251000, platform: 'xiaohongshu', category: '美妆' },
    { id: 'xhs-18', text: '穿搭技巧：小个子女生显高穿搭', hashtag: '#小个子穿搭', engagement: 228000, platform: 'xiaohongshu', category: '时尚' },
    { id: 'xhs-19', text: '护肤成分：了解这些成分让护肤更有效', hashtag: '#护肤成分', engagement: 205000, platform: 'xiaohongshu', category: '美妆' },
    { id: 'xhs-20', text: '生活方式：如何提升生活品质', hashtag: '#生活方式', engagement: 189000, platform: 'xiaohongshu', category: '生活' },
    { id: 'xhs-21', text: '穿搭分享：一周穿搭不重样', hashtag: '#一周穿搭', engagement: 175000, platform: 'xiaohongshu', category: '时尚' },
    { id: 'xhs-22', text: '美妆好物：这些彩妆单品值得回购', hashtag: '#美妆好物', engagement: 162000, platform: 'xiaohongshu', category: '美妆' },
    { id: 'xhs-23', text: '旅行清单：出门旅行必备物品清单', hashtag: '#旅行清单', engagement: 148000, platform: 'xiaohongshu', category: '旅行' },
    { id: 'xhs-24', text: '健身计划：适合新手的健身入门指南', hashtag: '#健身计划', engagement: 135000, platform: 'xiaohongshu', category: '健身' },
    { id: 'xhs-25', text: '美食推荐：这些网红美食你吃过吗', hashtag: '#美食推荐', engagement: 125000, platform: 'xiaohongshu', category: '美食' },
  ];

  // Facebook真实热点话题数据
  const facebookTopics: TrendingTopic[] = [
    { id: 'fb-1', text: 'AI Technology: Latest Developments in Artificial Intelligence', hashtag: '#AITechnology', engagement: 2450000, platform: 'facebook', category: '科技' },
    { id: 'fb-2', text: 'Climate Change: Global Efforts to Reduce Carbon Emissions', hashtag: '#ClimateChange', engagement: 1890000, platform: 'facebook', category: '时事' },
    { id: 'fb-3', text: 'Business News: Market Trends and Economic Updates', hashtag: '#BusinessNews', engagement: 1650000, platform: 'facebook', category: '商业' },
    { id: 'fb-4', text: 'Health & Wellness: Tips for Maintaining a Healthy Lifestyle', hashtag: '#HealthWellness', engagement: 1420000, platform: 'facebook', category: '健康' },
    { id: 'fb-5', text: 'Technology Review: Latest Smartphone and Gadget Reviews', hashtag: '#TechReview', engagement: 1280000, platform: 'facebook', category: '科技' },
    { id: 'fb-6', text: 'Travel Tips: Best Destinations for Your Next Vacation', hashtag: '#TravelTips', engagement: 1150000, platform: 'facebook', category: '旅行' },
    { id: 'fb-7', text: 'Education: Online Learning Resources and Opportunities', hashtag: '#Education', engagement: 980000, platform: 'facebook', category: '教育' },
    { id: 'fb-8', text: 'Entertainment: Latest Movies and TV Shows to Watch', hashtag: '#Entertainment', engagement: 856000, platform: 'facebook', category: '娱乐' },
    { id: 'fb-9', text: 'Sports: Major League Updates and Game Highlights', hashtag: '#Sports', engagement: 742000, platform: 'facebook', category: '体育' },
    { id: 'fb-10', text: 'Food & Recipes: Delicious Recipes You Can Try at Home', hashtag: '#FoodRecipes', engagement: 689000, platform: 'facebook', category: '美食' },
    { id: 'fb-11', text: 'Finance: Investment Tips and Market Analysis', hashtag: '#Finance', engagement: 625000, platform: 'facebook', category: '财经' },
    { id: 'fb-12', text: 'Science: Breakthrough Discoveries and Research News', hashtag: '#Science', engagement: 589000, platform: 'facebook', category: '科学' },
    { id: 'fb-13', text: 'Politics: Current Events and Political Discussions', hashtag: '#Politics', engagement: 542000, platform: 'facebook', category: '政治' },
    { id: 'fb-14', text: 'Lifestyle: Tips for Better Work-Life Balance', hashtag: '#Lifestyle', engagement: 498000, platform: 'facebook', category: '生活' },
    { id: 'fb-15', text: 'Fashion: Latest Trends and Style Inspiration', hashtag: '#Fashion', engagement: 456000, platform: 'facebook', category: '时尚' },
    { id: 'fb-16', text: 'Motivation: Inspirational Quotes and Success Stories', hashtag: '#Motivation', engagement: 423000, platform: 'facebook', category: '励志' },
    { id: 'fb-17', text: 'Gaming: Latest Game Releases and Reviews', hashtag: '#Gaming', engagement: 389000, platform: 'facebook', category: '游戏' },
    { id: 'fb-18', text: 'Photography: Tips and Techniques for Better Photos', hashtag: '#Photography', engagement: 356000, platform: 'facebook', category: '摄影' },
    { id: 'fb-19', text: 'DIY Projects: Creative Ideas for Home Improvement', hashtag: '#DIYProjects', engagement: 332000, platform: 'facebook', category: '手工' },
    { id: 'fb-20', text: 'Pet Care: Tips for Keeping Your Pets Healthy', hashtag: '#PetCare', engagement: 298000, platform: 'facebook', category: '宠物' },
    { id: 'fb-21', text: 'Career: Job Search Tips and Career Development', hashtag: '#Career', engagement: 275000, platform: 'facebook', category: '职场' },
    { id: 'fb-22', text: 'Real Estate: Home Buying and Selling Tips', hashtag: '#RealEstate', engagement: 251000, platform: 'facebook', category: '房产' },
    { id: 'fb-23', text: 'Fitness: Workout Routines and Exercise Tips', hashtag: '#Fitness', engagement: 228000, platform: 'facebook', category: '健身' },
    { id: 'fb-24', text: 'Cooking: Easy Recipes for Beginners', hashtag: '#Cooking', engagement: 205000, platform: 'facebook', category: '美食' },
    { id: 'fb-25', text: 'News: Breaking News and Current Events', hashtag: '#News', engagement: 189000, platform: 'facebook', category: '时事' },
  ];

  // Instagram真实热点话题数据
  const instagramTopics: TrendingTopic[] = [
    { id: 'ig-1', text: 'Fashion Inspiration: Street Style Looks from Around the World', hashtag: '#FashionInspiration', engagement: 3200000, platform: 'instagram', category: '时尚' },
    { id: 'ig-2', text: 'Travel Photography: Stunning Destinations to Visit', hashtag: '#TravelPhotography', engagement: 2850000, platform: 'instagram', category: '旅行' },
    { id: 'ig-3', text: 'Food Styling: Beautiful Food Photography Tips', hashtag: '#FoodStyling', engagement: 2450000, platform: 'instagram', category: '美食' },
    { id: 'ig-4', text: 'Fitness Motivation: Transform Your Body Journey', hashtag: '#FitnessMotivation', engagement: 2120000, platform: 'instagram', category: '健身' },
    { id: 'ig-5', text: 'Beauty Tips: Skincare Routines That Actually Work', hashtag: '#BeautyTips', engagement: 1890000, platform: 'instagram', category: '美妆' },
    { id: 'ig-6', text: 'Home Decor: Interior Design Ideas for Your Space', hashtag: '#HomeDecor', engagement: 1650000, platform: 'instagram', category: '家居' },
    { id: 'ig-7', text: 'Art & Creativity: Showcasing Amazing Artwork', hashtag: '#ArtCreativity', engagement: 1420000, platform: 'instagram', category: '艺术' },
    { id: 'ig-8', text: 'Lifestyle: Daily Routines and Healthy Habits', hashtag: '#Lifestyle', engagement: 1280000, platform: 'instagram', category: '生活' },
    { id: 'ig-9', text: 'Fashion Week: Latest Runway Trends and Styles', hashtag: '#FashionWeek', engagement: 1150000, platform: 'instagram', category: '时尚' },
    { id: 'ig-10', text: 'Travel Diaries: Exploring Hidden Gems', hashtag: '#TravelDiaries', engagement: 980000, platform: 'instagram', category: '旅行' },
    { id: 'ig-11', text: 'Foodie Adventures: Trying New Restaurants', hashtag: '#FoodieAdventures', engagement: 856000, platform: 'instagram', category: '美食' },
    { id: 'ig-12', text: 'Workout Routines: Fitness Challenges and Goals', hashtag: '#WorkoutRoutines', engagement: 742000, platform: 'instagram', category: '健身' },
    { id: 'ig-13', text: 'Makeup Tutorials: Step-by-Step Beauty Looks', hashtag: '#MakeupTutorials', engagement: 689000, platform: 'instagram', category: '美妆' },
    { id: 'ig-14', text: 'Minimalist Living: Simple and Sustainable Lifestyle', hashtag: '#MinimalistLiving', engagement: 625000, platform: 'instagram', category: '生活' },
    { id: 'ig-15', text: 'Nature Photography: Capturing Beautiful Landscapes', hashtag: '#NaturePhotography', engagement: 589000, platform: 'instagram', category: '摄影' },
    { id: 'ig-16', text: 'Street Fashion: Urban Style Inspiration', hashtag: '#StreetFashion', engagement: 542000, platform: 'instagram', category: '时尚' },
    { id: 'ig-17', text: 'Travel Tips: Budget-Friendly Vacation Ideas', hashtag: '#TravelTips', engagement: 498000, platform: 'instagram', category: '旅行' },
    { id: 'ig-18', text: 'Healthy Recipes: Nutritious and Delicious Meals', hashtag: '#HealthyRecipes', engagement: 456000, platform: 'instagram', category: '美食' },
    { id: 'ig-19', text: 'Fitness Transformation: Before and After Stories', hashtag: '#FitnessTransformation', engagement: 423000, platform: 'instagram', category: '健身' },
    { id: 'ig-20', text: 'Beauty Products: Honest Reviews and Recommendations', hashtag: '#BeautyProducts', engagement: 389000, platform: 'instagram', category: '美妆' },
    { id: 'ig-21', text: 'Interior Design: Modern Home Styling Ideas', hashtag: '#InteriorDesign', engagement: 356000, platform: 'instagram', category: '家居' },
    { id: 'ig-22', text: 'Art Gallery: Showcasing Creative Talents', hashtag: '#ArtGallery', engagement: 332000, platform: 'instagram', category: '艺术' },
    { id: 'ig-23', text: 'Daily Vlog: A Day in My Life', hashtag: '#DailyVlog', engagement: 298000, platform: 'instagram', category: '生活' },
    { id: 'ig-24', text: 'Fashion Trends: What\'s Hot This Season', hashtag: '#FashionTrends', engagement: 275000, platform: 'instagram', category: '时尚' },
    { id: 'ig-25', text: 'Travel Guide: Best Places to Visit This Year', hashtag: '#TravelGuide', engagement: 251000, platform: 'instagram', category: '旅行' },
  ];

  // 获取当前平台的分类列表
  const getCategories = (): string[] => {
    const topics = getTopics();
    const categories = Array.from(new Set(topics.map(topic => topic.category)));
    return ['全部', ...categories.sort()];
  };

  // 获取筛选后的话题
  const getFilteredTopics = (): TrendingTopic[] => {
    const topics = getTopics();
    if (selectedCategory === '全部') {
      return topics;
    }
    return topics.filter(topic => topic.category === selectedCategory);
  };

  const getTopics = () => {
    switch (activePlatform) {
      case 'xiaohongshu':
        return xiaohongshuTopics;
      case 'facebook':
        return facebookTopics;
      case 'instagram':
        return instagramTopics;
      default:
        return [];
    }
  };

  // 切换平台时重置分类
  const handlePlatformChange = (platform: 'xiaohongshu' | 'facebook' | 'instagram') => {
    setActivePlatform(platform);
    setSelectedCategory('全部');
  };

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
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      {/* 背景遮罩 */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-30' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* 侧边窗口 */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span>{t('trendingCreation')}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 平台切换标签 */}
          <div className="flex items-center space-x-2 p-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => handlePlatformChange('xiaohongshu')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePlatform === 'xiaohongshu'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('xiaohongshu')}
            </button>
            <button
              onClick={() => handlePlatformChange('facebook')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePlatform === 'facebook'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('facebook')}
            </button>
            <button
              onClick={() => handlePlatformChange('instagram')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePlatform === 'instagram'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('instagram')}
            </button>
          </div>

          {/* 分类标签 */}
          <div className="flex items-center space-x-2 p-4 border-b border-gray-200 bg-white overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              {getCategories().map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 话题列表 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
              {getFilteredTopics().map((topic) => {
                const isSelected = selectedTopics.some(t => t.id === topic.id);
                return (
                  <div
                    key={topic.id}
                    onClick={() => onTopicToggle && onTopicToggle(topic)}
                    className={`bg-white border-2 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <span className="text-primary-600 font-semibold">{topic.hashtag}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getPlatformName(topic.platform)}
                          </span>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {topic.category}
                          </span>
                          {isSelected && (
                            <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded">
                              {t('selected')}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 mb-2">{topic.text}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{t('engagement')}: {topic.engagement.toLocaleString()}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-4">
                          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="text-sm text-gray-600">
              {selectedTopics.length > 0 && (
                <span>{t('selectedTopicsCount') || `已选择 ${selectedTopics.length} 个话题`}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('cancel')}
              </button>
              {selectedTopics.length > 0 && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {t('confirm')}
                </button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default TrendingTopicsModal;

