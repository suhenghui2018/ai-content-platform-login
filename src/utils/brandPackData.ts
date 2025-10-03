import { BrandPack } from '../types/brandPack';

// 创建支持多语言的品牌包数据工厂函数
export const createBrandPacks = (t: Function): BrandPack[] => [
  {
    id: '1',
    name: t('radicaBrandPack'),
    logo: '/ai-content-platform-login/Image831/logo/radica.png',
    createdAt: '2024-01-15',
    isEnabled: true,
    creator: t('zhangsan'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan&backgroundColor=b6e3f4&size=40',
    description: t('radicaBrandPackDescription'),
    tags: [t('ai'), t('marketingAutomation'), t('omnichannel'), t('intelligent')]
  },
  {
    id: '2',
    name: t('godivaBrandPack'),
    logo: '/ai-content-platform-login/Image831/logo/godiva.jpeg',
    createdAt: '2024-01-10',
    isEnabled: true,
    creator: t('lisi'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi&backgroundColor=b6e3f4&size=40',
    description: t('godivaBrandPackDescription'),
    tags: [t('luxury'), t('chocolate'), t('highEnd'), t('classic')]
  }
];

// 存储当前语言的品牌包数据
let currentBrandPacks: BrandPack[] = [];

// 设置品牌包数据并根据当前语言更新
export const setBrandPacks = (t: Function): void => {
  currentBrandPacks = createBrandPacks(t);
};

export const getBrandPacks = (): BrandPack[] => {
  // 如果还没有初始化，返回默认的中文数据
  if (currentBrandPacks.length === 0) {
    // 临时的默认翻译函数
    const defaultT = (key: string) => {
      const defaultTranslations: {[key: string]: string} = {
        radicaBrandPack: 'Radica品牌包',
        zhangsan: '张三',
        radicaBrandPackDescription: 'Radica AI驱动的全渠道营销自动化平台品牌包，专为营销科技行业设计，包含智能化、专业化的视觉元素和现代化设计风格',
        ai: 'AI',
        marketingAutomation: '营销自动化',
        omnichannel: '全渠道',
        intelligent: '智能化',
        godivaBrandPack: 'Godiva品牌包',
        lisi: '李四',
        godivaBrandPackDescription: 'Godiva高端巧克力品牌包，专为奢侈品行业设计，包含奢华、精致的视觉元素和经典的设计风格',
        luxury: '奢侈品',
        chocolate: '巧克力',
        highEnd: '高端',
        classic: '经典'
      };
      return defaultTranslations[key] || key;
    };
    currentBrandPacks = createBrandPacks(defaultT);
  }
  return currentBrandPacks;
};

export const toggleBrandPackStatus = (id: string): BrandPack[] => {
  const updatedPacks = currentBrandPacks.map(pack => 
    pack.id === id ? { ...pack, isEnabled: !pack.isEnabled } : pack
  );
  // 更新原始数组以保持数据同步
  currentBrandPacks.splice(0, currentBrandPacks.length, ...updatedPacks);
  return updatedPacks;
};

export const createBrandPack = (data: any): BrandPack => {
  const newPack: BrandPack = {
    id: Date.now().toString(),
    name: data.name,
    logo: data.logo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=6b7280&size=80',
    createdAt: new Date().toISOString().split('T')[0],
    isEnabled: true,
    creator: data.creator || '当前用户',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current&backgroundColor=b6e3f4&size=40',
    description: data.description,
    tags: data.tags || []
  };
  
  // 添加到当前语言的数组中
  currentBrandPacks.unshift(newPack);
  
  return newPack;
};
