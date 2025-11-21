# 🚀 快速部署到GitHub Pages指南

## 📋 前置准备

1. **安装Git**（如果还没有安装）
   - macOS: 通常已预装，或通过Xcode Command Line Tools安装
   - 检查是否已安装：`git --version`

2. **拥有GitHub账号**
   - 如果没有，请访问 [GitHub](https://github.com) 注册

## 🎯 部署步骤

### 步骤1: 在GitHub上创建新仓库

1. 登录GitHub，点击右上角 **"+"** → **"New repository"**
2. 填写仓库信息：
   - **Repository name**: `ai-content-platform-login`（或您喜欢的名称）
   - **Description**: `AI全渠道内容生成平台`
   - **Visibility**: 选择 **Public**（GitHub Pages免费版需要公开仓库）
   - **不要勾选** "Add a README file"、"Add .gitignore"、"Choose a license"
3. 点击 **"Create repository"**

### 步骤2: 初始化本地Git仓库并推送代码

在项目根目录执行以下命令：

```bash
# 进入项目目录
cd "/Users/suhenghui/Desktop/Mema demo_副本"

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: AI content platform"

# 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-content-platform-login.git

# 重命名分支为main（如果GitHub使用main作为默认分支）
git branch -M main

# 推送代码到GitHub
git push -u origin main
```

**注意**: 首次推送可能需要输入GitHub用户名和密码（或Personal Access Token）

### 步骤3: 启用GitHub Pages

1. 在GitHub仓库页面，点击 **"Settings"** 标签
2. 在左侧菜单中找到 **"Pages"**
3. 在 **"Source"** 部分：
   - 选择 **"GitHub Actions"**
4. 保存设置（无需其他操作）

### 步骤4: 等待自动部署

1. 推送代码后，GitHub Actions会自动开始构建和部署
2. 在仓库页面点击 **"Actions"** 标签可以查看部署进度
3. 部署通常需要2-5分钟

### 步骤5: 访问您的网站

部署成功后，您的网站将在以下地址可用：
```
https://YOUR_USERNAME.github.io/ai-content-platform-login/
```

**注意**: 
- 首次部署可能需要等待几分钟
- 如果仓库名称不是 `ai-content-platform-login`，请相应修改URL

## 🔄 更新网站

以后每次更新代码后，只需：

```bash
git add .
git commit -m "更新描述"
git push
```

GitHub Actions会自动重新构建和部署！

## ❓ 常见问题

### Q: 部署后页面显示404？
A: 
- 检查GitHub Actions是否成功完成
- 确认仓库Settings → Pages中Source设置为"GitHub Actions"
- 等待5-10分钟后再次访问

### Q: 页面显示但样式/图片不显示？
A: 
- 检查浏览器控制台是否有404错误
- 确认`vite.config.ts`中的`base`路径与仓库名称匹配

### Q: 如何修改仓库名称？
A: 
- 在GitHub仓库Settings → General → Repository name中修改
- 同时需要修改`vite.config.ts`中的`base`路径
- 重新推送代码

### Q: 需要输入GitHub密码但忘记了？
A: 
- 使用Personal Access Token代替密码
- 在GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)创建新token
- 权限选择`repo`即可

## 🎉 完成！

恭喜！您的项目已成功部署到GitHub Pages！


