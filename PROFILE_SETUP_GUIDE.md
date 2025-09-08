# 资料登记页面功能指南

## 功能概述

资料登记页面是用户注册成功后的必经流程，用于收集用户的版本选择和详细信息。

## 功能特性

### 1. 版本选择
- **个人基础版**：每月 100,000 元
  - 适合个人体验用户
  - 每月生成 20 条内容
  - 1 个社交媒体渠道
  - 基本 AI 模板访问权限

- **个人专业版**：每月 100,000 美元
  - 适合个人创作者和自由职业者
  - 每月生成 100 条内容
  - 3 个社交媒体渠道
  - 专业数据分析
  - 基本 AI 模板库

- **团队版**：每月 / 席位 100,000 美元
  - 适合小型团队和初创企业
  - 每月生成 500 条内容
  - 10 个社交媒体渠道
  - 高级 AI 模板库
  - 团队协作功能

- **企业版**：定制
  - 适合大型企业及组织
  - 套餐token下无限制内容生成
  - 全渠道支持
  - 独家 AI 模型训练
  - 高级数据分析
  - 专属账户管理员

### 2. 表单字段

#### 个人版（个人基础版 + 个人专业版）
- 名字 (First Name)
- 姓氏 (Last Name)
- 职位 (Job Title)
- 部门 (Department)

#### 团队版
- 负责人的名字 (First Name)
- 负责人的姓氏 (Last Name)
- 团队名称 (Team Name)
- 职位 (Job Title)
- 部门 (Department)
- 团队人数 (Team Size)

#### 企业版
- 公司名称 (Company Name)
- 统一社会信用代码 (Business Registration Number)
- 行业 (Industry)
- 公司规模 (Company Size)
- 公司地址 (Company Address)
- 联系人姓名 (Contact Name)
- 联系人职务 (Contact Title)
- 联系电话 (Contact Phone)
- 联系邮箱 (Contact Email) - 必须以公司域名结尾
- 定制需求 (Custom Requirements) - 选填
- 关键使用场景 (Key Usage Scenarios)
- 预计席位数量 (Expected Number of Seats)

### 3. 多语言支持
- 简体中文 (zh-CN)
- 繁体中文 (zh-TW)
- 英文 (en)
- 日文 (ja)

### 4. 表单验证
- 必填字段验证
- 邮箱格式验证（企业版）
- 实时错误提示

## 使用流程

1. 用户完成注册
2. 自动跳转到资料登记页面
3. 选择版本并查看权益详情
4. 填写对应版本的表单信息
5. 提交后进入平台首页

## 技术实现

### 组件结构
- `ProfileSetupForm.tsx` - 资料登记页面主组件
- `PlatformHome.tsx` - 平台首页组件
- 更新了 `App.tsx` 的状态管理

### 国际化
- 在 `src/i18n/index.ts` 中添加了所有相关翻译
- 支持四种语言的完整翻译

### 样式
- 使用 Tailwind CSS 进行样式设计
- 响应式设计，支持移动端
- 左侧显示登录页面图片，右侧显示表单

## 文件修改清单

1. `src/i18n/index.ts` - 添加翻译内容
2. `src/components/ProfileSetupForm.tsx` - 新建资料登记组件
3. `src/components/PlatformHome.tsx` - 新建平台首页组件
4. `src/components/RegisterForm.tsx` - 添加注册成功回调
5. `src/App.tsx` - 更新状态管理和路由逻辑

## 测试建议

1. 测试不同版本的权益展示
2. 测试表单验证功能
3. 测试多语言切换
4. 测试响应式设计
5. 测试完整的用户流程：注册 → 资料登记 → 平台首页

