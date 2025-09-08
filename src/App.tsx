import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './i18n';
import LanguageSelector from './components/LanguageSelector';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfileSetupForm from './components/ProfileSetupForm';
import PlatformHome from './components/PlatformHome';
import UserManagementPanel from './components/UserManagementPanel';
import BrandPackCreatePage from './components/BrandPackCreatePage';
import { initializeDemoData } from './utils/demoData';
import TestCredentials from './components/TestCredentials';
import { images } from './assets/images';

// 登录页面组件
function LoginPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showUserPanel, setShowUserPanel] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/profile-setup');
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部控制栏 */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        <button
          onClick={() => setShowUserPanel(true)}
          className="px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          title="用戶管理"
        >
          👥 用戶管理
        </button>
        <LanguageSelector />
      </div>

      <div className="flex min-h-screen">
        {/* 左侧图片区域 */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-50 to-primary-100 items-center justify-center p-8">
          <div className="text-center">
            <img
              src={images.loginIllustration}
              alt="AI全渠道内容生成平台"
              className="max-w-md mx-auto mb-6 rounded-lg shadow-2xl"
            />
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary-700 mb-4">
                {t('welcome')}
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {t('platformName')}
              </h2>
              <p className="text-gray-600 text-lg">
                {t('platformDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* 右侧登录/注册区域 */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {mode === 'login' ? (
              <LoginForm onModeChange={setMode} onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onModeChange={setMode} onRegisterSuccess={handleRegisterSuccess} />
            )}
          </div>
        </div>

        {/* 移动端底部信息 */}
        <div className="lg:hidden bg-white border-t border-gray-200 p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('platformName')}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('platformDescription')}
          </p>
        </div>
      </div>

      {/* 用户管理面板 */}
      <UserManagementPanel 
        isOpen={showUserPanel} 
        onClose={() => setShowUserPanel(false)} 
      />

      {/* 测试凭据提示 */}
      <TestCredentials />
    </div>
  );
}

// 资料设置页面组件
function ProfileSetupPage() {
  const navigate = useNavigate();

  const handleProfileSetupComplete = () => {
    navigate('/dashboard');
  };

  return <ProfileSetupForm onComplete={handleProfileSetupComplete} />;
}

// 仪表板页面组件
function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return <PlatformHome onLogout={handleLogout} />;
}

function App() {
  // 初始化演示数据
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/brand-pack-create" element={<BrandPackCreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
