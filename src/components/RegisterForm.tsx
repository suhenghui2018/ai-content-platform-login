import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/userService';

interface RegisterFormProps {
  onModeChange: (mode: 'login' | 'register') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onModeChange }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '密碼確認不匹配';
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
    
    // 使用用户服务注册新用户
    try {
      const result = userService.registerUser(formData.email, formData.password);
      
      if (result.success) {
        alert(result.message);
        onModeChange('login');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('註冊失敗，請稍後再試');
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('register')}</h1>
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
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            確認密碼
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
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
              註冊中...
            </div>
          ) : (
            t('registerButton')
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {t('haveAccount')} {t('login')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
