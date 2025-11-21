# GitHub Desktop 使用指南

## 快速步骤

### 1. 添加本地仓库
1. 打开 GitHub Desktop
2. 点击菜单栏 "File" > "Add Local Repository"
3. 点击 "Choose..." 按钮
4. 选择项目目录：`/Users/suhenghui/Desktop/Mema demo_副本`
5. 点击 "Add repository"

### 2. 查看更改
- 左侧会显示所有修改的文件
- 点击文件名可以查看具体更改内容

### 3. 提交更改
1. 在左下角的 "Summary" 输入框中填写提交信息：
   ```
   更新代码：修复logo路径和路由配置
   ```
2. （可选）在 "Description" 中添加详细说明
3. 点击 "Commit to main" 按钮

### 4. 推送到GitHub
1. 点击右上角的 "Push origin" 按钮
2. 等待推送完成

## 本次更新的文件

以下文件已被修改，会在GitHub Desktop中显示：

1. **src/App.tsx** - 修复Router basename配置
2. **src/components/PlatformHome.tsx** - 修复logo路径
3. **src/components/AIChatPage.tsx** - 修复logo路径
4. **src/assets/images.ts** - 修复登录插图路径

## 如果遇到问题

### 问题1：找不到仓库
- 确保选择的是项目根目录（包含 `.git` 文件夹的目录）

### 问题2：推送失败
- 检查网络连接
- 确认已登录GitHub账号
- 确认有仓库的写入权限

### 问题3：显示"no changes"
- 尝试点击 "Repository" > "Show in Finder" 确认目录正确
- 或者关闭并重新添加仓库

## 完成后的验证

推送成功后，可以访问GitHub查看：
https://github.com/suhenghui2018/ai-content-platform-login

