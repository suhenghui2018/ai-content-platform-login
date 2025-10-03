export interface ContentPack {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  creatorAvatar: string;
  isShared: boolean;
  sharedBy?: string;
  contentCount: number;
  status: 'draft' | 'published' | 'archived';
  coverImage?: string;
}

export interface ProjectSettings {
  brandPackId: string;
  targetAudience: string;
  brandVoice: string;
  brandTone: string;
  title: string;
  goal: string;
}

export interface CreateContentPackData {
  name: string;
  description: string;
  coverImage?: string;
  projectSettings?: ProjectSettings;
}
