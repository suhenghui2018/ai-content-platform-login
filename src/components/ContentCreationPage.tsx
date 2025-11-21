import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectSettings } from '../types/contentPack';
import { getBrandPacks } from '../utils/brandPackData';
import { BrandPack } from '../types/brandPack';
import { getContentPackSettings } from '../utils/contentPackData';

interface ContentCard {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'content-pack' | 'email' | 'facebook' | 'instagram' | 'rednote' | 'blog' | 'landingpage';
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}


// 邮件模板接口
interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // 预览图片URL或base64
  category: string;
  htmlContent?: string; // HTML邮件内容
}

// 邮件长度类型
type EmailLength = 'short' | 'medium' | 'long';

// CTA类型
interface CTASettings {
  text: string;
  url: string;
  color: string;
}

// 热门话题接口
interface TrendingTopic {
  id: string;
  text: string;
  hashtag: string;
  popularity: number;
}

const ContentCreationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { contentPackId } = useParams<{ contentPackId: string }>();
  const [searchParams] = useSearchParams();
  const contentPackName = searchParams.get('name') || t('untitledProject');
  
  // 项目设置信息
  const [projectSettings, setProjectSettings] = useState<ProjectSettings | null>(null);
  const [brandPacks, setBrandPacks] = useState<BrandPack[]>([]);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contentCards, setContentCards] = useState<ContentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [chatMessage, setChatMessage] = useState('');
  
  // 创建内容菜单状态
  const [showCreateContentMenu, setShowCreateContentMenu] = useState(false);
  const [createContentPosition, setCreateContentPosition] = useState({ x: 0, y: 0 });
  const [currentSourceCardId, setCurrentSourceCardId] = useState<string | null>(null);
  
  // 提示弹窗状态
  const [showTipModal, setShowTipModal] = useState(false);
  
  // 下拉选择器状态
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('');
  
  // 语言显示状态
  const [displayLanguage, setDisplayLanguage] = useState<'zh-CN' | 'zh-TW' | 'ja' | 'en'>('zh-CN');
  
  // 链接提取状态
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionTimeLeft, setExtractionTimeLeft] = useState(30);
  
  // 邮件模板相关状态
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedLength, setSelectedLength] = useState<EmailLength>('medium');
  const [ctaSettings, setCtaSettings] = useState<CTASettings>({
    text: '立即购买',
    url: '',
    color: '#3B82F6'
  });
  const [selectedTopics, setSelectedTopics] = useState<TrendingTopic[]>([]);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [htmlPreviewContent, setHtmlPreviewContent] = useState<string>('');
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [emailEditorContent, setEmailEditorContent] = useState<string>('');
  const [uploadMenuOpenId, setUploadMenuOpenId] = useState<string | null>(null);
  
  // 邮件模板数据
  const emailTemplates: EmailTemplate[] = [
    {
      id: 'template-a',
      name: '营销推广模板',
      description: '适用于产品营销推广，包含引人注目的标题和清晰的行动号召',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIj7nlLXohJHlupTnlKjmiYvmnLogQTwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2QjcyODAiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5Q0EzQUYiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPC9zdmc+',
      category: '营销',
      htmlContent: `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Godiva 2025 方形朱古力 | 會員尊享預購</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Open Sans', Arial, sans-serif; color: #5C3A21; background-color: #F9F5F0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
        <!-- 主題行和預覽文本（在郵件客戶端中顯示） -->
        <!-- 主題: {{高級會員}}專屬 | 搶先預購Godiva 2025方形朱古力，尊享9.5折 -->
        <!-- 預覽文本: 親愛的{{MemberName}}，您作為Godiva高級會員，特邀您於2025年6月5日前優先預購限量新品。 -->
        
        <!-- 頭部品牌LOGO -->
        <tr>
            <td align="center" style="padding: 25px 0; background-color: #FFFFFF;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td align="center">
                            <img src="https://s1.imagehub.cc/images/2025/08/23/7e1afb810ac8c39809aaf682bd5040f8.png" alt="Godiva Chocolatier" width="180" style="display: block; border: 0; max-width: 180px; height: auto;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- 主視覺區域 -->
        <tr>
            <td align="center" style="padding: 0; background: linear-gradient(to bottom, #FFFFFF, #F9F5F0);">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 20px 0 30px;">
                            <img src="https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg" alt="Godiva 2025 方形朱古力" width="100%" style="display: block; border: 0; max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(92, 58, 33, 0.15);">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 20px 20px;">
                            <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #5C3A21; margin: 0; line-height: 1.2;">2025方形朱古力系列</h1>
                            <p style="font-size: 18px; color: #8C6D46; margin: 10px 0 0;">高級會員尊享預購即將開啟</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- 倒計時組件 -->
        <tr>
            <td align="center" style="padding: 0; background-color: #F9F5F0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 15px 20px; background-color: #5C3A21; color: #FFFFFF; border-radius: 8px; margin: 0 20px;">
                            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; margin: 0 0 10px; font-weight: 700;">預購開啟倒計時</h2>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 8px 12px; background-color: #8C6D46; border-radius: 4px; margin: 0 5px;">
                                        <span style="font-size: 24px; font-weight: bold;">05</span>
                                        <br>
                                        <span style="font-size: 12px;">天</span>
                                    </td>
                                    <td align="center" style="padding: 8px 12px; background-color: #8C6D46; border-radius: 4px; margin: 0 5px;">
                                        <span style="font-size: 24px; font-weight: bold;">12</span>
                                        <br>
                                        <span style="font-size: 12px;">時</span>
                                    </td>
                                    <td align="center" style="padding: 8px 12px; background-color: #8C6D46; border-radius: 4px; margin: 0 5px;">
                                        <span style="font-size: 24px; font-weight: bold;">45</span>
                                        <br>
                                        <span style="font-size: 12px;">分</span>
                                    </td>
                                    <td align="center" style="padding: 8px 12px; background-color: #8C6D46; border-radius: 4px; margin: 0 5px;">
                                        <span style="font-size: 24px; font-weight: bold;">30</span>
                                        <br>
                                        <span style="font-size: 12px;">秒</span>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; margin: 15px 0 0;">預購開啟時間: 2025年6月5日 上午10:00</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- 產品亮點 -->
        <tr>
            <td align="center" style="padding: 30px 0; background-color: #F9F5F0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0 20px;">
                            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #5C3A21; border-left: 4px solid #D4AF37; padding-left: 15px;">尊享會員特權</h2>
                            <p style="font-size: 16px; line-height: 1.6;">親愛的{{MemberName}}，您作為Godiva高級會員，我們誠摯邀請您優先預購全新2025方形朱古力系列。這款限量新品融合了東西方風味靈感，採用最優質的可可豆精製而成，每一口都是奢華的味覺盛宴。</p>
                            
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0; border-collapse: collapse;">
                                <tr>
                                    <td width="33%" align="center" style="padding: 10px;">
                                        <img src="https://s1.imagehub.cc/images/2025/06/16/dc0472537187030ae716558ba0f94e27.jpg" alt="精美包裝" width="100%" style="display: block; border: 0; max-width: 100%; height: auto; border-radius: 6px;">
                                        <p style="font-size: 14px; margin: 10px 0 0; color: #8C6D46;">典雅金色包裝</p>
                                    </td>
                                    <td width="33%" align="center" style="padding: 10px;">
                                        <img src="https://s1.imagehub.cc/images/2025/06/16/53d75b3bcf7530b54e5b02078f8a6948.jpg" alt="多樣口味" width="100%" style="display: block; border: 0; max-width: 100%; height: auto; border-radius: 6px;">
                                        <p style="font-size: 14px; margin: 10px 0 0; color: #8C6D46;">八種獨特風味</p>
                                    </td>
                                    <td width="33%" align="center" style="padding: 10px;">
                                        <img src="https://s1.imagehub.cc/images/2025/06/16/e273c2393f14c15d8f76d3552ed4b1b7.jpg" alt="精緻工藝" width="100%" style="display: block; border: 0; max-width: 100%; height: auto; border-radius: 6px;">
                                        <p style="font-size: 14px; margin: 10px 0 0; color: #8C6D46;">手工精製工藝</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <ul style="font-size: 16px; line-height: 1.6; padding-left: 20px; margin: 20px 0;">
                                <li>全球限量發售，僅對高級會員開放預購</li>
                                <li>尊享<span style="font-weight: bold; color: #D4AF37;">9.5折</span>獨家優惠</li>
                                <li>優先發貨權，比公眾提前一週收到產品</li>
                                <li>專屬禮品包裝及定制賀卡服務</li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- 行動呼籲按鈕 -->
        <tr>
            <td align="center" style="padding: 0 0 40px; background-color: #F9F5F0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 0 20px;">
                            <a href="https://e.tb.cn/h.6BUaa8HJRtnKoZe?tk=thVbVLgDHfa" style="display: inline-block; padding: 16px 40px; background-color: #D4AF37; color: #FFFFFF; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; text-decoration: none; border-radius: 30px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">立即預購</a>
                            <p style="font-size: 14px; color: #8C6D46; margin: 15px 0 0;">預購期: 2025年6月5日 - 6月12日</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- 頁腳 -->
        <tr>
            <td align="center" style="padding: 30px 0; background-color: #FFFFFF; border-top: 1px solid #F0E6D9;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 0 20px 20px;">
                            <!-- 社交圖標 -->
                            <div style="margin-bottom: 20px;">
                                <a href="{{SocialLinks}}" style="display: inline-block; margin: 0 10px;"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png" alt="Facebook" width="28" height="28" style="border: 0;"></a>
                                <a href="{{SocialLinks}}" style="display: inline-block; margin: 0 10px;"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png" alt="Instagram" width="28" height="28" style="border: 0;"></a>
                                <a href="{{SocialLinks}}" style="display: inline-block; margin: 0 10px;"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/twitter-icon-2x.png" alt="Twitter" width="28" height="28" style="border: 0;"></a>
                            </div>
                            
                            <!-- 公司地址和聯繫方式 -->
                            <p style="font-size: 12px; color: #8C6D46; line-height: 1.6; margin: 0 0 10px;">
                                {{CompanyAddress}}<br>
                                客服郵箱: <a href="mailto:{{ContactEmail}}" style="color: #8C6D46; text-decoration: underline;">{{ContactEmail}}</a>
                            </p>
                            
                            <!-- 退訂鏈接 -->
                            <p style="font-size: 12px; color: #8C6D46;">
                                <a href="{{UnsubscribeURL}}" style="color: #8C6D46; text-decoration: underline;">退訂郵件</a>
                            </p>
                            
                            <!-- 版權信息 -->
                            <p style="font-size: 12px; color: #8C6D46; margin: 20px 0 0;">
                                © 2025 Godiva Chocolatier. 保留所有權利。
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    },
    {
      id: 'template-b',
      name: '品牌推广模板',
      description: '专业品牌推广邮件，包含产品介绍和品牌体验',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMzI0NzJmIi8+Cjx0ZXh0IHg9IjEwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIj5TdGFyYnVja3M8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmZmZmIj7nlLXohJHlupTnlKjmiYvmnLogQjwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNmZmZmZmYiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPC9zdmc+',
      category: '品牌',
      htmlContent: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0," />
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{{BRAND_NAME}}</title>
    <style>
      body { width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; }
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; border-spacing: 0px; }
      table td { border-collapse: collapse; mso-line-height-rule: exactly; padding: 0; margin: 0px; }
      .email-container { max-width: 640px; margin: 0 auto; background-color: #c1c594; }
      .header { background-color: #32472f; padding: 0; text-align: center; }
      .header img { width: 100%; height: auto; display: block; }
      .hero-section { background-color: #c1c594; text-align: center; }
      .hero-image { width: 100%; height: auto; display: block; }
      .main-title { font-family: 'Lander Short', Cambria, serif; font-size: 54px; line-height: 76px; color: #32472f; text-align: center; padding: 24px 20px 2px; font-weight: 300; }
      .subtitle { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 26px; line-height: 44px; color: #32472f; text-align: center; padding: 12px 20px 8px; font-weight: bold; }
      .description { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 24px; line-height: 32px; color: #32472f; text-align: center; padding: 22px 46px 24px; }
      .cta-button { display: block; margin: 24px auto 58px; }
      .features-section { background-color: #fbf5e7; margin: 0 40px; border-radius: 15px; padding: 38px 100px 32px; }
      .features-title { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 38px; line-height: 44px; color: #32472f; text-align: center; font-weight: bold; }
      .feature-item { display: flex; align-items: center; margin-bottom: 36px; }
      .feature-image { width: 176px; height: 176px; }
      .feature-text { flex: 1; padding: 0 20px; }
      .feature-title { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 22px; line-height: 30px; color: #32472f; font-weight: bold; margin-bottom: 10px; }
      .feature-desc { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 18px; line-height: 20px; color: #32472f; }
      .footer-icons { background-color: #32472f; padding: 28px 0; }
      .icon-grid { display: flex; justify-content: space-around; max-width: 640px; margin: 0 auto; }
      .icon-item { text-align: center; color: #ffffff; }
      .icon-item img { width: 42px; height: 42px; margin-bottom: 6px; }
      .icon-text { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 14px; color: #ffffff; }
      .social-icons { text-align: center; padding: 25px 0 30px; }
      .social-icons img { width: 26px; height: 26px; margin: 0 20px; }
      .footer-text { font-family: 'SoDo Sans', Arial, sans-serif; font-size: 14px; line-height: 20px; color: #707070; text-align: center; padding: 0 11% 10px; }
      .legal-text { font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Mastheads/EN/Starbucks_32472f.png" alt="{{BRAND_NAME}}" />
      </div>
      
      <!-- Hero Section -->
      <div class="hero-section">
        <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Images/FY25/25-19-NWSL-1-0-0_Hero.png" alt="产品展示" class="hero-image" />
        <div class="main-title">A new way to refresh</div>
        <div class="subtitle">Introducing {{PRODUCT_NAME}}</div>
        <div class="description">{{PRODUCT_DESCRIPTION}}</div>
        <a href="{{CTA_URL}}" class="cta-button">
          <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/CTAs/OrderNow_32472f_TFFF_Bc1c594.png" alt="{{CTA_TEXT}}" />
        </a>
      </div>
      
      <!-- Features Section -->
      <div class="features-section">
        <div class="features-title">More reasons to stay awhile</div>
        
        <div class="feature-item">
          <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Images/FY25/25-19-NWSL-1-0-0-Mod2.png" alt="特色1" class="feature-image" />
          <div class="feature-text">
            <div class="feature-title">Free refills</div>
            <div class="feature-desc">All for-here orders now include freshly brewed refills on hot or iced coffee and tea. You can order as many refills as you'd like.</div>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-text">
            <div class="feature-title">Condiment bar</div>
            <div class="feature-desc">It's back. Now you can add the finishing touches to your drink—so you'll always get your perfect amount of cream and sugar.</div>
          </div>
          <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Images/FY25/25-19-NWSL-1-0-0-Mod3.png" alt="特色2" class="feature-image" />
        </div>
        
        <div class="feature-item">
          <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Images/FY25/25-19-NWSL-1-0-0-Mod4.png" alt="特色3" class="feature-image" />
          <div class="feature-text">
            <div class="feature-title">For-here orders</div>
            <div class="feature-desc">Catching up with a friend or hunkering down with your laptop? Order your drink for here and enjoy it in a mug or glass.</div>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-text">
            <div class="feature-title">Nondairy milk</div>
            <div class="feature-desc">Now you can customize your drink with your favorite nondairy milk—like soy, coconut, almond or oat—at no extra cost.</div>
          </div>
          <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Images/FY25/25-19-NWSL-1-0-0-Mod5.png" alt="特色4" class="feature-image" />
        </div>
        
        <a href="{{CTA_URL}}" style="display: block; margin: 48px auto 0;">
          <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/CTAs/LearnMore_32472f_TFFF_fbf5e7.png" alt="了解更多" />
        </a>
      </div>
      
      <!-- Footer Icons -->
      <div class="footer-icons">
        <div class="icon-grid">
          <div class="icon-item">
            <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/SRHeaderFooter_Final0806_select_42_White.png" alt="APP" />
            <div class="icon-text">APP</div>
          </div>
          <div class="icon-item">
            <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/SRHeaderFooter_Final0806_cup_42_White.png" alt="ORDER" />
            <div class="icon-text">ORDER</div>
          </div>
          <div class="icon-item">
            <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/SRHeaderFooter_Final0806_stars_42_White.png" alt="OFFERS" />
            <div class="icon-text">OFFERS</div>
          </div>
          <div class="icon-item">
            <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/SRHeaderFooter_Final0806_gift_42_White.png" alt="REWARDS" />
            <div class="icon-text">REWARDS</div>
          </div>
        </div>
      </div>
      
      <!-- Social Icons -->
      <div class="social-icons">
        <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/social_Instagram_icon_52x52.png" alt="Instagram" />
        <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/social_TikTok_icon_52x52.png" alt="TikTok" />
        <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/social_Facebook_icon_52x52.png" alt="Facebook" />
        <img src="https://i.a.starbucks.com/wpm/1161/ContentUploads/Teleion/Icons/social_X_icon_52x52.png" alt="X" />
      </div>
      
      <!-- Footer Text -->
      <div class="footer-text">
        <span class="legal-text">Free refills on hot and iced brewed coffee and tea during same store visit. Excludes Cold Brew and Nitro Cold Brew, Iced Tea Lemonade, flavored Iced Tea and Starbucks Refreshers® base. Initial purchase must be made in a reusable cup or "for-here" serveware. At participating stores.</span>
        <br /><br />
        This email was sent to {{RECIPIENT_EMAIL}}.
        <a href="#" style="color:#707070; text-decoration:underline;">Unsubscribe</a>.
        <br /><br />
        Questions? <a href="#" style="color:#707070; text-decoration:underline;">Contact us here</a>.
        <br /><br />
        © 2025 {{BRAND_NAME}} Company.
      </div>
    </div>
  </body>
</html>`
    },
    {
      id: 'template-c',
      name: '会员尊享模板',
      description: '高端会员专属邮件，包含倒计时、特权展示和产品图库',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZjlmNWYwIi8+Cjx0ZXh0IHg9IjEwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNWMzYTIxIj5Hb2RpdmE8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNWMzYTIxIj7nlLXohJHlupTnlKjmiYvmnLogQzwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM1YzNhMjEiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPC9zdmc+',
      category: '会员',
      htmlContent: `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BRAND_NAME}} {{PRODUCT_NAME}} | {{MEMBER_TYPE}}尊享預購</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;500&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Montserrat', Arial, sans-serif;
            background-color: #f9f5f0;
            color: #5c3a21;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #d4af37;
            box-shadow: 0 0 30px rgba(92, 58, 33, 0.2);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .header {
            text-align: center;
            padding: 25px 20px;
            background: linear-gradient(to bottom, #8c6d46, #5c3a21);
            border-bottom: 2px solid #d4af37;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
        }
        
        .hero {
            position: relative;
            text-align: center;
            overflow: hidden;
        }
        
        .hero-image {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .hero-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(92, 58, 33, 0.85), transparent);
            padding: 30px 20px 20px;
            text-align: center;
        }
        
        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 36px;
            font-weight: 700;
            color: #f8f3e6;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .hero-subtitle {
            font-size: 18px;
            color: #d4af37;
            margin: 10px 0 0;
            font-weight: 500;
        }
        
        .countdown-section {
            background: #f8f3e6;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #d4af37;
        }
        
        .countdown-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            color: #5c3a21;
            margin: 0 0 20px;
        }
        
        .countdown-container {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 0 auto;
            max-width: 500px;
        }
        
        .countdown-box {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid #d4af37;
            border-radius: 8px;
            padding: 15px 10px;
            min-width: 70px;
            text-align: center;
        }
        
        .countdown-value {
            font-size: 32px;
            font-weight: 700;
            color: #5c3a21;
            display: block;
            line-height: 1;
        }
        
        .countdown-label {
            font-size: 12px;
            color: #8c6d46;
            text-transform: uppercase;
            margin-top: 8px;
            display: block;
        }
        
        .product-section {
            padding: 40px 20px;
            background: #f8f3e6;
        }
        
        .section-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            color: #5c3a21;
            text-align: center;
            margin: 0 0 30px;
            position: relative;
            padding-bottom: 15px;
        }
        
        .section-title:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 2px;
            background: #d4af37;
        }
        
        .product-intro {
            font-size: 16px;
            line-height: 1.6;
            text-align: center;
            margin: 0 0 30px;
            color: #5c3a21;
        }
        
        .highlight-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        
        .highlight-item {
            text-align: center;
            padding: 20px 15px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            border: 1px solid #d4af37;
            box-shadow: 0 4px 12px rgba(92, 58, 33, 0.1);
        }
        
        .highlight-icon {
            font-size: 32px;
            color: #8c6d46;
            margin-bottom: 15px;
        }
        
        .highlight-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            color: #5c3a21;
            margin: 0 0 10px;
        }
        
        .highlight-desc {
            font-size: 14px;
            color: #5c3a21;
            margin: 0;
        }
        
        .gallery-section {
            padding: 20px;
            background: #f8f3e6;
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .gallery-item {
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #d4af37;
            box-shadow: 0 4px 8px rgba(92, 58, 33, 0.15);
        }
        
        .gallery-item img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .cta-section {
            padding: 40px 20px;
            text-align: center;
            background: linear-gradient(to bottom, #f8f3e6, #e8dfca);
        }
        
        .cta-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            color: #5c3a21;
            margin: 0 0 20px;
        }
        
        .cta-text {
            font-size: 16px;
            color: #5c3a21;
            margin: 0 0 30px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            display: inline-block;
            padding: 18px 45px;
            background: linear-gradient(to right, #8c6d46, #5c3a21);
            color: #f8f3e6;
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(92, 58, 33, 0.3);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(92, 58, 33, 0.5);
            background: linear-gradient(to right, #5c3a21, #8c6d46);
        }
        
        .footer {
            padding: 30px 20px;
            background: linear-gradient(to bottom, #5c3a21, #3e2817);
            border-top: 2px solid #d4af37;
            text-align: center;
            color: #f8f3e6;
        }
        
        .social-links {
            margin-bottom: 20px;
        }
        
        .social-icon {
            display: inline-block;
            margin: 0 12px;
            width: 36px;
            height: 36px;
            background: #8c6d46;
            border-radius: 50%;
            line-height: 36px;
            text-align: center;
            color: #f8f3e6;
            text-decoration: none;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background: #d4af37;
            color: #5c3a21;
            transform: translateY(-3px);
        }
        
        .footer-text {
            font-size: 12px;
            color: #d4af37;
            line-height: 1.6;
            margin: 0 0 10px;
        }
        
        .footer-link {
            color: #f8f3e6;
            text-decoration: none;
        }
        
        .footer-link:hover {
            text-decoration: underline;
            color: #d4af37;
        }
        
        @media (max-width: 600px) {
            .highlight-grid {
                grid-template-columns: 1fr;
            }
            
            .gallery-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .countdown-container {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .countdown-box {
                min-width: 60px;
                padding: 12px 8px;
            }
            
            .countdown-value {
                font-size: 26px;
            }
            
            .hero-title {
                font-size: 28px;
            }
            
            .section-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 15px 30px;
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <center>
        <div class="email-container">
            <!-- 头部品牌LOGO -->
            <div class="header">
                <img src="https://s1.imagehub.cc/images/2025/08/23/7e1afb810ac8c39809aaf682bd5040f8.png" alt="{{BRAND_NAME}}" class="logo">
            </div>
            
            <!-- 主视觉区域 -->
            <div class="hero">
                <img src="https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg" alt="{{PRODUCT_NAME}}" class="hero-image">
                <div class="hero-overlay">
                    <h1 class="hero-title">{{PRODUCT_NAME}}</h1>
                    <p class="hero-subtitle">{{MEMBER_TYPE}}尊享預購即將開啟</p>
                </div>
            </div>
            
            <!-- 倒计时组件 -->
            <div class="countdown-section">
                <h2 class="countdown-title">預購開啟倒計時</h2>
                <div class="countdown-container">
                    <div class="countdown-box">
                        <span class="countdown-value" id="days">05</span>
                        <span class="countdown-label">天</span>
                    </div>
                    <div class="countdown-box">
                        <span class="countdown-value" id="hours">12</span>
                        <span class="countdown-label">時</span>
                    </div>
                    <div class="countdown-box">
                        <span class="countdown-value" id="minutes">45</span>
                        <span class="countdown-label">分</span>
                    </div>
                    <div class="countdown-box">
                        <span class="countdown-value" id="seconds">30</span>
                        <span class="countdown-label">秒</span>
                    </div>
                </div>
                <p style="font-size: 14px; margin: 20px 0 0; color: #8C6D46;">預購開啟時間: {{PREORDER_START_TIME}}</p>
            </div>
            
            <!-- 产品亮点 -->
            <div class="product-section">
                <h2 class="section-title">尊享會員特權</h2>
                <p class="product-intro">親愛的{{MEMBER_NAME}}，您作為{{BRAND_NAME}}{{MEMBER_TYPE}}，我們誠摯邀請您優先預購全新{{PRODUCT_NAME}}。{{PRODUCT_DESCRIPTION}}</p>
                
                <div class="highlight-grid">
                    <div class="highlight-item">
                        <div class="highlight-icon">🌟</div>
                        <h3 class="highlight-title">全球限量</h3>
                        <p class="highlight-desc">僅對{{MEMBER_TYPE}}開放預購，全球限量發售</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon">🎁</div>
                        <h3 class="highlight-title">專屬優惠</h3>
                        <p class="highlight-desc">尊享<span style="font-weight: bold; color: #8c6d46;">{{DISCOUNT_RATE}}</span>獨家優惠</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon">🚚</div>
                        <h3 class="highlight-title">優先發貨</h3>
                        <p class="highlight-desc">比公眾提前{{EARLY_DELIVERY}}收到產品</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon">🎀</div>
                        <h3 class="highlight-title">專屬包裝</h3>
                        <p class="highlight-desc">專屬禮品包裝及定制賀卡服務</p>
                    </div>
                </div>
            </div>
            
            <!-- 产品图库 -->
            <div class="gallery-section">
                <h2 class="section-title">產品展示</h2>
                <div class="gallery-grid">
                    <div class="gallery-item">
                        <img src="https://s1.imagehub.cc/images/2025/06/16/dc0472537187030ae716558ba0f94e27.jpg" alt="典雅金色包裝">
                    </div>
                    <div class="gallery-item">
                        <img src="https://s1.imagehub.cc/images/2025/06/16/53d75b3bcf7530b54e5b02078f8a6948.jpg" alt="八種獨特風味">
                    </div>
                    <div class="gallery-item">
                        <img src="https://s1.imagehub.cc/images/2025/06/16/e273c2393f14c15d8f76d3552ed4b1b7.jpg" alt="手工精製工藝">
                    </div>
                </div>
            </div>
            
            <!-- 行动呼吁按钮 -->
            <div class="cta-section">
                <h2 class="cta-title">{{CTA_TEXT}}</h2>
                <p class="cta-text">作為{{BRAND_NAME}}{{MEMBER_TYPE}}，您可於{{PREORDER_PERIOD}}期間享受專屬預購權益</p>
                <a href="{{CTA_URL}}" class="cta-button">{{CTA_BUTTON_TEXT}}</a>
            </div>
            
            <!-- 页脚 -->
            <div class="footer">
                <div class="social-links">
                    <a href="{{SOCIAL_LINKS}}" class="social-icon">f</a>
                    <a href="{{SOCIAL_LINKS}}" class="social-icon">in</a>
                    <a href="{{SOCIAL_LINKS}}" class="social-icon">t</a>
                </div>
                
                <p class="footer-text">
                    {{COMPANY_ADDRESS}}<br>
                    客服郵箱: <a href="mailto:{{CONTACT_EMAIL}}" class="footer-link">{{CONTACT_EMAIL}}</a>
                </p>
                
                <p class="footer-text">
                    <a href="{{UNSUBSCRIBE_URL}}" class="footer-link">退訂郵件</a>
                </p>
                
                <p class="footer-text">
                    © 2025 {{BRAND_NAME}}. 保留所有權利。
                </p>
            </div>
        </div>
    </center>
    
    <script>
        // 倒计时功能
        function updateCountdown() {
            const targetDate = new Date('{{PREORDER_START_DATE}}');
            const now = new Date();
            const difference = targetDate - now;
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            } else {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
            }
        }
        
        // 初始化倒计时并设置每秒更新
        updateCountdown();
        setInterval(updateCountdown, 1000);
    </script>
</body>
</html>`
    },
    {
      id: 'template-d',
      name: '客户关怀模板',
      description: '用于客户关怀，表达感谢并提供专属优惠',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjEwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIj7nlLXohJHlupTnlKjmiYvmnLogRDwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2QjcyODAiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5Q0EzQUYiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPC9zdmc+',
      category: '关怀'
    },
    {
      id: 'template-e',
      name: '节日祝福模板',
      description: '用于节日祝福，包含节日问候和特别优惠',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRkZGNUY1Ii8+Cjx0ZXh0IHg9IjEwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIj7nlLXohJHlupTnlKjmiYvmnLogRTwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2QjcyODAiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5Q0EzQUYiPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD4KPC9zdmc+',
      category: '节日'
    }
  ];
  
  // 热门话题数据
  const trendingTopics: TrendingTopic[] = [
    { id: '1', text: 'AI人工智能', hashtag: '#AI人工智能', popularity: 95 },
    { id: '2', text: '可持续发展', hashtag: '#可持续发展', popularity: 88 },
    { id: '3', text: '数字化转型', hashtag: '#数字化转型', popularity: 85 },
    { id: '4', text: '绿色能源', hashtag: '#绿色能源', popularity: 82 },
    { id: '5', text: '智能家居', hashtag: '#智能家居', popularity: 80 },
    { id: '6', text: '健康生活', hashtag: '#健康生活', popularity: 78 },
    { id: '7', text: '科技创新', hashtag: '#科技创新', popularity: 75 },
    { id: '8', text: '环保理念', hashtag: '#环保理念', popularity: 72 },
    { id: '9', text: '数字营销', hashtag: '#数字营销', popularity: 70 },
    { id: '10', text: '用户体验', hashtag: '#用户体验', popularity: 68 },
    { id: '11', text: '区块链技术', hashtag: '#区块链技术', popularity: 65 },
    { id: '12', text: '云计算服务', hashtag: '#云计算服务', popularity: 62 },
    { id: '13', text: '移动支付', hashtag: '#移动支付', popularity: 60 },
    { id: '14', text: '物联网应用', hashtag: '#物联网应用', popularity: 58 },
    { id: '15', text: '数据分析', hashtag: '#数据分析', popularity: 55 }
  ];
  
  
  // 聊天历史状态
  const [chatHistory, setChatHistory] = useState<Array<{ 
    type: 'user' | 'ai', 
    message: string, 
    sender?: string,
    buttons?: Array<{ text: string, action: string }>,
    extractionForm?: {
      productName: string,
      productDescription: string,
      startTime: string,
      endTime: string,
      offerType: string,
      sellingPoints: string[]
    },
    themeSelectionForm?: {
      selectedTheme: string,
      themes: Array<{
        id: number,
        title: string
      }>
    }
  }>>([]);
  
  // 多语言内容定义
  const languageContent = {
    'zh-CN': {
      languageName: t('simplifiedChinese'),
      languageCode: 'zh-CN',
      flag: '🇨🇳',
      mema: 'mema',
      aiAssistant: t('aiAssistant'),
      knowledgeBase: t('knowledgeBase'),
      replyPlaceholder: t('replyPlaceholder'),
      initialMessage: t('initialMessage'),
      buttons: {
        preSale: t('preSale'),
        promotion: t('promotion'),
        welcome: t('welcomeContent'),
        newsletter: t('newsletter')
      },
      responses: {
        preSale: t('preSaleChoice'),
        preSaleGoal: t('preSaleGoal'),
        preSaleFollowup: t('preSaleFollowup'),
        provideLink: t('provideLink'),
        requestLink: t('requestLink'),
        extractingContent: t('extractingContent'),
        progressText: t('progressText'),
        extractionComplete: t('extractionComplete'),
        viewResult: t('viewResult'),
        extractionResult: `产品预售信息提取结果：

1. 产品名称
GODIVA歌蒂梵立方巧克力 (2025新升级版)

2. 产品介绍
2025 GODIVA 歌帝梵立方巧克力系列全新升级上市!该系列包含五款全新口味巧克力,并推出三种精美礼盒,是日常享受甜蜜或节日表达心意的臻选佳品。

3. 预售时间
开始时间：2025年8月2日 12:08
结束时间：2025年8月8日 12:08

4. 预售优惠方案
8月大促8折优惠

5. 产品核心卖点
核心卖点1：全新口味,惊喜体验:内含五款创新口味巧克力,带来新鲜独特的味蕾享受;
核心卖点2：礼盒佳选,心意之礼:提供三种不同规格的礼盒系列,满足不同送礼场合需求,是表达爱意与关怀的理想选择。
核心卖点3：日常醇享:不仅限于节日,也适合日常随心享用,让高品质巧克力的醇厚滋味充盈每一天。

您还需要调整哪些信息吗？`,
        manualInput: '没问题！我将引导您逐步填写内容包信息。请告诉我您想要创建的预售产品的基本信息。',
        promotion: '产品促销是很好的营销策略！我会帮您设计吸引人的促销内容，包括优惠信息和行动呼吁。',
        welcome: '欢迎内容是新用户体验的重要一环。我将为您创建温暖、友好的欢迎内容。',
        newsletter: '新闻通讯是维持客户关系的好方法！我会帮您设计有价值的通讯内容结构。'
      },
      preSaleGoals: {
        memberExperience: '给忠实的会员用户提前体验新产品',
        salesKPI: '达成预售期销售额 / 销量 KPI',
        priceTesting: '测试不同价格带的接受度',
        lockOrders: '提前锁定核心客户订单'
      },
      preSaleOptions: {
        provideLink: '提供产品链接自动填写',
        manualInput: '自己填写内容包信息'
      }
    },
    'zh-TW': {
      languageName: '繁體中文',
      languageCode: 'zh-TW',
      flag: '🇹🇼',
      mema: 'mema',
      aiAssistant: 'AI 助手',
      knowledgeBase: '選擇知識庫',
      replyPlaceholder: '回覆 mema',
      initialMessage: 'Hello, Lily，請告訴我你想要創建的內容包的目的是什麼呢？',
      buttons: {
        preSale: '預售新產品',
        promotion: '產品促銷',
        welcome: '歡迎內容',
        newsletter: '新聞通訊'
      },
      responses: {
        preSale: '很好的選擇！預售新產品需要創造期待感和緊迫感。讓我為您提供一些預售內容的建議。',
        preSaleGoal: '預售新產品的目標是什麼？',
        preSaleFollowup: '你想要創建一個針對產品預售的內容包，請問你是希望通過提供已經發布的產品鏈接來提取並自動填寫預售信息還是希望自己填寫內容包信息呢？',
        provideLink: '很好的選擇！請提供您的產品鏈接，我將自動提取產品信息並為您填寫預售內容包的基礎信息。',
        requestLink: '請提供您的產品鏈接地址，我會幫您自動提取產品信息並填寫到預售內容包中。',
        extractingContent: 'AI正在提取內容中，請耐心等待，預計剩餘時間',
        progressText: '提取進度',
        extractionComplete: '產品信息提取完成！點擊下方按鈕查看提取結果。',
        viewResult: '查看提取結果',
        extractionResult: `產品預售信息提取結果：

1. 產品名稱
GODIVA歌蒂梵立方巧克力 (2025新升級版)

2. 產品介紹
2025 GODIVA 歌帝梵立方巧克力系列全新升級上市!該系列包含五款全新口味巧克力,並推出三種精美禮盒,是日常享受甜蜜或節日表達心意的臻選佳品。

3. 預售時間
開始時間：2025年8月2日 12:08
結束時間：2025年8月8日 12:08

4. 預售優惠方案
8月大促8折優惠

5. 產品核心賣點
核心賣點1：全新口味,驚喜體驗:內含五款創新口味巧克力,帶來新鮮獨特的味蕾享受;
核心賣點2：禮盒佳選,心意之禮:提供三種不同規格的禮盒系列,滿足不同送禮場合需求,是表達愛意與關懷的理想選擇。
核心賣點3：日常醇享:不僅限於節日,也適合日常隨心享用,讓高品質巧克力的醇厚滋味充盈每一天。

您還需要調整哪些信息嗎？`,
        manualInput: '沒問題！我將引導您逐步填寫內容包信息。請告訴我您想要創建的預售產品的基本信息。',
        promotion: '產品促銷是很好的營銷策略！我會幫您設計吸引人的促銷內容，包括優惠信息和行動呼籲。',
        welcome: '歡迎內容是新用戶體驗的重要一環。我將為您創建溫暖、友好的歡迎內容。',
        newsletter: '新聞通訊是維持客戶關係的好方法！我會幫您設計有價值的通訊內容結構。'
      },
      preSaleGoals: {
        memberExperience: '給忠實的會員用戶提前體驗新產品',
        salesKPI: '達成預售期銷售額 / 銷量 KPI',
        priceTesting: '測試不同價格帶的接受度',
        lockOrders: '提前鎖定核心客戶訂單'
      },
      preSaleOptions: {
        provideLink: '提供產品鏈接自動填寫',
        manualInput: '自己填寫內容包信息'
      }
    },
    'ja': {
      languageName: '日本語',
      languageCode: 'ja',
      flag: '🇯🇵',
      mema: 'mema',
      aiAssistant: 'AI アシスタント',
      knowledgeBase: 'ナレッジベースを選択',
      replyPlaceholder: 'memaに返信',
      initialMessage: 'Hello, Lily、作成したいコンテンツパックの目的を教えてください。',
      buttons: {
        preSale: '新製品の先行販売',
        promotion: '製品プロモーション',
        welcome: 'ウェルカムコンテンツ',
        newsletter: 'ニュースレター'
      },
      responses: {
        preSale: '素晴らしい選択です！新製品の先行販売には期待感と緊迫感を創造する必要があります。先行販売コンテンツの提案をさせていただきます。',
        preSaleGoal: '新製品の先行販売の目標は何ですか？',
        preSaleFollowup: '製品の先行販売を対象としたコンテンツパックを作成したいと思いますが、既に公開されている製品リンクを提供して先行販売情報を自動入力してもらいたいですか、それとも自分でコンテンツパック情報を入力したいですか？',
        provideLink: '素晴らしい選択です！製品リンクを提供してください。製品情報を自動抽出し、先行販売コンテンツパックの基本情報を入力いたします。',
        requestLink: '製品リンクアドレスを提供してください。製品情報を自動抽出し、先行販売コンテンツパックに記入いたします。',
        extractingContent: 'AIがコンテンツを抽出中です。お待ちください。予想残り時間',
        progressText: '抽出進度',
        extractionComplete: '製品情報の抽出が完了しました！下のボタンをクリックして抽出結果を確認してください。',
        viewResult: '抽出結果を確認',
        extractionResult: `製品プレセール情報抽出結果：

1. 製品名
GODIVA歌蒂梵立方巧克力 (2025新升級版)

2. 製品紹介
2025 GODIVA 歌帝梵立方巧克力系列全新升級上市!該系列包含五款全新口味巧克力,並推出三種精美禮盒,是日常享受甜蜜或節日表達心意的臻選佳品。

3. プレセール時間
開始時間：2025年8月2日 12:08
終了時間：2025年8月8日 12:08

4. プレセール優惠方案
8月大促8折優惠

5. 製品核心賣點
核心賣點1：全新口味,驚喜體驗:內含五款創新口味巧克力,帶來新鮮獨特的味蕾享受;
核心賣點2：禮盒佳選,心意之禮:提供三種不同規格的禮盒系列,滿足不同送禮場合需求,是表達愛意與關懷的理想選擇。
核心賣點3：日常醇享:不僅限於節日,也適合日常隨心享用,讓高品質巧克力的醇厚滋味充盈每一天。

他に調整が必要な情報はありますか？`,
        manualInput: '問題ありません！コンテンツパック情報の入力を段階的にご案内いたします。作成したい先行販売製品の基本情報を教えてください。',
        promotion: '製品プロモーションは優れたマーケティング戦略です！魅力的なプロモーションコンテンツをデザインし、特典情報と行動喚起を含めます。',
        welcome: 'ウェルカムコンテンツは新規ユーザー体験の重要な要素です。温かく親しみやすいウェルカムコンテンツを作成いたします。',
        newsletter: 'ニュースレターは顧客関係を維持する良い方法です！価値のあるニュースレターコンテンツの構造をデザインいたします。'
      },
      preSaleGoals: {
        memberExperience: '忠実なメンバーユーザーに新製品を早期体験してもらう',
        salesKPI: '先行販売期間の売上/販売数KPIを達成する',
        priceTesting: '異なる価格帯の受容性をテストする',
        lockOrders: '核心顧客の注文を事前に確保する'
      },
      preSaleOptions: {
        provideLink: '製品リンクを提供して自動入力',
        manualInput: '自分でコンテンツパック情報を入力'
      }
    },
    'en': {
      languageName: 'English',
      languageCode: 'en',
      flag: '🇺🇸',
      mema: 'mema',
      aiAssistant: 'AI Assistant',
      knowledgeBase: 'Select Knowledge Base',
      replyPlaceholder: 'Reply to mema',
      initialMessage: 'Hello, Lily, please tell me what is the purpose of the content pack you want to create?',
      buttons: {
        preSale: 'Pre-sale New Products',
        promotion: 'Product Promotion',
        welcome: 'Welcome Content',
        newsletter: 'Newsletter'
      },
      responses: {
        preSale: 'Great choice! Pre-sale new products need to create anticipation and urgency. Let me provide you with some pre-sale content suggestions.',
        preSaleGoal: 'What is the goal of pre-selling new products?',
        preSaleFollowup: 'You want to create a content pack for product pre-sale. Would you like to provide a published product link to extract and automatically fill in the pre-sale information, or would you prefer to fill in the content pack information yourself?',
        provideLink: 'Great choice! Please provide your product link, and I will automatically extract product information and fill in the basic information for your pre-sale content pack.',
        requestLink: 'Please provide your product link address, and I will help you automatically extract product information and fill it into the pre-sale content pack.',
        extractingContent: 'AI is extracting content, please wait patiently. Estimated remaining time',
        progressText: 'Extraction Progress',
        extractionComplete: 'Product information extraction completed! Click the button below to view the extraction results.',
        viewResult: 'View Extraction Results',
        extractionResult: `Product Pre-sale Information Extraction Results:

1. Product Name
GODIVA歌蒂梵立方巧克力 (2025新升級版)

2. Product Introduction
2025 GODIVA 歌帝梵立方巧克力系列全新升級上市!該系列包含五款全新口味巧克力,並推出三種精美禮盒,是日常享受甜蜜或節日表達心意的臻選佳品。

3. Pre-sale Time
Start Time: August 2, 2025 12:08
End Time: August 8, 2025 12:08

4. Pre-sale Offer
August Big Sale 20% off discount

5. Product Core Selling Points
Core Selling Point 1: 全新口味,驚喜體驗:內含五款創新口味巧克力,帶來新鮮獨特的味蕾享受;
Core Selling Point 2: 禮盒佳選,心意之禮:提供三種不同規格的禮盒系列,滿足不同送禮場合需求,是表達愛意與關懷的理想選擇。
Core Selling Point 3: 日常醇享:不僅限於節日,也適合日常隨心享用,讓高品質巧克力的醇厚滋味充盈每一天。

Do you need to adjust any information?`,
        manualInput: 'No problem! I will guide you step by step to fill in the content pack information. Please tell me the basic information about the pre-sale product you want to create.',
        promotion: 'Product promotion is a great marketing strategy! I will help you design attractive promotional content, including discount information and call-to-action.',
        welcome: 'Welcome content is an important part of the new user experience. I will create warm and friendly welcome content for you.',
        newsletter: 'Newsletter is a great way to maintain customer relationships! I will help you design valuable newsletter content structure.'
      },
      preSaleGoals: {
        memberExperience: 'Let loyal member users experience new products early',
        salesKPI: 'Achieve pre-sale period sales / volume KPI',
        priceTesting: 'Test acceptance of different price ranges',
        lockOrders: 'Lock in core customer orders in advance'
      },
      preSaleOptions: {
        provideLink: 'Provide product link for auto-fill',
        manualInput: 'Fill in content pack information myself'
      }
    }
  }  
  // 获取当前语言的聊天历史
  const getInitialChatHistory = (lang: 'zh-CN' | 'zh-TW' | 'ja' | 'en') => {
    const content = languageContent[lang];
    return [
      {
        type: 'ai' as const,
        message: content.initialMessage,
        sender: content.mema,
        buttons: [
          { text: content.buttons.preSale, action: 'pre-sale' },
          { text: content.buttons.promotion, action: 'promotion' },
          { text: content.buttons.welcome, action: 'welcome' },
          { text: content.buttons.newsletter, action: 'newsletter' }
        ]
      }
    ];
  }  
  // 初始化聊天历史
  useEffect(() => {
    setChatHistory(getInitialChatHistory(displayLanguage));
  }, []);

  // 聊天历史滚动到底部的引用
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 自动滚动到聊天历史底部
  useEffect(() => {
    if (chatHistoryRef.current) {
      // 滚动到底部显示最新消息
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // 检测消息是否包含链接
  const isLinkMessage = (message: string): boolean => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasUrl = urlRegex.test(message);
    console.log('链接检测:', message, '是否包含链接:', hasUrl); // 调试信息
    return hasUrl;
  }
  // 开始链接提取过程
  const startExtractionProcess = (userMessage: string) => {
    setIsExtracting(true);
    setExtractionTimeLeft(30);
    
    // 添加用户消息
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    
    // 立即添加AI回复的提取消息
    const content = languageContent[displayLanguage];
    setChatHistory(prev => [...prev, { 
      type: 'ai', 
      message: `${content.responses.extractingContent} 30s`,
      sender: content.mema
    }]);
  }
  // 倒计时效果
  useEffect(() => {
    let timer: any;
    
    if (isExtracting && extractionTimeLeft > 0) {
      timer = setTimeout(() => {
        setExtractionTimeLeft(prev => {
          const newTime = prev - 1;
          
          // 更新聊天记录中的倒计时消息
          setChatHistory(prevHistory => {
            const content = languageContent[displayLanguage];
            const newHistory = [...prevHistory];
            const lastMessageIndex = newHistory.length - 1;
            
            // 找到最后一条AI提取消息并更新
            if (lastMessageIndex >= 0 && 
                newHistory[lastMessageIndex].type === 'ai' && 
                (newHistory[lastMessageIndex].message.includes('正在提取') || 
                 newHistory[lastMessageIndex].message.includes('extracting'))) {
              newHistory[lastMessageIndex] = {
                ...newHistory[lastMessageIndex],
                  message: `${content.responses.extractingContent} ${newTime}s`
                }
              }
              
              return newHistory;
          });
          
          return newTime;
        });
      }, 1000);
    } else if (isExtracting && extractionTimeLeft === 0) {
      // 提取完成
      setIsExtracting(false);
      const content = languageContent[displayLanguage];
      console.log('提取完成，准备添加按钮:', (content as any).viewResult); // 调试信息
      
      // 更新最后一条消息为完成状态
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const lastMessageIndex = newHistory.length - 1;
        
        console.log('最后一条消息:', newHistory[lastMessageIndex]); // 调试信息
        
        if (lastMessageIndex >= 0 && 
            newHistory[lastMessageIndex].type === 'ai' && 
            (newHistory[lastMessageIndex].message.includes('正在提取') || 
             newHistory[lastMessageIndex].message.includes('extracting'))) {
          console.log('找到提取消息，更新为完成状态'); // 调试信息
          console.log('viewResult值:', (content as any).viewResult); // 调试信息
          newHistory[lastMessageIndex] = {
            ...newHistory[lastMessageIndex],
            message: (content as any).responses.extractionComplete,
            buttons: [
              { text: (content as any).viewResult, action: 'view-extraction-result' }
            ]
          };
          console.log('设置按钮后的消息:', newHistory[lastMessageIndex]); // 调试信息
        } else {
          console.log('未找到提取消息，添加新消息'); // 调试信息
          // 如果没找到提取消息，直接添加新的完成消息
          newHistory.push({
            type: 'ai',
            message: (content as any).responses.extractionComplete,
            sender: content.mema,
            buttons: [
              { text: (content as any).viewResult, action: 'view-extraction-result' }
            ]
          });
        }
        
        return newHistory;
      });
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isExtracting, extractionTimeLeft, displayLanguage]);
  
  // 聊天对话框拖拽状态
  const [isChatDragging, setIsChatDragging] = useState(false);
  const [chatDragOffset, setChatDragOffset] = useState({ x: 0, y: 0 });
  const [chatPosition, setChatPosition] = useState({ x: 16, y: 80 }); // 默认位置
  
  // 聊天按钮拖拽状态
  const [isButtonDragging, setIsButtonDragging] = useState(false);
  const [buttonDragOffset, setButtonDragOffset] = useState({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 }); // 默认位置，将在useEffect中设置
  
  // 聊天对话框调整大小状态
  const [isChatResizing, setIsChatResizing] = useState(false);
  const [chatResizeDirection, setChatResizeDirection] = useState<string>('');
  const [chatResizeOffset, setChatResizeOffset] = useState({ x: 0, y: 0 });
  const [chatSize, setChatSize] = useState({ width: 400, height: window.innerHeight - 80 }); // 默认尺寸，覆盖到屏幕底部
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const nextZIndex = useRef(1);


  // 下拉选择器选项

  const knowledgeBaseOptions = [
    { value: '', label: '選擇知識庫' },
    { value: 'kb1', label: '產品知識庫' },
    { value: 'kb2', label: '行銷策略庫' },
    { value: 'kb3', label: '客戶服務庫' },
    { value: 'kb4', label: '行業趨勢庫' }
  ];

  // 创建内容卡片
  const createContentCard = (type: ContentCard['type'], title: string, content: string) => {
    return createContentCardAtPosition(type, title, content, Math.random() * 400 + 100, Math.random() * 300 + 100);
  };

  // 上传到平台占位处理
  const handleUploadToPlatform = (platform: 'radica' | 'hubspot') => {
    setUploadMenuOpenId(null);
    if (!emailEditorContent && !generatedEmail) {
      alert('请先生成邮件内容');
      return;
    }
    const html = emailEditorContent || generatedEmail;
    console.log(`准备上传到 ${platform}:`, html.substring(0, 120));
    alert(`已触发上传到 ${platform} 的流程（示例）。可在此对接API。`);
  };

  // 下载HTML
  const handleDownloadEmailHtml = () => {
    setUploadMenuOpenId(null);
    const html = emailEditorContent || generatedEmail;
    if (!html) {
      alert('暂无可下载的邮件内容，请先生成邮件');
      return;
    }
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 在指定位置创建内容卡片
  const createContentCardAtPosition = (type: ContentCard['type'], title: string, content: string, x: number, y: number) => {
    // 根据卡片类型和内容计算合适的尺寸
    let cardWidth = 300; // 默认宽度
    let cardHeight = 150; // 默认高度
    
    if (type === 'content-pack') {
      // 内容包卡片设置更大的高度，确保内容能完整显示
      cardHeight = 600; // 增加高度以确保所有内容都能显示
    } else if (type === 'email') {
      // Email卡片需要更大的空间来显示所有功能
      cardWidth = 450;
      cardHeight = 600;
    } else if (type === 'facebook' || type === 'instagram' || type === 'rednote' || type === 'blog' || type === 'landingpage') {
      // 其他内容类型卡片也需要更多空间
      cardHeight = 250;
    }
    
    const newCard: ContentCard = {
      id: Date.now().toString(),
      type,
      title,
      content,
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      zIndex: nextZIndex.current++
    };
    
    console.log('createContentCardAtPosition 被调用，创建卡片:', newCard); // 调试信息
    console.log('卡片尺寸:', { width: newCard.width, height: newCard.height }); // 调试信息
    
    setContentCards(prev => {
      const newCards = [...prev, newCard];
      console.log('更新内容卡片列表，新数量:', newCards.length); // 调试信息
      console.log('所有卡片:', newCards.map(c => ({ id: c.id, type: c.type, title: c.title }))); // 调试信息
      return newCards;
    });
    
    console.log('createContentCardAtPosition 返回卡片:', newCard); // 调试信息
    return newCard;
  };

  // 处理创建内容按钮点击
  const handleCreateContentClick = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    const card = contentCards.find(c => c.id === cardId);
    if (card) {
      // 悬浮窗顶部与内容包卡片顶部对齐
      setCreateContentPosition({ x: card.x + card.width + 10, y: card.y });
      setShowCreateContentMenu(true);
      // 存储当前来源卡片ID，用于后续创建内容时定位
      setCurrentSourceCardId(cardId);
    }
  };

  // 创建特定类型的内容
  const createSpecificContent = (contentType: string, sourceCardId?: string) => {
    console.log('创建特定类型内容:', contentType, '来源卡片ID:', sourceCardId); // 调试信息
    
    const contentTemplates = {
      email: {
        title: 'Email 内容',
        content: `📧 Email 营销内容\n\n主题：GODIVA 立方巧克力预售\n\n收件人：会员用户\n\n内容：\n• 产品介绍\n• 预售优惠\n• 购买链接\n• 联系方式\n\n状态：待编辑`
      },
      facebook: {
        title: 'Facebook 内容',
        content: `📘 Facebook 帖子\n\n标题：GODIVA 立方巧克力预售开启！\n\n内容：\n• 产品图片\n• 预售信息\n• 用户互动\n• 分享按钮\n\n状态：待发布`
      },
      instagram: {
        title: 'Instagram 内容',
        content: `📷 Instagram 帖子\n\n图片：产品展示\n\n标题：#GODIVA #立方巧克力 #预售\n\n内容：\n• 视觉内容\n• 故事分享\n• 标签使用\n• 互动元素\n\n状态：待发布`
      },
      rednote: {
        title: '小红书 内容',
        content: `📖 小红书笔记\n\n标题：GODIVA 立方巧克力预售体验\n\n内容：\n• 产品测评\n• 使用心得\n• 购买建议\n• 用户分享\n\n状态：待发布`
      },
      blog: {
        title: 'Blog 内容',
        content: `📝 Blog 文章\n\n标题：GODIVA 立方巧克力预售深度解析\n\n内容：\n• 产品背景\n• 口味介绍\n• 购买指南\n• 用户评价\n\n状态：待发布`
      },
      landingpage: {
        title: 'Landing Page',
        content: `🌐 着陆页\n\n标题：GODIVA 立方巧克力预售\n\n内容：\n• 产品展示\n• 预售信息\n• 购买流程\n• 联系表单\n\n状态：待优化`
      }
    };

    // 获取对应模板
    let template = contentTemplates[contentType as keyof typeof contentTemplates];
    let selectedTemplateId = null;
    
    if (template) {
      console.log('使用模板创建内容卡片:', template); // 调试信息
      
      // 如果有来源卡片ID，计算相对位置
      let newCardX = Math.random() * 400 + 100;
      let newCardY = Math.random() * 300 + 100;
      
      if (sourceCardId) {
        const sourceCard = contentCards.find(c => c.id === sourceCardId);
        if (sourceCard) {
          // 新卡片放在来源卡片的右侧
          newCardX = sourceCard.x + sourceCard.width + 20;
          newCardY = sourceCard.y;
          
          // 检查是否有其他卡片在同一位置，如果有则向下偏移
          const existingCardsAtPosition = contentCards.filter(card => 
            card.x === newCardX && card.y === newCardY
          );
          if (existingCardsAtPosition.length > 0) {
            newCardY = sourceCard.y + existingCardsAtPosition.length * 60; // 每个卡片向下偏移60px
          }
        }
      }
      
      const newCard = createContentCardAtPosition(
        contentType as ContentCard['type'], 
        template.title, 
        template.content,
        newCardX,
        newCardY
      );
      
      // 添加选中的模板信息
      if (selectedTemplateId) {
        // newCard.selectedTemplate = selectedTemplateId; // 注释掉，因为ContentCard接口中没有这个属性
      }
      
      console.log('新创建的内容卡片:', newCard); // 调试信息
      setSelectedCard(newCard.id);
      setShowCreateContentMenu(false);
      
      // 清除选中的模板状态
      // setSelectedEmailTemplate(null); // 注释掉，因为不存在这个函数
    } else {
      console.log('未找到对应模板:', contentType); // 调试信息
    }
  };


  // 处理邮件模板选择
  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  // 处理邮件长度选择
  const handleLengthSelect = (length: EmailLength) => {
    setSelectedLength(length);
  };

  // 处理CTA设置更新
  const handleCtaUpdate = (field: keyof CTASettings, value: string) => {
    setCtaSettings(prev => ({ ...prev, [field]: value }));
  };

  // 处理热门话题选择
  const handleTopicSelect = (topic: TrendingTopic) => {
    setSelectedTopics(prev => {
      const isSelected = prev.some(t => t.id === topic.id);
      if (isSelected) {
        return prev.filter(t => t.id !== topic.id);
      } else {
        return [...prev, topic];
      }
    });
  };

  // 调整卡片大小
  const resizeCard = (cardId: string, newWidth: number, newHeight: number) => {
    setContentCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, width: newWidth, height: newHeight }
        : card
    ));
  };

  // 自动调整Email卡片大小
  const autoResizeEmailCard = (cardId: string) => {
    // 根据内容动态调整Email卡片大小
    const baseWidth = 400;
    const baseHeight = 500;
    
    // 如果有生成的内容，增加高度
    const extraHeight = generatedEmail ? 200 : 0;
    
    resizeCard(cardId, baseWidth, baseHeight + extraHeight);
  };
  // 预览HTML邮件
  const handlePreviewHtml = () => {
    if (!selectedTemplate || !selectedTemplate.htmlContent) {
      alert('请先选择一个包含HTML内容的邮件模板');
      return;
    }

    let htmlContent = selectedTemplate.htmlContent;
    
    // 替换模板中的动态内容
    const lengthText = selectedLength === 'short' ? '简短' : selectedLength === 'medium' ? '中等' : '详细';
    const topicsText = selectedTopics.map(t => t.hashtag).join(' ');
    
    htmlContent = htmlContent.replace('{{CTA_TEXT}}', ctaSettings.text);
    htmlContent = htmlContent.replace('{{CTA_URL}}', ctaSettings.url || '#');
    htmlContent = htmlContent.replace('{{TOPICS}}', topicsText || '');
    htmlContent = htmlContent.replace('{{LENGTH}}', lengthText);
    
      // 模板特有的变量替换
      if (selectedTemplate.id === 'template-a') {
        // 模板A (Godiva营销推广模板) 的变量替换
        htmlContent = htmlContent.replace('{{MemberName}}', '張先生');
        htmlContent = htmlContent.replace('{{SocialLinks}}', '#');
        htmlContent = htmlContent.replace('{{CompanyAddress}}', '香港中環皇后大道中99號中環中心');
        htmlContent = htmlContent.replace('{{ContactEmail}}', 'service@godiva.com.hk');
        htmlContent = htmlContent.replace('{{UnsubscribeURL}}', '#');
      } else if (selectedTemplate.id === 'template-b') {
      htmlContent = htmlContent.replace('{{BRAND_NAME}}', 'Starbucks');
      htmlContent = htmlContent.replace('{{PRODUCT_NAME}}', 'Blackberry Sage Refreshers');
      htmlContent = htmlContent.replace('{{PRODUCT_DESCRIPTION}}', 'Sweet blackberries and notes of sage come together in perfect harmony to create this craveable, first-ever winter Refresher. Add lemonade for a tart twist, or coconutmilk for a richer experience.');
      htmlContent = htmlContent.replace('{{RECIPIENT_EMAIL}}', 'customer@example.com');
    } else if (selectedTemplate.id === 'template-c') {
      // 模板C (Godiva会员尊享模板) 的变量替换
      htmlContent = htmlContent.replace('{{BRAND_NAME}}', 'Godiva');
      htmlContent = htmlContent.replace('{{PRODUCT_NAME}}', '2025方形朱古力系列');
      htmlContent = htmlContent.replace('{{MEMBER_TYPE}}', '高級會員');
      htmlContent = htmlContent.replace('{{MEMBER_NAME}}', '張先生');
      htmlContent = htmlContent.replace('{{PRODUCT_DESCRIPTION}}', '這款限量新品融合了東西方風味靈感，採用最優質的可可豆精製而成，每一口都是奢華的味覺盛宴。');
      htmlContent = htmlContent.replace('{{DISCOUNT_RATE}}', '9.5折');
      htmlContent = htmlContent.replace('{{EARLY_DELIVERY}}', '一週');
      htmlContent = htmlContent.replace('{{PREORDER_START_TIME}}', '2025年6月5日 上午10:00');
      htmlContent = htmlContent.replace('{{PREORDER_START_DATE}}', '2025-06-05T10:00:00');
      htmlContent = htmlContent.replace('{{PREORDER_PERIOD}}', '2025年6月5日至6月12日');
      htmlContent = htmlContent.replace('{{CTA_BUTTON_TEXT}}', '尊享預購優惠');
      htmlContent = htmlContent.replace('{{SOCIAL_LINKS}}', '#');
      htmlContent = htmlContent.replace('{{COMPANY_ADDRESS}}', '香港中環皇后大道中99號中環中心');
      htmlContent = htmlContent.replace('{{CONTACT_EMAIL}}', 'service@godiva.com.hk');
      htmlContent = htmlContent.replace('{{UNSUBSCRIBE_URL}}', '#');
    }
    
    setHtmlPreviewContent(htmlContent);
    setShowHtmlPreview(true);
  };

  const handleGenerateEmail = () => {
    if (!selectedTemplate) {
      alert('请先选择一个邮件模板');
      return;
    }

    const lengthText = selectedLength === 'short' ? '简短' : selectedLength === 'medium' ? '中等' : '详细';
    const topicsText = selectedTopics.map(t => t.hashtag).join(' ');
    
    // 如果有HTML内容，使用HTML模板
    if (selectedTemplate.htmlContent) {
      let htmlContent = selectedTemplate.htmlContent;
      
      // 替换模板中的动态内容
      htmlContent = htmlContent.replace('{{CTA_TEXT}}', ctaSettings.text);
      htmlContent = htmlContent.replace('{{CTA_URL}}', ctaSettings.url || '#');
      htmlContent = htmlContent.replace('{{TOPICS}}', topicsText || '');
      htmlContent = htmlContent.replace('{{LENGTH}}', lengthText);
      
      // 模板特有的变量替换
      if (selectedTemplate.id === 'template-a') {
        // 模板A (Godiva营销推广模板) 的变量替换
        htmlContent = htmlContent.replace('{{MemberName}}', '張先生');
        htmlContent = htmlContent.replace('{{SocialLinks}}', '#');
        htmlContent = htmlContent.replace('{{CompanyAddress}}', '香港中環皇后大道中99號中環中心');
        htmlContent = htmlContent.replace('{{ContactEmail}}', 'service@godiva.com.hk');
        htmlContent = htmlContent.replace('{{UnsubscribeURL}}', '#');
      } else if (selectedTemplate.id === 'template-b') {
        htmlContent = htmlContent.replace('{{BRAND_NAME}}', 'Starbucks');
        htmlContent = htmlContent.replace('{{PRODUCT_NAME}}', 'Blackberry Sage Refreshers');
        htmlContent = htmlContent.replace('{{PRODUCT_DESCRIPTION}}', 'Sweet blackberries and notes of sage come together in perfect harmony to create this craveable, first-ever winter Refresher. Add lemonade for a tart twist, or coconutmilk for a richer experience.');
        htmlContent = htmlContent.replace('{{RECIPIENT_EMAIL}}', 'customer@example.com');
      } else if (selectedTemplate.id === 'template-c') {
        // 模板C (Godiva会员尊享模板) 的变量替换
        htmlContent = htmlContent.replace('{{BRAND_NAME}}', 'Godiva');
        htmlContent = htmlContent.replace('{{PRODUCT_NAME}}', '2025方形朱古力系列');
        htmlContent = htmlContent.replace('{{MEMBER_TYPE}}', '高級會員');
        htmlContent = htmlContent.replace('{{MEMBER_NAME}}', '張先生');
        htmlContent = htmlContent.replace('{{PRODUCT_DESCRIPTION}}', '這款限量新品融合了東西方風味靈感，採用最優質的可可豆精製而成，每一口都是奢華的味覺盛宴。');
        htmlContent = htmlContent.replace('{{DISCOUNT_RATE}}', '9.5折');
        htmlContent = htmlContent.replace('{{EARLY_DELIVERY}}', '一週');
        htmlContent = htmlContent.replace('{{PREORDER_START_TIME}}', '2025年6月5日 上午10:00');
        htmlContent = htmlContent.replace('{{PREORDER_START_DATE}}', '2025-06-05T10:00:00');
        htmlContent = htmlContent.replace('{{PREORDER_PERIOD}}', '2025年6月5日至6月12日');
        htmlContent = htmlContent.replace('{{CTA_BUTTON_TEXT}}', '尊享預購優惠');
        htmlContent = htmlContent.replace('{{SOCIAL_LINKS}}', '#');
        htmlContent = htmlContent.replace('{{COMPANY_ADDRESS}}', '香港中環皇后大道中99號中環中心');
        htmlContent = htmlContent.replace('{{CONTACT_EMAIL}}', 'service@godiva.com.hk');
        htmlContent = htmlContent.replace('{{UNSUBSCRIBE_URL}}', '#');
      }
      
      // 设置邮件编辑器内容并打开弹窗
      setEmailEditorContent(htmlContent);
      setShowEmailEditor(true);
    } else {
      // 使用默认的文本模板
      const emailContent = `📧 ${selectedTemplate.name}

📝 邮件长度：${lengthText}
🎯 CTA行动号召：${ctaSettings.text}
🔗 链接：${ctaSettings.url || '未设置'}
🏷️ 热门话题：${topicsText || '未选择'}

📄 邮件内容预览：
基于${selectedTemplate.name}生成的内容将在这里显示...

${selectedTemplate.description}

[生成时间：${new Date().toLocaleString()}]`;

      setGeneratedEmail(emailContent);
    }
    
    // 自动调整Email卡片大小
    const emailCard = contentCards.find(card => card.type === 'email');
    if (emailCard) {
      autoResizeEmailCard(emailCard.id);
    }
  };
  const handleButtonClick = (buttonText: string, action: string) => {
    console.log('按钮点击:', buttonText, action); // 调试信息
    
    // 添加用户选择的按钮消息
    setChatHistory(prev => [...prev, { type: 'user', message: buttonText }]);
    
    // 根据不同的action和当前语言生成不同的AI回复
    const content = languageContent[displayLanguage];
    
    // 如果是预售新产品，显示目标选择
    if (action === 'pre-sale') {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          message: content.responses.preSaleGoal,
          sender: content.mema,
          buttons: [
            { text: content.preSaleGoals.memberExperience, action: 'pre-sale-member' },
            { text: content.preSaleGoals.salesKPI, action: 'pre-sale-kpi' },
            { text: content.preSaleGoals.priceTesting, action: 'pre-sale-price' },
            { text: content.preSaleGoals.lockOrders, action: 'pre-sale-orders' }
          ]
        }]);
      }, 1000);
      return;
    }
    
    let aiResponse = '';
    let isPreSaleGoal = false;
    
    switch (action) {
      case 'promotion':
        aiResponse = content.responses.promotion;
        break;
      case 'welcome':
        aiResponse = content.responses.welcome;
        break;
      case 'newsletter':
        aiResponse = content.responses.newsletter;
        break;
      case 'pre-sale-member':
        aiResponse = '很好的选择！为忠实会员提供早期体验需要强调专属性和尊贵感。我会为您设计会员专属的预售内容，突出会员福利和优先体验权。';
        isPreSaleGoal = true;
        break;
      case 'pre-sale-kpi':
        aiResponse = '明确的目标！达成销售KPI需要创造紧迫感和购买动力。我会为您设计强调限时优惠、数量限制和紧迫感的预售内容。';
        isPreSaleGoal = true;
        break;
      case 'pre-sale-price':
        aiResponse = '聪明的策略！测试价格接受度需要设计不同的价格选项和购买组合。我会为您设计多价位测试的预售内容，帮助您找到最佳价格点。';
        isPreSaleGoal = true;
        break;
      case 'pre-sale-orders':
        aiResponse = '明智的选择！锁定核心客户需要提供具有吸引力的预售优惠。我会为您设计针对核心客户的专属预售内容，强调价值感和投资回报。';
        isPreSaleGoal = true;
        break;
      case 'provide-product-link':
        aiResponse = content.responses.requestLink;
        break;
      case 'manual-input':
        aiResponse = content.responses.manualInput;
        break;
      case 'view-extraction-result':
        console.log('点击查看提取结果按钮'); // 调试信息
        
        // 先添加用户点击消息
        setChatHistory(prev => [...prev, { 
          type: 'user', 
          message: '我要查看提取结果'
        }]);
        
        // 然后添加AI回复的表单
        setTimeout(() => {
          setChatHistory(prev => [...prev, { 
            type: 'ai', 
            message: '好的，以下是提取的产品预售信息：',
            sender: 'mema',
            extractionForm: {
              productName: 'GODIVA歌蒂梵立方巧克力 (2025新升级版)',
              productDescription: '2025 GODIVA 歌帝梵立方巧克力系列全新升级上市!该系列包含五款全新口味巧克力,并推出三种精美礼盒,是日常享受甜蜜或节日表达心意的臻选佳品。',
              startTime: '2025-08-02T12:08',
              endTime: '2025-08-08T12:08',
              offerType: '8月大促8折优惠',
              sellingPoints: [
                '全新口味,惊喜体验:内含五款创新口味巧克力,带来新鲜独特的味蕾享受;',
                '礼盒佳选,心意之礼:提供三种不同规格的礼盒系列,满足不同送礼场合需求,是表达爱意与关怀的理想选择。',
                '日常醇享:不仅限于节日,也适合日常随心享用,让高品质巧克力的醇厚滋味充盈每一天。'
              ]
            }
          }]);
        }, 500);
        
        return; // 不执行后续的AI回复逻辑
      default:
        aiResponse = content.responses.preSale;
    }
    
    // 模拟AI回复
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: aiResponse,
        sender: content.mema
      }]);
      
      // 如果是预售目标选择，添加额外的回复
      if (isPreSaleGoal) {
        setTimeout(() => {
          setChatHistory(prev => [...prev, { 
            type: 'ai', 
            message: content.responses.preSaleFollowup,
            sender: content.mema,
            buttons: [
              { text: content.preSaleOptions.provideLink, action: 'provide-product-link' },
              { text: content.preSaleOptions.manualInput, action: 'manual-input' }
            ]
          }]);
        }, 1500);
      }
    }, 1000);
  };

  // 处理语言切换
  const handleLanguageChange = (newLanguage: 'zh-CN' | 'zh-TW' | 'ja' | 'en') => {
    setDisplayLanguage(newLanguage);
    // 重新生成聊天历史
    setChatHistory(getInitialChatHistory(newLanguage));
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    const card = contentCards.find(c => c.id === cardId);
    if (!card) return;

    setSelectedCard(cardId);
    setIsDragging(true);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !selectedCard || !canvasRef.current) return;

    requestAnimationFrame(() => {
      const canvasRect = canvasRef.current!.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      setContentCards(prev => prev.map(card => 
        card.id === selectedCard 
          ? { ...card, x: Math.max(0, newX), y: Math.max(0, newY) }
          : card
      ));
    });
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
    // 不要取消选中卡片，保持选中状态
    // setSelectedCard(null);
  };

  // 聊天对话框拖拽处理
  const handleChatDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChatDragging(true);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setChatDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleChatDragMove = (e: MouseEvent) => {
    if (!isChatDragging) return;

    requestAnimationFrame(() => {
      const newX = e.clientX - chatDragOffset.x;
      const newY = e.clientY - chatDragOffset.y;
      
      // 限制在视窗范围内
      const maxX = window.innerWidth - 320; // 320px 是对话框宽度
      const maxY = window.innerHeight - 400; // 400px 是对话框高度
      
      setChatPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    });
  };

  const handleChatDragEnd = () => {
    setIsChatDragging(false);
  };

  // 聊天按钮拖拽处理
  const handleButtonDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsButtonDragging(true);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setButtonDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleButtonDragMove = (e: MouseEvent) => {
    if (!isButtonDragging) return;

    requestAnimationFrame(() => {
      const newX = e.clientX - buttonDragOffset.x;
      const newY = e.clientY - buttonDragOffset.y;
      
      // 限制在视窗范围内，但允许在画布区域自由移动
      const maxX = window.innerWidth - 48; // 48px 是按钮宽度
      const maxY = window.innerHeight - 48; // 48px 是按钮高度
      const minY = 80; // 在导航栏下方
      
      setButtonPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      });
    });
  };

  const handleButtonDragEnd = () => {
    setIsButtonDragging(false);
  };

  // 聊天对话框调整大小处理
  const handleChatResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsChatResizing(true);
    setChatResizeDirection(direction);
    
    setChatResizeOffset({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleChatResizeMove = (e: MouseEvent) => {
    if (!isChatResizing) return;

    requestAnimationFrame(() => {
      const deltaX = e.clientX - chatResizeOffset.x;
      const deltaY = e.clientY - chatResizeOffset.y;
    
    let newWidth = chatSize.width;
    let newHeight = chatSize.height;
    let newX = chatPosition.x;
    let newY = chatPosition.y;

    // 根据调整方向计算新尺寸和位置
    if (chatResizeDirection.includes('right')) {
      newWidth = Math.max(350, chatSize.width + deltaX);
    }
    if (chatResizeDirection.includes('left')) {
      newWidth = Math.max(350, chatSize.width - deltaX);
      newX = chatPosition.x + deltaX;
    }
    if (chatResizeDirection.includes('bottom')) {
      newHeight = Math.max(300, chatSize.height + deltaY);
    }
    if (chatResizeDirection.includes('top')) {
      newHeight = Math.max(300, chatSize.height - deltaY);
      newY = chatPosition.y + deltaY;
    }

    // 限制在视窗范围内
    const maxWidth = window.innerWidth - newX;
    const maxHeight = window.innerHeight - newY;
    
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);
    
    // 确保最小高度，让聊天框能够覆盖到屏幕底部
    newHeight = Math.max(newHeight, 400);

      setChatSize({ width: newWidth, height: newHeight });
      setChatPosition({ x: newX, y: newY });
      setChatResizeOffset({ x: e.clientX, y: e.clientY });
    });
  };

  const handleChatResizeEnd = () => {
    setIsChatResizing(false);
    setChatResizeDirection('');
  };

  // 处理聊天消息发送
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');

    // 检查是否是链接消息
    if (isLinkMessage(userMessage)) {
      console.log('检测到链接，开始提取过程'); // 调试信息
      startExtractionProcess(userMessage);
    } else {
      console.log('普通消息，生成AI回复'); // 调试信息
      // 普通消息处理
      setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
      
      // 如果是创建内容的请求，自动创建卡片
      if (userMessage.toLowerCase().includes('create') || userMessage.toLowerCase().includes('generate')) {
        const card = createContentCard('text', 'Generated Content', aiResponse);
        setSelectedCard(card.id);
      }
    }, 1000);
    }
  };

  // 生成AI回复
  const generateAIResponse = (_message: string): string => {
    const responses = [
      "我已經為您生成了一些內容想法。您希望我為此創建一個內容卡片嗎？",
      "根據您的要求，這裡有一些建議。我可以幫助您將它們組織成內容卡片。",
      "我已經為您創建了一個內容大綱。您可以根據需要拖拽和排列卡片。",
      "根據您的輸入，我已經準備了一些內容，您可以自定義並在畫布上排列。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };


  // 删除卡片
  const deleteCard = (cardId: string) => {
    setContentCards(prev => prev.filter(card => card.id !== cardId));
    if (selectedCard === cardId) {
      setSelectedCard(null);
    }
  };

  // 更新卡片内容
  const updateCardContent = (cardId: string, content: string) => {
    setContentCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, content } : card
    ));
  };

  // 事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove, { passive: true });
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, selectedCard, dragOffset]);

  // 聊天对话框拖拽事件监听器
  useEffect(() => {
    if (isChatDragging) {
      document.addEventListener('mousemove', handleChatDragMove, { passive: true });
      document.addEventListener('mouseup', handleChatDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleChatDragMove);
        document.removeEventListener('mouseup', handleChatDragEnd);
      };
    }
  }, [isChatDragging, chatDragOffset]);

  // 设置按钮初始位置 - 放在画布左上角
  useEffect(() => {
    const x = 20; // 距离左边20px
    const y = 100; // 距离顶部100px（在导航栏下方）
    setButtonPosition({ x, y });
  }, []);

  // 设置聊天对话框初始高度，使其覆盖到屏幕底部
  useEffect(() => {
    const height = window.innerHeight - 80; // 减去导航栏高度
    setChatSize(prev => ({ ...prev, height }));
  }, []);

  // 获取项目设置信息
  useEffect(() => {
    // 首先尝试从URL参数中获取项目设置信息
    const brandPackId = searchParams.get('brandPackId');
    const targetAudience = searchParams.get('targetAudience');
    const brandVoice = searchParams.get('brandVoice');
    const brandTone = searchParams.get('brandTone');

    // 如果URL参数中有项目设置信息，使用URL参数
    if (brandPackId || targetAudience || brandVoice || brandTone) {
      const settings = {
        brandPackId: brandPackId || '',
        targetAudience: targetAudience || '',
        brandVoice: brandVoice || '',
        brandTone: brandTone || '',
        title: '',
        goal: ''
      };
      setProjectSettings(settings);
    } 
    // 否则从localStorage中获取
    else if (contentPackId) {
      const settings = getContentPackSettings(contentPackId);
      if (settings) {
        setProjectSettings(settings);
      }
    }

    // 获取品牌包列表
    const packs = getBrandPacks();
    setBrandPacks(packs);
  }, [searchParams, contentPackId]);

  // 聊天按钮拖拽事件监听器
  useEffect(() => {
    if (isButtonDragging) {
      document.addEventListener('mousemove', handleButtonDragMove, { passive: true });
      document.addEventListener('mouseup', handleButtonDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleButtonDragMove);
        document.removeEventListener('mouseup', handleButtonDragEnd);
      };
    }
  }, [isButtonDragging, buttonDragOffset]);

  // 聊天对话框调整大小事件监听器
  useEffect(() => {
    if (isChatResizing) {
      document.addEventListener('mousemove', handleChatResizeMove, { passive: true });
      document.addEventListener('mouseup', handleChatResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleChatResizeMove);
        document.removeEventListener('mouseup', handleChatResizeEnd);
      };
    }
  }, [isChatResizing, chatResizeOffset, chatResizeDirection]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        {/* 主导航栏 */}
        <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard?menu=content-pack')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{contentPackName}</h1>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t('share')}
          </button>
        </div>
        </div>


        {/* 项目设置信息栏 */}
        {projectSettings && (
          <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
            <div className="flex items-center space-x-6 text-sm">
              {/* 品牌包 */}
              {projectSettings.brandPackId && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{t('brandPack')}:</span>
                  <span className="font-medium text-gray-900">
                    {brandPacks.find(pack => pack.id === projectSettings.brandPackId)?.name || projectSettings.brandPackId}
                  </span>
                </div>
              )}
              
              {/* 目标受众 */}
              {projectSettings.targetAudience && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{t('targetAudience')}:</span>
                  <span className="font-medium text-gray-900">{projectSettings.targetAudience}</span>
                </div>
              )}
              
              {/* 品牌声音 */}
              {projectSettings.brandVoice && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{t('brandVoice')}:</span>
                  <span className="font-medium text-gray-900">{projectSettings.brandVoice}</span>
                </div>
              )}
              
              {/* 品牌语调 */}
              {projectSettings.brandTone && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{t('brandTone')}:</span>
                  <span className="font-medium text-gray-900">{projectSettings.brandTone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 主画布区域 */}
      <div 
        ref={canvasRef}
        className="flex-1 h-[calc(100vh-4rem)] relative bg-white"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)', 
          backgroundSize: '20px 20px',
          height: projectSettings ? 'calc(100vh - 7rem)' : 'calc(100vh - 4rem)' // 如果有项目设置信息，增加高度
        }}
        onClick={(e) => {
          // 如果点击的是画布本身（不是卡片），取消选中
          if (e.target === e.currentTarget) {
            setSelectedCard(null);
          }
        }}
      >
        {/* 内容卡片 */}
        {(() => {
          console.log('开始渲染内容卡片，总数:', contentCards.length);
          return null;
        })()}
        {contentCards.map((card) => {
          console.log('渲染单个卡片:', card.id, '类型:', card.type, '位置:', { x: card.x, y: card.y });
          return (
          <div
            key={card.id}
            className={`absolute border-2 rounded-lg shadow-lg bg-white cursor-move select-none ${
              selectedCard === card.id 
                ? 'border-blue-500 shadow-xl' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{
              left: card.x,
              top: card.y,
              width: card.width,
              height: card.height,
              zIndex: card.zIndex
            }}
            onMouseDown={(e) => handleDragStart(e, card.id)}
          >
            {/* 卡片头部 */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  card.type === 'content-pack' ? 'bg-purple-500' : 'bg-blue-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">{card.title}</span>
              </div>
              <div className="flex items-center space-x-1">
                {card.type === 'content-pack' && (
                  <button
                    onClick={(e) => handleCreateContentClick(e, card.id)}
                    className="p-1 hover:bg-purple-100 rounded transition-colors"
                    title={t('createContent')}
                  >
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                )}
                {card.type === 'email' && (
                  <>
                    <button
                      onClick={() => autoResizeEmailCard(card.id)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      title="自动调整大小"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l-5 5m21-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setUploadMenuOpenId(card.id)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="上传至平台"
                      >
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </button>
                      {uploadMenuOpenId === card.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => handleUploadToPlatform('radica')}
                          >
                            上传到 Radica
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => handleUploadToPlatform('hubspot')}
                          >
                            上传到 HubSpot
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={handleDownloadEmailHtml}
                          >
                            下载 HTML
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <button
                  onClick={() => setSelectedCard(card.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 卡片内容 */}
            <div className="flex-1 overflow-hidden">
              {card.type === 'content-pack' ? (
                <div className="h-full overflow-y-auto p-3" style={{ maxHeight: 'calc(100% - 0px)' }}>
                  <div className="space-y-2 pb-4">
                    {/* 内容包表单样式显示 */}
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      <div className="text-xs font-medium text-gray-600">📦 内容包主题</div>
                      <div className="text-xs text-gray-800 bg-white p-2 rounded border">
                        {card.content.split('\n\n')[1]?.split('\n')[0]?.replace('📦 内容包主题：', '') || '未设置'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      <div className="text-xs font-medium text-gray-600">🏷️ 产品信息</div>
                      <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                        <div className="whitespace-pre-line">
                          {card.content.split('🏷️ 产品信息：')[1]?.split('\n\n')[0] || '未设置'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      <div className="text-xs font-medium text-gray-600">⏰ 预售时间</div>
                      <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                        {card.content.split('⏰ 预售时间：')[1]?.split('\n\n')[0] || '未设置'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      <div className="text-xs font-medium text-gray-600">🎯 优惠方案</div>
                      <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                        {card.content.split('🎯 优惠方案：')[1]?.split('\n\n')[0] || '未设置'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      <div className="text-xs font-medium text-gray-600">💎 核心卖点</div>
                      <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                        <div className="whitespace-pre-line">
                          {card.content.split('💎 核心卖点：')[1]?.split('\n\n')[0] || '未设置'}
                        </div>
                      </div>
                    </div>
                    
                    {/* 状态信息 */}
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                      <div className="text-xs font-medium text-gray-600">✅ 状态信息</div>
                      <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                        {card.content.split('✅ 内容包状态：')[1]?.split('\n')[0] || '已创建'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : card.type === 'email' ? (
                <div className="p-3 h-full overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
                  {/* 邮件模板选择 */}
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-600 mb-2">📧 选择邮件模板</h4>
                    <div className="overflow-x-auto pb-2 hide-scrollbar">
                    <div className="flex space-x-2 min-w-max">
                        {emailTemplates.map(template => (
                          <div 
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            className={`flex-shrink-0 w-28 h-16 rounded-lg border-2 cursor-pointer transition-all relative ${
                              selectedTemplate?.id === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="p-2 h-full flex flex-col justify-between">
                              <div className="text-xs font-medium text-gray-700 line-clamp-1">{template.name}</div>
                              <div className="text-xs text-gray-500 truncate">{template.category}</div>
                              {selectedTemplate?.id === template.id && (
                                <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 邮件长度选择 */}
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-600 mb-2">📏 邮件长度</h4>
                    <div className="flex space-x-1">
                      {(['short', 'medium', 'long'] as EmailLength[]).map(length => (
                        <button
                          key={length}
                          onClick={() => handleLengthSelect(length)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                            selectedLength === length
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {length === 'short' ? '短' : length === 'medium' ? '中' : '长'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CTA设置 */}
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-600 mb-2">🎯 CTA行动号召</h4>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={ctaSettings.text}
                        onChange={(e) => handleCtaUpdate('text', e.target.value)}
                        placeholder="CTA按钮文字"
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={ctaSettings.url}
                        onChange={(e) => handleCtaUpdate('url', e.target.value)}
                        placeholder="跳转链接"
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 热门话题选择 */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium text-gray-600">🔥 热门话题</h4>
                      <button
                        onClick={() => setShowTopicsModal(true)}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        更多
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingTopics.slice(0, 8).map(topic => {
                        const isSelected = selectedTopics.some(t => t.id === topic.id);
                        return (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicSelect(topic)}
                            className={`px-2 py-1 text-xs rounded-full transition-all ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {topic.hashtag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* 生成按钮 */}
                  <div className="flex space-x-2 mb-3">
                      <button
                      onClick={handleGenerateEmail}
                      className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                      >
                      ✨ 生成邮件
                      </button>
                    {selectedTemplate?.htmlContent && (
                      <button
                        onClick={handlePreviewHtml}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-all shadow-sm"
                      >
                        👁️ 预览
                      </button>
                    )}
                  </div>

                  {/* 生成的邮件内容 */}
                  {generatedEmail && (
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-medium text-gray-600 mb-2">📄 生成内容</h4>
                      <div className="max-h-[60vh] overflow-y-auto border border-gray-300 rounded">
                        <iframe
                          srcDoc={generatedEmail}
                          className="w-full h-[60vh] border-0"
                          title="邮件预览"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 h-full">
                  <textarea
                    value={card.content}
                    onChange={(e) => updateCardContent(card.id, e.target.value)}
                    className="w-full h-full resize-none border-none outline-none text-sm text-gray-700"
                    placeholder="在此輸入內容..."
                  />
                </div>
              )}
          </div>
          </div>
          );
        })}

        {/* 空状态提示 */}
        {contentCards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('startCreatingContent')}</h3>
              <p className="text-gray-600 mb-4">{t('startCreatingContentDesc')}</p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('startChatWithAI')}
              </button>
            </div>
          </div>
        )}

        {/* 创建内容菜单悬浮框 */}
        {showCreateContentMenu && (
          <div 
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
            style={{
              left: createContentPosition.x,
              top: createContentPosition.y,
              minWidth: '300px'
            }}
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('createContent')}</h3>
            
            
            <div className="space-y-2">
              <button
                onClick={() => createSpecificContent('email', currentSourceCardId || undefined)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs">📧</span>
                </div>
                <span className="text-sm text-gray-700">Email</span>
              </button>
              
              <button
                onClick={() => createSpecificContent('facebook', currentSourceCardId || undefined)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs">📘</span>
                </div>
                <span className="text-sm text-gray-700">Facebook</span>
              </button>
              
              <button
                onClick={() => createSpecificContent('instagram', currentSourceCardId || undefined)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center">
                  <span className="text-xs">📷</span>
                </div>
                <span className="text-sm text-gray-700">Instagram</span>
              </button>
              
              <button
                onClick={() => createSpecificContent('rednote', currentSourceCardId || undefined)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-xs">📖</span>
                </div>
                <span className="text-sm text-gray-700">小红书</span>
              </button>
              
              <button
                onClick={() => createSpecificContent('blog', currentSourceCardId || undefined)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-xs">📝</span>
                </div>
                <span className="text-sm text-gray-700">Blog</span>
              </button>
              
              <button
                onClick={() => createSpecificContent('landingpage', currentSourceCardId || undefined)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-xs">🌐</span>
                </div>
                <span className="text-sm text-gray-700">Landing Page</span>
              </button>
            </div>
          </div>
        )}


        {/* HTML邮件预览弹窗 */}
        {showHtmlPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📧 HTML邮件预览</h3>
                <button
                  onClick={() => setShowHtmlPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                <iframe
                  srcDoc={htmlPreviewContent}
                  className="w-full h-[600px] border border-gray-200 rounded"
                  title="HTML邮件预览"
                />
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowHtmlPreview(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  关闭
                </button>
                </div>
              </div>
          </div>
        )}

        {/* 邮件编辑器弹窗 */}
        {showEmailEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📧 邮件编辑器</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // 复制邮件内容到剪贴板
                      navigator.clipboard.writeText(emailEditorContent);
                      alert('邮件内容已复制到剪贴板');
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    📋 复制
                  </button>
                  <button
                    onClick={() => setShowEmailEditor(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex h-[calc(95vh-80px)]">
                {/* 左侧：HTML源码编辑器 */}
                <div className="w-1/2 border-r border-gray-200 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700">HTML 源码</h4>
                  </div>
                  <div className="flex-1 p-4">
                    <textarea
                      value={emailEditorContent}
                      onChange={(e) => setEmailEditorContent(e.target.value)}
                      className="w-full h-full resize-none border border-gray-300 rounded p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="邮件HTML内容..."
                    />
                  </div>
                </div>
                
                {/* 右侧：邮件预览 */}
                <div className="w-1/2 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700">邮件预览</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <iframe
                      srcDoc={emailEditorContent}
                      className="w-full h-full border-0"
                      title="邮件预览"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">字符数: {emailEditorContent.length}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // 保存邮件内容
                      const blob = new Blob([emailEditorContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'email-template.html';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    💾 保存
                  </button>
                  <button
                    onClick={() => setShowEmailEditor(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 热门话题弹窗 */}
        {showTopicsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🔥 所有热门话题</h3>
                <button
                  onClick={() => setShowTopicsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(topic => {
                  const isSelected = selectedTopics.some(t => t.id === topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className={`px-3 py-2 rounded-full transition-all flex items-center space-x-2 ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-sm">{topic.hashtag}</span>
                      <span className="text-xs opacity-75">({topic.popularity})</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  已选择 {selectedTopics.length} 个话题
                </div>
                <button
                  onClick={() => setShowTopicsModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 点击外部关闭菜单 */}
        {showCreateContentMenu && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowCreateContentMenu(false)}
          />
        )}

        {/* 提示弹窗 */}
        {showTipModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('pleaseCreateContentPackFirst')}</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  {t('beforeCreatingContent')}
                </p>
                <p className="text-sm text-gray-500">
                  {t('pleaseClickStartChat')}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTipModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    setShowTipModal(false);
                    setIsChatOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('startCreatingContentPack')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 左侧悬浮聊天对话框 */}
      <div 
        className={`fixed bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 flex flex-col ${
          isChatDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isChatResizing ? 'select-none' : ''}`}
        style={{
          left: isChatOpen ? chatPosition.x : -chatSize.width - 20,
          top: chatPosition.y,
          width: chatSize.width,
          height: chatSize.height,
          zIndex: 1000,
          opacity: isChatOpen ? 1 : 0
        }}
      >
        {/* 聊天头部 */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-100 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleChatDragStart}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{languageContent[displayLanguage].mema}</h3>
              <p className="text-xs text-gray-500">{languageContent[displayLanguage].aiAssistant}</p>
            </div>
            <div className="flex space-x-1 ml-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* 语言切换选择器 */}
            <select
              value={displayLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as 'zh-CN' | 'zh-TW' | 'ja' | 'en')}
              className="px-2 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              title="切换显示语言"
            >
              <option value="zh-CN">🇨🇳 简体中文</option>
              <option value="zh-TW">🇹🇼 繁體中文</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="en">🇺🇸 English</option>
            </select>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 聊天内容区域 - 使用flex布局 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 聊天历史 - 占用剩余空间，第一条在顶部 */}
          <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((message, index) => (
              <div key={index} className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* 头像 */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  }`}>
                    {message.type === 'user' ? 'L' : 'M'}
                  </div>
                </div>
                
                {/* 消息内容 */}
                <div className={`max-w-sm px-3 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                  {message.sender && (
                    <p className="text-xs font-medium mb-1 opacity-75">{message.sender}</p>
                  )}
                <p className="text-sm">{message.message}</p>
                  
                  {/* 提取进度条 */}
                  {isExtracting && (
                    message.message.includes('正在提取内容中') || 
                    message.message.includes('正在提取內容中') ||
                    message.message.includes('抽出中です') ||
                    message.message.includes('extracting content')
                  ) && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${((30 - extractionTimeLeft) / 30) * 100}%` }}
                        ></div>
              </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {(languageContent[displayLanguage] as any).progressText}: {Math.round(((30 - extractionTimeLeft) / 30) * 100)}%
                      </p>
            </div>
                  )}
                  
                  {/* 显示提取结果表单 */}
                  {message.extractionForm && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">产品预售信息提取结果：</h4>
                      
                      {/* 1. 产品名称 */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">1. 产品名称</label>
                        <input
                          type="text"
                          value={message.extractionForm.productName}
                          onChange={(e) => {
                            const newHistory = [...chatHistory];
                            const messageIndex = chatHistory.findIndex(msg => msg === message);
                            if (messageIndex !== -1 && newHistory[messageIndex].extractionForm) {
                              newHistory[messageIndex].extractionForm!.productName = e.target.value;
                              setChatHistory(newHistory);
                            }
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
        </div>

                      {/* 2. 产品介绍 */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">2. 产品介绍</label>
                        <textarea
                          value={message.extractionForm.productDescription}
                          onChange={(e) => {
                            const newHistory = [...chatHistory];
                            const messageIndex = chatHistory.findIndex(msg => msg === message);
                            if (messageIndex !== -1 && newHistory[messageIndex].extractionForm) {
                              newHistory[messageIndex].extractionForm!.productDescription = e.target.value;
                              setChatHistory(newHistory);
                            }
                          }}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                      </div>

                      {/* 3. 预售时间 */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">3. 预售时间</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">开始时间</label>
                            <input
                              type="datetime-local"
                              value={message.extractionForm.startTime}
                              onChange={(e) => {
                                const newHistory = [...chatHistory];
                                const messageIndex = chatHistory.findIndex(msg => msg === message);
                                if (messageIndex !== -1 && newHistory[messageIndex].extractionForm) {
                                  newHistory[messageIndex].extractionForm!.startTime = e.target.value;
                                  setChatHistory(newHistory);
                                }
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">结束时间</label>
                            <input
                              type="datetime-local"
                              value={message.extractionForm.endTime}
                              onChange={(e) => {
                                const newHistory = [...chatHistory];
                                const messageIndex = chatHistory.findIndex(msg => msg === message);
                                if (messageIndex !== -1 && newHistory[messageIndex].extractionForm) {
                                  newHistory[messageIndex].extractionForm!.endTime = e.target.value;
                                  setChatHistory(newHistory);
                                }
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. 预售优惠方案 */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">4. 预售优惠方案</label>
                        <select
                          value={message.extractionForm.offerType}
                          onChange={(e) => {
                            const newHistory = [...chatHistory];
                            const messageIndex = chatHistory.findIndex(msg => msg === message);
                            if (messageIndex !== -1 && newHistory[messageIndex].extractionForm) {
                              newHistory[messageIndex].extractionForm!.offerType = e.target.value;
                              setChatHistory(newHistory);
                            }
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="">选择优惠方案</option>
                          <option value="8月大促8折优惠">8月大促8折优惠</option>
                          <option value="早鸟价7折优惠">早鸟价7折优惠</option>
                          <option value="限时9折优惠">限时9折优惠</option>
                          <option value="买二送一优惠">买二送一优惠</option>
                          <option value="新用户专享优惠">新用户专享优惠</option>
                          <option value="会员专属优惠">会员专属优惠</option>
                        </select>
                      </div>

                      {/* 5. 产品核心卖点 */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">5. 产品核心卖点</label>
          <div className="space-y-2">
                          {message.extractionForm.sellingPoints.map((point, index) => (
                            <div key={index}>
                              <label className="block text-xs text-gray-500 mb-1">核心卖点{index + 1}</label>
                              <textarea
                                value={point}
                                onChange={(e) => {
                                  const newHistory = [...chatHistory];
                                  const messageIndex = chatHistory.findIndex(msg => msg === message);
                                  if (messageIndex !== -1 && newHistory[messageIndex].extractionForm) {
                                    const newPoints = [...newHistory[messageIndex].extractionForm!.sellingPoints];
                                    newPoints[index] = e.target.value;
                                    newHistory[messageIndex].extractionForm!.sellingPoints = newPoints;
                                    setChatHistory(newHistory);
                                  }
                                }}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                placeholder={`输入核心卖点${index + 1}...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                          onClick={() => {
                            // 添加保存成功的消息
                            setChatHistory(prev => [...prev, { 
                              type: 'user', 
                              message: '确认保存以上信息'
                            }]);
                            setTimeout(() => {
                              setChatHistory(prev => [...prev, { 
                                type: 'ai', 
                                message: '产品预售信息已保存成功！您可以继续创建其他内容或进行下一步操作。',
                                sender: 'mema'
                              }]);
                              // 添加主题选择表单
                              setTimeout(() => {
                                setChatHistory(prev => [...prev, { 
                                  type: 'ai', 
                                  message: '接下来请选择内容包的主题，我们已经根据前面设定的内容帮你预设了几个内容主题。',
                                  sender: 'mema',
                                  themeSelectionForm: {
                                    selectedTheme: '',
                                    themes: [
                                      {
                                        id: 1,
                                        title: '一口入魂,五重奏響| GODIVA 立方巧克力禮盒,限時預售中!'
                                      },
                                      {
                                        id: 2,
                                        title: '方寸之間,藏盡甜蜜 | GODIVA 匠心立方禮盒,驚喜預售開啟!'
                                      },
                                      {
                                        id: 3,
                                        title: '解鎖立方,邂逅5種摯愛| GODIVA 限定巧克力禮盒,預售搶先訂!'
                                      },
                                      {
                                        id: 4,
                                        title: '一口驚豔,五層奢享| GODIVA 立方巧克力藝術禮盒,預售盛啟!'
                                      }
                                    ]
                                  }
                                }]);
                              }, 800);
                            }, 500);
                          }}
                          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          确认保存以上信息
              </button>
          </div>
        </div>
                  )}
                  
                  {/* 显示主题选择表单 */}
                  {message.themeSelectionForm && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">选择内容包主题：</h4>
                      
                      <div className="space-y-3">
                        {message.themeSelectionForm.themes.map((theme) => (
                          <div 
                            key={theme.id} 
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                              message.themeSelectionForm?.selectedTheme === theme.id.toString() 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              const newHistory = [...chatHistory];
                              const messageIndex = chatHistory.findIndex(msg => msg === message);
                              if (messageIndex !== -1 && newHistory[messageIndex].themeSelectionForm) {
                                newHistory[messageIndex].themeSelectionForm!.selectedTheme = theme.id.toString();
                                setChatHistory(newHistory);
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="theme-selection"
                                checked={message.themeSelectionForm?.selectedTheme === theme.id.toString()}
                                onChange={() => {
                                  const newHistory = [...chatHistory];
                                  const messageIndex = chatHistory.findIndex(msg => msg === message);
                                  if (messageIndex !== -1 && newHistory[messageIndex].themeSelectionForm) {
                                    newHistory[messageIndex].themeSelectionForm!.selectedTheme = theme.id.toString();
                                    setChatHistory(newHistory);
                                  }
                                }}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <span className="text-sm text-gray-700">{theme.title}</span>
                              </div>
                            </div>
                          </div>
                        ))}
            </div>

                      <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-3">
                        <button className="flex-1 px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex items-center justify-center">
                          重新生成
                        </button>
                        <button 
                          onClick={() => {
                            // 添加用户选择消息
                            const selectedTheme = message.themeSelectionForm?.themes.find(
                              theme => theme.id.toString() === message.themeSelectionForm?.selectedTheme
                            );
                            setChatHistory(prev => [...prev, { 
                              type: 'user', 
                              message: `保存主题：${selectedTheme?.title || '未选择主题'}`
                            }]);
                            
                            // 创建内容包卡片
                            if (selectedTheme) {
                              console.log('开始创建内容包卡片，选择的主题:', selectedTheme); // 调试信息
                              console.log('当前内容卡片数量（创建前）:', contentCards.length); // 调试信息
                              
                              const contentPackCard = createContentCard('content-pack', 'GODIVA 内容包', 
                                `📦 内容包主题：\n${selectedTheme.title}\n\n🏷️ 产品信息：\n• 产品名称：GODIVA歌蒂梵立方巧克力 (2025新升级版)\n• 产品介绍：2025 GODIVA 歌帝梵立方巧克力系列全新升级上市！该系列包含五款全新口味巧克力，并推出三种精美礼盒。\n\n⏰ 预售时间：\n• 开始时间：2025年8月2日 12:08\n• 结束时间：2025年8月8日 12:08\n\n🎯 优惠方案：\n• 8月大促8折优惠\n\n💎 核心卖点：\n• 全新口味，惊喜体验\n• 礼盒佳选，心意之礼\n• 日常醇享，品质生活\n\n✅ 内容包状态：已创建\n📝 您可以继续编辑或添加更多内容。`
                              );
                              
                              console.log('内容包卡片创建成功:', contentPackCard); // 调试信息
                              console.log('卡片ID:', contentPackCard.id); // 调试信息
                              console.log('卡片类型:', contentPackCard.type); // 调试信息
                              console.log('卡片位置:', { x: contentPackCard.x, y: contentPackCard.y }); // 调试信息
                              
                              // 立即选中新创建的卡片
                              setSelectedCard(contentPackCard.id);
                              
                              // 使用 setTimeout 确保状态更新后再检查
                              setTimeout(() => {
                                console.log('延迟检查：当前内容卡片数量:', contentCards.length); // 调试信息
                                console.log('延迟检查：选中的卡片ID:', selectedCard); // 调试信息
                              }, 100);
                            } else {
                              console.log('没有选择主题，无法创建内容包卡片'); // 调试信息
                            }
                            
                            setTimeout(() => {
                              setChatHistory(prev => [...prev, { 
                                type: 'ai', 
                                message: '内容包创建成功！我已经在画布上为您创建了一个内容包卡片，您可以在画布上查看和编辑内容包的详细信息。',
                                sender: 'mema'
                              }]);
                            }, 500);
                          }}
                          className="flex-1 px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                        >
                          保存主题
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 显示按钮选项 */}
                  {message.buttons && message.buttons.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {/* 渲染按钮 */}
                      {message.buttons.map((button, buttonIndex) => {
                        console.log('渲染按钮:', button); // 调试信息
                        return (
                          <button
                            key={buttonIndex}
                            onClick={() => handleButtonClick(button.text, button.action)}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-left break-words"
                          >
                            {button.text || '查看提取结果'}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>

          {/* 底部控件区域 - 固定在底部 */}
          <div className="flex-shrink-0 border-t border-gray-100">
            {/* 知识库选择器 */}
            <div className="p-4 pb-2">
              <select
                value={selectedKnowledgeBase}
                onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">{languageContent[displayLanguage].knowledgeBase}</option>
                {knowledgeBaseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
          </div>
          
            {/* 发送框 */}
            <div className="p-4 pt-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={languageContent[displayLanguage].replyPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
              </div>
            </div>
          </div>
        </div>

        {/* 调整大小控制区域 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 右边框调整 */}
          <div 
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'right')}
          ></div>
          
          {/* 下边框调整 */}
          <div 
            className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'bottom')}
          ></div>
          
          {/* 右下角调整 */}
          <div 
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'bottom-right')}
          ></div>
          
          {/* 左边框调整 */}
          <div 
            className="absolute top-0 left-0 w-1 h-full cursor-ew-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'left')}
          ></div>
          
          {/* 上边框调整 */}
          <div 
            className="absolute top-0 left-0 w-full h-1 cursor-ns-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'top')}
          ></div>
          
          {/* 左上角调整 */}
          <div 
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'top-left')}
          ></div>
          
          {/* 右上角调整 */}
          <div 
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'top-right')}
          ></div>
          
          {/* 左下角调整 */}
          <div 
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize pointer-events-auto hover:bg-blue-500 hover:opacity-50"
            onMouseDown={(e) => handleChatResizeStart(e, 'bottom-left')}
          ></div>
        </div>
      </div>

      {/* 聊天按钮 */}
      <button
        onClick={() => {
          if (!isButtonDragging) {
            setIsChatOpen(!isChatOpen);
          }
        }}
        onMouseDown={handleButtonDragStart}
        className={`fixed w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center ${
          isButtonDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          left: buttonPosition.x,
          top: buttonPosition.y,
          zIndex: 9999
        }}
        title={`按钮位置: x=${buttonPosition.x}, y=${buttonPosition.y}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* 底部工具栏 */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2">
        <button className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            // 检查是否有内容包卡片
            const hasContentPack = contentCards.some(card => card.type === 'content-pack');
            
            if (!hasContentPack) {
              // 如果没有内容包，显示提示弹窗
              setShowTipModal(true);
              return;
            }
            
            // 在底部导航栏+号按钮上方显示创建菜单
            const rect = e.currentTarget.getBoundingClientRect();
            setCreateContentPosition({ 
              x: rect.left - 100, // 在按钮左侧显示菜单
              y: rect.top - 320    // 在按钮上方显示菜单
            });
            setShowCreateContentMenu(true);
            setCurrentSourceCardId(null); // 清空来源卡片ID，表示独立创建
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* 右侧工具栏 */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-2">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a1.5 1.5 0 003 0m0-6V7a1.5 1.5 0 013 0v2.5m-3 0h3" />
          </svg>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </button>
        <div className="flex items-center space-x-2 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-1">
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">100%</span>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>


    </div>
  );
}

export default ContentCreationPage;
