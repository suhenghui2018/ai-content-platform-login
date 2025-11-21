# AI全渠道内容生成平台登录页面

这是一个现代化的AI全渠道内容生成平台登录页面demo，使用React + TypeScript + Tailwind CSS构建。

## 功能特性

- 🎨 美观的现代化UI设计
- 🌍 多语言支持（繁体中文、简体中文、英文、日文）
- 📱 响应式设计，支持移动端和桌面端
- 🔐 完整的登录/注册表单
- 🔒 表单验证和错误处理
- 🌐 Google账号授权登录（待实现）
- 🖼️ 左侧产品展示图片
- 🎯 验证码功能
- 👥 用户管理系统
- 🧪 默认测试账号
- 💾 本地数据存储

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **国际化**: react-i18next
- **状态管理**: React Hooks

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── LanguageSelector.tsx    # 语言选择器
│   ├── LoginForm.tsx          # 登录表单
│   └── RegisterForm.tsx       # 注册表单
├── i18n/               # 国际化配置
│   └── index.ts       # 语言包和配置
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式

public/
└── Image831/          # 静态资源
    └── 全渠道平台登录页插画设计.png
```

## 语言支持

- 🇹🇼 繁體中文 (默认)
- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語

## 自定义配置

### 修改主题色彩

在 `tailwind.config.js` 中修改 `primary` 颜色值：

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### 添加新语言

在 `src/i18n/index.ts` 中添加新的语言包：

```typescript
'new-lang': {
  translation: {
    // 翻译内容
  }
}
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

- 验证码目前是静态的 "1234"，实际项目中需要集成真实的验证码服务
- Google登录功能需要配置OAuth 2.0，目前只是UI展示
- 表单提交已集成本地用户服务，支持真实的登录/注册功能
- 默认测试账号：mema@radicasys.com / radica123
- 用户数据存储在浏览器本地存储中，刷新页面数据不会丢失
- 支持用户管理、数据导出、重置等功能

## 部署

### 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署。只需要：

1. 将代码推送到 GitHub 仓库
2. 在仓库 Settings → Pages 中启用 GitHub Actions
3. 访问 `https://YOUR_USERNAME.github.io/ai-content-platform-login/`

详细部署说明请查看 [DEPLOY_TO_GITHUB.md](./DEPLOY_TO_GITHUB.md)

## 许可证

MIT License
