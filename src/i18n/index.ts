import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  'zh-TW': {
    translation: {
      login: '登入',
      email: '電子郵件',
      password: '密碼',
      captcha: '驗證碼',
      loginWithGoogle: '使用 Google 帳號登入',
      forgotPassword: '忘記密碼？',
      register: '註冊新帳號',
      noAccount: '還沒有帳號？',
      haveAccount: '已有帳號？',
      loginButton: '登入',
      registerButton: '註冊',
      emailRequired: '請輸入電子郵件',
      passwordRequired: '請輸入密碼',
      captchaRequired: '請輸入驗證碼',
      invalidEmail: '請輸入有效的電子郵件地址',
      invalidPassword: '密碼至少需要6個字符',
      loginSuccess: '登入成功！',
      loginError: '登入失敗，請檢查您的憑證',
      welcome: '歡迎使用',
      platformName: 'AI全渠道內容生成平台',
      platformDescription: '智能內容創作，多平台一鍵發布'
    }
  },
  'zh-CN': {
    translation: {
      login: '登录',
      email: '电子邮箱',
      password: '密码',
      captcha: '验证码',
      loginWithGoogle: '使用 Google 账号登录',
      forgotPassword: '忘记密码？',
      register: '注册新账号',
      noAccount: '还没有账号？',
      haveAccount: '已有账号？',
      loginButton: '登录',
      registerButton: '注册',
      emailRequired: '请输入电子邮箱',
      passwordRequired: '请输入密码',
      captchaRequired: '请输入验证码',
      invalidEmail: '请输入有效的电子邮箱地址',
      invalidPassword: '密码至少需要6个字符',
      loginSuccess: '登录成功！',
      loginError: '登录失败，请检查您的凭据',
      welcome: '欢迎使用',
      platformName: 'AI全渠道内容生成平台',
      platformDescription: '智能内容创作，多平台一键发布'
    }
  },
  'en': {
    translation: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      captcha: 'Captcha',
      loginWithGoogle: 'Login with Google',
      forgotPassword: 'Forgot Password?',
      register: 'Create Account',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      loginButton: 'Login',
      registerButton: 'Register',
      emailRequired: 'Please enter your email',
      passwordRequired: 'Please enter your password',
      captchaRequired: 'Please enter the captcha',
      invalidEmail: 'Please enter a valid email address',
      invalidPassword: 'Password must be at least 6 characters',
      loginSuccess: 'Login successful!',
      loginError: 'Login failed, please check your credentials',
      welcome: 'Welcome to',
      platformName: 'AI Omnichannel Content Generation Platform',
      platformDescription: 'Intelligent content creation, multi-platform one-click publishing'
    }
  },
  'ja': {
    translation: {
      login: 'ログイン',
      email: 'メールアドレス',
      password: 'パスワード',
      captcha: '認証コード',
      loginWithGoogle: 'Googleアカウントでログイン',
      forgotPassword: 'パスワードを忘れた？',
      register: 'アカウント作成',
      noAccount: 'アカウントをお持ちでない方',
      haveAccount: 'すでにアカウントをお持ちの方',
      loginButton: 'ログイン',
      registerButton: '登録',
      emailRequired: 'メールアドレスを入力してください',
      passwordRequired: 'パスワードを入力してください',
      captchaRequired: '認証コードを入力してください',
      invalidEmail: '有効なメールアドレスを入力してください',
      invalidPassword: 'パスワードは6文字以上で入力してください',
      loginSuccess: 'ログインに成功しました！',
      loginError: 'ログインに失敗しました。認証情報を確認してください',
      welcome: 'ようこそ',
      platformName: 'AI全チャネルコンテンツ生成プラットフォーム',
      platformDescription: 'インテリジェントなコンテンツ作成、マルチプラットフォームワンクリック配信'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
