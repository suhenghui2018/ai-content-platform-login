export interface BrandPackPreview {
  brandCoreIdentity?: {
    brandName: string[];
    brandSlogan: string;
    brandStory: string;
    brandMission: string;
    brandValues: string;
    keywords: string[];
  };
  brandVoiceTone?: {
    personality: string;
    toneGuide: string;
    preferredWords: string[];
    avoidedWords: string[];
  };
  targetAudience?: {
    demographics: string[];
    gender: string[];
    income: string[];
    lifestyle: string[];
    education: string[];
    psychological: string[];
    painPoints: string[];
    useCases: string[];
  };
  visualAssets?: {
    logoDescription: string;
    selectedLogos: Array<{ id: number; name: string; url: string; description: string }>;
    selectedColorSystems: Array<{ id: number; name: string; mainColors: string[]; neutralColors: string[]; accentColors: string[] }>;
  };
  contentProducts?: {
    productList: string[];
    uniqueSellingPoints: string[];
    faqList: Array<{ title: string; content: string }>;
  };
  seoOptimization?: {
    brandKeywords: string[];
    productKeywords: string[];
    industryKeywords: string[];
  };
  socialMedia?: {
    facebook: { name: string; url: string };
    instagram: { name: string; url: string };
    rednote: { name: string; url: string };
  };
  brandTaboos?: {
    forbiddenWords: string[];
    forbiddenTopics: string[];
    forbiddenVisuals: string[];
    forbiddenBehaviors: string[];
  };
}

export interface BrandPack {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
  isEnabled: boolean;
  creator: string;
  creatorAvatar: string;
  description?: string;
  tags?: string[];
  sharedBy?: string; // 如果是分享的品牌包，显示分享者
  preview?: BrandPackPreview; // 品牌包预览数据
}

export interface CreateBrandPackData {
  name: string;
  description?: string;
  logo?: string;
  tags?: string[];
}

