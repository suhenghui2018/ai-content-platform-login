#!/bin/bash

# 推送到GitHub的脚本
# 使用方法：在终端运行 ./push-to-github.sh

cd "$(dirname "$0")"

echo "=========================================="
echo "🚀 开始更新代码到GitHub"
echo "=========================================="
echo ""

# 检查Git是否可用
if ! command -v git &> /dev/null; then
    echo "❌ 错误：Git命令不可用"
    echo "请先安装Xcode命令行工具："
    echo "  运行命令: xcode-select --install"
    exit 1
fi

echo "📦 检查Git状态..."
git status

echo ""
echo "📝 添加所有更改的文件..."
git add -A

echo ""
echo "💾 提交更改..."
read -p "请输入提交信息（直接回车使用默认信息）: " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="更新代码：修复logo路径和路由配置 - $(date '+%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$commit_msg"

echo ""
echo "🚀 推送到GitHub..."
if git push origin main; then
    echo ""
    echo "=========================================="
    echo "✅ 完成！代码已成功推送到GitHub"
    echo "=========================================="
    echo "仓库地址: https://github.com/suhenghui2018/ai-content-platform-login.git"
    echo ""
    echo "本次更新内容："
    echo "  - 修复Router basename配置"
    echo "  - 修复logo路径（PlatformHome和AIChatPage）"
    echo "  - 修复登录插图路径"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "  1. 网络连接是否正常"
    echo "  2. GitHub认证是否有效"
    echo "  3. 是否有仓库写入权限"
    exit 1
fi

