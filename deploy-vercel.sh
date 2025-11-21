#!/bin/bash

# Vercel部署脚本
# 使用方法：在终端运行 ./deploy-vercel.sh

cd "$(dirname "$0")"

echo "=========================================="
echo "🚀 开始部署到Vercel"
echo "=========================================="
echo ""

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装Vercel CLI..."
    # 尝试使用系统的npm
    if command -v npm &> /dev/null; then
        npm install -g vercel
    else
        echo "❌ 错误：未找到npm命令"
        echo "请先安装Node.js，或者使用方法一（通过GitHub部署）"
        echo ""
        echo "或者手动安装："
        echo "1. 访问 https://nodejs.org 安装Node.js"
        echo "2. 然后运行: npm install -g vercel"
        exit 1
    fi
fi

echo "✅ Vercel CLI已安装"
echo ""

# 检查是否已登录
echo "🔐 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "请先登录Vercel..."
    vercel login
else
    echo "✅ 已登录Vercel"
    vercel whoami
fi

echo ""
echo "📦 开始部署..."
echo ""

# 部署到预览环境
vercel

echo ""
read -p "是否部署到生产环境？(y/n): " deploy_prod

if [ "$deploy_prod" = "y" ] || [ "$deploy_prod" = "Y" ]; then
    echo ""
    echo "🚀 部署到生产环境..."
    vercel --prod
    echo ""
    echo "✅ 生产环境部署完成！"
else
    echo ""
    echo "ℹ️  预览环境已部署完成"
    echo "要部署到生产环境，请运行: vercel --prod"
fi

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="

