import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// 用户接口定义
interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profileSetupComplete: boolean;
}

// 认证上下文接口
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储中的用户数据
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 检查是否为演示用户（支持用户名或邮箱）
      if ((username === 'demo' || username === 'demo@example.com') && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user-1',
          username: 'demo',
          email: 'demo@example.com',
          role: 'admin',
          profileSetupComplete: true
        };
        
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true, message: '登录成功！欢迎使用演示账户。' };
      }
      
      // 检查是否为测试用户（支持用户名或邮箱）
      if ((username === 'test' || username === 'test@example.com') && password === 'test123') {
        const testUser: User = {
          id: 'test-user-1',
          username: 'test',
          email: 'test@example.com',
          role: 'user',
          profileSetupComplete: false
        };
        
        setUser(testUser);
        localStorage.setItem('user', JSON.stringify(testUser));
        setIsLoading(false);
        return { success: true, message: '登录成功！请完善您的资料。' };
      }
      
      // 检查是否为Mema测试用户
      if (username === 'mema@radicasys.com' && password === 'mema123') {
        const memaUser: User = {
          id: 'mema-user-1',
          username: 'mema',
          email: 'mema@radicasys.com',
          role: 'admin',
          profileSetupComplete: true
        };
        
        setUser(memaUser);
        localStorage.setItem('user', JSON.stringify(memaUser));
        setIsLoading(false);
        return { success: true, message: '登录成功！欢迎使用Mema测试账户。' };
      }
      
      // 其他情况，检查本地存储的用户数据（支持用户名或邮箱匹配）
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const foundUser = users.find((u: any) => 
          (u.username === username || u.email === username) && u.password === password
        );
        
        if (foundUser) {
          const userData: User = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role || 'user',
            profileSetupComplete: foundUser.profileSetupComplete || false
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setIsLoading(false);
          return { success: true, message: '登录成功！' };
        }
      }
      
      setIsLoading(false);
      return { success: false, message: '用户名或密码错误，请重试。' };
    } catch (error) {
      console.error('登录失败:', error);
      setIsLoading(false);
      return { success: false, message: '登录过程中发生错误，请稍后重试。' };
    }
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用认证上下文的钩子
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}
