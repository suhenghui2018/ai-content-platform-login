# 更新代码到GitHub - 操作指南

## 当前状态
- ✅ 已修复logo路径问题
- ✅ 已修复路由basename配置
- ⚠️ 需要安装Xcode命令行工具才能使用Git

## 步骤1：确认Xcode命令行工具安装

如果还没有安装完成，请：

1. 打开终端（Terminal）
2. 运行：`xcode-select --install`
3. 等待安装完成（可能需要10-30分钟）

## 步骤2：更新代码到GitHub

安装完成后，在终端中执行以下命令：

```bash
# 进入项目目录
cd "/Users/suhenghui/Desktop/Mema demo_副本"

# 查看当前状态
git status

# 添加所有更改的文件
git add -A

# 提交更改（可以修改提交信息）
git commit -m "更新代码：修复logo路径和路由配置 - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到GitHub
git push origin main
```

## 或者使用自动脚本

我已经创建了 `push-to-github.sh` 脚本，安装完Xcode工具后可以直接运行：

```bash
cd "/Users/suhenghui/Desktop/Mema demo_副本"
./push-to-github.sh
```

## 本次更新的内容

1. **修复路由配置**：将Router的basename从`/ai-content-platform-login`改为`/Memacreate.ai/`，与Vite配置保持一致
2. **修复logo路径**：
   - `PlatformHome.tsx` 中的logo路径
   - `AIChatPage.tsx` 中的logo路径
   - `images.ts` 中的登录插图路径
3. **路径统一**：所有静态资源路径统一使用`/Memacreate.ai/`前缀

## 如果遇到问题

### 问题1：Git认证失败
如果推送时要求输入用户名和密码，你可能需要使用Personal Access Token：
1. 访问：https://github.com/settings/tokens
2. 生成新的token（选择`repo`权限）
3. 使用token作为密码

### 问题2：权限被拒绝
确保你有该仓库的写入权限：
- 仓库地址：https://github.com/suhenghui2018/ai-content-platform-login.git

### 问题3：分支名称不同
如果主分支不是`main`而是`master`，请使用：
```bash
git push origin master
```

## 验证更新

推送成功后，可以访问GitHub仓库查看：
https://github.com/suhenghui2018/ai-content-platform-login


