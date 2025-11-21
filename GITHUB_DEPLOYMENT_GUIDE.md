# GitHub 部署指南

由于当前环境限制（缺少完整的git工具链和GitHub访问权限），以下是在您的本地环境中部署项目到GitHub Pages的详细步骤：

## 前提条件

1. 已安装 Node.js 和 npm
2. 已安装 Git
3. 拥有 GitHub 账号

## 部署步骤

### 1. 在 GitHub 上创建新仓库

1. 登录您的 GitHub 账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库名称（建议使用：`ai-content-platform-login`）
4. 设置为公开或私有仓库
5. 点击 "Create repository"

### 2. 配置本地项目

在项目根目录执行以下命令：

```bash
# 初始化 git 仓库
git init

# 添加远程仓库（替换为您的 GitHub 仓库 URL）
git remote add origin https://github.com/您的用户名/ai-content-platform-login.git

# 配置 git 用户信息
git config user.name "您的用户名"
git config user.email "您的邮箱"
```

### 3. 构建项目

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

### 4. 部署到 GitHub Pages

```bash
# 使用 gh-pages 部署
npm run deploy
```

## 5. 访问在线预览

部署成功后，您可以通过以下 URL 访问您的项目：
`https://您的用户名.github.io/ai-content-platform-login/`

## 注意事项

1. 首次部署可能需要几分钟时间来生效
2. 如果页面显示空白，请检查浏览器控制台是否有错误
3. 您可以在 GitHub 仓库的 "Settings" > "Pages" 页面查看部署状态

## 项目已准备就绪

您的项目已成功构建到 `dist` 目录，包含了所有需要部署的文件。按照上述步骤，您可以轻松将其部署到 GitHub Pages 获取在线预览链接。