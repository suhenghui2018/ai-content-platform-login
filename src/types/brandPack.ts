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
}

export interface CreateBrandPackData {
  name: string;
  description?: string;
  logo?: string;
}

