import { ContentPack } from '../types/contentPack';

// 创建支持多语言的内容包数据工厂函数
export const createContentPacks = (t: Function): ContentPack[] => [
  {
    id: '1',
    name: t('springMarketingCampaign'),
    description: t('springMarketingCampaignDescription'),
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    creator: t('zhangsan'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan&backgroundColor=b6e3f4&size=40',
    isShared: true,
    sharedBy: t('lisi'),
    contentCount: 15,
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    name: t('productIntroduction'),
    description: t('productIntroductionDescription'),
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    creator: t('wangwu'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu&backgroundColor=fbbf24&size=40',
    isShared: false,
    contentCount: 8,
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    name: t('brandStory'),
    description: t('brandStoryDescription'),
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    creator: t('zhaoliu'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu&backgroundColor=10b981&size=40',
    isShared: true,
    sharedBy: t('qianqi'),
    contentCount: 12,
    status: 'draft',
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop'
  }
];

// 存储当前语言的内容包数据
let currentContentPacks: ContentPack[] = [];

// 设置内容包数据并根据当前语言更新
export const setContentPacks = (t: Function): void => {
  currentContentPacks = createContentPacks(t);
};

export const getContentPacks = (): ContentPack[] => {
  // 如果还没有初始化，返回默认的中文数据
  if (currentContentPacks.length === 0) {
    // 临时的默认翻译函数
    const defaultT = (key: string) => {
      const defaultTranslations: {[key: string]: string} = {
        springMarketingCampaign: '春季营销活动内容包',
        springMarketingCampaignDescription: '包含春季新品发布、促销活动、社交媒体等全方位营销内容',
        zhangsan: '张三',
        lisi: '李四',
        productIntroduction: '产品介绍内容包',
        productIntroductionDescription: '公司核心产品的详细介绍、功能说明和使用指南',
        wangwu: '王五',
        brandStory: '品牌故事内容包',
        brandStoryDescription: '公司发展历程、企业文化、创始人故事等品牌相关内容',
        zhaoliu: '赵六',
        qianqi: '钱七'
      };
      return defaultTranslations[key] || key;
    };
    currentContentPacks = createContentPacks(defaultT);
  }
  return currentContentPacks;
};

export const getContentPackSettings = (contentPackId: string): any => {
  const settings = localStorage.getItem(`contentPack_${contentPackId}_settings`);
  return settings ? JSON.parse(settings) : null;
};

export const createContentPack = (data: any, t?: Function): ContentPack => {
  const newPack: ContentPack = {
    id: Date.now().toString(),
    name: data.name,
    description: data.description,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    creator: data.creator || (t ? t('currentUser') : '当前用户'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current&backgroundColor=b6e3f4&size=40',
    isShared: false,
    contentCount: 0,
    status: 'draft',
    coverImage: data.coverImage
  };
  
  // 保存项目设置信息到localStorage，使用内容包ID作为key
  if (data.projectSettings) {
    localStorage.setItem(`contentPack_${newPack.id}_settings`, JSON.stringify(data.projectSettings));
  }
  
  // 添加到当前语言的数组中
  currentContentPacks.unshift(newPack);
  return newPack;
};

export const updateContentPack = (id: string, data: Partial<ContentPack>): ContentPack | null => {
  const index = currentContentPacks.findIndex(pack => pack.id === id);
  if (index !== -1) {
    currentContentPacks[index] = { ...currentContentPacks[index], ...data, updatedAt: new Date().toISOString().split('T')[0] };
    return currentContentPacks[index];
  }
  return null;
};

export const deleteContentPack = (id: string): boolean => {
  const index = currentContentPacks.findIndex(pack => pack.id === id);
  if (index !== -1) {
    currentContentPacks.splice(index, 1);
    return true;
  }
  return false;
};

export const toggleContentPackStatus = (id: string): ContentPack | null => {
  const pack = currentContentPacks.find(pack => pack.id === id);
  if (pack) {
    pack.status = pack.status === 'published' ? 'draft' : 'published';
    pack.updatedAt = new Date().toISOString().split('T')[0];
    return pack;
  }
  return null;
};
