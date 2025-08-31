export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
}

// 默认账号
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'mema@radicasys.com',
    password: 'radica123',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-12-19T10:00:00.000Z'
  }
];

class UserService {
  private readonly STORAGE_KEY = 'ai_platform_users';

  constructor() {
    this.initializeUsers();
  }

  // 初始化用户数据
  private initializeUsers(): void {
    const existingUsers = this.getUsersFromStorage();
    if (existingUsers.length === 0) {
      this.saveUsersToStorage(DEFAULT_USERS);
    }
  }

  // 从本地存储获取用户
  private getUsersFromStorage(): User[] {
    try {
      const usersJson = localStorage.getItem(this.STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error reading users from storage:', error);
      return [];
    }
  }

  // 保存用户到本地存储
  private saveUsersToStorage(users: User[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  // 获取所有用户
  getUsers(): User[] {
    return this.getUsersFromStorage();
  }

  // 根据邮箱查找用户
  getUserByEmail(email: string): User | undefined {
    const users = this.getUsersFromStorage();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // 验证用户登录
  validateLogin(email: string, password: string): { success: boolean; user?: User; message: string } {
    const user = this.getUserByEmail(email);
    
    if (!user) {
      return { success: false, message: '用戶不存在' };
    }
    
    if (user.password !== password) {
      return { success: false, message: '密碼錯誤' };
    }

    // 更新最后登录时间
    this.updateLastLoginTime(user.id);
    
    return { success: true, user, message: '登入成功' };
  }

  // 注册新用户
  registerUser(email: string, password: string): { success: boolean; message: string } {
    // 检查邮箱是否已存在
    if (this.getUserByEmail(email)) {
      return { success: false, message: '該郵箱已被註冊' };
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date().toISOString()
    };

    const users = this.getUsersFromStorage();
    users.push(newUser);
    this.saveUsersToStorage(users);

    return { success: true, message: '註冊成功' };
  }

  // 更新最后登录时间
  private updateLastLoginTime(userId: string): void {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].lastLoginAt = new Date().toISOString();
      this.saveUsersToStorage(users);
    }
  }

  // 获取用户统计信息
  getUserStats(): { totalUsers: number; defaultUsers: number; registeredUsers: number } {
    const users = this.getUsersFromStorage();
    const defaultUsers = users.filter(user => 
      DEFAULT_USERS.some(defaultUser => defaultUser.email === user.email)
    ).length;
    
    return {
      totalUsers: users.length,
      defaultUsers,
      registeredUsers: users.length - defaultUsers
    };
  }

  // 清除所有用户数据（重置到默认状态）
  resetToDefault(): void {
    this.saveUsersToStorage(DEFAULT_USERS);
  }

  // 导出用户数据（用于调试）
  exportUsers(): string {
    return JSON.stringify(this.getUsersFromStorage(), null, 2);
  }
}

// 创建单例实例
export const userService = new UserService();
