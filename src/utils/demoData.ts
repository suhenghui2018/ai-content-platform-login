import { userService } from '../services/userService';

// 初始化演示数据
export const initializeDemoData = () => {
  // 检查是否已经初始化过
  const isInitialized = localStorage.getItem('ai_platform_demo_initialized');
  
  if (!isInitialized) {
    console.log('初始化演示数据...');
    
    // 确保默认用户存在
    userService.resetToDefault();
    
    // 标记为已初始化
    localStorage.setItem('ai_platform_demo_initialized', 'true');
    
    console.log('演示数据初始化完成！');
    console.log('默认账号: mema@radicasys.com / radica123');
  }
};

// 清除所有演示数据
export const clearDemoData = () => {
  localStorage.removeItem('ai_platform_users');
  localStorage.removeItem('ai_platform_demo_initialized');
  console.log('演示数据已清除');
};

// 获取演示数据状态
export const getDemoDataStatus = () => {
  const users = userService.getUsers();
  const stats = userService.getUserStats();
  
  return {
    isInitialized: !!localStorage.getItem('ai_platform_demo_initialized'),
    totalUsers: stats.totalUsers,
    defaultUsers: stats.defaultUsers,
    registeredUsers: stats.registeredUsers,
    users: users
  };
};
