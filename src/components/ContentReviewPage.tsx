import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ComplianceTask, ComplianceStats, ComplianceFilter, RiskLevel, DetectionStatus, DetectionType, BatchAction } from '../types/compliance';
import { generateMockComplianceTasks, generateMockComplianceStats, teamMembers } from '../utils/complianceDemoData';
import { getContentPacks } from '../utils/contentPackData';
import { ContentPack } from '../types/contentPack';

const ContentReviewPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Tab状态
  const [activeTab, setActiveTab] = useState<'stats' | 'list'>('list');
  
  // 状态管理
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [stats, setStats] = useState<ComplianceStats>({
    todayDetectionCount: 0,
    pendingHighRisks: 0,
    riskDistribution: { high: 0, medium: 0, low: 0, none: 0 },
    typeDistribution: { email_compliance: 0, regional_regulation: 0, image_compliance: 0, copyright_risk: 0, custom: 0 }
  });
  const [filters, setFilters] = useState<ComplianceFilter>({});
  const [filteredTasks, setFilteredTasks] = useState<ComplianceTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [contentPacks, setContentPacks] = useState<ContentPack[]>([]);
  const [contentSource, setContentSource] = useState<'manual' | 'contentPack'>('manual');
  const [selectedContentPack, setSelectedContentPack] = useState<string>('');
  const [selectedDetectionTypes, setSelectedDetectionTypes] = useState<string[]>([]);
  const [taskName, setTaskName] = useState('');
  const [content, setContent] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 加载模拟数据
  useEffect(() => {
    const mockTasks = generateMockComplianceTasks();
    const mockStats = generateMockComplianceStats();
    const packs = getContentPacks();
    
    setTasks(mockTasks);
    setStats(mockStats);
    setFilteredTasks(mockTasks);
    setContentPacks(packs);
  }, []);
  
  // 筛选任务
  useEffect(() => {
    let result = [...tasks];
    
    // 关键词筛选
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(task => 
        task.name.toLowerCase().includes(keyword) || 
        task.contentSummary.toLowerCase().includes(keyword)
      )}
    
    // 检测类型筛选
    if (filters.detectionTypes && filters.detectionTypes.length > 0) {
      result = result.filter(task => filters.detectionTypes!.includes(task.detectionType));
    }
    
    // 风险等级筛选
    if (filters.riskLevels && filters.riskLevels.length > 0) {
      result = result.filter(task => filters.riskLevels!.includes(task.riskLevel));
    }
    
    // 状态筛选
    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter(task => filters.statuses!.includes(task.status));
    }
    
    // 日期范围筛选
    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      result = result.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }
    
    // 创建人筛选
    if (filters.createdBy) {
      result = result.filter(task => task.createdBy === filters.createdBy);
    }
    
    setFilteredTasks(result);
    // 筛选后重置到第一页
    setCurrentPage(1);
  }, [tasks, filters, searchKeyword]);
  
  // 处理搜索
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, keyword: searchKeyword }));
  };
  
  // 处理重置
  const handleReset = () => {
    setSearchKeyword('');
    setFilters({});
    setCurrentPage(1);
  };
  
  // 计算分页数据
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  
  // 分页处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  // 处理任务选择
  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };
  
  // 处理全选/取消全选（当前页）
  const handleSelectAll = () => {
    const currentPageTaskIds = paginatedTasks.map(task => task.id);
    const allSelected = currentPageTaskIds.every(id => selectedTasks.includes(id));
    
    if (allSelected) {
      setSelectedTasks(prev => prev.filter(id => !currentPageTaskIds.includes(id)));
    } else {
      setSelectedTasks(prev => [...new Set([...prev, ...currentPageTaskIds])]);
    }
  };
  
  // 检查当前页是否全部选中
  const isCurrentPageAllSelected = paginatedTasks.length > 0 && 
    paginatedTasks.every(task => selectedTasks.includes(task.id));
  
  // 处理批量操作
  const handleBatchAction = (action: BatchAction) => {
    if (selectedTasks.length === 0) return;
    
    switch (action) {
      case 'delete':
        if (window.confirm(t('confirmDeleteSelectedTasks', { count: selectedTasks.length }))) {
          setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
          setSelectedTasks([]);
        }
        break;
      case 'export_report':
        alert(t('exportingReports', { count: selectedTasks.length }));
        break;
    }
  };
  
  // 处理单个任务操作
  const handleTaskAction = (taskId: string, action: 'view' | 'recheck' | 'delete') => {
    switch (action) {
      case 'view':
        alert(t('viewTaskReport', { taskId }));
        break;
      case 'recheck':
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: 'pending' } : task
        ));
        break;
      case 'delete':
        if (window.confirm(t('confirmDeleteTask'))) {
          setTasks(prev => prev.filter(task => task.id !== taskId));
        }
        break;
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // 根据当前语言设置适当的选项
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleString(i18n.language, options);
    } catch (error) {
      // 如果日期格式化失败，返回原始字符串
      return dateString;
    }
  };

  // 处理检测类型选择
  const handleDetectionTypeChange = (type: string) => {
    setSelectedDetectionTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(item => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // 处理内容包选择
  const handleContentPackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const packId = e.target.value;
    setSelectedContentPack(packId);
    
    // 根据选择的内容包加载内容
    if (packId) {
      const selectedPack = contentPacks.find(pack => pack.id === packId);
      if (selectedPack) {
        // 假设ContentPack有content字段，实际使用时根据类型定义调整
        setContent((selectedPack as any).content || '');
      }
    } else {
      setContent('');
    }
  };

  // 生成随机风险等级
  const getRandomRiskLevel = (): RiskLevel => {
    const levels: RiskLevel[] = ['high', 'medium', 'low', 'none'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!taskName || !content || selectedDetectionTypes.length === 0) return;
    
    // 获取内容包信息
      const contentPack = contentSource === 'contentPack' && selectedContentPack
        ? contentPacks.find(pack => pack.id === selectedContentPack)
        : null;
      
      // 创建新的检测任务
      const newTask: ComplianceTask = {
        id: `task_${Date.now()}`,
        name: taskName,
        contentSummary: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        contentType: 'text',
        detectionType: selectedDetectionTypes[0] as DetectionType, // 使用第一个类型，实际可能需要调整类型定义支持多个
        riskLevel: getRandomRiskLevel(),
        status: 'completed',
        createdAt: new Date().toISOString(),
        createdBy: 'currentUser',
        contentPackId: contentPack?.id,
        contentPackName: contentPack?.name || (contentSource === 'contentPack' ? selectedContentPack : undefined)
    };
    
    setTasks(prev => [newTask, ...prev]);
    setShowCreateModal(false);
    
    // 重置表单
    setTaskName('');
    setContent('');
    setSelectedDetectionTypes([]);
    setContentSource('manual');
    setSelectedContentPack('');
    
    // 显示成功消息
    alert(t('detectionTaskCreated'));
  };
  
  // 获取风险等级显示信息
  const getRiskLevelInfo = (level: RiskLevel) => {
    const info = {
      high: { text: t('highRisk'), color: 'bg-red-100 text-red-800', icon: '🔴' },
      medium: { text: t('mediumRisk'), color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      low: { text: t('lowRisk'), color: 'bg-blue-100 text-blue-800', icon: '🔵' },
      none: { text: t('noRisk'), color: 'bg-green-100 text-green-800', icon: '🟢' }
    };
    return info[level];
  };
  
  // 获取状态显示信息
  const getStatusInfo = (status: DetectionStatus) => {
    const info = {
      pending: { text: t('detecting'), color: 'bg-purple-100 text-purple-800', icon: '⏳' },
      completed: { text: t('completed'), color: 'bg-green-100 text-green-800', icon: '✅' },
      failed: { text: t('failed'), color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    return info[status];
  };
  
  // 获取检测类型显示信息
  const getDetectionTypeInfo = (type: DetectionType) => {
    const info = {
      email_compliance: t('emailCompliance'),
      regional_regulation: t('regionalRegulationCompliance'),
      image_compliance: t('imageCompliance'),
      copyright_risk: t('copyrightRisk'),
      custom: t('customType')
    };
    return info[type];
  };
  
  // 计算风险分布的总任务数
  const totalRiskTasks = Object.values(stats.riskDistribution).reduce((sum, count) => sum + count, 0);
  
  // 计算检测类型分布的总任务数
  const totalTypeTasks = Object.values(stats.typeDistribution).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 h-full">
      {/* 页面标题和Tab导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">{t('contentComplianceDetection')}</h1>
          
          {/* Tab导航 */}
          <div className="flex items-center space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-5 py-2.5 text-base font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'list'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('detectionList')}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-5 py-2.5 text-base font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'stats'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('dataStatistics')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-8 py-6">
        {/* 检测列表Tab */}
        {activeTab === 'list' && (
          <>
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-4">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                onClick={() => setShowCreateModal(true)}
              >
                <span>+</span>
                <span>{t('newDetection')}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                {selectedTasks.length > 0 && (
                  <select 
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBatchAction(e.target.value as BatchAction);
                        e.target.value = '';
                      }
                    }}
                    value=""
                  >
                    <option value="" disabled>{t('batchOperations', { count: selectedTasks.length })}</option>
                    <option value="delete">{t('batchDelete')}</option>
                    <option value="export_report">{t('batchExportReports')}</option>
                  </select>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>{t('filter')}</span>
                </button>
              </div>
            </div>
            
            {/* 筛选栏 */}
            {showFilters && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* 关键词搜索 */}
                  <div>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder={t('searchTaskNameOrSummary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  
                  {/* 检测类型 */}
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({ 
                        ...prev, 
                        detectionTypes: value ? [value as DetectionType] : undefined 
                      }));
                    }}
                    value={filters.detectionTypes?.[0] || ''}
                  >
                    <option value="">{t('allTypes')}</option>
                    <option value="email_compliance">{t('emailCompliance')}</option>
                    <option value="regional_regulation">{t('regionalRegulationCompliance')}</option>
                    <option value="image_compliance">{t('imageCompliance')}</option>
                    <option value="copyright_risk">{t('copyrightRisk')}</option>
                    <option value="custom">{t('customType')}</option>
                  </select>
                  
                  {/* 风险等级 */}
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({ 
                        ...prev, 
                        riskLevels: value ? [value as RiskLevel] : undefined 
                      }));
                    }}
                    value={filters.riskLevels?.[0] || ''}
                  >
                    <option value="">{t('allLevels')}</option>
                    <option value="high">{t('highRisk')}</option>
                    <option value="medium">{t('mediumRisk')}</option>
                    <option value="low">{t('lowRisk')}</option>
                    <option value="none">{t('noRisk')}</option>
                  </select>
                  
                  {/* 检测状态 */}
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters(prev => ({ 
                        ...prev, 
                        statuses: value ? [value as DetectionStatus] : undefined 
                      }));
                    }}
                    value={filters.statuses?.[0] || ''}
                  >
                    <option value="">{t('allStatuses')}</option>
                    <option value="pending">{t('detecting')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="failed">{t('failed')}</option>
                  </select>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    onClick={handleReset}
                  >
                    {t('reset')}
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    onClick={handleSearch}
                  >
                    {t('search')}
                  </button>
                </div>
              </div>
            )}
            
            {/* 检测任务列表 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* 列表信息栏 */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {t('totalRecords', { count: filteredTasks.length })}，{' '}
                  {t('currentlyDisplaying', { start: startIndex + 1, end: Math.min(endIndex, filteredTasks.length) })}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{t('recordsPerPage')}：</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                          checked={isCurrentPageAllSelected && paginatedTasks.length > 0}
                          onChange={() => handleSelectAll()}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('taskNameId')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('detectionContent')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('detectionType')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('riskLevel')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('detectionStatus')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('creationTime')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('createdBy')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTasks.length > 0 ? (
                      paginatedTasks.map(task => {
                        const riskInfo = getRiskLevelInfo(task.riskLevel);
                        const statusInfo = getStatusInfo(task.status);
                        return (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500"
                                checked={selectedTasks.includes(task.id)}
                                onChange={() => handleTaskSelect(task.id)}
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {task.id}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-700 truncate max-w-[200px]" title={task.contentPackName || task.contentSummary}>
                                {task.contentPackName || task.contentSummary}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-700">{getDetectionTypeInfo(task.detectionType)}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskInfo.color}`}>
                                <span className="mr-1">{riskInfo.icon}</span>
                                {riskInfo.text}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span 
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                                title={task.status === 'failed' ? task.failureReason : undefined}
                              >
                                <span className={`mr-1 ${task.status === 'pending' ? 'animate-pulse' : ''}`}>
                                  {statusInfo.icon}
                                </span>
                                {statusInfo.text}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(task.createdAt)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {task.createdBy}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => handleTaskAction(task.id, 'view')}
                                >
                                  {t('viewReport')}
                                </button>
                                <button 
                                  className="text-purple-600 hover:text-purple-900"
                                  onClick={() => handleTaskAction(task.id, 'recheck')}
                                  disabled={task.status === 'pending'}
                                >
                                  {t('recheck')}
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleTaskAction(task.id, 'delete')}
                                >
                                  {t('delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-10 text-center text-gray-500">
                          {t('noTasksFound')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* 分页控件 */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {t('totalPages', { count: totalPages })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t('previousPage')}
                    </button>
                    
                    {/* 页码按钮 */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // 只显示当前页附近的页码
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t('nextPage')}
                    </button>
                    
                    {/* 跳转到指定页 */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-sm text-gray-600">{t('goToPage')}</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = Number(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            handlePageChange(page);
                          }
                        }}
                        className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{t('page')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* 数据统计Tab */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 今日检测量 */}
              <div className="flex flex-col p-4 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-500 mb-2">{t('todayDetectionCount')}</span>
                <span className="text-4xl font-bold text-gray-900">{stats.todayDetectionCount}</span>
              </div>
              
              {/* 待处理风险 */}
              <div className="flex flex-col p-4 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-500 mb-2">{t('pendingHighRisks')}</span>
                <span 
                  className="text-4xl font-bold text-red-600 cursor-pointer hover:underline"
                  onClick={() => {
                    setFilters(prev => ({ 
                      ...prev, 
                      statuses: ['pending'],
                      riskLevels: ['high', 'medium']
                    }));
                    setActiveTab('list');
                  }}
                >
                  {stats.pendingHighRisks}
                </span>
              </div>
              
              {/* 风险分布 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-500 mb-4 block">{t('riskDistribution')}</span>
                <div className="space-y-3">
                  {Object.entries(stats.riskDistribution).map(([level, count]) => {
                    const riskInfo = getRiskLevelInfo(level as RiskLevel);
                    const percentage = totalRiskTasks > 0 ? Math.round((count / totalRiskTasks) * 100) : 0;
                    return (
                      <div key={level} className="flex items-center text-sm">
                        <span className="mr-2 w-6">{riskInfo.icon}</span>
                        <span className="w-16 text-gray-700">{riskInfo.text}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                          <div 
                            className={`h-full rounded-full ${level === 'high' ? 'bg-red-500' : level === 'medium' ? 'bg-yellow-500' : level === 'low' ? 'bg-blue-500' : 'bg-green-500'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-600 min-w-[50px] text-right">{count} ({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 检测类型分布 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-500 mb-4 block">{t('detectionTypeDistribution')}</span>
                <div className="space-y-3">
                  {Object.entries(stats.typeDistribution).map(([type, count]) => {
                    const percentage = totalTypeTasks > 0 ? Math.round((count / totalTypeTasks) * 100) : 0;
                    return (
                      <div key={type} className="flex items-center text-sm">
                        <span className="w-32 text-gray-700 truncate">{getDetectionTypeInfo(type as DetectionType)}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                          <div 
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-600 min-w-[50px] text-right">{count} ({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 新建检测模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('createDetectionTask')}</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('taskName')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('enterTaskName')}
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentSource')}</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="manual-input" 
                      name="content-source" 
                      className="text-blue-600 focus:ring-blue-500" 
                      checked={contentSource === 'manual'}
                      onChange={() => setContentSource('manual')}
                    />
                    <label htmlFor="manual-input" className="ml-2 text-sm text-gray-700">{t('manualInput')}</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="content-pack" 
                      name="content-source" 
                      className="text-blue-600 focus:ring-blue-500"
                      checked={contentSource === 'contentPack'}
                      onChange={() => setContentSource('contentPack')}
                    />
                    <label htmlFor="content-pack" className="ml-2 text-sm text-gray-700">{t('fromContentPack')}</label>
                  </div>
                </div>
              </div>
              {contentSource === 'contentPack' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('selectContentPack')}</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedContentPack}
                    onChange={handleContentPackChange}
                  >
                    <option value="">{t('selectContentPack')}</option>
                    {contentPacks.map(pack => (
                      <option key={pack.id} value={pack.id}>{pack.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('detectionType')} <span className="text-gray-500 text-xs">(支持多选)</span></label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="email_compliance" 
                      value="email_compliance" 
                      className="text-blue-600 focus:ring-blue-500 rounded"
                      checked={selectedDetectionTypes.includes('email_compliance')}
                      onChange={() => handleDetectionTypeChange('email_compliance')}
                    />
                    <label htmlFor="email_compliance" className="ml-2 text-sm text-gray-700">{t('emailCompliance')}</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="regional_regulation" 
                      value="regional_regulation" 
                      className="text-blue-600 focus:ring-blue-500 rounded"
                      checked={selectedDetectionTypes.includes('regional_regulation')}
                      onChange={() => handleDetectionTypeChange('regional_regulation')}
                    />
                    <label htmlFor="regional_regulation" className="ml-2 text-sm text-gray-700">{t('regionalRegulationCompliance')}</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="image_compliance" 
                      value="image_compliance" 
                      className="text-blue-600 focus:ring-blue-500 rounded"
                      checked={selectedDetectionTypes.includes('image_compliance')}
                      onChange={() => handleDetectionTypeChange('image_compliance')}
                    />
                    <label htmlFor="image_compliance" className="ml-2 text-sm text-gray-700">{t('imageCompliance')}</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="copyright_risk" 
                      value="copyright_risk" 
                      className="text-blue-600 focus:ring-blue-500 rounded"
                      checked={selectedDetectionTypes.includes('copyright_risk')}
                      onChange={() => handleDetectionTypeChange('copyright_risk')}
                    />
                    <label htmlFor="copyright_risk" className="ml-2 text-sm text-gray-700">{t('copyrightRisk')}</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="custom" 
                      value="custom" 
                      className="text-blue-600 focus:ring-blue-500 rounded"
                      checked={selectedDetectionTypes.includes('custom')}
                      onChange={() => handleDetectionTypeChange('custom')}
                    />
                    <label htmlFor="custom" className="ml-2 text-sm text-gray-700">{t('customType')}</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('detectionContent')}</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder={t('enterOrPasteContent')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={contentSource === 'contentPack' && !!selectedContentPack}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  {t('cancel')}
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSubmit}
                  disabled={!taskName || !content || selectedDetectionTypes.length === 0}
                >
                  {t('submitDetection')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentReviewPage;