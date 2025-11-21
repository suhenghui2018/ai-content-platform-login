#!/bin/bash

# 部署准备脚本
# 这个脚本会准备所有需要部署的文件

echo "🚀 开始准备部署..."

# 检查 Git
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    echo "   安装方法：在终端运行: xcode-select --install"
    exit 1
fi

# 检查是否已初始化 Git 仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git branch -M main
fi

# 添加所有文件
echo "📝 添加文件到 Git..."
git add .

# 检查是否有未提交的更改
if git diff --cached --quiet; then
    echo "✅ 所有文件已提交，无需重新提交"
else
    echo "💾 创建提交..."
    git commit -m "Deploy: AI全渠道内容生成平台 - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ 提交完成"
fi

# 检查远程仓库
echo ""
echo "📡 检查远程仓库配置..."
if git remote | grep -q origin; then
    echo "✅ 已配置远程仓库:"
    git remote -v
else
    echo "⚠️  尚未配置远程仓库"
    echo ""
    echo "请按以下步骤操作："
    echo "1. 在 GitHub 上创建新仓库"
    echo "2. 运行以下命令添加远程仓库："
    echo "   git remote add origin https://github.com/YOUR_USERNAME/ai-content-platform-login.git"
    echo "3. 运行以下命令推送代码："
    echo "   git push -u origin main"
fi

echo ""
echo "✨ 准备完成！"
echo ""
echo "下一步："
echo "1. 如果还没有创建 GitHub 仓库，请访问 https://github.com/new 创建"
echo "2. 添加远程仓库并推送："
echo "   git remote add origin https://github.com/YOUR_USERNAME/ai-content-platform-login.git"
echo "   git push -u origin main"
echo "3. 在 GitHub 仓库 Settings → Pages 中启用 GitHub Actions"










