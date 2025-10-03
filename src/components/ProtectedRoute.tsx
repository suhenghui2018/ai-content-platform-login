import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 受保护路由组件的属性接口
interface ProtectedRouteProps {
  children: ReactNode;
  requireProfileSetup?: boolean; // 是否需要完成资料设置
}

// 受保护路由组件
export default function ProtectedRoute({ 
  children, 
  requireProfileSetup = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果用户未认证，重定向到登录页面
  if (!isAuthenticated) {
    console.log('ProtectedRoute: 用户未认证，重定向到登录页面');
    return <Navigate to="/" replace />;
  }

  // 如果需要完成资料设置但用户未完成，重定向到资料设置页面
  if (requireProfileSetup && user && !user.profileSetupComplete) {
    console.log('ProtectedRoute: 需要完成资料设置，重定向到资料设置页面');
    return <Navigate to="/profile-setup" replace />;
  }

  // 用户已认证且满足所有条件，渲染子组件
  console.log('ProtectedRoute: 用户已认证，渲染受保护的内容');
  return <>{children}</>;
}






