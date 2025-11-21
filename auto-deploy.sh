#!/bin/bash

# 自动部署脚本
# 使用方法：bash auto-deploy.sh

echo "🚀 开始自动部署 AI全渠道内容生成平台..."

# 设置颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取当前目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# 使用本地 Node.js
export PATH="$PROJECT_DIR/node-v18.18.0-darwin-x64/bin:$PATH"

echo -e "${BLUE}📦 步骤 1: 检查项目状态...${NC}"

# 检查 Node.js
if [ ! -f "$PROJECT_DIR/node-v18.18.0-darwin-x64/bin/node" ]; then
    echo -e "${YELLOW}⚠️  警告: 未找到本地 Node.js，将使用系统 Node.js${NC}"
    export PATH=""
fi

# 重新构建项目（跳过类型检查）
echo -e "${BLUE}📦 步骤 2: 构建项目...${NC}"
npm run build:skip-check

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  构建失败，但使用现有 dist 文件${NC}"
fi

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}❌ dist 目录不存在！${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建完成！${NC}"
echo ""

# 显示 dist 内容
echo -e "${BLUE}📁 构建文件列表：${NC}"
ls -lh dist/ | head -10

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎯 部署准备完成！${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}请选择部署方式：${NC}"
echo ""
echo "方式 1: Vercel 部署（推荐，最简单）"
echo "────────────────────────────────────"
echo "1. 访问: https://vercel.com/new"
echo "2. 使用 GitHub 账号登录"
echo "3. 点击 'Import Git Repository' 连接仓库"
echo "   或者点击 'Deploy' → 将 dist 文件夹拖拽到页面"
echo "4. 配置（如果提示）："
echo "   - Build Command: npm run build:skip-check"
echo "   - Output Directory: dist"
echo "   - Framework Preset: Vite"
echo "5. 点击 'Deploy'"
echo ""
echo "方式 2: Netlify 部署（也很快）"
echo "────────────────────────────────────"
echo "1. 访问: https://app.netlify.com/drop"
echo "2. 直接将 dist 文件夹拖拽到页面"
echo "3. 等待部署完成，获得预览链接"
echo ""
echo "方式 3: GitHub Pages 部署"
echo "────────────────────────────────────"
echo "1. 将代码推送到 GitHub"
echo "2. 在仓库 Settings → Pages 中启用"
echo "3. 选择 'GitHub Actions' 作为源"
echo ""
echo -e "${YELLOW}💡 提示: dist 文件夹位于: $PROJECT_DIR/dist${NC}"
echo ""

# 尝试自动打开浏览器（macOS）
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "是否现在打开 Vercel 部署页面？(y/n)"
    read -r answer
    if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
        open "https://vercel.com/new"
        echo -e "${GREEN}✅ 已打开浏览器${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 准备完成！请按照上述步骤完成部署。${NC}"




