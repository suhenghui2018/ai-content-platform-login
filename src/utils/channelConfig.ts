// 渠道配置工具函数

export interface ChannelAccount {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status: 'connected' | 'disconnected';
}

export interface ChannelInfo {
  id: string;
  name: string;
  icon?: string | React.ReactNode;
  iconImage?: string;
  accounts: ChannelAccount[];
}

// 获取已绑定的账号数据（模拟数据，实际应该从API或状态管理获取）
export const getChannelAccounts = (): Record<string, ChannelAccount[]> => {
  // 模拟已绑定的账号数据
  // 实际应用中，这应该从全局状态管理（如Redux、Context）或API获取
  const channelAccounts: Record<string, ChannelAccount[]> = {
    'radica': [
      { id: '1', name: 'Radica Account 1', email: 'account1@radica.com', status: 'connected' },
      { id: '2', name: 'Radica Account 2', email: 'account2@radica.com', status: 'connected' }
    ],
    'braze': [
      { id: '1', name: 'Braze Account 1', email: 'account1@braze.com', status: 'connected' }
    ],
    'facebook': [],
    'instagram': [],
    'hubspot': [],
    'xiaohongshu': [],
    // 添加email渠道（如果存在）
    'email': []
  };
  
  return channelAccounts;
};

// 获取已绑定账号的渠道ID列表
export const getBoundChannelIds = (): string[] => {
  const channelAccounts = getChannelAccounts();
  return Object.keys(channelAccounts).filter(channelId => {
    const accounts = channelAccounts[channelId] || [];
    // 至少有一个已连接的账号
    return accounts.some(account => account.status === 'connected');
  });
};

// 渠道ID映射（渠道配置中的ID -> 内容生成中的ID）
const channelIdMapping: Record<string, string> = {
  'radica': 'email', // Radica可能对应Email渠道
  'braze': 'email', // Braze也可能对应Email渠道
  'facebook': 'facebook',
  'instagram': 'instagram',
  'xiaohongshu': 'xiaohongshu',
  'hubspot': 'email', // HubSpot可能对应Email渠道
};

// 获取已绑定账号的渠道列表（用于同步弹窗显示）
export const getBoundChannelsForSync = (t?: (key: string) => string): Array<{ id: string; name: string; icon: string; iconImage?: string }> => {
  const boundChannelIds = getBoundChannelIds();
  const channelAccounts = getChannelAccounts();
  
  // 渠道显示配置
  const channelDisplayConfig: Record<string, { name: string; icon: string; iconImage?: string; contentId?: string }> = {
    'radica': { name: t ? t('radica') : 'Radica', icon: '📧', iconImage: '/ai-content-platform-login/Image831/logo/radica.png', contentId: 'email' },
    'braze': { name: t ? t('braze') : 'Braze', icon: '📧', contentId: 'email' },
    'facebook': { name: t ? t('facebook') : 'Facebook', icon: '👍', contentId: 'facebook' },
    'instagram': { name: t ? t('instagram') : 'Instagram', icon: '📷', contentId: 'instagram' },
    'xiaohongshu': { name: t ? t('xiaohongshu') : '小红书', icon: '📕', contentId: 'xiaohongshu' },
    'hubspot': { name: t ? t('hubspot') : 'HubSpot', icon: '📧', contentId: 'email' },
    'email': { name: 'Email', icon: '📧', contentId: 'email' }
  };
  
  // 去重：如果多个渠道映射到同一个contentId，只显示一个
  const seenContentIds = new Set<string>();
  const result: Array<{ id: string; name: string; icon: string; iconImage?: string }> = [];
  
  boundChannelIds.forEach(channelId => {
    const config = channelDisplayConfig[channelId];
    if (config) {
      const contentId = config.contentId || channelId;
      if (!seenContentIds.has(contentId)) {
        seenContentIds.add(contentId);
        result.push({
          id: contentId,
          name: config.name,
          icon: config.icon,
          iconImage: config.iconImage
        });
      }
    }
  });
  
  return result;
};

