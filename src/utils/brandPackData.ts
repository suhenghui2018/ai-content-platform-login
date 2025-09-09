import { BrandPack } from '../types/brandPack';

export const mockBrandPacks: BrandPack[] = [
  {
    id: '1',
    name: 'Radica品牌包',
    logo: '/Image831/logo/radica.png',
    createdAt: '2024-01-15',
    isEnabled: true,
    creator: '张三',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan&backgroundColor=b6e3f4&size=40',
    description: 'Radica AI驱动的全渠道营销自动化平台品牌包，专为营销科技行业设计，包含智能化、专业化的视觉元素和现代化设计风格',
    tags: ['AI', '营销自动化', '全渠道', '智能化']
  }
  // Godiva品牌包已删除，用户需要先创建品牌包
];

export const getBrandPacks = (): BrandPack[] => {
  return mockBrandPacks;
};

export const toggleBrandPackStatus = (id: string): BrandPack[] => {
  const updatedPacks = mockBrandPacks.map(pack => 
    pack.id === id ? { ...pack, isEnabled: !pack.isEnabled } : pack
  );
  // 更新原始数组以保持数据同步
  mockBrandPacks.splice(0, mockBrandPacks.length, ...updatedPacks);
  return updatedPacks;
};

export const createBrandPack = (data: any): BrandPack => {
  const newPack: BrandPack = {
    id: Date.now().toString(),
    name: data.name,
    logo: data.logo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=6b7280&size=80',
    createdAt: new Date().toISOString().split('T')[0],
    isEnabled: true,
    creator: '当前用户',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current&backgroundColor=b6e3f4&size=40',
    description: data.description,
    tags: data.tags || []
  };
  
  mockBrandPacks.unshift(newPack);
  return newPack;
};
