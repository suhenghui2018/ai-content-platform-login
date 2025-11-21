import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateBrandPackData } from '../types/brandPack';
import ServiceAgreementModal from './ServiceAgreementModal';

interface CreateBrandPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateBrandPackData) => void;
  fullscreen?: boolean; // 新增：是否全屏模式
}

const CreateBrandPackModal: React.FC<CreateBrandPackModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate,
  fullscreen = false
}) => {
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'select' | 'basic-info' | 'main' | 'generating' | 'result'>('select');
  const [creationMethod, setCreationMethod] = useState<'ai' | 'quick' | null>(null);
  const [currentStep, setCurrentStep] = useState<'basic' | 'analysis' | 'ai-generating' | 'ai-result' | 'modify' | 'confirm'>('basic');
  const [chatStep, setChatStep] = useState<'basic' | 'analysis' | 'ai-result' | 'modify' | 'confirm'>('basic');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showUserReply, setShowUserReply] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showGuideMessage, setShowGuideMessage] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [guideText, setGuideText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    access: 'public',
    industry: '',
    targetUsers: '',
    brandFeatures: '',
    useCases: [] as string[],
    tags: [] as string[]
  });

  const [step2Data, setStep2Data] = useState({
    website: '',
    socialMedia: '',
    textContent: '',
    knowledgeBase: [] as string[],
    socialPlatforms: {
      facebook: '',
      instagram: '',
      rednote: '',
      tiktok: '',
      weibo: '',
      wechat: ''
    }
  });

  const [selectedInputMethod, setSelectedInputMethod] = useState<'upload' | 'paste' | 'url' | 'social' | 'knowledge'>('upload');
  
  // 聊天容器引用
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // 文件上传引用
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 文件上传状态
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // 临时输入状态（用于网址输入）
  const [tempWebsite, setTempWebsite] = useState('');
  
  // 临时输入状态（用于社交媒体输入）
  const [tempSocialMedia, setTempSocialMedia] = useState('');
  
  // AI分析步骤状态
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
  const [showBrandPackComplete, setShowBrandPackComplete] = useState(false);
  
  // 品牌包查看流程状态
  const [showUserClickBubble, setShowUserClickBubble] = useState(false);
  const [showAILoadingResponse, setShowAILoadingResponse] = useState(false);
  const [showBrandPackDescription, setShowBrandPackDescription] = useState(false);
  const [showBrandPackResult] = useState(false);
  const [showModificationOption] = useState(false);

  // 6个部分的气泡显示状态
  const [showBrandCoreIdentity, setShowBrandCoreIdentity] = useState(false);
  const [showBrandVoiceTone, setShowBrandVoiceTone] = useState(false);
  const [showTargetAudience, setShowTargetAudience] = useState(false);
  const [showVisualAssets, setShowVisualAssets] = useState(false);
  const [showContentProducts, setShowContentProducts] = useState(false);
  const [showSeoOptimization, setShowSeoOptimization] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);

  // 品牌核心身份编辑状态
  const [brandCoreIdentityData, setBrandCoreIdentityData] = useState({
    brandName: ['GODIVA', 'GODIVA HK', 'GODIVA Chocolatier'],
    brandSlogan: '"Any Moment, A GODIVA Moment" (任何时刻，都是GODIVA时刻)',
    brandStory: '1926年由巧克力大师Pierre Draps于比利时布鲁塞尔创立，品牌名源自传奇人物Godiva夫人，象征着慷慨、勇气与奢华。1968年成为比利时皇室御用巧克力供应商。',
    brandMission: '以顶尖的原料、精湛的工艺和艺术化的设计，为全球消费者提供终极巧克力体验，让每一个时刻都变得更加甜蜜和值得纪念。',
    brandValues: '精湛工艺 (Craftsmanship)、奢华体验 (Luxury)、慷慨分享 (Generosity)、浪漫灵感 (Romance)、永恒经典 (Timeless Elegance)',
    keywords: ['比利时巧克力', '皇室御用', '手工制作', '丝滑口感', '精美礼盒', '馈赠佳品', '浪漫时刻', '自我奖赏']
  });

  // 品牌视觉指南编辑状态
  const [brandVisualData, setBrandVisualData] = useState<{
    logoDescription: string;
    selectedLogos: Array<{ id: number; name: string; url: string; description: string; isUploaded?: boolean }>;
    availableLogos: Array<{ id: number; name: string; url: string; description: string; isUploaded?: boolean }>;
    selectedColorSystems: Array<{ id: number; name: string; mainColors: string[]; neutralColors: string[]; accentColors: string[] }>;
    availableColorSystems: Array<{ id: number; name: string; mainColors: string[]; neutralColors: string[]; accentColors: string[] }>;
  }>({
    logoDescription: 'GODIVA品牌Logo采用经典的"G"字母设计，结合优雅的字体和金色调，体现奢华与精致的品牌形象。Logo设计简洁而富有辨识度，适合各种应用场景。',
    selectedLogos: [], // 选中的logo，最多3个
    availableLogos: [ // 可选择的logo图片
      { id: 1, name: 'GODIVA', url: '/Image831/logo/godiva.jpeg', description: 'GODIVA经典Logo' }
    ],
    selectedColorSystems: [], // 选中的色彩系统，最多3个
    availableColorSystems: [ // 可选择的色彩系统
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
  });

  // 品牌声音与语调编辑状态
  const [brandVoiceToneData, setBrandVoiceToneData] = useState({
    personality: '奢华、优雅、浪漫、精致。品牌声音温暖而富有情感，传达出对品质的极致追求和对美好生活的向往。语调专业而不失亲和力，既体现高端定位又保持人性化沟通。',
    toneGuide: '使用温暖而富有诗意的语言，避免过于商业化的表达。强调情感连接和体验价值，用词精准而富有感染力。在描述产品时突出工艺和品质，在传达理念时注重情感共鸣。',
    preferredWords: ['奢华', '精致', '浪漫', '优雅', '品质', '工艺', '体验', '美好', '温暖', '情感'],
    avoidedWords: ['便宜', '实惠', '促销', '打折', '普通', '简单', '快速', '批量', '大众', '常见']
  });

  // 目标受众画像编辑状态
  const [targetAudienceData, setTargetAudienceData] = useState({
    demographics: ['25-45岁', '都市白领', '中高收入群体'],
    gender: ['男女皆可'], // 多选：男性、女性、男女皆可、无性别限制
    income: ['高收入', '年收入50万以上'],
    lifestyle: ['注重生活品质', '追求精致生活'],
    education: ['受教育水平较高', '本科及以上学历'],
    psychological: ['追求品质生活', '注重情感体验', '愿意为高品质产品付费'],
    painPoints: ['对普通产品品质不满意', '希望获得独特体验', '需要情感价值认同'],
    useCases: ['节日礼品赠送', '商务接待', '自我奖赏', '浪漫约会']
  });

  // 气泡折叠状态
  const [bubbleCollapsed, setBubbleCollapsed] = useState({
    brandCoreIdentity: true,
    brandVoiceTone: true,
    targetAudience: true,
    visualAssets: true,
    contentProducts: true,
    seoOptimization: true,
    socialMedia: true
  });

  // Toast提示状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementType, setAgreementType] = useState<'ai' | 'quick'>('quick');

  // 自定义色彩系统弹窗状态
  const [showCustomColorModal, setShowCustomColorModal] = useState(false);
  const [customColorData, setCustomColorData] = useState({
    name: '',
    mainColors: ['', ''],
    neutralColors: ['', '', ''],
    accentColors: ['', '', '']
  });

  // 内容与产品信息编辑状态
  const [contentProductData, setContentProductData] = useState({
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
  });

  // SEO与优化编辑状态
  const [seoData, setSeoData] = useState({
    brandKeywords: ['GODIVA', '高端巧克力', '比利时巧克力', '手工巧克力', '礼品巧克力'],
    productKeywords: ['巧克力礼盒', '情人节巧克力', '圣诞节巧克力', '定制巧克力', '企业礼品'],
    industryKeywords: ['食品行业', '奢侈品', '礼品行业', '巧克力品牌', '高端食品']
  });

  // 社交媒体编辑状态
  const [socialMediaData, setSocialMediaData] = useState({
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
  });

  // 右侧预览加载状态
  const [previewLoadingStates, setPreviewLoadingStates] = useState({
    brandCoreIdentity: false,
    brandVoiceTone: false,
    targetAudience: false,
    visualAssets: false,
    contentProducts: false,
    seoOptimization: false,
    socialMedia: false
  });

  // GODIVA品牌固定数据
  const godivaBrandData = {
    name: 'GODIVA',
    industry: '高端巧克力与甜品',
    targetUsers: '追求品质生活的高端消费者',
    brandFeatures: '奢华、精致、比利时传统工艺',
    description: 'GODIVA是享誉全球的比利时奢华巧克力品牌，传承近百年精湛工艺，为追求极致品质的消费者提供顶级的巧克力体验。品牌融合传统比利时巧克力制作工艺与现代创新设计，每一颗巧克力都是艺术品般的精致之作。',
    logo: '/Image831/全渠道平台登录页插画设计.png',
    colorPalette: ['#8B4513', '#DAA520', '#F5F5DC', '#2F4F4F'],
    brandValues: ['奢华品质', '传统工艺', '创新设计', '精致体验'],
    targetAudience: ['高端消费者', '巧克力爱好者', '礼品购买者', '商务人士'],
    brandPersonality: '优雅、奢华、精致、传统与现代并重',
    keyMessages: [
      '每一颗巧克力都是艺术品',
      '传承比利时百年工艺',
      '为特殊时刻创造美好回忆',
      '奢华品质，精致体验'
    ]
  };

  // GODIVA品牌详细数据 - 6个部分
  // const godivaDetailedData = {
  /*
    brandCoreIdentity: {
      brandName: 'GODIVA Chocolatier',
      brandSlogan: '"Any Moment, A GODIVA Moment" (任何时刻，都是GODIVA时刻)',
      brandStory: '1926年由巧克力大师Pierre Draps于比利时布鲁塞尔创立，品牌名源自传奇人物Godiva夫人，象征着慷慨、勇气与奢华。1968年成为比利时皇室御用巧克力供应商。',
      brandMission: '以顶尖的原料、精湛的工艺和艺术化的设计，为全球消费者提供终极巧克力体验，让每一个时刻都变得更加甜蜜和值得纪念。',
      brandValues: ['精湛工艺 (Craftsmanship)', '奢华体验 (Luxury)', '慷慨分享 (Generosity)', '浪漫灵感 (Romance)', '永恒经典 (Timeless Elegance)'],
      keywords: ['比利时巧克力', '皇室御用', '手工制作', '丝滑口感', '精美礼盒', '馈赠佳品', '浪漫时刻', '自我奖赏']
    },
    brandVoiceTone: {
      personality: '奢华而亲切：如同一位见多识广、品味卓越且乐于分享的朋友，而非高冷疏远。浪漫而愉悦：充满情感，善于为生活创造甜蜜和惊喜。权威而可信：作为行业标杆，传递自信和可靠的信息。',
      toneGuide: '正式而优雅：避免过于随意的网络用语，用词考究。热情而真挚：传递对巧克力艺术的热爱和对消费者的关怀。描述性强：善于运用能激发感官体验的词汇（如"丝滑"、"香醇"、"馥郁"）。',
      preferredWords: ['丝滑', '香醇', '精致', '匠心', '奢华', '臻礼', '体验', '时刻', '比利时传统', '大师之作', '可可芬芳'],
      avoidedWords: ['便宜', '零食', '糖果', '代可可脂']
    },
    targetAudience: {
      demographics: '25-55岁，中高收入，注重生活品质，受教育水平较高',
      psychographics: '追求精致生活，懂得奖赏自己和自己所爱的人，注重品牌背后的故事和情感价值，将巧克力视为一种轻奢体验而非普通零食。愿意为卓越的品质、独特的设计和美好的体验支付溢价。',
      painPoints: '寻找能够表达深厚情感或彰显品味的礼物；希望在日常生活中获得片刻的愉悦和奢华体验；追求真实、高品质的食品。',
      useCases: ['礼品馈赠：情人节、圣诞节、生日、母亲节、婚礼、商务答谢', '自我奖赏：忙碌工作后的放松时刻、下午茶搭配、个人庆祝', '社交分享：派对甜品台、朋友间分享美好事物']
    },
    visualAssets: {
      logo: '经典的金色字母标识，often accompanied by the iconic lady rider silhouette. 确保logo清晰醒目，背景简洁，四周留有足够空间，始终保持完整性。',
      colorSystem: {
        primary: '金色 (奢华、质感，常用于包装和标志)',
        secondary: ['勃艮第红 (优雅、经典)', '巧克力棕 (自然、醇厚)', '纯白色 (洁净、高端)'],
        neutral: ['深黑色', '浅灰色']
      },
      typography: {
        english: '优雅的衬线字体 (体现经典与奢华)',
        chinese: '选择一款精致且易读的黑体或宋体'
      },
      visualStyle: '高端静物摄影（突出巧克力的光泽与质感）、温馨情境摄影（展现分享和享受的时刻）、精致细节特写（展示原料和工艺）'
    },
    contentProducts: {
      productList: [
        '松露巧克力系列 (Truffles): 标志性产品，口感丝滑，口味丰富',
        '夹心巧克力系列: 内含干果、奶油、水果等，口感层次丰富',
        '巧克力大板 (Bars): 不同可可含量的黑巧克力、牛奶巧克力等',
        '节日限定系列: 针对圣诞节、情人节、中秋节等推出的特色礼盒',
        '巧克力冰淇淋',
        '糕点及饼干'
      ],
      uniqueSellingPoints: [
        '比利时传统与工艺: 源自1926年，皇室御用',
        '精选原料: 宣称使用世界各地优质的可可豆和其他原料',
        '手工制作/匠心精神: 部分产品强调手工精制',
        '精美包装设计: 礼盒包装本身即是礼品的一部分，体验感十足'
      ],
      faq: [
        { question: 'GODIVA起源于哪里？', answer: '1926年由Pierre Draps在比利时布鲁塞尔创立。' },
        { question: 'GODIVA有什么含义？', answer: '品牌名源自11世纪英国考文垂的Godiva夫人传奇故事，象征着慷慨、勇气与仁爱。' },
        { question: '为什么GODIVA巧克力比较贵？', answer: '因其选用高品质原料、秉承传统制作工艺、投入匠心设计以及带来的奢华品牌体验。' }
      ]
    },
    seoOptimization: {
      brandKeywords: ['GODIVA', '歌帝梵', '戈迪瓦'],
      productKeywords: ['松露巧克力', '夹心巧克力', '黑巧克力', '巧克力礼盒', '情人节巧克力'],
      industryKeywords: ['高端巧克力', '手工巧克力', '比利时巧克力'],
      scenarioKeywords: ['节日礼物', '商务礼品', '婚礼喜糖', '下午茶']
    }
  };
  */
  
  // 分析步骤配置 - 使用useState以便在语言变化时更新
  const [analysisSteps, setAnalysisSteps] = useState([
    t('analyzingUploadedDocuments'),
    t('analyzingUrlContent'),
    t('analyzingSocialMedia'),
    t('analyzingTextContent'),
    t('analyzingKnowledgeBase'),
    t('analysisCompleteGeneratingResults')
  ]);

  // 监听语言变化，更新分析步骤
  useEffect(() => {
    setAnalysisSteps([
      t('analyzingUploadedDocuments'),
      t('analyzingUrlContent'),
      t('analyzingSocialMedia'),
      t('analyzingTextContent'),
      t('analyzingKnowledgeBase'),
      t('analysisCompleteGeneratingResults')
    ]);
  }, [i18n.language, t]);

  // 自动滚动到聊天底部
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 文件上传处理
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 文件选择处理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };

  // 文件拖拽处理
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };

  // 删除文件
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 添加网址到已添加文档
  const addWebsite = () => {
    if (tempWebsite.trim()) {
      handleStep2InputChange('website', tempWebsite);
      setTempWebsite(''); // 清空临时输入
    }
  };

  // 添加社交媒体到已添加文档
  const addSocialMedia = () => {
    if (tempSocialMedia.trim()) {
      // 将社交媒体内容添加到socialMedia字段
      handleStep2InputChange('socialMedia', tempSocialMedia);
      setTempSocialMedia(''); // 清空临时输入
    }
  };

  // 处理品牌核心身份数据更新
  const handleBrandCoreIdentityChange = (field: string, value: any) => {
    setBrandCoreIdentityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理关键词添加
  const handleAddKeyword = (newKeyword: string) => {
    if (newKeyword.trim() && !brandCoreIdentityData.keywords.includes(newKeyword.trim())) {
      setBrandCoreIdentityData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
    }
  };

  // 处理关键词删除
  const handleRemoveKeyword = (index: number) => {
    setBrandCoreIdentityData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  // 处理品牌名称添加
  const handleAddBrandName = (newBrandName: string) => {
    if (newBrandName.trim() && !brandCoreIdentityData.brandName.includes(newBrandName.trim())) {
      setBrandCoreIdentityData(prev => ({
        ...prev,
        brandName: [...prev.brandName, newBrandName.trim()]
      }));
    }
  };

  // 处理品牌名称删除
  const handleRemoveBrandName = (index: number) => {
    setBrandCoreIdentityData(prev => ({
      ...prev,
      brandName: prev.brandName.filter((_, i) => i !== index)
    }));
  };

  // 处理品牌声音与语调数据更新
  const handleBrandVoiceToneChange = (field: string, value: any) => {
    setBrandVoiceToneData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理推荐词汇添加
  const handleAddPreferredWord = (newWord: string) => {
    if (newWord.trim() && !brandVoiceToneData.preferredWords.includes(newWord.trim())) {
      setBrandVoiceToneData(prev => ({
        ...prev,
        preferredWords: [...prev.preferredWords, newWord.trim()]
      }));
    }
  };

  // 处理推荐词汇删除
  const handleRemovePreferredWord = (index: number) => {
    setBrandVoiceToneData(prev => ({
      ...prev,
      preferredWords: prev.preferredWords.filter((_, i) => i !== index)
    }));
  };

  // 处理避免词汇添加
  const handleAddAvoidedWord = (newWord: string) => {
    if (newWord.trim() && !brandVoiceToneData.avoidedWords.includes(newWord.trim())) {
      setBrandVoiceToneData(prev => ({
        ...prev,
        avoidedWords: [...prev.avoidedWords, newWord.trim()]
      }));
    }
  };

  // 处理避免词汇删除
  const handleRemoveAvoidedWord = (index: number) => {
    setBrandVoiceToneData(prev => ({
      ...prev,
      avoidedWords: prev.avoidedWords.filter((_, i) => i !== index)
    }));
  };

  // 处理品牌视觉数据更新
  const handleBrandVisualChange = (field: string, value: any) => {
    setBrandVisualData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理logo选择
  const handleSelectLogo = (logo: any) => {
    if (brandVisualData.selectedLogos.length < 3 && !brandVisualData.selectedLogos.find(l => l.id === logo.id)) {
      setBrandVisualData(prev => ({
        ...prev,
        selectedLogos: [...prev.selectedLogos, logo]
      }));
    }
  };

  // 处理logo删除
  const handleRemoveLogo = (index: number) => {
    setBrandVisualData(prev => ({
      ...prev,
      selectedLogos: prev.selectedLogos.filter((_, i) => i !== index)
    }));
  };

  // 处理色彩系统选择
  const handleSelectColorSystem = (colorSystem: any) => {
    if (brandVisualData.selectedColorSystems.length < 3 && !brandVisualData.selectedColorSystems.find(cs => cs.id === colorSystem.id)) {
      setBrandVisualData(prev => ({
        ...prev,
        selectedColorSystems: [...prev.selectedColorSystems, colorSystem]
      }));
    }
  };

  // 处理色彩系统删除
  const handleRemoveColorSystem = (index: number) => {
    setBrandVisualData(prev => ({
      ...prev,
      selectedColorSystems: prev.selectedColorSystems.filter((_, i) => i !== index)
    }));
  };

  // 处理自定义色彩系统添加
  const handleAddCustomColorSystem = () => {
    setShowCustomColorModal(true);
    setCustomColorData({
      name: '',
      mainColors: ['', ''],
      neutralColors: ['', '', ''],
      accentColors: ['', '', '']
    });
  };

  // 处理自定义色彩系统保存
  const handleSaveCustomColorSystem = () => {
    if (!customColorData.name.trim()) {
      showToastMessage(t('pleaseEnterColorSystemName'));
      return;
    }

    const newColorSystem = {
      id: Date.now(),
      name: customColorData.name.trim(),
      mainColors: customColorData.mainColors.filter(color => color.trim()),
      neutralColors: customColorData.neutralColors.filter(color => color.trim()),
      accentColors: customColorData.accentColors.filter(color => color.trim())
    };
    
    setBrandVisualData(prev => ({
      ...prev,
      availableColorSystems: [...prev.availableColorSystems, newColorSystem]
    }));
    
    setShowCustomColorModal(false);
    showToastMessage(t('customColorSystemAdded'));
  };

  // 处理自定义色彩数据更新
  const handleCustomColorChange = (field: 'mainColors' | 'neutralColors' | 'accentColors', index: number, value: string) => {
    setCustomColorData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  // 处理内容与产品信息数据更新
  const handleContentProductChange = (field: string, value: any) => {
    setContentProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理产品清单添加
  const handleAddProduct = (newProduct: string) => {
    if (newProduct.trim()) {
      setContentProductData(prev => ({
        ...prev,
        productList: [...prev.productList, newProduct.trim()]
      }));
    }
  };

  // 处理产品清单删除
  const handleRemoveProduct = (index: number) => {
    setContentProductData(prev => ({
      ...prev,
      productList: prev.productList.filter((_, i) => i !== index)
    }));
  };

  // 处理独特卖点添加
  const handleAddSellingPoint = (newPoint: string) => {
    if (newPoint.trim()) {
      setContentProductData(prev => ({
        ...prev,
        uniqueSellingPoints: [...prev.uniqueSellingPoints, newPoint.trim()]
      }));
    }
  };

  // 处理独特卖点删除
  const handleRemoveSellingPoint = (index: number) => {
    setContentProductData(prev => ({
      ...prev,
      uniqueSellingPoints: prev.uniqueSellingPoints.filter((_, i) => i !== index)
    }));
  };

  // 处理FAQ添加
  const handleAddFAQ = () => {
    setContentProductData(prev => ({
      ...prev,
      faqList: [...prev.faqList, { title: '', content: '' }]
    }));
  };

  // 处理FAQ删除
  const handleRemoveFAQ = (index: number) => {
    setContentProductData(prev => ({
      ...prev,
      faqList: prev.faqList.filter((_, i) => i !== index)
    }));
  };

  // 处理FAQ更新
  const handleUpdateFAQ = (index: number, field: 'title' | 'content', value: string) => {
    setContentProductData(prev => ({
      ...prev,
      faqList: prev.faqList.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  // 自适应高度函数
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // 确保所有textarea在组件更新后都能正确设置高度
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea[data-auto-height="true"]');
    textareas.forEach((textarea) => {
      adjustTextareaHeight(textarea as HTMLTextAreaElement);
    });
  }, [contentProductData]);

  // 处理SEO数据更新
  // const handleSeoChange = (field: string, value: any) => {
  //   setSeoData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  // 处理SEO关键词添加
  const handleAddSeoKeyword = (type: 'brandKeywords' | 'productKeywords' | 'industryKeywords', newKeyword: string) => {
    if (newKeyword.trim()) {
      setSeoData(prev => ({
        ...prev,
        [type]: [...prev[type], newKeyword.trim()]
      }));
    }
  };

  // 处理SEO关键词删除
  const handleRemoveSeoKeyword = (type: 'brandKeywords' | 'productKeywords' | 'industryKeywords', index: number) => {
    setSeoData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // 处理社交媒体数据更新
  const handleSocialMediaChange = (platform: string, field: string, value: string) => {
    setSocialMediaData(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // 处理logo上传
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        showToastMessage(t('pleaseSelectImageFile'));
        return;
      }
      
      // 检查文件大小 (限制为2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToastMessage(t('imageFileSizeExceeded'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo = {
          id: Date.now(), // 使用时间戳作为唯一ID
          name: file.name.replace(/\.[^/.]+$/, ""), // 去除文件扩展名
          url: e.target?.result as string,
          description: `${t('uploadedLogo')}: ${file.name}`,
          isUploaded: true
        };
        
        setBrandVisualData(prev => ({
          ...prev,
          availableLogos: [...prev.availableLogos, newLogo]
        }));
        
        showToastMessage(t('logoUploadSuccess'));
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理目标受众画像数据更新
  // const handleTargetAudienceChange = (field: string, value: any) => {
  //   setTargetAudienceData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  // 处理单行文本数组添加
  const handleAddSingleText = (field: string, newText: string) => {
    if (newText.trim() && !targetAudienceData[field as keyof typeof targetAudienceData].includes(newText.trim())) {
      setTargetAudienceData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof targetAudienceData], newText.trim()]
      }));
    }
  };

  // 处理单行文本数组删除
  const handleRemoveSingleText = (field: string, index: number) => {
    setTargetAudienceData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof targetAudienceData].filter((_, i) => i !== index)
    }));
  };

  // 处理多行文本数组添加
  const handleAddMultiText = (field: string, newText: string) => {
    if (newText.trim() && !targetAudienceData[field as keyof typeof targetAudienceData].includes(newText.trim())) {
      setTargetAudienceData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof targetAudienceData], newText.trim()]
      }));
    }
  };

  // 处理多行文本数组删除
  const handleRemoveMultiText = (field: string, index: number) => {
    setTargetAudienceData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof targetAudienceData].filter((_, i) => i !== index)
    }));
  };

  // 处理性别多选
  const handleGenderChange = (gender: string) => {
    setTargetAudienceData(prev => {
      const currentGenders = prev.gender;
      if (currentGenders.includes(gender)) {
        return {
          ...prev,
          gender: currentGenders.filter(g => g !== gender)
        };
      } else {
        return {
          ...prev,
          gender: [...currentGenders, gender]
        };
      }
    });
  };

  // 计算文本行数并设置textarea高度
  // const calculateTextareaHeight = (text: string, minHeight: number = 20) => {
  //   if (!text) return minHeight;
  //   const lines = text.split('\n').length;
  //   const estimatedHeight = Math.max(lines * 20, minHeight);
  //   return Math.min(estimatedHeight, 120); // 最大高度限制为120px
  // };

  // 处理气泡折叠/展开
  const toggleBubbleCollapse = (bubbleType: string) => {
    setBubbleCollapsed(prev => ({
      ...prev,
      [bubbleType]: !prev[bubbleType as keyof typeof prev]
    }));
  };

  // 显示Toast提示
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 处理保存并更新内容
  const handleSaveAndUpdate = (bubbleType: string) => {
    // 显示保存成功提示
    showToastMessage(t('saveSuccess'));
    
    // 自动折叠气泡
    setTimeout(() => {
      setBubbleCollapsed(prev => ({
        ...prev,
        [bubbleType]: true
      }));
    }, 500);
  };

  // 处理查看品牌包点击
  const handleViewBrandPack = () => {
    // 更新进度条到查看AI结果
    setCurrentStep('ai-result');
    
    // 1. 显示用户点击气泡
    setShowUserClickBubble(true);
    scrollToBottom();
    
    // 2. 延迟1秒后显示AI加载响应
    setTimeout(() => {
      setShowAILoadingResponse(true);
      scrollToBottom();
      
      // 3. 延迟3秒后显示品牌包描述，同时隐藏加载响应
      setTimeout(() => {
        setShowAILoadingResponse(false); // 隐藏加载气泡
        setShowBrandPackDescription(true);
        scrollToBottom();
        
        // 4. 延迟1秒后依次显示6个部分的气泡和右侧预览加载效果
        setTimeout(() => {
          // 显示气泡
          setTimeout(() => {
            setShowBrandCoreIdentity(true);
            // 同时开始右侧预览加载
            setPreviewLoadingStates(prev => ({ ...prev, brandCoreIdentity: true }));
          }, 500);
          
          setTimeout(() => {
            setShowBrandVoiceTone(true);
            setPreviewLoadingStates(prev => ({ ...prev, brandVoiceTone: true }));
          }, 1000);
          
          setTimeout(() => {
            setShowTargetAudience(true);
            setPreviewLoadingStates(prev => ({ ...prev, targetAudience: true }));
          }, 1500);
          
          setTimeout(() => {
            setShowVisualAssets(true);
            setPreviewLoadingStates(prev => ({ ...prev, visualAssets: true }));
          }, 2000);
          
          setTimeout(() => {
            setShowContentProducts(true);
            setPreviewLoadingStates(prev => ({ ...prev, contentProducts: true }));
          }, 2500);
          
          setTimeout(() => {
            setShowSeoOptimization(true);
            setPreviewLoadingStates(prev => ({ ...prev, seoOptimization: true }));
          }, 3000);
          
          setTimeout(() => {
            setShowSocialMedia(true);
            setPreviewLoadingStates(prev => ({ ...prev, socialMedia: true }));
          }, 3500);
        }, 1000);
      }, 3000);
    }, 1000);
  };

  // 分析步骤打字效果
  const typeAnalysisStep = (stepIndex: number) => {
    const stepText = analysisSteps[stepIndex];
    let currentIndex = 0;
    setAnalysisText('');
    
    const typeInterval = setInterval(() => {
      if (currentIndex < stepText.length) {
        setAnalysisText(stepText.substring(0, currentIndex + 1));
        currentIndex++;
        scrollToBottom();
      } else {
        clearInterval(typeInterval);
        // 当前步骤完成，等待3秒后进入下一步
        setTimeout(() => {
          if (stepIndex < analysisSteps.length - 1) {
            setAnalysisStep(stepIndex + 1);
            typeAnalysisStep(stepIndex + 1);
                  } else {
          // 所有步骤完成
          setIsAnalyzing(false);
          setShowAnalysisComplete(true);
          
          // 延迟2秒后显示品牌包生成完成消息
          setTimeout(() => {
            setShowBrandPackComplete(true);
            scrollToBottom();
          }, 2000);
          
          // 延迟3秒后自动跳转到下一步
          setTimeout(() => {
            setCurrentStep('ai-result');
            setChatStep('ai-result');
          }, 3000);
        }
        }, 3000); // 每个步骤间隔3秒
      }
    }, 100); // 每100ms打一个字，减慢打字速度
  };

  // 初始化打字效果
  useEffect(() => {
    if (generationStep === 'main' && creationMethod) {
      // 延迟1秒后开始显示欢迎消息
      setTimeout(() => {
        setShowWelcomeMessage(true);
        typeWelcomeText(t('aiWelcomeMessage'), () => {
          // 欢迎消息完成后，延迟1秒显示引导消息
          setTimeout(() => {
            setShowGuideMessage(true);
            typeGuideText(t('pleaseFillBasicInfo'), () => {
              // 引导消息完成后，可以开始交互
            });
          }, 1000);
        });
      }, 1000);
    }
  }, [generationStep, creationMethod]);

  // 监听聊天内容变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [showWelcomeMessage, showGuideMessage, showUserReply, showAIAnalysis, isTyping, typingText, welcomeText, guideText, showBrandPackComplete, isAnalyzing, analysisStep, analysisText, showUserClickBubble, showAILoadingResponse, showBrandPackDescription, showBrandPackResult, showModificationOption, showBrandCoreIdentity, showBrandVoiceTone, showTargetAudience, showVisualAssets, showContentProducts, showSeoOptimization]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t('brandPackNameRequired');
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      if (creationMethod === 'ai') {
        handleAIGeneration();
      } else {
        // 显示服务协议弹窗
        setAgreementType('quick');
        setShowAgreement(true);
      }
    }
  };

  const handleAIGeneration = async () => {
    setIsGenerating(true);
    setGenerationStep('generating');
    
    // 模拟AI生成过程
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 模拟生成结果
    const generatedData = {
      ...formData,
      logo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}&backgroundColor=6b7280&size=200`,
      description: formData.description || `基于"${formData.name}"的AI生成品牌包，包含智能化的视觉元素和现代化设计风格`
    };
    
    setFormData(generatedData);
    setGenerationStep('result');
    setIsGenerating(false);
  };

  const handleConfirmGeneration = () => {
    // 显示服务协议弹窗
    setAgreementType('ai');
    setShowAgreement(true);
  };

  const handleAgreementAgree = () => {
    // 根据协议类型调用不同的处理函数
    if (agreementType === 'ai') {
      handleTraditionalAgreementAgree(); // AI创建方式使用传统处理
    } else {
      handleTraditionalAgreementAgree(); // 传统创建方式
    }
  };

  const handleTraditionalAgreementAgree = () => {
    // 传统创建方式的协议同意处理
    onCreate(formData);
    setFormData({ 
      name: '', 
      description: '', 
      logo: '',
      access: 'public',
      industry: '',
      targetUsers: '',
      brandFeatures: '',
      useCases: [],
      tags: []
    });
    setShowAgreement(false);
    onClose();
  };

  const handleAgreementClose = () => {
    setShowAgreement(false);
  };

  const handleRegenerate = () => {
    setGenerationStep('main');
  };

  const handleMethodSelect = (selectedMethod: 'ai' | 'quick') => {
    setCreationMethod(selectedMethod);
    if (selectedMethod === 'ai') {
      // AI创建：先进入基本信息输入步骤
      setGenerationStep('basic-info');
    } else {
      // 快捷创建：直接进入主界面
      setGenerationStep('main');
    }
  };

  const handleBasicInfoConfirm = () => {
    // 验证基本信息
    if (!formData.name.trim()) {
      setErrors({ name: t('brandPackNameRequired') });
      return;
    }
    if (!formData.description?.trim()) {
      setErrors({ description: t('brandDescriptionRequired') });
      return;
    }
    // 确认后进入主界面
    setGenerationStep('main');
    setErrors({});
  };

  const handleBackToSelect = () => {
    setGenerationStep('select');
    setCreationMethod(null);
    setCurrentStep('basic');
    setFormData(prev => ({
      ...prev,
      name: '',
      description: ''
    }));
    setErrors({});
  };


  // const handleNextStep = () => {
  //   const steps = ['basic', 'analysis', 'ai-result', 'modify', 'confirm'];
  //   const currentIndex = steps.indexOf(currentStep);
  //   if (currentIndex < steps.length - 1) {
  //     setCurrentStep(steps[currentIndex + 1] as any);
  //   }
  // };

  // const handlePrevStep = () => {
  //   const steps = ['basic', 'analysis', 'ai-result', 'modify', 'confirm'];
  //   const currentIndex = steps.indexOf(currentStep);
  //   if (currentIndex > 0) {
  //     setCurrentStep(steps[currentIndex - 1] as any);
  //   }
  // };

  const handleFormInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStep2InputChange = (field: keyof typeof step2Data, value: string | string[] | any) => {
    setStep2Data(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const typeText = (text: string, callback?: () => void) => {
    setIsTyping(true);
    setTypingText('');
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setTypingText(text.substring(0, index + 1));
        index++;
        // 打字过程中也滚动
        scrollToBottom();
      } else {
        clearInterval(timer);
        setIsTyping(false);
        if (callback) {
          callback();
        }
      }
    }, 50); // 每50ms显示一个字符
  };

  const typeWelcomeText = (text: string, callback?: () => void) => {
    setWelcomeText('');
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setWelcomeText(text.substring(0, index + 1));
        index++;
        // 打字过程中也滚动
        scrollToBottom();
      } else {
        clearInterval(timer);
        if (callback) {
          callback();
        }
      }
    }, 50);
  };

  const typeGuideText = (text: string, callback?: () => void) => {
    setGuideText('');
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setGuideText(text.substring(0, index + 1));
        index++;
        // 打字过程中也滚动
        scrollToBottom();
      } else {
        clearInterval(timer);
        if (callback) {
          callback();
        }
      }
    }, 50);
  };

  const handleNextChatStep = () => {
    // 保存当前表单数据
    console.log('保存表单数据:', formData);
    
    // 更新进度条到第二步
    setCurrentStep('analysis');
    
    // 显示用户回复消息
    setShowUserReply(true);
    
    // 5秒后跳转到第二步
    setTimeout(() => {
      setChatStep('analysis');
      setShowAIAnalysis(true);
      typeText(t('brandMaterialInputDesc'), () => {
        // 打字完成后可以继续下一步
      });
    }, 5000);
  };

  const renderProgressSteps = () => {
    const steps = [
      { key: 'basic', label: t('basicInformationForm') },
      { key: 'analysis', label: t('step2BrandMaterialInput') },
      { key: 'ai-generating', label: t('step3AIGenerating') },
      { key: 'ai-result', label: t('step4ViewAIResult') },
      { key: 'confirm', label: t('step5ConfirmContent') }
    ];

    const currentStepIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-1">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                index === currentStepIndex
                  ? 'bg-primary-600 text-white'
                  : index < currentStepIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                index === currentStepIndex ? 'text-primary-600 font-semibold' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-6 h-0.5 bg-gray-300 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    return (
      <div className="flex h-[70vh] min-h-[600px] max-h-[800px]">
        {/* 左侧聊天对话框区域 */}
        <div className="w-[600px] p-6 border-r border-gray-200 bg-white">
          <div className="h-full flex flex-col">
            {/* 聊天标题 */}
            <div className="mb-4 flex-shrink-0 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('aiBrandPackGenerationAssistant')}</h3>
                  <p className="text-sm text-gray-600">{t('intelligentConversationalBrandPackCreation')}</p>
                </div>
              </div>
            </div>
            
            {/* 聊天消息区域 */}
            <div ref={chatContainerRef} className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2 min-h-0">
              {/* AI欢迎消息 - 带打字效果 */}
              {showWelcomeMessage && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800">
                      {welcomeText}
                      {welcomeText.length > 0 && welcomeText.length < t('aiWelcomeMessage').length && (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* AI引导消息 - 带打字效果 */}
              {showGuideMessage && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800 mb-3">
                      {guideText}
                      {guideText.length > 0 && guideText.length < t('pleaseFillBasicInfo').length && (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>
                    
                    {/* 嵌入在聊天中的表单 - 卡片式设计 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      {/* 基本信息表单标题 */}
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-900">{t('basicInformationForm')}</h4>
                        <p className="text-xs text-gray-600 mt-1">{t('pleaseFillBasicInfo')}</p>
                      </div>
                    
                    {/* 品牌包名称 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('brandPackName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={t('pleaseEnterBrandPackName')}
                        value={formData.name}
                        onChange={(e) => handleFormInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">{formData.name.length}/100</div>
                    </div>

                    {/* 品牌包概述 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('brandPackOverview')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder={t('enterBrandPackDescription')}
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleFormInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center">
                          <span className="mr-1">⚡</span>
                          {t('generateDescription')}
                        </button>
                        <div className="text-xs text-gray-500">{formData.description?.length || 0}/500</div>
                      </div>
                    </div>

                    {/* 访问权限设置 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('accessPermissions')}</label>
                      <div className="space-y-2">
                        <label className="flex items-start">
                          <input
                            type="radio"
                            name="access"
                            value="public"
                            checked={formData.access === 'public'}
                            onChange={(e) => handleFormInputChange('access', e.target.value)}
                            className="mt-1 mr-2"
                          />
                          <div>
                            <div className="text-xs font-medium text-gray-900">{t('anyoneInWorkspace')}</div>
                            <div className="text-xs text-gray-500">{t('anyoneInWorkspaceDesc')}</div>
                          </div>
                        </label>
                        <label className="flex items-start">
                          <input
                            type="radio"
                            name="access"
                            value="private"
                            checked={formData.access === 'private'}
                            onChange={(e) => handleFormInputChange('access', e.target.value)}
                            className="mt-1 mr-2"
                          />
                          <div>
                            <div className="text-xs font-medium text-gray-900">{t('onlyMe')}</div>
                            <div className="text-xs text-gray-500">{t('onlyMeDesc')}</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 保存并下一步按钮 */}
                    <div className="pt-2">
                      <button
                        onClick={handleNextChatStep}
                        disabled={!formData.name.trim() || !formData.description?.trim()}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                      >
                        {t('saveAndNextStep')}
                      </button>
                    </div>
                    </div> {/* 表单卡片结束 */}
                  </div>
                </div>
              )}

              {/* 用户回复消息 - 只在点击保存并下一步后显示 */}
              {showUserReply && (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary-600 text-white rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm">{t('userReplyBasicInfoCompleted')}</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                </div>
              )}

              {/* AI分析消息 - 带打字效果 */}
              {showAIAnalysis && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800 mb-3">
                      {isTyping ? (
                        <span>
                          {typingText}
                          <span className="animate-pulse">|</span>
                        </span>
                      ) : (
                          t('aiAnalysisRequestMoreInfo')
                        )}
                    </p>
                    
                    {/* 第二步表单 - 在analysis和ai-result步骤都显示 */}
                    {(chatStep === 'analysis' || chatStep === 'ai-result') && !isTyping && (
                      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="space-y-6">
                          {/* 输入方式选择 - 参考图片样式 */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-900">{t('brandMaterialInputTitle')}</h4>
                            <p className="text-xs text-gray-600">{t('aiAnalysisRequestMoreInfo')}</p>
                          
                          {/* 输入方式按钮组 */}
                          <div className="flex space-x-1 flex-wrap">
                            <button 
                              onClick={() => setSelectedInputMethod('upload')}
                              className={`px-2 py-1.5 text-xs rounded-md font-medium transition-colors flex-shrink-0 ${
                                selectedInputMethod === 'upload' 
                                  ? 'bg-primary-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {t('uploadFile')}
                            </button>
                            <button 
                              onClick={() => setSelectedInputMethod('paste')}
                              className={`px-2 py-1.5 text-xs rounded-md font-medium transition-colors flex-shrink-0 ${
                                selectedInputMethod === 'paste' 
                                  ? 'bg-primary-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {t('pasteText')}
                            </button>
                            <button 
                              onClick={() => setSelectedInputMethod('url')}
                              className={`px-2 py-1.5 text-xs rounded-md font-medium transition-colors flex-shrink-0 ${
                                selectedInputMethod === 'url' 
                                  ? 'bg-primary-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {t('addWebsite')}
                            </button>
                            <button 
                              onClick={() => setSelectedInputMethod('social')}
                              className={`px-2 py-1.5 text-xs rounded-md font-medium transition-colors flex-shrink-0 ${
                                selectedInputMethod === 'social' 
                                  ? 'bg-primary-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {t('socialMedia')}
                            </button>
                            <button 
                              onClick={() => setSelectedInputMethod('knowledge')}
                              className={`px-2 py-1.5 text-xs rounded-md font-medium transition-colors flex-shrink-0 ${
                                selectedInputMethod === 'knowledge' 
                                  ? 'bg-primary-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {t('knowledgeBase')}
                            </button>
                          </div>
                        </div>
                        
                        {/* 统一输入区域 - 根据选择的输入方式显示不同内容 */}
                        <div className="space-y-3">
                          
                          {/* 上传文件方式 */}
                          {selectedInputMethod === 'upload' && (
                            <div className="space-y-4">
                              {/* 隐藏的文件输入 */}
                              <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".doc,.docx,.pdf,.ppt,.pptx,.txt"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              
                              {/* 拖拽上传区域 */}
                              <div 
                                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                                onClick={handleFileUpload}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                              >
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    {t('dragFilesHere')} <span className="text-blue-600 underline">{t('browse')}</span>
                                  </p>
                                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center">
                                        <span className="text-white text-xs">📄</span>
                                      </div>
                                      <span>DOC</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center">
                                        <span className="text-white text-xs">📊</span>
                                      </div>
                                      <span>SLIDES</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                          )}
                          
                          {/* 粘贴文字方式 - 参考图片样式 */}
                          {selectedInputMethod === 'paste' && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700">
                                {t('pasteTextContent')}
                              </label>
                              <textarea
                                placeholder={t('pasteTextPlaceholder')}
                                value={step2Data.textContent}
                                onChange={(e) => handleStep2InputChange('textContent', e.target.value)}
                                rows={8}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                              />
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                  {step2Data.textContent.length}/5000
                                </div>
                                <button
                                  onClick={() => {
                                    // 文字内容已经实时保存到step2Data.textContent中
                                    // 这里可以添加额外的处理逻辑，比如显示成功提示
                                  }}
                                  disabled={!step2Data.textContent.trim()}
                                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {t('addText')}
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* 添加网址方式 - 参考图片样式 */}
                          {selectedInputMethod === 'url' && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {t('websiteLink')}
                                </label>
                                <input
                                  type="url"
                                  placeholder={t('pasteWebsitePlaceholder')}
                                  value={tempWebsite}
                                  onChange={(e) => setTempWebsite(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                                <p className="text-xs text-gray-500">{t('provideValidWebLink')}</p>
                                <div className="flex justify-end">
                                  <button 
                                    onClick={addWebsite}
                                    disabled={!tempWebsite.trim()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {t('addWebsite')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 社交媒体方式 - 参考图片样式 */}
                          {selectedInputMethod === 'social' && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {t('socialMedia')}
                                </label>
                                <input
                                  type="text"
                                  placeholder={t('socialMediaPlaceholder')}
                                  value={tempSocialMedia}
                                  onChange={(e) => setTempSocialMedia(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                                <p className="text-xs text-gray-500">{t('socialMediaFormatHint')}</p>
                                <div className="flex justify-end">
                                  <button 
                                    onClick={addSocialMedia}
                                    disabled={!tempSocialMedia.trim()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {t('addSocialMedia')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 知识库方式 - 参考图片样式 */}
                          {selectedInputMethod === 'knowledge' && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-900">{t('knowledgeBase')}</h4>
                              <div className="bg-gray-100 rounded-lg p-4">
                                <input
                                  type="text"
                                  placeholder={t('searchByNameDescriptionOrTags')}
                                  value={step2Data.knowledgeBase[0] || ''}
                                  onChange={(e) => handleStep2InputChange('knowledgeBase', e.target.value ? [e.target.value] : [])}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* 已添加文档区域 - 优化设计 */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-900">{t('addedDocuments')}</h4>
                          <div className="space-y-3">
                            {/* 已上传文件列表 */}
                            {uploadedFiles.length > 0 && (
                              uploadedFiles.map((file, index) => (
                                <div key={index} className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <span className="text-blue-600 text-sm">📄</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-medium text-gray-900 truncate">{file.name}</h5>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                          }}
                                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200"
                                          title={t('deleteFile')}
                                        >
                                          <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {t('fileSize')}: {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                            
                            {/* 已添加的文字内容 */}
                            {step2Data.textContent && (
                              <div className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 text-sm">📝</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="text-sm font-medium text-gray-900">{t('textContent')}</h5>
                                      <button
                                        onClick={() => handleStep2InputChange('textContent', '')}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200"
                                        title={t('deleteTextContent')}
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3 max-h-20 overflow-y-auto">
                                      <p className="text-xs text-gray-700 leading-relaxed">
                                        {step2Data.textContent.length > 200 
                                          ? `${step2Data.textContent.substring(0, 200)}...` 
                                          : step2Data.textContent
                                        }
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {t('characterCount', { count: step2Data.textContent.length, max: 5000 })}
                                      </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 已添加的网址 */}
                            {step2Data.website && (
                              <div className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-600 text-sm">🔗</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="text-sm font-medium text-gray-900">{t('websiteLink')}</h5>
                                      <button
                                        onClick={() => handleStep2InputChange('website', '')}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200"
                                        title={t('deleteWebsiteLink')}
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3">
                                      <a 
                                        href={step2Data.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 break-all"
                                      >
                                        {step2Data.website}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 已添加的社交媒体 */}
                            {step2Data.socialMedia && (
                              <div className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-pink-600 text-sm">📱</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="text-sm font-medium text-gray-900">{t('socialMedia')}</h5>
                                      <button
                                        onClick={() => handleStep2InputChange('socialMedia', '')}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200"
                                        title={t('deleteSocialMedia')}
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3">
                                      <p className="text-xs text-gray-700 break-all">
                                        {step2Data.socialMedia}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 已添加的知识库内容 */}
                            {step2Data.knowledgeBase.length > 0 && step2Data.knowledgeBase[0] && (
                              <div className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-orange-600 text-sm">📚</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="text-sm font-medium text-gray-900">{t('knowledgeBaseContent')}</h5>
                                      <button
                                        onClick={() => handleStep2InputChange('knowledgeBase', [])}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all duration-200"
                                        title={t('deleteKnowledgeBaseContent')}
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3 max-h-20 overflow-y-auto">
                                      <p className="text-xs text-gray-700 leading-relaxed">
                                        {step2Data.knowledgeBase[0].length > 200 
                                          ? `${step2Data.knowledgeBase[0].substring(0, 200)}...` 
                                          : step2Data.knowledgeBase[0]
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 空状态 */}
                            {uploadedFiles.length === 0 && 
                             !step2Data.textContent && 
                             !step2Data.website && 
                             !step2Data.socialMedia && 
                             step2Data.knowledgeBase.length === 0 && (
                              <div className="text-center py-8 text-gray-500 text-sm">
                                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-400 text-lg">📁</span>
                                </div>
                                {t('noAddedContent')}
                              </div>
                            )}
                          </div>
                        </div>
                        

                        {/* 提交分析按钮 */}
                        {!isAnalyzing && !showAnalysisComplete && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                // 更新进度条到AI生成中
                                setCurrentStep('ai-generating');
                                
                                // 开始分析过程
                                setIsAnalyzing(true);
                                setAnalysisStep(0);
                                setShowAnalysisComplete(false);
                                
                                // 开始第一个分析步骤的打字效果
                                typeAnalysisStep(0);
                              }}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm transition-colors"
                            >
                              {t('submitAnalysis')}
                            </button>
                          </div>
                        )}

                        </div> {/* 第二步表单卡片结束 */}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI分析步骤消息 - 独立显示 */}
              {isAnalyzing && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800 mb-3">
                      {t('aiAnalyzingContent')}
                    </p>
                    <div className="space-y-2">
                      {analysisSteps.map((step, index) => (
                        <div key={index} className={`flex items-center space-x-2 text-xs ${
                          index < analysisStep ? 'text-green-600' : 
                          index === analysisStep ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            index < analysisStep ? 'bg-green-500' : 
                            index === analysisStep ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className={index === analysisStep && analysisText ? 'font-medium' : ''}>
                            {index === analysisStep ? analysisText : step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 品牌包生成完成消息 */}
              {showBrandPackComplete && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800 mb-3">
                      {t('brandPackGenerationComplete')}
                    </p>
                    <div className="flex justify-start">
                      <button
                        onClick={handleViewBrandPack}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 text-sm transition-colors"
                      >
                        {t('viewBrandPack')}
                      </button>
                    </div>
                  </div>
                </div>
              )}


              {/* 用户点击查看品牌包气泡 */}
              {showUserClickBubble && (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-blue-500 text-white rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm">
                      {t('openGeneratedBrandPack')}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                </div>
              )}

              {/* 品牌包描述聊天气泡 */}
              {showBrandPackDescription && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800">
                      {t('brandPackDescriptionText')}
                    </p>
                  </div>
                </div>
              )}

              {/* 1. 品牌核心身份气泡 */}
              {showBrandCoreIdentity && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('brandCoreIdentity')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">1. {t('brandCoreIdentity')} ({t('brandCoreIdentityEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.brandCoreIdentity ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.brandCoreIdentity && (
                      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                        {/* 品牌名称 - 标签属性 */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">{t('brandName')}</label>
                          <div className="space-y-2">
                            {/* 现有标签 */}
                            <div className="flex flex-wrap gap-1">
                              {brandCoreIdentityData.brandName.map((name, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {name}
                                  <button
                                    onClick={() => handleRemoveBrandName(index)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                            {/* 添加新标签 */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder={t('addBrandName')}
                                className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddBrandName(e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  handleAddBrandName(input.value);
                                  input.value = '';
                                }}
                                className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 品牌标语 - 多行文本框 */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">{t('brandSlogan')}</label>
                          <textarea
                            value={brandCoreIdentityData.brandSlogan}
                            onChange={(e) => handleBrandCoreIdentityChange('brandSlogan', e.target.value)}
                            className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            placeholder={t('enterBrandSlogan')}
                            style={{ minHeight: '60px', height: 'auto' }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                          />
                        </div>

                        {/* 品牌故事与使命 */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-2 block">{t('brandStoryAndMission')}</label>
                          <div className="space-y-3">
                            {/* 故事 - 多行文本框 */}
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">{t('story')}：</label>
                              <textarea
                                value={brandCoreIdentityData.brandStory}
                                onChange={(e) => handleBrandCoreIdentityChange('brandStory', e.target.value)}
                                className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                placeholder={t('enterBrandStory')}
                                style={{ minHeight: '80px', height: 'auto' }}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                              />
                            </div>
                            {/* 使命 - 多行文本框 */}
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">{t('mission')}：</label>
                              <textarea
                                value={brandCoreIdentityData.brandMission}
                                onChange={(e) => handleBrandCoreIdentityChange('brandMission', e.target.value)}
                                className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                placeholder={t('enterBrandMission')}
                                style={{ minHeight: '60px', height: 'auto' }}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 品牌价值观与关键词 */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-2 block">{t('brandValuesAndKeywords')}</label>
                          <div className="space-y-3">
                            {/* 核心价值观 - 多行文本框 */}
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">{t('coreValues')}：</label>
                              <textarea
                                value={brandCoreIdentityData.brandValues}
                                onChange={(e) => handleBrandCoreIdentityChange('brandValues', e.target.value)}
                                className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                placeholder={t('enterCoreValues')}
                                style={{ minHeight: '40px', height: 'auto' }}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                              />
                            </div>
                            {/* 关联关键词 - 标签框 */}
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">{t('relatedKeywords')}：</label>
                              <div className="space-y-2">
                                {/* 现有标签 */}
                                <div className="flex flex-wrap gap-1">
                                  {brandCoreIdentityData.keywords.map((keyword, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {keyword}
                                      <button
                                        onClick={() => handleRemoveKeyword(index)}
                                        className="ml-1 text-gray-400 hover:text-gray-600"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                {/* 添加新标签 */}
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder={t('addKeyword')}
                                    className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddKeyword(e.currentTarget.value);
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                <button
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    handleAddKeyword(input.value);
                                    input.value = '';
                                  }}
                                  className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!bubbleCollapsed.brandCoreIdentity && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('brandCoreIdentity')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. 品牌声音与语调气泡 */}
              {showBrandVoiceTone && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('brandVoiceTone')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">2. {t('brandVoiceTone')} ({t('brandVoiceToneEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.brandVoiceTone ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.brandVoiceTone && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                      {/* 品牌个性描述 - 多行文本框 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('brandPersonalityDescription')}</label>
                        <textarea
                          value={brandVoiceToneData.personality}
                          onChange={(e) => handleBrandVoiceToneChange('personality', e.target.value)}
                          className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                          placeholder={t('enterBrandPersonality')}
                          style={{ minHeight: '80px', height: 'auto' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </div>

                      {/* 语调指南 - 多行文本框 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('toneGuide')}</label>
                        <textarea
                          value={brandVoiceToneData.toneGuide}
                          onChange={(e) => handleBrandVoiceToneChange('toneGuide', e.target.value)}
                          className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                          placeholder={t('enterToneGuide')}
                          style={{ minHeight: '80px', height: 'auto' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </div>

                      {/* 风格与词汇偏好 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('styleAndVocabularyPreferences')}</label>
                        <div className="space-y-3">
                          {/* 推荐使用 - 标签框 */}
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('recommendedUsage')}：</label>
                            <div className="space-y-2">
                              {/* 现有标签 */}
                              <div className="flex flex-wrap gap-1">
                                {brandVoiceToneData.preferredWords.map((word, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                    {word}
                                    <button
                                      onClick={() => handleRemovePreferredWord(index)}
                                      className="ml-1 text-green-400 hover:text-green-600"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                              {/* 添加新标签 */}
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder={t('addRecommendedWord')}
                                  className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddPreferredWord(e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    handleAddPreferredWord(input.value);
                                    input.value = '';
                                  }}
                                  className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 避免使用 - 标签框 */}
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('avoidUsage')}：</label>
                            <div className="space-y-2">
                              {/* 现有标签 */}
                              <div className="flex flex-wrap gap-1">
                                {brandVoiceToneData.avoidedWords.map((word, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                    {word}
                                    <button
                                      onClick={() => handleRemoveAvoidedWord(index)}
                                      className="ml-1 text-red-400 hover:text-red-600"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                              {/* 添加新标签 */}
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder={t('addAvoidedWord')}
                                  className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddAvoidedWord(e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    handleAddAvoidedWord(input.value);
                                    input.value = '';
                                  }}
                                  className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {!bubbleCollapsed.brandVoiceTone && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('brandVoiceTone')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. 目标受众画像气泡 */}
              {showTargetAudience && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('targetAudience')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">{t('stepNumber', { number: 3 })} {t('targetAudiencePersona')} ({t('targetAudiencePersonaEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.targetAudience ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.targetAudience && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                      {/* 人口统计 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('demographics')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.demographics.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveSingleText('demographics', index)}
                                  className="ml-1 text-blue-400 hover:text-blue-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addDemographicInfo')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSingleText('demographics', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSingleText('demographics', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 性别属性 - 多选 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('genderAttribute')}</label>
                        <div className="flex flex-wrap gap-2">
                          {[t('male'), t('female'), t('bothGenders'), t('noGenderRestriction')].map((gender) => (
                            <label key={gender} className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={targetAudienceData.gender.includes(gender)}
                                onChange={() => handleGenderChange(gender)}
                                className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-700">{gender}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 收入属性 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('incomeAttribute')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.income.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveSingleText('income', index)}
                                  className="ml-1 text-green-400 hover:text-green-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addIncomeAttribute')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSingleText('income', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSingleText('income', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 生活品质 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('lifestyle')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.lifestyle.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveSingleText('lifestyle', index)}
                                  className="ml-1 text-purple-400 hover:text-purple-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addLifestyleDescription')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSingleText('lifestyle', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSingleText('lifestyle', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 受教育水平 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('educationLevel')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.education.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveSingleText('education', index)}
                                  className="ml-1 text-orange-400 hover:text-orange-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addEducationLevel')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSingleText('education', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSingleText('education', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 心理特征 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('psychologicalTraits')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.psychological.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveMultiText('psychological', index)}
                                  className="ml-1 text-indigo-400 hover:text-indigo-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addPsychologicalTrait')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddMultiText('psychological', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddMultiText('psychological', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 痛点与需求 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('painPointsAndNeeds')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.painPoints.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveMultiText('painPoints', index)}
                                  className="ml-1 text-pink-400 hover:text-pink-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addPainPointDescription')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddMultiText('painPoints', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddMultiText('painPoints', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 典型使用场景 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('typicalUseCases')}</label>
                        <div className="space-y-2">
                          {/* 现有标签 */}
                          <div className="flex flex-wrap gap-1">
                            {targetAudienceData.useCases.map((item, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                                {item}
                                <button
                                  onClick={() => handleRemoveMultiText('useCases', index)}
                                  className="ml-1 text-teal-400 hover:text-teal-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          {/* 添加新标签 */}
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={t('addTypicalUseCase')}
                              className="flex-1 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddMultiText('useCases', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddMultiText('useCases', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {!bubbleCollapsed.targetAudience && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('targetAudience')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. 视觉资产指南气泡 */}
              {showVisualAssets && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('visualAssets')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">{t('stepNumber', { number: 4 })} {t('visualAssetGuidelines')} ({t('visualAssetGuidelinesEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.visualAssets ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.visualAssets && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                      {/* 品牌logo描述 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('brandLogoDescription')}</label>
                        <textarea
                          value={brandVisualData.logoDescription}
                          onChange={(e) => handleBrandVisualChange('logoDescription', e.target.value)}
                          className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          style={{ minHeight: '60px', height: 'auto' }}
                          onInput={(e) => {
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                          }}
                          placeholder={t('enterBrandLogoDescription')}
                        />
                      </div>

                      {/* 品牌logo选择 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('brandLogoSelection')}</label>
                        <p className="text-xs text-gray-500 mb-3">{t('logoSelectionDescription')}</p>
                        
                        {/* 选择框区域 */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[0, 1, 2].map((index) => (
                            <div key={index} className="relative">
                              <div className="w-full h-16 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 group">
                                {brandVisualData.selectedLogos[index] ? (
                                  <div className="relative w-full h-full flex items-center justify-center">
                                    <img 
                                      src={brandVisualData.selectedLogos[index].url} 
                                      alt={brandVisualData.selectedLogos[index].name}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                    <button
                                      onClick={() => handleRemoveLogo(index)}
                                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs">{t('clickBelowToSelectLogo')}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 可选logo列表 */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-700">{t('availableLogos')}</label>
                            <label className="text-xs text-primary-600 cursor-pointer hover:text-primary-700 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                              📁 {t('uploadLogo')}
                            </label>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {brandVisualData.availableLogos.map((logo) => (
                              <div
                                key={logo.id}
                                className="relative cursor-pointer group"
                                onClick={() => handleSelectLogo(logo)}
                              >
                                <img 
                                  src={logo.url} 
                                  alt={logo.name}
                                  className="w-full h-12 object-contain border border-gray-200 rounded hover:border-primary-500 transition-colors"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    {brandVisualData.selectedLogos.find(l => l.id === logo.id) ? t('selected') : t('clickToSelect')}
                                  </span>
                                </div>
                                {logo.isUploaded && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* 品牌色彩方案 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('stepNumber', { number: 3 })} {t('brandColorScheme')} ({t('brandColorSchemeEn')})</label>
                        <p className="text-xs text-gray-500 mb-3">{t('colorSchemeSelectionDescription')}</p>
                        
                        {/* 选择框区域 */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[0, 1, 2].map((index) => (
                            <div key={index} className="relative">
                              <div className="w-full h-12 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 group">
                                {brandVisualData.selectedColorSystems[index] ? (
                                  <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="text-xs font-medium text-gray-700">
                                      {brandVisualData.selectedColorSystems[index].name}
                                    </div>
                                    <button
                                      onClick={() => handleRemoveColorSystem(index)}
                                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs">{t('clickBelowToSelectColorSystem')}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 可选色彩系统列表 */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-700">{t('availableColorSystems')}</label>
                            <button
                              onClick={handleAddCustomColorSystem}
                              className="text-xs text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              {t('addCustomColorSystem')}
                            </button>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {brandVisualData.availableColorSystems.map((colorSystem) => (
                              <div
                                key={colorSystem.id}
                                className="relative cursor-pointer group flex-shrink-0"
                                onClick={() => handleSelectColorSystem(colorSystem)}
                              >
                                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:border-primary-500 transition-colors w-fit min-w-48">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1">
                                      <h4 className="text-xs font-medium text-gray-900">{colorSystem.name}</h4>
                                      {(colorSystem.name.includes('自定义') || colorSystem.name.includes('Custom')) && (
                                        <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">{t('custom')}</span>
                                      )}
                                    </div>
                                    {brandVisualData.selectedColorSystems.find(cs => cs.id === colorSystem.id) && (
                                      <span className="text-xs text-green-600">✓ {t('selected')}</span>
                                    )}
                                  </div>
                                  
                                  {/* 主色值 */}
                                  <div className="mb-2">
                                    <div className="text-xs text-gray-600 mb-1">{t('mainColors')}</div>
                                    <div className="flex gap-1">
                                      {colorSystem.mainColors.map((color, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                          <div 
                                            className="w-6 h-6 rounded border border-gray-200"
                                            style={{ backgroundColor: color }}
                                          ></div>
                                          <span className="text-2xs text-gray-500 mt-1">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* 中性色 */}
                                  <div className="mb-2">
                                    <div className="text-xs text-gray-600 mb-1">{t('neutralColors')}</div>
                                    <div className="flex gap-1">
                                      {colorSystem.neutralColors.map((color, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                          <div 
                                            className="w-6 h-6 rounded border border-gray-200"
                                            style={{ backgroundColor: color }}
                                          ></div>
                                          <span className="text-2xs text-gray-500 mt-1">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* 辅助色 */}
                                  <div>
                                    <div className="text-xs text-gray-600 mb-1">{t('accentColors')}</div>
                                    <div className="flex gap-1">
                                      {colorSystem.accentColors.map((color, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                          <div 
                                            className="w-6 h-6 rounded border border-gray-200"
                                            style={{ backgroundColor: color }}
                                          ></div>
                                          <span className="text-2xs text-gray-500 mt-1">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {!bubbleCollapsed.visualAssets && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('visualAssets')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* {t('stepNumber', { number: 5 })} 内容与产品信息气泡 */}
              {showContentProducts && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('contentProducts')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">{t('stepNumber', { number: 5 })} {t('contentAndProductInfo')} ({t('contentAndProductInfoEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.contentProducts ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.contentProducts && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                      {/* 产品/服务清单 - 多行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('productServiceList')}</label>
                        <div className="space-y-2">
                          {contentProductData.productList.map((product, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <textarea
                                value={product}
                                onChange={(e) => {
                                  const newList = [...contentProductData.productList];
                                  newList[index] = e.target.value;
                                  handleContentProductChange('productList', newList);
                                }}
                                className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                style={{ minHeight: '60px', height: 'auto' }}
                                data-auto-height="true"
                                onInput={(e) => adjustTextareaHeight(e.currentTarget)}
                                placeholder={`产品/服务 ${index + 1}`}
                              />
                              <button
                                onClick={() => handleRemoveProduct(index)}
                                className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <textarea
                              placeholder={t('addNewProductService')}
                              className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                              style={{ minHeight: '60px', height: 'auto' }}
                              data-auto-height="true"
                              onInput={(e) => adjustTextareaHeight(e.currentTarget)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddProduct(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                  adjustTextareaHeight(e.currentTarget);
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                                handleAddProduct(textarea.value);
                                textarea.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 独特卖点 - 单行文本数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('uniqueSellingPoints')}</label>
                        <div className="space-y-2">
                          {contentProductData.uniqueSellingPoints.map((point, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const newList = [...contentProductData.uniqueSellingPoints];
                                  newList[index] = e.target.value;
                                  handleContentProductChange('uniqueSellingPoints', newList);
                                }}
                                className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder={`${t('uniqueSellingPoint')} ${index + 1}`}
                              />
                              <button
                                onClick={() => handleRemoveSellingPoint(index)}
                                className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={t('addNewUniqueSellingPoint')}
                              className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSellingPoint(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSellingPoint(input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 常见问答 - 带标题型多行文本框数组 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('frequentlyAskedQuestions')}</label>
                        <div className="space-y-3">
                          {contentProductData.faqList.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500">{t('qAndA')} {index + 1}</span>
                                <button
                                  onClick={() => handleRemoveFAQ(index)}
                                  className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={faq.title}
                                  onChange={(e) => handleUpdateFAQ(index, 'title', e.target.value)}
                                  className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder={t('questionTitle')}
                                />
                                <textarea
                                  value={faq.content}
                                  onChange={(e) => handleUpdateFAQ(index, 'content', e.target.value)}
                                  className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                  style={{ minHeight: '60px', height: 'auto' }}
                                  data-auto-height="true"
                                  onInput={(e) => adjustTextareaHeight(e.currentTarget)}
                                  placeholder={t('questionAnswer')}
                                />
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={handleAddFAQ}
                            className="w-full text-xs text-primary-600 border border-dashed border-primary-300 rounded-lg p-3 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t('addNewFAQ')}
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {!bubbleCollapsed.contentProducts && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('contentProducts')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. SEO与优化策略气泡 */}
              {showSeoOptimization && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('seoOptimization')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">{t('stepNumber', { number: 6 })} {t('seoOptimizationStrategy')} ({t('seoOptimizationStrategyEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.seoOptimization ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.seoOptimization && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                      {/* 品牌词 - 标签属性 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('brandKeywords')}</label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {seoData.brandKeywords.map((keyword, index) => (
                              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                <span>{keyword}</span>
                                <button
                                  onClick={() => handleRemoveSeoKeyword('brandKeywords', index)}
                                  className="w-4 h-4 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                                >
                                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={t('addBrandKeyword')}
                              className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSeoKeyword('brandKeywords', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSeoKeyword('brandKeywords', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 产品词 - 标签属性 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('productKeywords')}</label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {seoData.productKeywords.map((keyword, index) => (
                              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                <span>{keyword}</span>
                                <button
                                  onClick={() => handleRemoveSeoKeyword('productKeywords', index)}
                                  className="w-4 h-4 bg-green-200 text-green-600 rounded-full flex items-center justify-center hover:bg-green-300 transition-colors"
                                >
                                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={t('addProductKeyword')}
                              className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSeoKeyword('productKeywords', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSeoKeyword('productKeywords', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 行业词 - 标签属性 */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">{t('industryKeywords')}</label>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {seoData.industryKeywords.map((keyword, index) => (
                              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                <span>{keyword}</span>
                                <button
                                  onClick={() => handleRemoveSeoKeyword('industryKeywords', index)}
                                  className="w-4 h-4 bg-purple-200 text-purple-600 rounded-full flex items-center justify-center hover:bg-purple-300 transition-colors"
                                >
                                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={t('addIndustryKeyword')}
                              className="flex-1 text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddSeoKeyword('industryKeywords', e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleAddSeoKeyword('industryKeywords', input.value);
                                input.value = '';
                              }}
                              className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {!bubbleCollapsed.seoOptimization && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('seoOptimization')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. 社交媒体气泡 */}
              {showSocialMedia && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-3"
                      onClick={() => toggleBubbleCollapse('socialMedia')}
                    >
                      <h4 className="text-sm font-bold text-gray-900">{t('stepNumber', { number: 7 })} {t('socialMedia')} ({t('socialMediaEn')})</h4>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${bubbleCollapsed.socialMedia ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {!bubbleCollapsed.socialMedia && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
                      {/* Facebook */}
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 mb-3">{t('facebook')}</h5>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('facebookName')}</label>
                            <input
                              type="text"
                              value={socialMediaData.facebook.name}
                              onChange={(e) => handleSocialMediaChange('facebook', 'name', e.target.value)}
                              className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={t('facebookPageName')}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('pageUrl')}</label>
                            <input
                              type="text"
                              value={socialMediaData.facebook.url}
                              onChange={(e) => handleSocialMediaChange('facebook', 'url', e.target.value)}
                              className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="https://www.facebook.com/your-page"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Instagram */}
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 mb-3">{t('instagram')}</h5>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('instagramName')}</label>
                            <input
                              type="text"
                              value={socialMediaData.instagram.name}
                              onChange={(e) => handleSocialMediaChange('instagram', 'name', e.target.value)}
                              className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={t('instagramHandle')}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('pageUrl')}</label>
                            <input
                              type="text"
                              value={socialMediaData.instagram.url}
                              onChange={(e) => handleSocialMediaChange('instagram', 'url', e.target.value)}
                              className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="https://www.instagram.com/your_handle"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rednote (小红书) */}
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 mb-3">{t('rednote')} ({t('xiaohongshu')})</h5>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('rednoteName')}</label>
                            <input
                              type="text"
                              value={socialMediaData.rednote.name}
                              onChange={(e) => handleSocialMediaChange('rednote', 'name', e.target.value)}
                              className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={t('rednoteAccountName')}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">{t('pageUrl')}</label>
                            <input
                              type="text"
                              value={socialMediaData.rednote.url}
                              onChange={(e) => handleSocialMediaChange('rednote', 'url', e.target.value)}
                              className="w-full text-xs text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="https://www.xiaohongshu.com/user/profile/your_id"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {!bubbleCollapsed.socialMedia && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleSaveAndUpdate('socialMedia')}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
                        >
                          {t('saveAndUpdate')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI加载响应 */}
              {showAILoadingResponse && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{t('openingBrandPackResult')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 品牌包结果表单气泡 */}
              {showBrandPackResult && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center mb-4">
                        <img 
                          src={godivaBrandData.logo} 
                          alt={t('godivaLogo')} 
                          className="w-8 h-8 rounded-lg mr-3"
                        />
                        <h4 className="text-sm font-bold text-gray-900">{godivaBrandData.name}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-600">{t('industryType')}:</span>
                          <p className="text-xs text-gray-900 font-medium mt-1">{godivaBrandData.industry}</p>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('targetUsers')}:</span>
                          <p className="text-xs text-gray-900 mt-1">{godivaBrandData.targetUsers}</p>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('brandFeatures')}:</span>
                          <p className="text-xs text-gray-900 mt-1">{godivaBrandData.brandFeatures}</p>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('brandPersonality')}:</span>
                          <p className="text-xs text-gray-900 mt-1">{godivaBrandData.brandPersonality}</p>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('brandValues')}:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {godivaBrandData.brandValues.map((value, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('targetAudience')}:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {godivaBrandData.targetAudience.map((audience, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {audience}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('keyMessages')}:</span>
                          <ul className="text-xs text-gray-900 mt-1 space-y-1">
                            {godivaBrandData.keyMessages.map((message, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-gray-400 mr-1">•</span>
                                {message}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-600">{t('brandDescription')}:</span>
                          <p className="text-xs text-gray-900 mt-1 leading-relaxed">
                            {godivaBrandData.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 修改选项聊天气泡 */}
              {showModificationOption && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-gray-800 mb-3">
                      {t('ifYouHaveQuestionsAboutResults')}
                    </p>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">{t('modificationOptions')}</h4>
                      <div className="space-y-2">
                          <button className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            ✏️ {t('modifyBrandName')}
                          </button>
                          <button className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            🎨 {t('adjustBrandStyle')}
                          </button>
                          <button className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            👥 {t('modifyTargetUsers')}
                          </button>
                          <button className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            📝 {t('updateBrandDescription')}
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 加载指示器 - 在5秒延迟期间显示 */}
              {showUserReply && !showAIAnalysis && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-500">{t('aIThinking')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 底部输入区域 */}
            <div className="border-t border-gray-200 pt-4 flex-shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={t('pleaseEnterYourReply')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                  {t('send')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧预览区域 - 扩大尺寸 */}
        <div className="flex-1 p-6 bg-gray-50 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('brandPackPreview')}</h3>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex-1 overflow-y-auto">
            {/* 品牌包基础信息 */}
            <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{t('brandPackBasicInfo')}</h3>
              
              <div className="space-y-3">
                <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandPackName')}:</label>
                  {formData.name ? (
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData.name}
                    </div>
                  ) : (
                    <div className="h-8 bg-gray-200 rounded border animate-pulse"></div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandPackDescription')}:</label>
                  {formData.description ? (
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px]">
                      {formData.description}
                    </div>
                  ) : (
                    <div className="h-16 bg-gray-200 rounded border animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* 品牌包详细信息 */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">{t('brandPackDetailedInfo')}</h3>
              
              {/* 第一部分：品牌核心身份 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partOneBrandCoreIdentity')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandNameRequired')}</label>
                    {previewLoadingStates.brandCoreIdentity ? (
                      <div className="flex flex-wrap gap-1">
                        {brandCoreIdentityData.brandName.map((name, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandSloganRequired')}</label>
                    {previewLoadingStates.brandCoreIdentity ? (
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px]">
                        {brandCoreIdentityData.brandSlogan}
                      </div>
                    ) : (
                      <div className="h-16 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandStoryMissionRequired')}</label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">{t('story')}：</span>
                        {previewLoadingStates.brandCoreIdentity ? (
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px] mt-1">
                            {brandCoreIdentityData.brandStory}
                          </div>
                        ) : (
                          <div className="h-16 bg-gray-200 rounded border animate-pulse mt-1"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('mission')}：</span>
                        {previewLoadingStates.brandCoreIdentity ? (
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px] mt-1">
                            {brandCoreIdentityData.brandMission}
                          </div>
                        ) : (
                          <div className="h-16 bg-gray-200 rounded border animate-pulse mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandCoreValuesKeywordsRequired')}</label>
                    <div className="space-y-2">
                      {previewLoadingStates.brandCoreIdentity ? (
                        <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px]">
                          {brandCoreIdentityData.brandValues}
                        </div>
                      ) : (
                        <div className="h-16 bg-gray-200 rounded border animate-pulse"></div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {previewLoadingStates.brandCoreIdentity ? (
                          brandCoreIdentityData.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-14"></div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 第二部分：品牌声音与语调 */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partTwoBrandVoiceTone')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandPersonalityRequired')}</label>
                    {previewLoadingStates.brandVoiceTone ? (
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px]">
                        {brandVoiceToneData.personality}
                      </div>
                    ) : (
                      <div className="h-16 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('toneGuideRequired')}</label>
                    {previewLoadingStates.brandVoiceTone ? (
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px]">
                        {brandVoiceToneData.toneGuide}
                      </div>
                    ) : (
                      <div className="h-16 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('styleVocabularyPreferences')}</label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">{t('preferredWords')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.brandVoiceTone ? (
                            brandVoiceToneData.preferredWords.map((word, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                              >
                                {word}
                              </span>
                            ))
                          ) : (
                            <>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-10"></div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('avoidedWords')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.brandVoiceTone ? (
                            brandVoiceToneData.avoidedWords.map((word, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                              >
                                {word}
                              </span>
                            ))
                          ) : (
                            <>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-14"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-18"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 第三部分：目标受众 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partThreeTargetAudience')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('targetUserProfileRequired')}</label>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500">{t('demographics')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.demographics.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('gender')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.gender.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('income')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.income.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('lifestyle')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.lifestyle.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('education')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.education.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-18"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('psychological')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.psychological.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('painPoints')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.painPoints.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-28"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('useCases')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.targetAudience ? (
                            targetAudienceData.useCases.map((item, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 第四部分：视觉资产 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partFourVisualAssets')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandLogoRequired')}</label>
                    {previewLoadingStates.visualAssets ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border min-h-[60px]">
                          {brandVisualData.logoDescription}
                        </div>
                        {brandVisualData.selectedLogos.length > 0 && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2">{t('selectedLogos')}：</div>
                            <div className="flex flex-wrap gap-2">
                              {brandVisualData.selectedLogos.map((logo, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                  <img
                                    src={logo.url}
                                    alt={logo.name}
                                    className="w-8 h-8 object-contain"
                                  />
                                  <div className="text-xs font-medium">{logo.name}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-16 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('brandColorSystemRequired')}</label>
                    <div className="space-y-3">
                      {previewLoadingStates.visualAssets ? (
                        <div className="space-y-3">
                          <div className="text-xs text-gray-500">{t('selectedColorSystems')}：</div>
                          <div className="space-y-3">
                            {brandVisualData.selectedColorSystems.map((system, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded border">
                                <div className="text-sm font-medium text-gray-900 mb-2">{system.name}</div>
                                <div className="space-y-2">
                                  <div>
                                    <div className="text-xs text-gray-600 mb-1">{t('mainColors')}：</div>
                                    <div className="flex gap-2">
                                      {system.mainColors.map((color, colorIndex) => (
                                        <div key={colorIndex} className="flex items-center gap-1">
                                          <div
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: color }}
                                          ></div>
                                          <span className="text-xs text-gray-500">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-600 mb-1">{t('neutralColors')}：</div>
                                    <div className="flex gap-2">
                                      {system.neutralColors.map((color, colorIndex) => (
                                        <div key={colorIndex} className="flex items-center gap-1">
                                          <div
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: color }}
                                          ></div>
                                          <span className="text-xs text-gray-500">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-600 mb-1">{t('accentColors')}：</div>
                                    <div className="flex gap-2">
                                      {system.accentColors.map((color, colorIndex) => (
                                        <div key={colorIndex} className="flex items-center gap-1">
                                          <div
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: color }}
                                          ></div>
                                          <span className="text-xs text-gray-500">{color}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-8 bg-gray-200 rounded border animate-pulse"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-gray-200 rounded border animate-pulse w-16"></div>
                            <div className="h-8 bg-gray-200 rounded border animate-pulse w-16"></div>
                            <div className="h-8 bg-gray-200 rounded border animate-pulse w-16"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* 第五部分：内容与产品信息 */}
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partFiveContentProducts')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('productServiceListRequired')}</label>
                    {previewLoadingStates.contentProducts ? (
                      <div className="space-y-2">
                        {contentProductData.productList.map((product, index) => (
                          <div key={index} className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                            • {product}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-24 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('uniqueSellingPoints')}</label>
                    {previewLoadingStates.contentProducts ? (
                      <div className="space-y-2">
                        {contentProductData.uniqueSellingPoints.map((point, index) => (
                          <div key={index} className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                            • {point}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-20 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('faqRecommended')}</label>
                    {previewLoadingStates.contentProducts ? (
                      <div className="space-y-3">
                        {contentProductData.faqList.map((faq, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border">
                            <div className="text-sm font-medium text-gray-900 mb-1">Q: {faq.title}</div>
                            <div className="text-sm text-gray-700">A: {faq.content}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-20 bg-gray-200 rounded border animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* 第六部分：SEO与优化 */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partSixSeoOptimization')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('coreKeywordsRecommended')}</label>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500">{t('brandKeywords')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.seoOptimization ? (
                            seoData.brandKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-14"></div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('productKeywords')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.seoOptimization ? (
                            seoData.productKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-18"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-22"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('industryKeywords')}：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewLoadingStates.seoOptimization ? (
                            seoData.industryKeywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-14"></div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 第七部分：社交媒体 */}
              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="text-base font-bold text-gray-900 mb-4">{t('partSevenSocialMedia')}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('socialMediaPlatforms')}</label>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500">{t('facebook')}：</span>
                        {previewLoadingStates.socialMedia ? (
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border mt-1">
                            <div>{t('name')}：{socialMediaData.facebook.name}</div>
                            <div>{t('url')}：{socialMediaData.facebook.url}</div>
                          </div>
                        ) : (
                          <div className="h-12 bg-gray-200 rounded border animate-pulse mt-1"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('instagram')}：</span>
                        {previewLoadingStates.socialMedia ? (
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border mt-1">
                            <div>{t('name')}：{socialMediaData.instagram.name}</div>
                            <div>{t('url')}：{socialMediaData.instagram.url}</div>
                          </div>
                        ) : (
                          <div className="h-12 bg-gray-200 rounded border animate-pulse mt-1"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t('rednoteXiaohongshu')}：</span>
                        {previewLoadingStates.socialMedia ? (
                          <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border mt-1">
                            <div>{t('name')}：{socialMediaData.rednote.name}</div>
                            <div>{t('url')}：{socialMediaData.rednote.url}</div>
                          </div>
                        ) : (
                          <div className="h-12 bg-gray-200 rounded border animate-pulse mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 保存按钮区域 */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={() => {
                // 收集表单数据并保存
                const brandPackData: CreateBrandPackData = {
                  name: formData.name || t('unnamedBrandPack'),
                  description: formData.description || '',
                  logo: formData.logo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=6b7280&size=80',
                  tags: formData.tags || []
                };
                
                // 调用onCreate回调保存数据
                onCreate(brandPackData);
                onClose();
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
                    {t('saveBrandPack')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('enterBrandPackBasicInfo')}</h2>
          <p className="text-gray-600">{t('pleaseEnterBrandPackBasicInfo')}</p>
        </div>
        
        <div className="space-y-6">
          {/* 品牌包名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('brandPackName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('pleaseEnterBrandPackName')}
              maxLength={100}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            <div className="text-right text-xs text-gray-500 mt-1">{formData.name.length}/100</div>
          </div>

          {/* 品牌包简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('brandDescriptionOptional')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              placeholder={t('pleaseEnterBrandPackDescription')}
              maxLength={500}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            <div className="text-right text-xs text-gray-500 mt-1">{formData.description?.length || 0}/500</div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={handleBackToSelect}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleBasicInfoConfirm}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectContent = () => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI创建选项 - 确保在左侧 */}
          <div
            className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 border-purple-200 hover:border-purple-300 hover:shadow-md order-1"
            onClick={() => handleMethodSelect('ai')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('aiCreation')}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {t('aiCreationDesc')}
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {t('intelligentBrandAnalysis')}
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {t('autoGenerateContent')}
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {t('smartRecommendations')}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </div>
            </div>
          </div>

          {/* 快捷创建选项 - 确保在右侧 */}
          <div
            className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 border-blue-200 hover:border-blue-300 hover:shadow-md order-2"
            onClick={() => handleMethodSelect('quick')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('quickCreation')}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {t('quickCreationDesc')}
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {t('fastSetup')}
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {t('manualConfiguration')}
                </div>
                <div className="flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {t('fullControl')}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-primary-600 text-xs">💡</span>
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium mb-1">{t('selectionRecommendation')}</p>
              <p className="text-xs text-gray-600">
                {t('recommendationText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAIContent = () => {
    if (generationStep === 'generating') {
      return (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('aiGenerating')}</h3>
          <p className="text-gray-600 mb-4">{t('aiGeneratingPleaseWait')}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              {t('analyzingBrandNeeds')}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              {t('generatingVisualElements')}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              {t('optimizingDesignSolution')}
            </div>
          </div>
        </div>
      );
    }

    if (generationStep === 'result') {
      return (
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('aiGenerationComplete')}</h3>
            <p className="text-gray-600">{t('aiGenerationCompleteText')}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={formData.logo} 
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{formData.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{formData.description}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleRegenerate}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              {t('regenerate')}
            </button>
            <button
              type="button"
              onClick={handleConfirmGeneration}
              className="flex-1 px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-colors font-medium"
            >
              {t('confirmCreation')}
            </button>
          </div>
        </div>
      );
    }

    // 输入步骤
    return (
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('brandPackName')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('pleaseEnterBrandPackName')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('brandDescriptionOptional')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
              rows={3}
              placeholder={t('brandDescriptionPlaceholder')}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('brandDescriptionHelp')}
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
          >
                    {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors font-medium"
          >
            {isGenerating ? t('generating') : t('nextStep')}
          </button>
        </div>
      </form>
    );
  };

  const renderTraditionalContent = () => {
    return (
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('brandPackName')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('pleaseEnterBrandPackName')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('brandPackDescription')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              rows={3}
              placeholder={t('brandPackDescriptionPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('logoUrl')}
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={t('logoUrlPlaceholder')}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('defaultLogoIfNotProvided')}
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
          >
                    {t('cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors font-medium"
          >
            {t('createBrandPack')}
          </button>
        </div>
      </form>
    );
  };

  const handleInputChange = (field: keyof CreateBrandPackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const renderHeader = () => {
    if (generationStep === 'select') {
      return (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">{t('createBrandPack')}</h2>
              <button
                onClick={() => window.location.reload()}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                title={t('refreshPage')}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-500 text-lg">×</span>
            </button>
          </div>
        </div>
      );
    } else if (generationStep === 'basic-info') {
      return (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackToSelect}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center mr-3 transition-colors"
              >
                <span className="text-gray-600 text-sm">←</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{t('aiCreation')}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-500 text-lg">×</span>
            </button>
          </div>
        </div>
      );
    } else if (generationStep === 'main') {
      return (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackToSelect}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center mr-3 transition-colors"
              >
                <span className="text-gray-600 text-sm">←</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {creationMethod === 'ai' ? t('aiSmartGeneration') : t('quickCreation')}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {/* 刷新按钮 */}
              <button
                onClick={() => window.location.reload()}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                title={t('refreshPage')}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* 新标签页打开按钮 */}
              <button
                onClick={() => {
                  const newWindow = window.open('/brand-pack-create', '_blank');
                  if (newWindow) {
                    newWindow.focus();
                  }
                }}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title={t('openInNewTab')}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>{t('newTab')}</span>
              </button>
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-500 text-lg">×</span>
              </button>
            </div>
          </div>
        </div>
      );
    } else if (creationMethod === 'ai') {
      return (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackToSelect}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center mr-3 transition-colors"
              >
                <span className="text-gray-600 text-sm">←</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{t('aiGeneratingBrandPack')}</h2>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              title={t('refreshPage')}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackToSelect}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center mr-3 transition-colors"
              >
                <span className="text-gray-600 text-sm">←</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{t('traditionalBuildBrandPack')}</h2>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              title={t('refreshPage')}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      );
    }
  };

  // 全屏模式：只返回内容，不包含固定定位背景
  if (fullscreen) {
    return (
      <div className={`bg-white w-full h-full ${
        generationStep === 'main' ? 'max-w-7xl' : generationStep === 'basic-info' ? 'max-w-2xl' : 'max-w-2xl'
      }`}>
        {renderHeader()}
        
        {generationStep === 'select' && renderSelectContent()}
        {generationStep === 'basic-info' && renderBasicInfo()}
        {generationStep === 'main' && (
          <>
            {renderProgressSteps()}
            {renderMainContent()}
          </>
        )}
        {generationStep === 'generating' && creationMethod === 'ai' && renderAIContent()}
        {generationStep === 'result' && creationMethod === 'ai' && renderAIContent()}
        {generationStep === 'main' && creationMethod === 'quick' && renderTraditionalContent()}
      </div>
    );
  }

  // 弹窗模式：包含固定定位背景
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${
        generationStep === 'main' ? 'max-w-7xl' : generationStep === 'basic-info' ? 'max-w-2xl' : 'max-w-2xl'
      }`}>
        {renderHeader()}
        
        {generationStep === 'select' && renderSelectContent()}
        {generationStep === 'basic-info' && renderBasicInfo()}
        {generationStep === 'main' && (
          <>
            {renderProgressSteps()}
            {renderMainContent()}
          </>
        )}
        {generationStep === 'generating' && creationMethod === 'ai' && renderAIContent()}
        {generationStep === 'result' && creationMethod === 'ai' && renderAIContent()}
        {generationStep === 'main' && creationMethod === 'quick' && renderTraditionalContent()}
      </div>
      
      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-60 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 自定义色彩系统弹窗 */}
      {showCustomColorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('addCustomColorSystem')}</h3>
              <button
                onClick={() => setShowCustomColorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* 色彩系统名称 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('colorSystemName')}</label>
                <input
                  type="text"
                  value={customColorData.name}
                  onChange={(e) => setCustomColorData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-sm text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={t('pleaseEnterColorSystemName')}
                />
              </div>

              {/* 主色值 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('mainColors')}</label>
                <div className="space-y-2">
                  {customColorData.mainColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color || '#000000'}
                        onChange={(e) => handleCustomColorChange('mainColors', index, e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleCustomColorChange('mainColors', index, e.target.value)}
                        className="flex-1 text-sm text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`${t('mainColor')} ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 中性色 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('neutralColors')}</label>
                <div className="space-y-2">
                  {customColorData.neutralColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color || '#000000'}
                        onChange={(e) => handleCustomColorChange('neutralColors', index, e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleCustomColorChange('neutralColors', index, e.target.value)}
                        className="flex-1 text-sm text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`${t('neutralColor')} ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 辅助色 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('accentColors')}</label>
                <div className="space-y-2">
                  {customColorData.accentColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color || '#000000'}
                        onChange={(e) => handleCustomColorChange('accentColors', index, e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleCustomColorChange('accentColors', index, e.target.value)}
                        className="flex-1 text-sm text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`${t('accentColor')} ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCustomColorModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveCustomColorSystem}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 服务协议弹窗 */}
      <ServiceAgreementModal
        isOpen={showAgreement}
        onClose={handleAgreementClose}
        onAgree={handleAgreementAgree}
        title={t('brandPackCreationServiceAgreement')}
      />
    </div>
  );
};

export default CreateBrandPackModal;
