#!/bin/bash

# 快速部署脚本 - 自动打开部署页面

echo "🚀 快速部署 - AI全渠道内容生成平台"
echo "═══════════════════════════════════════"
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$PROJECT_DIR/dist"

# 检查 dist 目录
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ 错误: dist 目录不存在！"
    echo "正在构建项目..."
    cd "$PROJECT_DIR"
    export PATH="$PROJECT_DIR/node-v18.18.0-darwin-x64/bin:$PATH"
    npm run build:skip-check
fi

if [ ! -d "$DIST_DIR" ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 构建文件已就绪！"
echo ""
echo "📁 部署文件位置: $DIST_DIR"
echo "📦 文件大小: $(du -sh "$DIST_DIR" | cut -f1)"
echo ""

# 显示 dist 目录内容
echo "📋 包含的文件:"
ls -lh "$DIST_DIR" | head -8
echo ""

# macOS 自动打开浏览器
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 正在打开 Vercel 部署页面..."
    echo ""
    echo "═══════════════════════════════════════"
    echo "📌 部署步骤："
    echo "═══════════════════════════════════════"
    echo ""
    echo "1. 浏览器将自动打开 Vercel 页面"
    echo "2. 使用 GitHub 账号登录（如果没有，先用邮箱注册）"
    echo "3. 在页面上找到 'Deploy' 区域"
    echo "4. 将 'dist' 文件夹拖拽到页面"
    echo "5. 等待部署完成（约 30 秒）"
    echo "6. 获得预览链接！"
    echo ""
    echo "💡 提示: dist 文件夹位于:"
    echo "   $DIST_DIR"
    echo ""
    echo "═══════════════════════════════════════"
    echo ""
    
    # 自动打开 Vercel 和 Netlify
    open "https://vercel.com/new" 2>/dev/null &
    sleep 2
    open "https://app.netlify.com/drop" 2>/dev/null &
    
    echo "✅ 已打开部署页面！"
    echo ""
    echo "请按照页面提示完成部署："
    echo "  • Vercel: 连接 GitHub 仓库或拖拽 dist 文件夹"
    echo "  • Netlify: 直接拖拽 dist 文件夹（无需登录）"
    echo ""
    
    # 尝试打开 Finder 显示 dist 文件夹
    open "$DIST_DIR" 2>/dev/null &
    echo "✅ 已打开 Finder 显示 dist 文件夹"
    echo ""
    echo "现在您可以："
    echo "1. 从 Finder 拖拽 dist 文件夹到浏览器页面"
    echo "2. 或者从 Finder 中选择 dist 文件夹内的所有文件拖拽"
    
else
    echo "请访问以下链接完成部署："
    echo ""
    echo "方式 1: Vercel"
    echo "https://vercel.com/new"
    echo ""
    echo "方式 2: Netlify（拖拽部署，无需登录）"
    echo "https://app.netlify.com/drop"
    echo ""
fi

echo ""
echo "═══════════════════════════════════════"
echo "🎉 部署文件已准备好！"
echo "═══════════════════════════════════════"




