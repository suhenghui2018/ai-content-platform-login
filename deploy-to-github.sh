#!/bin/bash

# GitHub部署脚本
# 使用方法: ./deploy-to-github.sh

set -e

echo "🚀 开始部署到GitHub..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查Git是否已初始化
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  检测到未初始化Git仓库，正在初始化...${NC}"
    git init
    echo -e "${GREEN}✅ Git仓库初始化完成${NC}"
fi

# 检查是否有远程仓库
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  未检测到远程仓库，请先添加远程仓库：${NC}"
    echo -e "${YELLOW}   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git${NC}"
    echo ""
    read -p "请输入GitHub仓库URL (或按Enter跳过): " repo_url
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ 远程仓库已添加${NC}"
    else
        echo -e "${RED}❌ 请先添加远程仓库后再运行此脚本${NC}"
        exit 1
    fi
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}📝 检测到未提交的更改${NC}"
    git add .
    read -p "请输入提交信息 (默认: Update): " commit_msg
    commit_msg=${commit_msg:-Update}
    git commit -m "$commit_msg"
    echo -e "${GREEN}✅ 更改已提交${NC}"
fi

# 获取当前分支名
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
    current_branch="main"
    git branch -M main
fi

# 推送代码
echo -e "${YELLOW}📤 正在推送代码到GitHub...${NC}"
git push -u origin "$current_branch" || {
    echo -e "${RED}❌ 推送失败，请检查：${NC}"
    echo -e "${YELLOW}   1. 是否已配置GitHub认证${NC}"
    echo -e "${YELLOW}   2. 远程仓库URL是否正确${NC}"
    echo -e "${YELLOW}   3. 是否有推送权限${NC}"
    exit 1
}

echo -e "${GREEN}✅ 代码已成功推送到GitHub！${NC}"
echo ""
echo -e "${GREEN}📋 下一步操作：${NC}"
echo -e "${YELLOW}   1. 访问GitHub仓库页面${NC}"
echo -e "${YELLOW}   2. 进入 Settings → Pages${NC}"
echo -e "${YELLOW}   3. 在Source中选择 'GitHub Actions'${NC}"
echo -e "${YELLOW}   4. 等待自动部署完成（约2-5分钟）${NC}"
echo -e "${YELLOW}   5. 访问 Actions 标签查看部署进度${NC}"
echo ""
echo -e "${GREEN}🎉 部署流程已启动！${NC}"


