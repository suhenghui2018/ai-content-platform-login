#!/bin/bash

echo "🚀 AI全渠道内容生成平台 - 快速部署脚本"
echo "=========================================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装Node.js，请先安装Node.js 18+"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败！"
    exit 1
fi

# 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败！"
    exit 1
fi

echo "✅ 项目构建成功！"

# 检查构建输出
echo ""
echo "📁 检查构建输出..."
if [ -d "dist" ]; then
    echo "✅ dist目录存在"
    echo "📊 文件列表："
    ls -la dist/
    echo ""
    echo "📊 文件大小："
    du -sh dist/*
else
    echo "❌ dist目录不存在！"
    exit 1
fi

# 部署选项
echo ""
echo "🎯 选择部署方式："
echo "1. 🚀 Vercel (推荐，免费，自动部署)"
echo "2. 📚 GitHub Pages (免费，需要GitHub)"
echo "3. 🌐 Netlify (免费，功能丰富)"
echo "4. 📁 本地预览"
echo "5. ❌ 退出"

read -p "请输入选择 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 部署到Vercel..."
        echo "请按照以下步骤操作："
        echo ""
        echo "1. 访问 https://vercel.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New Project'"
        echo "4. 导入您的GitHub仓库"
        echo "5. 配置项目："
        echo "   - Framework: Vite"
        echo "   - Build Command: npm run build"
        echo "   - Output Directory: dist"
        echo "6. 点击 'Deploy'"
        echo ""
        echo "或者使用CLI："
        echo "npm i -g vercel"
        echo "vercel --prod"
        ;;
    2)
        echo ""
        echo "📚 部署到GitHub Pages..."
        echo "请按照以下步骤操作："
        echo ""
        echo "1. 将代码推送到GitHub："
        echo "   git add ."
        echo "   git commit -m '准备部署'"
        echo "   git push origin main"
        echo ""
        echo "2. 在GitHub仓库设置中启用Pages"
        echo "3. 选择 'GitHub Actions' 作为部署源"
        ;;
    3)
        echo ""
        echo "🌐 部署到Netlify..."
        echo "请按照以下步骤操作："
        echo ""
        echo "1. 访问 https://netlify.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New site from Git'"
        echo "4. 选择您的GitHub仓库"
        echo "5. 配置："
        echo "   - Build command: npm run build"
        echo "   - Publish directory: dist"
        echo "6. 点击 'Deploy site'"
        ;;
    4)
        echo ""
        echo "📁 本地预览..."
        echo "启动本地服务器..."
        npm run preview
        ;;
    5)
        echo "👋 退出部署"
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署指南完成！"
echo ""
echo "📋 下一步："
echo "1. 按照上述步骤完成部署"
echo "2. 测试网站功能"
echo "3. 配置自定义域名（可选）"
echo "4. 分享您的网站链接"
echo ""
echo "🔗 有用的链接："
echo "- Vercel: https://vercel.com"
echo "- GitHub Pages: https://pages.github.com"
echo "- Netlify: https://netlify.com"
echo ""
echo "祝您部署顺利！🚀"
