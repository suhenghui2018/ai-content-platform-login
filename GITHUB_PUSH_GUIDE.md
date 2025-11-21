# 推送到GitHub指南

## 问题说明
当前系统缺少Xcode命令行工具，需要先安装才能使用Git命令。

## 解决方案

### 方法1：安装Xcode命令行工具（推荐）

1. **安装命令行工具**：
   - 打开终端（Terminal）
   - 运行命令：`xcode-select --install`
   - 按照提示完成安装（可能需要几分钟）

2. **安装完成后，运行推送脚本**：
   ```bash
   cd "/Users/suhenghui/Desktop/Mema demo_副本"
   ./push-to-github.sh
   ```

### 方法2：手动执行Git命令

安装Xcode命令行工具后，在终端中依次执行：

```bash
cd "/Users/suhenghui/Desktop/Mema demo_副本"

# 查看状态
git status

# 添加所有更改
git add -A

# 提交更改（请修改提交信息）
git commit -m "更新代码 - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到GitHub
git push origin main
```

## 当前仓库信息
- **远程仓库**: https://github.com/suhenghui2018/ai-content-platform-login.git
- **主分支**: main

## 注意事项
- 如果这是第一次推送，可能需要输入GitHub用户名和密码（或使用Personal Access Token）
- 确保你有该仓库的写入权限
- 推送前建议先查看 `git status` 确认要提交的文件

