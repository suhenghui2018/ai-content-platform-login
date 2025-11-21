# 🚀 自动部署指南 - 获取在线预览链接

## ✅ 已为您准备就绪

您的项目已经构建完成，所有文件都已准备好！`dist` 文件夹包含所有需要部署的静态文件。

---

## 🎯 最简单的方式：Vercel（3分钟完成）

### 方法 1：拖拽部署（最快）

1. **访问 Vercel**
   - 打开浏览器，访问：https://vercel.com/new
   - 使用 GitHub 账号登录（如果没有账号，先用邮箱注册）

2. **部署项目**
   - 在页面上找到 **"Deploy"** 按钮
   - 将整个 `dist` 文件夹拖拽到页面
   - 等待上传完成

3. **获得链接** ✅
   - 上传完成后，Vercel 会自动部署
   - 约 30 秒后，您会看到部署成功
   - **您的预览链接**：`https://your-project-name.vercel.app`

### 方法 2：连接 GitHub 仓库（推荐长期使用）

1. **访问 Vercel**
   - 打开：https://vercel.com/new
   - 登录账号

2. **导入项目**
   - 点击 **"Import Git Repository"**
   - 连接到您的 GitHub 账号
   - 选择仓库或创建新仓库

3. **配置项目**（自动检测，通常不需要修改）
   - Framework Preset: `Vite`
   - Build Command: `npm run build:skip-check`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **点击 "Deploy"**
   - 等待部署完成（约 1-2 分钟）

5. **获得链接** ✅
   - 部署完成后，Vercel 会自动提供预览链接
   - 链接格式：`https://your-project-name.vercel.app`
   - 每次推送代码，会自动重新部署！

---

## 🌐 方式二：Netlify（也很简单）

### 拖拽部署

1. **访问 Netlify Drop**
   - 打开：https://app.netlify.com/drop
   - 无需登录即可使用

2. **上传文件**
   - 将 `dist` 文件夹拖拽到页面
   - 等待上传和部署完成

3. **获得链接** ✅
   - 部署完成后，Netlify 会自动生成预览链接
   - 链接格式：`https://random-name.netlify.app`

---

## 📦 方式三：GitHub Pages

### 如果您的代码已经在 GitHub

1. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 **Settings**
   - 找到 **Pages**（左侧菜单）
   - 在 **Source** 部分，选择 **"GitHub Actions"**

2. **访问网站**
   - 部署完成后访问：`https://your-username.github.io/ai-content-platform-login/`

---

## 🛠️ 自动部署脚本

我已经为您创建了一个自动化脚本，运行：

```bash
cd "/Users/suhenghui/Desktop/Mema demo_副本"
bash auto-deploy.sh
```

这个脚本会：
1. ✅ 自动检查项目状态
2. ✅ 重新构建项目（如果需要）
3. ✅ 显示部署文件列表
4. ✅ 提供详细的部署步骤
5. ✅ 可选：自动打开浏览器

---

## 📍 项目信息

- **项目路径**: `/Users/suhenghui/Desktop/Mema demo_副本`
- **构建目录**: `dist/`
- **Base 路径**: `/ai-content-platform-login/`

---

## ⚡ 快速命令

如果您想快速部署，可以：

1. **打开 Vercel**（推荐）
   ```bash
   open https://vercel.com/new
   ```
   然后将 `dist` 文件夹拖进去

2. **或使用脚本**
   ```bash
   cd "/Users/suhenghui/Desktop/Mema demo_副本"
   bash auto-deploy.sh
   ```

---

## 🎉 部署完成后

部署成功后，您将获得：
- ✅ 可公开访问的 HTTPS 链接
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS 证书
- ✅ 响应式移动端支持

---

## ❓ 常见问题

### Q: 部署后显示 404？
A: 确保访问时包含 base 路径：`https://your-link.vercel.app/ai-content-platform-login/`

### Q: 图片无法显示？
A: 确认 `dist/Image831/` 目录下的所有图片都已上传

### Q: 需要更新部署？
A: 重新运行构建，然后重新上传 `dist` 文件夹或推送到 GitHub

---

## 🎊 开始部署吧！

最简单的方式就是：
1. 打开 https://vercel.com/new
2. 登录账号
3. 拖拽 `dist` 文件夹
4. 等待 30 秒
5. 获得预览链接！🚀



