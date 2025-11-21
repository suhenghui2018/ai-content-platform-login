// 内容合规检测相关类型定义

// 风险等级
export type RiskLevel = 'high' | 'medium' | 'low' | 'none';

// 检测状态
export type DetectionStatus = 'pending' | 'completed' | 'failed';

// 检测类型
export type DetectionType = 
  | 'email_compliance' 
  | 'regional_regulation' 
  | 'image_compliance' 
  | 'copyright_risk' 
  | 'custom';

// 检测任务接口
export interface ComplianceTask {
  id: string;
  name: string;
  contentSummary: string;
  contentType: 'text' | 'image' | 'html';
  detectionType: DetectionType;
  riskLevel: RiskLevel;
  status: DetectionStatus;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  failureReason?: string;
  // 扩展字段，可用于存储完整内容或报告URL
  fullContent?: string;
  reportUrl?: string;
  // 内容包相关信息
  contentPackId?: string;
  contentPackName?: string;
}

// 统计数据接口
export interface ComplianceStats {
  todayDetectionCount: number;
  pendingHighRisks: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  typeDistribution: {
    email_compliance: number;
    regional_regulation: number;
    image_compliance: number;
    copyright_risk: number;
    custom: number;
  };
}

// 筛选条件接口
export interface ComplianceFilter {
  keyword?: string;
  detectionTypes?: DetectionType[];
  riskLevels?: RiskLevel[];
  statuses?: DetectionStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  createdBy?: string;
}

// 批量操作类型
export type BatchAction = 'delete' | 'export_report';