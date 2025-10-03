import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LanguageSelector from './components/LanguageSelector';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfileSetupForm from './components/ProfileSetupForm';
import PlatformHome from './components/PlatformHome';
import UserManagementPanel from './components/UserManagementPanel';
import BrandPackCreatePage from './components/BrandPackCreatePage';
import ContentCreationPage from './components/ContentCreationPage';
import AppNavigationPage from './components/AppNavigationPage';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeDemoData } from './utils/demoData';
import TestCredentials from './components/TestCredentials';
import { images } from './assets/images';
import { setContentPacks } from './utils/contentPackData';
import { setBrandPacks } from './utils/brandPackData';

// 登录页面组件
function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showUserPanel, setShowUserPanel] = useState(false);
  const navigate = useNavigate();

  // 如果已经登录，重定向到仪表板
  useEffect(() => {
    if (isAuthenticated) {
      console.log('LoginPage: 用户已登录，重定向到仪表板');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    navigate('/profile-setup');
  };

  const handleLoginSuccess = () => {
    console.log('handleLoginSuccess被调用，准备跳转到/dashboard');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部控制栏 */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        <button
          onClick={() => setShowUserPanel(true)}
          className="px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          title={t('userManagementPanel')}
        >
          👥 {t('userManagementPanel')}
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
              <LoginForm onModeChange={setMode} onLoginSuccess={handleLoginSuccess} login={login} />
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

  console.log('DashboardPage组件被渲染');
  return <PlatformHome onLogout={handleLogout} />;
}

function App() {
  const { t, i18n } = useTranslation();

  // 初始化演示数据
  useEffect(() => {
    initializeDemoData();
    // 初始化多语言数据
    setBrandPacks(t);
    setContentPacks(t);
  }, []);

  // 监听语言变化
  useEffect(() => {
    // 直接使用i18n.t而不是依赖于外部的t函数
    const updateLanguageData = () => {
      setBrandPacks(i18n.t.bind(i18n));
      setContentPacks(i18n.t.bind(i18n));
      console.log(`语言已切换至: ${i18n.language}, 已更新所有数据`);
    };

    // 监听语言变化事件
    i18n.on('languageChanged', updateLanguageData);
    
    // 清理函数
    return () => {
      i18n.off('languageChanged', updateLanguageData);
    };
  }, [i18n]);

  // 修复初始数据加载，确保使用正确的翻译函数
  useEffect(() => {
    initializeDemoData();
    // 初始化多语言数据
    setBrandPacks(i18n.t.bind(i18n));
    setContentPacks(i18n.t.bind(i18n));
  }, [i18n]);

  return (
    <AuthProvider>
      <Router basename="/ai-content-platform-login">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/brand-pack-create" element={<ProtectedRoute><BrandPackCreatePage /></ProtectedRoute>} />
          <Route path="/content-creation/:contentPackId" element={<ProtectedRoute><ContentCreationPage /></ProtectedRoute>} />
          <Route path="/apps" element={<ProtectedRoute><AppNavigationPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
