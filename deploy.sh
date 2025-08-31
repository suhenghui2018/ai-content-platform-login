#!/bin/bash

echo "🚀 开始部署AI全渠道内容生成平台..."

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
else
    echo "❌ 构建失败！"
    exit 1
fi

# 检查dist目录
if [ -d "dist" ]; then
    echo "📁 构建输出目录检查完成"
    echo "📊 文件大小统计："
    du -sh dist/*
else
    echo "❌ dist目录不存在！"
    exit 1
fi

echo ""
echo "🎯 部署方式选择："
echo "1. Vercel (推荐，免费，自动部署)"
echo "2. GitHub Pages (免费，需要GitHub账号)"
echo "3. Netlify (免费，功能丰富)"
echo "4. 其他静态托管服务"
echo ""
echo "请选择部署方式 (1-4): "
read choice

case $choice in
    1)
        echo "🚀 准备部署到Vercel..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://vercel.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New Project'"
        echo "4. 导入您的GitHub仓库"
        echo "5. 选择 'Mema demo' 项目"
        echo "6. 点击 'Deploy'"
        echo ""
        echo "或者使用Vercel CLI："
        echo "npm i -g vercel"
        echo "vercel --prod"
        ;;
    2)
        echo "🚀 准备部署到GitHub Pages..."
        echo "请按照以下步骤操作："
        echo "1. 将代码推送到GitHub仓库"
        echo "2. 在仓库设置中启用GitHub Pages"
        echo "3. 选择部署分支和目录"
        ;;
    3)
        echo "🚀 准备部署到Netlify..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://netlify.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New site from Git'"
        echo "4. 选择您的GitHub仓库"
        echo "5. 构建命令: npm run build"
        echo "6. 发布目录: dist"
        ;;
    *)
        echo "🚀 其他部署方式..."
        echo "您可以将dist目录中的文件上传到任何静态托管服务"
        ;;
esac

echo ""
echo "📋 部署检查清单："
echo "✅ 项目构建完成"
echo "✅ 静态文件已生成"
echo "✅ 部署配置已准备"
echo ""
echo "🎉 部署准备完成！请按照上述步骤完成部署。"
