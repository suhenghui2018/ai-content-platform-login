import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/userService';

interface LoginFormProps {
  onModeChange: (mode: 'login' | 'register') => void;
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onModeChange, onLoginSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('invalidPassword');
    }

    if (!formData.captcha) {
      newErrors.captcha = t('captchaRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // 使用用户服务验证登录
    try {
      const result = userService.validateLogin(formData.email, formData.password);
      
      if (result.success) {
        alert(result.message);
        // 登录成功后跳转到平台
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoogleLogin = () => {
    // 这里可以添加Google OAuth登录逻辑
    alert('Google登录功能待实现');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login')}</h1>
        <p className="text-gray-600">{t('platformDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`input-field ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
            {t('captcha')}
          </label>
          <div className="flex space-x-3">
            <input
              id="captcha"
              type="text"
              value={formData.captcha}
              onChange={(e) => handleInputChange('captcha', e.target.value)}
              className={`input-field flex-1 ${errors.captcha ? 'border-red-500' : ''}`}
              placeholder="1234"
            />
            <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-mono text-lg cursor-pointer hover:bg-gray-300 transition-colors">
              1234
            </div>
          </div>
          {errors.captcha && <p className="mt-1 text-sm text-red-600">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('login')}...
            </div>
          ) : (
            t('loginButton')
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">{t('loginWithGoogle')}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Google</span>
        </button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => onModeChange('register')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {t('noAccount')} {t('register')}
          </button>
          <div>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              {t('forgotPassword')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
