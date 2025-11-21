import { BrandPack } from '../types/brandPack';

// 创建支持多语言的品牌包数据工厂函数
export const createBrandPacks = (t: Function): BrandPack[] => [
  {
    id: '1',
    name: t('radicaBrandPack'),
    logo: '/ai-content-platform-login/Image831/logo/radica.png',
    createdAt: '2024-01-15',
    isEnabled: true,
    creator: t('zhangsan'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan&backgroundColor=b6e3f4&size=40',
    description: t('radicaBrandPackDescription'),
    tags: [t('ai'), t('marketingAutomation'), t('omnichannel'), t('intelligent')]
  },
  {
    id: '2',
    name: t('godivaBrandPack'),
    logo: '/ai-content-platform-login/Image831/logo/godiva.jpeg',
    createdAt: '2024-01-10',
    isEnabled: true,
    creator: t('lisi'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi&backgroundColor=b6e3f4&size=40',
    description: t('godivaBrandPackDescription'),
    tags: [t('luxury'), t('chocolate'), t('highEnd'), t('classic')],
    preview: {
      brandCoreIdentity: {
        brandName: ['GODIVA', 'GODIVA HK', 'GODIVA Chocolatier'],
        brandSlogan: '"Any Moment, A GODIVA Moment" (任何时刻，都是GODIVA时刻)',
        brandStory: '1926年由巧克力大师Pierre Draps于比利时布鲁塞尔创立，品牌名源自传奇人物Godiva夫人，象征着慷慨、勇气与奢华。1968年成为比利时皇室御用巧克力供应商。',
        brandMission: '以顶尖的原料、精湛的工艺和艺术化的设计，为全球消费者提供终极巧克力体验，让每一个时刻都变得更加甜蜜和值得纪念。',
        brandValues: '精湛工艺 (Craftsmanship)、奢华体验 (Luxury)、慷慨分享 (Generosity)、浪漫灵感 (Romance)、永恒经典 (Timeless Elegance)',
        keywords: ['比利时巧克力', '皇室御用', '手工制作', '丝滑口感', '精美礼盒', '馈赠佳品', '浪漫时刻', '自我奖赏']
      },
      brandVoiceTone: {
        personality: '奢华、优雅、浪漫、精致。品牌声音温暖而富有情感，传达出对品质的极致追求和对美好生活的向往。语调专业而不失亲和力，既体现高端定位又保持人性化沟通。',
        toneGuide: '使用温暖而富有诗意的语言，避免过于商业化的表达。强调情感连接和体验价值，用词精准而富有感染力。在描述产品时突出工艺和品质，在传达理念时注重情感共鸣。',
        preferredWords: ['奢华', '精致', '浪漫', '优雅', '品质', '工艺', '体验', '美好', '温暖', '情感'],
        avoidedWords: ['便宜', '实惠', '促销', '打折', '普通', '简单', '快速', '批量', '大众', '常见']
      },
      targetAudience: {
        demographics: ['25-45岁', '都市白领', '中高收入群体'],
        gender: ['男女皆可'],
        income: ['高收入', '年收入50万以上'],
        lifestyle: ['注重生活品质', '追求精致生活'],
        education: ['受教育水平较高', '本科及以上学历'],
        psychological: ['追求品质生活', '注重情感体验', '愿意为高品质产品付费'],
        painPoints: ['对普通产品品质不满意', '希望获得独特体验', '需要情感价值认同'],
        useCases: ['节日礼品赠送', '商务接待', '自我奖赏', '浪漫约会']
      },
      visualAssets: {
        logoDescription: 'GODIVA品牌Logo采用经典的"G"字母设计，结合优雅的字体和金色调，体现奢华与精致的品牌形象。Logo设计简洁而富有辨识度，适合各种应用场景。',
        selectedLogos: [
          { id: 1, name: 'GODIVA', url: '/ai-content-platform-login/Image831/logo/godiva.jpeg', description: 'GODIVA经典Logo' }
        ],
        selectedColorSystems: [
          {
            id: 1,
            name: '色彩系統A',
            mainColors: ['#581B00', '#D4AF37'],
            neutralColors: ['#E5C083', '#F7E7CE', '#9C6A4D'],
            accentColors: ['#000000', '#FFFFFF', '#D2CFCB']
          },
          {
            id: 2,
            name: '色彩系統B',
            mainColors: ['#D4AF37', '#F7E7CE'],
            neutralColors: ['#EAC6B0', '#F4DFD0', '#F3E2BA'],
            accentColors: ['#FFFFFF', '#EAEAEA', '#CFCAC4']
          },
          {
            id: 3,
            name: '色彩系統C',
            mainColors: ['#8E0E13', '#D4AF37'],
            neutralColors: ['#581B00', '#D95B43', '#F3E5C2'],
            accentColors: ['#000000', '#FFFFFF', '#D3D3D3']
          }
        ]
      },
      contentProducts: {
        productList: [
          '高端手工巧克力礼盒系列',
          '季节性限定产品（情人节、圣诞节等）',
          '企业定制礼品服务',
          '在线订购与配送服务'
        ],
        uniqueSellingPoints: [
          '比利时皇室御用巧克力品牌',
          '100%手工制作，传承近百年工艺',
          '使用最优质的比利时巧克力原料',
          '精美包装设计，适合高端礼品赠送'
        ],
        faqList: [
          {
            title: 'GODIVA巧克力的保质期是多久？',
            content: '我们的巧克力在常温下可保存12个月，冷藏可保存18个月。建议在阴凉干燥处保存，避免阳光直射。'
          },
          {
            title: '如何订购定制礼品？',
            content: '您可以通过我们的官网或客服热线订购定制礼品。我们提供个性化包装、贺卡定制等服务，需要提前3-5个工作日预订。'
          },
          {
            title: '是否提供国际配送？',
            content: '是的，我们提供全球配送服务。配送时间和费用因地区而异，具体信息请查看配送页面或联系客服。'
          }
        ]
      },
      seoOptimization: {
        brandKeywords: ['GODIVA', '高端巧克力', '比利时巧克力', '手工巧克力', '礼品巧克力'],
        productKeywords: ['巧克力礼盒', '情人节巧克力', '圣诞节巧克力', '定制巧克力', '企业礼品'],
        industryKeywords: ['食品行业', '奢侈品', '礼品行业', '巧克力品牌', '高端食品']
      },
      socialMedia: {
        facebook: {
          name: 'GODIVA Hong Kong',
          url: 'https://www.facebook.com/GODIVAHongKong'
        },
        instagram: {
          name: '@godiva_hk',
          url: 'https://www.instagram.com/godiva_hk'
        },
        rednote: {
          name: 'GODIVA小红书',
          url: 'https://www.xiaohongshu.com/user/profile/godiva'
        }
      }
    }
  }
];

// 存储当前语言的品牌包数据
let currentBrandPacks: BrandPack[] = [];

// 设置品牌包数据并根据当前语言更新
export const setBrandPacks = (t: Function): void => {
  currentBrandPacks = createBrandPacks(t);
};

export const getBrandPacks = (): BrandPack[] => {
  // 如果还没有初始化，返回默认的中文数据
  if (currentBrandPacks.length === 0) {
    // 临时的默认翻译函数
    const defaultT = (key: string) => {
      const defaultTranslations: {[key: string]: string} = {
        radicaBrandPack: 'Radica品牌包',
        zhangsan: '张三',
        radicaBrandPackDescription: 'Radica AI驱动的全渠道营销自动化平台品牌包，专为营销科技行业设计，包含智能化、专业化的视觉元素和现代化设计风格',
        ai: 'AI',
        marketingAutomation: '营销自动化',
        omnichannel: '全渠道',
        intelligent: '智能化',
        godivaBrandPack: 'Godiva品牌包',
        lisi: '李四',
        godivaBrandPackDescription: 'Godiva高端巧克力品牌包，专为奢侈品行业设计，包含奢华、精致的视觉元素和经典的设计风格',
        luxury: '奢侈品',
        chocolate: '巧克力',
        highEnd: '高端',
        classic: '经典'
      };
      return defaultTranslations[key] || key;
    };
    currentBrandPacks = createBrandPacks(defaultT);
  }
  return currentBrandPacks;
};

export const toggleBrandPackStatus = (id: string): BrandPack[] => {
  const updatedPacks = currentBrandPacks.map(pack => 
    pack.id === id ? { ...pack, isEnabled: !pack.isEnabled } : pack
  );
  // 更新原始数组以保持数据同步
  currentBrandPacks.splice(0, currentBrandPacks.length, ...updatedPacks);
  return updatedPacks;
};

export const createBrandPack = (data: any, t?: Function): BrandPack => {
  const newPack: BrandPack = {
    id: Date.now().toString(),
    name: data.name,
    logo: data.logo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=6b7280&size=80',
    createdAt: new Date().toISOString().split('T')[0],
    isEnabled: true,
    creator: data.creator || (t ? t('currentUser') : '当前用户'),
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current&backgroundColor=b6e3f4&size=40',
    description: data.description,
    tags: data.tags || []
  };
  
  // 添加到当前语言的数组中
  currentBrandPacks.unshift(newPack);
  
  return newPack;
};
