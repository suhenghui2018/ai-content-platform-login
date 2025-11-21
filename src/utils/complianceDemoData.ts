import { ComplianceTask, ComplianceStats } from '../types/compliance';

// 生成随机ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 生成随机日期
const generateRandomDate = (): string => {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  return past.toISOString();
};

// 生成模拟合规检测任务数据
export const generateMockComplianceTasks = (): ComplianceTask[] => {
  const detectionTypes = ['email_compliance', 'regional_regulation', 'image_compliance', 'copyright_risk', 'custom'] as const;
  const riskLevels = ['high', 'medium', 'low', 'none'] as const;
  const statuses = ['pending', 'completed', 'failed'] as const;
  const contentTypes = ['text', 'image', 'html'] as const;
  const creators = ['张三', '李四', '王五', '赵六', '钱七'];
  
  const taskNames = [
    'GODIVA 2025立方古典力 会员抢先预售邮件',
    'GODIVA 歌蒂梵立方巧克力系列新产品预售广告',
    '促销活动横幅设计审核',
    '社交媒体宣传文案合规检查',
    '新品发布会演讲稿审核',
    '区域限定促销活动合规性',
    '产品包装图片版权检查',
    '品牌合作推广内容审核',
    '会员专属优惠信息邮件',
    '节日特别促销活动合规检查'
  ];
  
  const failureReasons = [
    '内容包含敏感词汇',
    '图片解析失败',
    '系统服务临时不可用',
    '内容格式不支持',
    '检测超时'
  ];
  
  return Array.from({ length: 20 }, (_, index) => {
    const type = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const riskLevel = status === 'completed' 
      ? riskLevels[Math.floor(Math.random() * riskLevels.length)] 
      : 'none';
      
    const contentPrefix = {
      email_compliance: '尊敬的会员，感谢您长期支持GODIVA...',
      regional_regulation: '根据当地法规要求，本促销活动仅限...',
      image_compliance: '[图片内容] GODIVA新品展示',
      copyright_risk: '本文案引用了部分市场研究数据...',
      custom: '自定义检测内容...'
    }[type];
    
    // 随机选择是否有关联内容包
    const hasContentPack = Math.random() > 0.3;
    const contentPackNames = [
      'GODIVA 2025春季新品系列',
      '会员专享优惠活动',
      '节日特别促销',
      '区域限定产品推广',
      '新品上市宣传活动'
    ];
    
    return {
      id: `task-${generateId()}`,
      name: taskNames[index % taskNames.length] + (index >= taskNames.length ? ` (${index + 1})` : ''),
      contentSummary: contentPrefix + '...内容摘要...',
      contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      detectionType: type,
      riskLevel,
      status,
      createdAt: generateRandomDate(),
      createdBy: creators[Math.floor(Math.random() * creators.length)],
      completedAt: status === 'completed' ? generateRandomDate() : undefined,
      failureReason: status === 'failed' ? failureReasons[Math.floor(Math.random() * failureReasons.length)] : undefined,
      fullContent: '这是完整的检测内容...',
      reportUrl: status === 'completed' ? `/compliance-report/${generateId()}` : undefined,
      contentPackId: hasContentPack ? `pack-${generateId()}` : undefined,
      contentPackName: hasContentPack ? contentPackNames[Math.floor(Math.random() * contentPackNames.length)] : undefined
    };
  });
};

// 生成模拟统计数据
export const generateMockComplianceStats = (): ComplianceStats => {
  return {
    todayDetectionCount: 48,
    pendingHighRisks: 7,
    riskDistribution: {
      high: 12,
      medium: 25,
      low: 38,
      none: 65
    },
    typeDistribution: {
      email_compliance: 45,
      regional_regulation: 28,
      image_compliance: 32,
      copyright_risk: 18,
      custom: 17
    }
  };
};

// 团队成员列表（用于创建人筛选）
export const teamMembers = [
  { id: 'user1', name: '张三' },
  { id: 'user2', name: '李四' },
  { id: 'user3', name: '王五' },
  { id: 'user4', name: '赵六' },
  { id: 'user5', name: '钱七' }
];