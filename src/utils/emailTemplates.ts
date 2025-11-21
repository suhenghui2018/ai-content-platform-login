// 邮件模板接口定义
export interface EmailTemplate {
  id: string;
  title: string;
  preview: string;
  content: string;
  thumbnail: string;
}

// 邮件模板数据
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'template1',
    title: '营销推广模板 (模板A)',
    preview: '适用于产品营销推广的邮件模板，包含引人注目的标题和清晰的行动号召。',
    content: `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Godiva 2025 方形朱古力 | 會員尊享預購</title>
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
            background: #f8f3e6 url('https://www.transparenttextures.com/patterns/cream-paper.png');
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
            transition: transform 0.3s ease;
        }
        
        .gallery-item:hover img {
            transform: scale(1.05);
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
                <img src="https://s1.imagehub.cc/images/2025/08/23/7e1afb810ac8c39809aaf682bd5040f8.png" alt="Godiva Chocolatier" class="logo">
            </div>
            
            <!-- 主视觉区域 -->
            <div class="hero">
                <img src="https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg" alt="Godiva 2025 方形朱古力" class="hero-image">
                <div class="hero-overlay">
                    <h1 class="hero-title">2025方形朱古力系列</h1>
                    <p class="hero-subtitle">高級會員尊享預購即將開啟</p>
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
                <p style="font-size: 14px; margin: 20px 0 0; color: #8C6D46;">預購開啟時間: 2025年6月5日 上午10:00</p>
            </div>
            
            <!-- 产品亮点 -->
            <div class="product-section">
                <h2 class="section-title">尊享會員特權</h2>
                <p class="product-intro">親愛的{{MemberName}}，您作為Godiva高級會員，我們誠摯邀請您優先預購全新2025方形朱古力系列。這款限量新品融合了東西方風味靈感，採用最優質的可可豆精製而成，每一口都是奢華的味覺盛宴。</p>
                
                <div class="highlight-grid">
                    <div class="highlight-item">
                        <div class="highlight-icon">🌟</div>
                        <h3 class="highlight-title">全球限量</h3>
                        <p class="highlight-desc">僅對高級會員開放預購，全球限量發售</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon">🎁</div>
                        <h3 class="highlight-title">專屬優惠</h3>
                        <p class="highlight-desc">尊享<span style="font-weight: bold; color: #8c6d46;">9.5折</span>獨家優惠</p>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-icon">🚚</div>
                        <h3 class="highlight-title">優先發貨</h3>
                        <p class="highlight-desc">比公眾提前一週收到產品</p>
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
                <h2 class="cta-title">立即預購</h2>
                <p class="cta-text">作為Godiva高級會員，您可於2025年6月5日至6月12日期間享受專屬預購權益</p>
                <a href="https://e.tb.cn/h.6BUaa8HJRtnKoZe?tk=thVbVLgDHfa" class="cta-button">尊享預購優惠</a>
            </div>
            
            <!-- 页脚 -->
            <div class="footer">
                <div class="social-links">
                    <a href="{{SocialLinks}}" class="social-icon">f</a>
                    <a href="{{SocialLinks}}" class="social-icon">in</a>
                    <a href="{{SocialLinks}}" class="social-icon">t</a>
                </div>
                
                <p class="footer-text">
                    {{CompanyAddress}}<br>
                    客服郵箱: <a href="mailto:{{ContactEmail}}" class="footer-link">{{ContactEmail}}</a>
                </p>
                
                <p class="footer-text">
                    <a href="{{UnsubscribeURL}}" class="footer-link">退訂郵件</a>
                </p>
                
                <p class="footer-text">
                    © 2025 Godiva Chocolatier. 保留所有權利。
                </p>
            </div>
        </div>
    </center>
    
    <script>
        // 倒计时功能
        function updateCountdown() {
            const targetDate = new Date('2025-06-05T10:00:00');
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
</html>`,
    thumbnail: '营销邮件缩略图'
  },
  {
    id: 'template2', 
    title: '活动邀请模板 (模板B)',
    preview: '用于活动邀请的邮件模板，包含活动详情和报名链接。',
    content: `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>GODIVA 歌帝梵立方巧克力系列新品預售</title><style>    body {        margin: 0;        padding: 0;        background-color: #f4f4f4;        font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;    }    .container {        width: 100%;        max-width: 600px;        margin: 0 auto;        background-color: #ffffff;        border-collapse: collapse;    }    .header-image {        width: 100%;        height: auto;        display: block;    }    .content {        padding: 30px 40px;        color: #333333;        line-height: 1.6;    }    .title {        font-size: 24px;        font-weight: bold;        color: #8B4513;        margin-top: 0;        margin-bottom: 20px;        text-align: center;    }    .text {        font-size: 16px;        margin-bottom: 20px;        text-align: center;    }    .highlight {        font-weight: bold;        color: #DAA520;    }    .cta-button {        display: block;        width: 200px;        margin: 30px auto;        padding: 15px 20px;        background-color: #DAA520;        color: #ffffff;        text-align: center;        text-decoration: none;        font-size: 16px;        font-weight: bold;        border-radius: 5px;    }    .footer {        padding: 20px;        text-align: center;        font-size: 12px;        color: #999999;    }    .footer a {        color: #999999;        text-decoration: underline;    }</style></head><body>    <!-- Preheader Text -->    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">        探索五款全新口味，享受九五折預售禮遇。    </div>    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>            <td>                <!-- 主題：一封來自GODIVA的甜蜜邀約 | 預覽：探索五款全新口味，享受九五折預售禮遇。 -->                <a href="https://www.godiva.cn/index.html#/CommodityDetail?id=10193" target="_blank">                    <img src="https://s1.imagehub.cc/images/2025/08/11/83f64704d62f32ec83807e2d15c2a6db.md.jpg" alt="GODIVA 立方巧克力" class="header-image">                </a>            </td>        </tr>        <tr>            <td class="content">                <h1 class="title">品味匠心之作，預覽甜蜜新篇</h1>                <p class="text">                    親愛的巧克力鑑賞家，<br><br>                    GODIVA歌帝梵誠邀您率先體驗一場無與倫比的味蕾盛宴。全新立方巧克力系列，承襲比利時精湛工藝，融合創新靈感，帶來五款前所未有的誘人新口味。                </p>                <p class="text">                    每一顆巧克力，都甄選全球頂級原料，經由巧克力大師的巧手匠心製作。搭配三款雅緻的全新禮盒，無論是犒賞自己，還是向摯愛傳遞心意，都是一份奢華而溫暖的臻選。                </p>                <p class="text" style="background-color: #FFF8E1; padding: 15px; border-radius: 8px;">                    <strong>限時預售禮遇</strong><br>                    僅在 <span class="highlight">2025年8月18日至8月20日</span> 期間，<br>                    提前預訂即可尊享 <span class="highlight">九五折優惠</span>。                </p>                <a href="https://www.godiva.cn/index.html#/CommodityDetail?id=10193" class="cta-button" target="_blank">立即預訂</a>            </td>        </tr>        <tr>            <td class="footer">                <p>                    此郵件由 GODIVA 發送。如果您不想再收到我們的郵件，請點擊<a href="#" target="_blank">此處退訂</a>。                </p>                <p>                    © 2025 GODIVA Chocolatier, Inc. 保留所有權利。                </p>            </td>        </tr>    </table></body></html>`,
    thumbnail: '活动邀请缩略图'
  },
  {
    id: 'template3',
    title: '新品发布模板 (模板C)',
    preview: '用于新产品发布的邮件模板，突出产品特点和创新点。',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>全新 {{产品名称}} 正式发布！</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .hero {
      background-color: #6c5ce7;
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .hero h1 {
      margin: 0;
      font-size: 32px;
    }
    .hero p {
      margin: 10px 0 0;
      font-size: 18px;
    }
    .content {
      padding: 30px;
    }
    .product-showcase {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .features {
      margin: 30px 0;
    }
    .feature-item {
      background-color: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
    }
    .feature-item h4 {
      margin: 0 0 5px;
      color: #6c5ce7;
    }
    .cta-button {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #6c5ce7;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      font-size: 16px;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>全新发布</h1>
      <p>{{产品名称}}</p>
    </div>
    <div class="content">
      <p>亲爱的 {{收件人姓名}}，</p>
      <p><strong>🚀 激动人心的时刻！</strong> 我们很高兴地宣布 {{产品名称}} 正式发布了！</p>
      
      <div class="product-showcase">
        <h3>{{产品名称}}</h3>
      </div>
      
      <h3>💡 为什么选择我们：</h3>
      <div class="features">
        <div class="feature-item">
          <h4>创新技术</h4>
          <p>采用最新技术，提供卓越性能</p>
        </div>
        <div class="feature-item">
          <h4>卓越性能</h4>
          <p>超越同类产品，满足您的需求</p>
        </div>
        <div class="feature-item">
          <h4>用户友好设计</h4>
          <p>简洁直观的界面，易于使用</p>
        </div>
      </div>
      
      <p><strong>📱 了解更多产品详情：</strong><a href="#">产品链接</a></p>
      
      <div class="cta-button">
        <p>作为我们的尊贵客户，您可以享受专属优惠</p>
        <a href="#" class="button">立即购买</a>
      </div>
      
      <p>感谢您一直以来的支持！</p>
      <p>{{公司名称}} 团队</p>
    </div>
    <div class="footer">
      <p>© 2025 {{公司名称}}. 保留所有权利。</p>
    </div>
  </div>
</body>
</html>`,
    thumbnail: '新品发布缩略图'
  },
  {
    id: 'template4',
    title: '客户关怀模板 (模板D)',
    preview: '用于客户关怀的邮件模板，表达感谢并提供专属优惠。',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>感谢您一直以来的支持，{{收件人姓名}}！</title>
  <style>
    body {
      font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
    }
    .header {
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
      padding: 30px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .thank-you {
      text-align: center;
      margin-bottom: 30px;
    }
    .thank-you h2 {
      color: #ff6b6b;
      margin: 0;
      font-size: 28px;
    }
    .gift-box {
      background-color: #fff5f5;
      border: 2px dashed #ff9a9e;
      border-radius: 10px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    .gift-box h3 {
      color: #ff6b6b;
      margin: 0 0 15px;
    }
    .coupon {
      background-color: white;
      border: 1px solid #ff9a9e;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
      font-weight: bold;
      color: #ff9a9e;
    }
    .button {
      display: inline-block;
      background-color: #ff6b6b;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 15px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>我们珍视您</h1>
    </div>
    <div class="content">
      <div class="thank-you">
        <h2>💖 感谢您！</h2>
      </div>
      
      <p>亲爱的 {{收件人姓名}}，</p>
      <p>感谢您一直以来对我们的支持和信任。您的陪伴是我们前进的动力，我们非常感激。</p>
      
      <div class="gift-box">
        <h3>专属礼物 🎁</h3>
        <p>为了表达我们的感激之情，我们为您准备了专属优惠：</p>
        <ul>
          <li>{{优惠详情}}</li>
          <li>有效期至：{{有效期}}</li>
        </ul>
        <div class="coupon">
          优惠码：{{优惠码}}
        </div>
        <a href="#" class="button">立即使用优惠</a>
      </div>
      
      <p>如果您有任何建议或问题，我们很乐意倾听。</p>
      <p>祝您生活愉快！</p>
      <p>{{公司名称}} 团队</p>
    </div>
    <div class="footer">
      <p>© 2025 {{公司名称}}. 保留所有权利。</p>
    </div>
  </div>
</body>
</html>`,
    thumbnail: '客户关怀缩略图'
  },
  {
    id: 'template5',
    title: '节日祝福模板 (模板E)',
    preview: '用于节日祝福的邮件模板，包含节日问候和特别优惠。',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{节日名称}} 快乐，{{收件人姓名}}！</title>
  <style>
    body {
      font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f3e9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .holiday-header {
      background-color: #e67e22;
      padding: 30px 20px;
      text-align: center;
      color: white;
    }
    .holiday-header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      text-align: center;
      margin-bottom: 30px;
    }
    .greeting h2 {
      color: #e67e22;
      margin: 0;
      font-size: 24px;
    }
    .promotion {
      background-color: #fff9f0;
      border: 1px solid #f39c12;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .promotion h3 {
      color: #d35400;
      margin: 0 0 15px;
      text-align: center;
    }
    .promotion ul {
      padding-left: 20px;
    }
    .promotion li {
      margin-bottom: 8px;
    }
    .cta-button {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #e67e22;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      background-color: #f5f0e5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="holiday-header">
      <h1>{{节日名称}}快乐！</h1>
    </div>
    <div class="content">
      <div class="greeting">
        <h2>🎊 节日快乐！</h2>
      </div>
      
      <p>亲爱的 {{收件人姓名}}，</p>
      <p>在这个特别的 {{节日名称}}，我们向您致以最诚挚的祝福！愿您的节日充满欢乐、祥和与温馨。</p>
      
      <div class="promotion">
        <h3>特别优惠 🎁</h3>
        <p>为庆祝节日，我们准备了特别优惠：</p>
        <ul>
          <li>全场 {{折扣}}% 优惠</li>
          <li>限时礼品赠送</li>
        </ul>
        <div class="cta-button">
          <a href="#" class="button">查看活动详情</a>
        </div>
      </div>
      
      <p>感谢您一直以来的支持，祝您节日快乐！</p>
      <p>{{公司名称}} 团队</p>
    </div>
    <div class="footer">
      <p>© 2025 {{公司名称}}. 保留所有权利。</p>
    </div>
  </div>
</body>
</html>`,
    thumbnail: '节日祝福缩略图'
  }
];