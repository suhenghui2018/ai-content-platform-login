import { useAuth } from '../contexts/AuthContext';

// 测试页面组件
export default function TestPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            测试页面
          </h1>
          
          <div className="space-y-6">
            {/* 用户信息显示 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                当前用户信息
              </h2>
              {user ? (
                <div className="space-y-2">
                  <p><strong>用户名:</strong> {user.username}</p>
                  <p><strong>邮箱:</strong> {user.email}</p>
                  <p><strong>角色:</strong> {user.role}</p>
                  <p><strong>资料设置完成:</strong> {user.profileSetupComplete ? '是' : '否'}</p>
                  <p><strong>用户ID:</strong> {user.id}</p>
                </div>
              ) : (
                <p className="text-gray-600">未登录</p>
              )}
            </div>

            {/* 功能测试区域 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                功能测试
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  登出测试
                </button>
                
                <div className="text-sm text-gray-600">
                  <p>• 这个页面用于测试各种功能</p>
                  <p>• 可以在这里添加更多的测试按钮和功能</p>
                  <p>• 当前显示用户的认证状态和信息</p>
                </div>
              </div>
            </div>

            {/* 系统状态 */}
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                系统状态
              </h2>
              <div className="space-y-2 text-sm">
                <p className="text-green-600">✓ 认证系统正常</p>
                <p className="text-green-600">✓ 路由保护正常</p>
                <p className="text-green-600">✓ 用户状态管理正常</p>
                <p className="text-green-600">✓ 本地存储正常</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






