# 🚀 快速部署指南 - 获取在线预览链接

## 方法一：Vercel 部署（最简单，推荐）⚡

### 步骤 1：构建项目

```bash
cd "/Users/suhenghui/Desktop/Mema demo_副本"
PATH="./node-v18.18.0-darwin-x64/bin:$PATH" npm run build
```

### 步骤 2：访问 Vercel

1. 打开浏览器，访问：**https://vercel.com**
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. 选择使用 **GitHub** 账号登录（如果没有账号，可以先用邮箱注册）

### 步骤 3：部署项目

**方式 A：直接拖拽部署（最简单）**

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 点击 **"Continue with GitHub"** 或直接拖拽 `dist` 文件夹到页面
3. 如果使用 GitHub：
   - 选择仓库或点击 **"Import Git Repository"**
   - 在输入框粘贴项目路径：`/Users/suhenghui/Desktop/Mema demo_副本`
   - 点击 **"Import"**

**方式 B：通过 Vercel CLI（命令行）**

```bash
# 安装 Vercel CLI
PATH="./node-v18.18.0-darwin-x64/bin:$PATH" npm i -g vercel

# 登录 Vercel
vercel login

# 进入项目目录并部署
cd "/Users/suhenghui/Desktop/Mema demo_副本"
vercel --prod
```

### 步骤 4：配置项目（如果提示）

- **Framework Preset**: 选择 `Vite` 或 `Other`
- **Root Directory**: 保持默认或填写 `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 步骤 5：获得预览链接 ✅

部署完成后，Vercel 会自动提供：
- **生产环境链接**：`https://your-project-name.vercel.app`
- **预览链接**：每次提交都会生成新的预览链接

**🎉 完成！** 您可以直接访问链接查看网站了！

---

## 方法二：GitHub Pages 部署

### 步骤 1：上传到 GitHub

1. 打开 **GitHub Desktop**（如果已安装）
2. 或者访问 **https://github.com/new** 创建新仓库

### 步骤 2：配置 GitHub Pages

1. 在仓库页面，点击 **Settings** 标签
2. 找到 **Pages** 选项（左侧菜单）
3. 在 **Source** 部分：
   - 选择 **"GitHub Actions"**
   - 或选择 **"main"** 分支，目录选择 **"/root"**

### 步骤 3：访问网站

部署完成后访问：
```
https://YOUR_USERNAME.github.io/ai-content-platform-login/
```

---

## 方法三：Netlify 部署

### 步骤 1：访问 Netlify

1. 打开浏览器，访问：**https://app.netlify.com**
2. 使用 GitHub 账号登录

### 步骤 2：部署项目

1. 点击 **"Add new site"** → **"Import an existing project"**
2. 选择 **"Deploy manually"** 或连接 GitHub 仓库
3. 如果手动部署：
   - 将 `dist` 文件夹拖拽到页面
   - 或使用命令行：`netlify deploy --prod --dir=dist`

### 步骤 3：获得链接

Netlify 会自动生成：`https://random-name.netlify.app`

---

## 🔧 部署前检查

确保已完成以下步骤：

1. **构建成功**
   ```bash
   PATH="./node-v18.18.0-darwin-x64/bin:$PATH" npm run build
   ```

2. **检查 dist 目录**
   ```bash
   ls -la dist/
   ```
   应该包含：`index.html`、`assets/`、`Image831/` 等

3. **本地预览测试**
   ```bash
   PATH="./node-v18.18.0-darwin-x64/bin:$PATH" npm run preview
   ```
   访问 http://localhost:4173/ai-content-platform-login/ 测试

---

## 📝 推荐顺序

1. **首选**：Vercel（最简单，5分钟完成）
2. **备选**：Netlify（功能丰富）
3. **长期**：GitHub Pages（适合持续集成）

---

## ❓ 常见问题

### Q: 部署后显示 404？
A: 检查 `vite.config.ts` 中的 `base` 路径是否正确（当前是 `/ai-content-platform-login/`）

### Q: 图片无法显示？
A: 确认 `dist/Image831/` 目录下的所有图片都已正确上传

### Q: 构建失败？
A: 检查是否有 TypeScript 错误，可以先修复错误再部署

---

## 🎉 部署成功后的链接格式

- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`  
- **GitHub Pages**: `https://your-username.github.io/ai-content-platform-login/`

部署完成后，您就可以将链接分享给其他人访问了！🚀




