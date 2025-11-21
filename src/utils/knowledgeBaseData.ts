// 知识库数据管理工具

export interface KnowledgeItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'email' | 'media' | 'other';
  brandPackId: string;
  brandPackName: string;
  fileSize: number;
  uploadDate: Date;
  url?: string;
  description?: string;
  tags?: string[];
}

const KNOWLEDGE_BASE_KEY = 'knowledge_base_items';

// 获取所有知识库项目
export const getKnowledgeItems = (): KnowledgeItem[] => {
  try {
    const itemsStr = localStorage.getItem(KNOWLEDGE_BASE_KEY);
    if (!itemsStr) {
      // 如果没有存储的数据，返回默认的Godiva邮件
      return getDefaultGodivaEmails();
    }
    const items = JSON.parse(itemsStr);
    // 将时间戳转换为Date对象
    return items.map((item: any) => ({
      ...item,
      uploadDate: new Date(item.uploadDate)
    }));
  } catch (error) {
    console.error('Failed to load knowledge items:', error);
    return getDefaultGodivaEmails();
  }
};

// 获取默认的Godiva邮件
const getDefaultGodivaEmails = (): KnowledgeItem[] => {
  return [
    {
      id: 'godiva-email-1',
      name: 'Godiva 2025方形朱古力系列 - 会员尊享预购邮件',
      type: 'email',
      brandPackId: '2',
      brandPackName: 'Godiva品牌包',
      fileSize: 45000,
      uploadDate: new Date('2025-06-01'),
      url: undefined,
      description: '高级会员专属预购邀请邮件，包含倒计时组件和产品亮点展示',
      tags: ['营销推广', '会员专享', '新品发布']
    },
    {
      id: 'godiva-email-2',
      name: 'GODIVA 歌帝梵立方巧克力系列新品预售邮件',
      type: 'email',
      brandPackId: '2',
      brandPackName: 'Godiva品牌包',
      fileSize: 38000,
      uploadDate: new Date('2025-08-15'),
      url: undefined,
      description: '新品预售邀请邮件，包含产品介绍和限时优惠信息',
      tags: ['新品预售', '限时优惠', '产品介绍']
    },
    {
      id: 'godiva-email-3',
      name: 'Godiva 节日祝福邮件模板',
      type: 'email',
      brandPackId: '2',
      brandPackName: 'Godiva品牌包',
      fileSize: 32000,
      uploadDate: new Date('2025-02-14'),
      url: undefined,
      description: '情人节节日祝福邮件，包含节日问候和特别优惠',
      tags: ['节日祝福', '客户关怀', '促销活动']
    }
  ];
};

// 根据品牌包ID获取知识库项目
export const getKnowledgeItemsByBrandPack = (brandPackId: string): KnowledgeItem[] => {
  const allItems = getKnowledgeItems();
  return allItems.filter(item => item.brandPackId === brandPackId);
};

// 保存知识库项目
export const saveKnowledgeItems = (items: KnowledgeItem[]): void => {
  try {
    localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save knowledge items:', error);
  }
};










