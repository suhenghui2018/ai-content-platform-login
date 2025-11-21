import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { emailTemplates } from '../utils/emailTemplates';

interface VersionHistory {
  version: number;
  timestamp: string;
  content: string;
}

interface EmailCard {
  id: string;
  type: 'email';
  title: string;
  subject: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  selectedTemplate?: string;
  versionHistory: VersionHistory[];
  currentVersion: number;
}

const ABTestCreationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 从URL参数获取测试类型和导入方式
  const testType = searchParams.get('testType') || 'email';
  const importMethod = searchParams.get('importMethod') || 'upload';
  
  // 邮件卡片状态
  const [emailCards, setEmailCards] = useState<EmailCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForCard, setSettingsForCard] = useState<string | null>(null);
  
  // 新增状态：版本历史弹窗和AI生成主题弹窗
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistoryForCard, setVersionHistoryForCard] = useState<string | null>(null);
  const [showAISubjectModal, setShowAISubjectModal] = useState(false);
  const [aiSubjectForCard, setAiSubjectForCard] = useState<string | null>(null);
  const [aiSubjectSuggestions, setAiSubjectSuggestions] = useState<string[]>([]);
  const [useTrendingTopics, setUseTrendingTopics] = useState(false);
  
  // 新增状态：版本创建弹窗
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);
  const [createVersionForCard, setCreateVersionForCard] = useState<string | null>(null);
  const [selectedNewTemplate, setSelectedNewTemplate] = useState<string | null>(null);
  const [includeHotTopics, setIncludeHotTopics] = useState(false);
  
  // 拖拽相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeCardId, setResizeCardId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nextZIndex = useRef(1);
  
  // 处理版本历史弹窗显示
  const handleShowVersionHistory = (cardId: string) => {
    setVersionHistoryForCard(cardId);
    setShowVersionHistory(true);
  };
  
  // 处理版本创建弹窗显示
  const handleShowCreateVersionModal = (cardId: string) => {
    setCreateVersionForCard(cardId);
    setSelectedNewTemplate(null);
    setIncludeHotTopics(false);
    setShowCreateVersionModal(true);
  };
  
  // 处理创建新版本
  const handleCreateNewVersion = () => {
    if (!createVersionForCard) return;
    
    // 判断是否是创建新卡片
    if (createVersionForCard === 'new-card-temp-id') {
      // 创建新卡片
      const versionCount = emailCards.length + 1;
      const newId = `email-${versionCount}`;
      const versionTitle = `Version ${String.fromCharCode(64 + versionCount)}`;
      const positionIndex = emailCards.length % 3;
      const rowIndex = Math.floor(emailCards.length / 3);
      const newX = 100 + (positionIndex * 550);
      const newY = 100 + (rowIndex * 550);
      
      // 获取模板内容
      let newContent = '';
      if (selectedNewTemplate && emailTemplates) {
        const template = emailTemplates.find(t => t.id === selectedNewTemplate);
        if (template) {
          newContent = template.content || '';
        }
      } else if (emailTemplates && emailTemplates.length > 0) {
        // 默认使用第一个模板
        newContent = emailTemplates[0].content || '';
      }
      
      // 添加热点话题
      if (includeHotTopics && newContent) {
        if (newContent.includes('<title>')) {
          newContent = newContent.replace(
            '<title>',
            '<title>【热门话题】'
          );
        }
      }
      
      setEmailCards(prevCards => [...prevCards, {
        id: newId,
        type: 'email',
        title: versionTitle,
        subject: 'Subject Line',
        content: newContent,
        x: newX,
        y: newY,
        width: 600,
        height: 800,
        zIndex: nextZIndex.current++,
        selectedTemplate: selectedNewTemplate || (emailTemplates && emailTemplates.length > 0 ? emailTemplates[0].id : undefined),
        versionHistory: [],
        currentVersion: 1
      }]);
    } else {
      // 为现有卡片创建新版本
      const card = emailCards.find(c => c.id === createVersionForCard);
      if (!card) return;
      
      const newVersion = card.currentVersion + 1;
      let newContent = card.content;
      
      if (selectedNewTemplate && emailTemplates) {
        const template = emailTemplates.find(t => t.id === selectedNewTemplate);
        if (template) {
          newContent = template.content || newContent;
        }
      }
      
      if (includeHotTopics) {
        if (newContent.includes('<title>')) {
          newContent = newContent.replace(
            '<title>',
            '<title>【热门话题】'
          );
        }
      }
      
      const newVersionHistory = [...card.versionHistory, {
        version: newVersion,
        timestamp: new Date().toISOString(),
        content: card.content
      }];
      
      setEmailCards(prevCards => 
        prevCards.map(c => 
          c.id === createVersionForCard 
            ? { 
                ...c, 
                content: newContent,
                currentVersion: newVersion, 
                versionHistory: newVersionHistory,
                selectedTemplate: selectedNewTemplate || c.selectedTemplate
              } 
            : c
        )
      );
    }
    
    setShowCreateVersionModal(false);
    setCreateVersionForCard(null);
  };
  
  // 处理版本切换
  const handleVersionSelect = (cardId: string, versionNumber: number) => {
    const card = emailCards.find(c => c.id === cardId);
    if (card) {
      const selectedVersion = card.versionHistory.find(v => v.version === versionNumber);
      if (selectedVersion) {
        setEmailCards(prevCards => 
          prevCards.map(c => 
            c.id === cardId 
              ? { 
                  ...c, 
                  content: selectedVersion.content,
                  currentVersion: versionNumber 
                } 
              : c
          )
        );
      }
    }
    setShowVersionHistory(false);
    setVersionHistoryForCard(null);
  };
  
  // 处理AI生成主题弹窗显示
  const handleShowAISubjectModal = (cardId: string) => {
    setAiSubjectForCard(cardId);
    setShowAISubjectModal(true);
    
    // 模拟AI生成5个主题建议
    const mockSuggestions = [
      '【独家预购】Godiva 2025全新方形巧克力系列',
      '会员专享：Godiva限量巧克力新品抢先购',
      '限时优惠：Godiva高级会员专属巧克力预售',
      '【品味奢华】Godiva 2025限量版巧克力系列',
      '会员福利：Godiva全新巧克力系列提前购'
    ];
    setAiSubjectSuggestions(mockSuggestions);
  };
  
  // 处理选择AI生成的主题
  const handleSelectAISubject = (cardId: string, subject: string) => {
    setEmailCards(prevCards => 
      prevCards.map(c => {
        if (c.id === cardId && c.subject !== subject) {
          // 创建新版本历史记录
          const newVersion = c.currentVersion + 1;
          const newVersionHistory = [...c.versionHistory, {
            version: newVersion,
            timestamp: new Date().toISOString(),
            content: c.content
          }];
          
          return {
            ...c,
            subject: subject,
            currentVersion: newVersion,
            versionHistory: newVersionHistory
          };
        }
        return c;
      })
    );
    setShowAISubjectModal(false);
    setAiSubjectForCard(null);
  };
  
  // 模拟重新生成AI主题
  const handleRegenerateSubjects = () => {
    // 模拟添加热点关键词
    const baseSuggestions = [
      '【独家预购】Godiva 2025全新方形巧克力系列',
      '会员专享：Godiva限量巧克力新品抢先购',
      '限时优惠：Godiva高级会员专属巧克力预售',
      '【品味奢华】Godiva 2025限量版巧克力系列',
      '会员福利：Godiva全新巧克力系列提前购'
    ];
    
    if (useTrendingTopics) {
      const trendingKeywords = ['热门话题', '爆款推荐', '新品首发', '限时活动', '独家优惠'];
      const newSuggestions = baseSuggestions.map((suggestion, index) => 
        `【${trendingKeywords[index % trendingKeywords.length]}】${suggestion}`
      );
      setAiSubjectSuggestions(newSuggestions);
    } else {
      setAiSubjectSuggestions(baseSuggestions);
    }
  };
  
  // 初始化页面时创建默认邮件卡片
  useEffect(() => {
    // 为A/B测试创建版本A和版本B的邮件卡片
    const initialCards: EmailCard[] = [
      {
        id: 'email-1',
        type: 'email',
        title: t('versionA'),
        subject: t('subjectLine'),
        content: emailTemplates.find(t => t.id === 'template1')?.content || '', // 从模板A加载内容
        x: 100,
        y: 100,
        width: 600,
        height: 800,
        zIndex: 1,
        selectedTemplate: 'template1', // 确保使用模板A
        versionHistory: [],
        currentVersion: 1
      },
      {
        id: 'email-2',
        type: 'email',
        title: 'Vision2',
        subject: t('subjectLine'),
        content: emailTemplates.find(t => t.id === 'template2')?.content || '', // 从模板B加载内容
        x: 750,
        y: 100,
        width: 600,
        height: 800,
        zIndex: 2,
        selectedTemplate: 'template2', // 确保使用模板B
        versionHistory: [],
        currentVersion: 1
      }
    ];
    
    setEmailCards(initialCards);
    // 初始化zIndex引用值
    nextZIndex.current = 3;
  }, [t]);
  
  // 处理选择卡片
  const handleCardSelect = (cardId: string) => {
    if (isDragging || isResizing) return; // 拖拽或调整大小时不处理选择
    setSelectedCard(cardId);
    // 更新选中卡片的z-index以置于顶层
    setEmailCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        zIndex: card.id === cardId ? nextZIndex.current++ : card.zIndex
      }))
    );
  };
  
  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    const card = emailCards.find(c => c.id === cardId);
    if (!card) return;

    setSelectedCard(cardId);
    setIsDragging(true);
    setIsResizing(false);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // 更新z-index
    setEmailCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        zIndex: card.id === cardId ? nextZIndex.current++ : card.zIndex
      }))
    );
  };
  
  // 处理调整大小开始
  const handleResizeStart = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setIsDragging(false);
    setResizeCardId(cardId);
    setSelectedCard(cardId);
    
    // 更新z-index
    setEmailCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        zIndex: card.id === cardId ? nextZIndex.current++ : card.zIndex
      }))
    );
  };
  
  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !selectedCard || !canvasRef.current) return;

    requestAnimationFrame(() => {
      const canvasRect = canvasRef.current!.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      setEmailCards(prev => prev.map(card => 
        card.id === selectedCard 
          ? { ...card, x: Math.max(0, newX), y: Math.max(0, newY) }
          : card
      ));
    });
  };
  
  // 处理调整大小
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !resizeCardId || !canvasRef.current) return;
    
    requestAnimationFrame(() => {
      const canvasRect = canvasRef.current!.getBoundingClientRect();
      const card = emailCards.find(c => c.id === resizeCardId);
      if (!card) return;
      
      // 计算新的宽度和高度
      const newWidth = e.clientX - canvasRect.left - card.x;
      const newHeight = e.clientY - canvasRect.top - card.y;
      
      // 设置最小尺寸限制
      const minWidth = 300;
      const minHeight = 400;
      
      setEmailCards(prev => prev.map(c => 
        c.id === resizeCardId 
          ? { 
              ...c, 
              width: Math.max(minWidth, newWidth), 
              height: Math.max(minHeight, newHeight) 
            }
          : c
      ));
    });
  };
  
  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeCardId(null);
  };
  
  // 添加全局拖拽事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e);
      } else if (isResizing) {
        handleResizeMove(e);
      }
    };
    
    const handleGlobalMouseUp = () => handleDragEnd();
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };  
  }, [isDragging, isResizing, selectedCard, dragOffset, resizeCardId]);

  // 版本历史弹窗
  if (showVersionHistory && versionHistoryForCard) {
    const card = emailCards.find(c => c.id === versionHistoryForCard);
    if (card) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">版本历史记录</h3>
              <button 
                onClick={() => {
                  setShowVersionHistory(false);
                  setVersionHistoryForCard(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {card.versionHistory.map((version) => {
                const isCurrent = version.version === card.currentVersion;
                const date = new Date(version.timestamp);
                return (
                  <div 
                    key={version.version}
                    onClick={() => handleVersionSelect(card.id, version.version)}
                    className={`p-3 mb-2 rounded cursor-pointer transition-colors ${isCurrent ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{isCurrent ? '最新版本' : `版本 ${version.version}`}</span>
                      <span className="text-xs text-gray-500">{date.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
  
  // AI生成主题弹窗
  if (showAISubjectModal && aiSubjectForCard) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">AI生成主题建议</h3>
            <button 
              onClick={() => {
                setShowAISubjectModal(false);
                setAiSubjectForCard(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="flex items-center cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={useTrendingTopics}
                    onChange={(e) => setUseTrendingTopics(e.target.checked)}
                    className="mr-2"
                  />
                  结合热点话题
                </label>
            </div>
            <div className="space-y-2 mb-4">
              {aiSubjectSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAISubject(aiSubjectForCard!, suggestion)}
                  className="p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleRegenerateSubjects}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              重新生成
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 处理返回按钮
  const handleBack = () => {
    navigate('/ai-content-platform-home');
  };
  
  // 处理保存测试
  const handleSaveTest = () => {
    // 这里可以添加保存逻辑
    console.log('Saving A/B test...', { testType, importMethod, emailCards });
    alert(t('testSavedSuccessfully'));
  };
  
  // 处理运行测试
  const handleRunTest = () => {
    // 这里可以添加运行测试的逻辑
    console.log('Running A/B test...', { testType, importMethod, emailCards });
    alert(t('testStartedSuccessfully'));
  };
  
  // 处理打开设置窗口
  const handleOpenSettings = (cardId: string) => {
    setSettingsForCard(cardId);
    setShowSettingsModal(true);
  };
  
  // 处理关闭设置窗口
  const handleCloseSettings = () => {
    setShowSettingsModal(false);
    setSettingsForCard(null);
  };
  
  // 处理更新卡片设置
  const handleUpdateCardSettings = (field: string, value: string) => {
    if (!settingsForCard) return;
    
    setEmailCards(prevCards => 
      prevCards.map(card => 
        card.id === settingsForCard 
          ? { ...card, [field]: value }
          : card
      )
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">A/B Test Creation</h1>
            <span className="ml-2 text-gray-500">▶</span>
          </div>
        </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  // 显示版本创建弹窗，让用户选择模板和热点话题
                  // 对于新卡片，我们创建一个临时ID来传递给弹窗
                  const tempId = 'new-card-temp-id';
                  setCreateVersionForCard(tempId);
                  setSelectedNewTemplate(null);
                  setIncludeHotTopics(false);
                  setShowCreateVersionModal(true);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Add vision
              </button>
              <button 
                onClick={handleSaveTest}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {t('save')}
              </button>
              <button 
                onClick={handleRunTest}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {t('runTest')}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主要内容区域 - 创作画布 */}
      <main className="flex-1 overflow-auto">
        <div 
          ref={canvasRef}
          className="min-h-full bg-gray-100 p-8 relative"
        >
          {/* 画布网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" style={{ margin: '2rem' }}></div>
          
          {/* 邮件卡片 */}
          {emailCards.map((card) => (
            <div
                key={card.id}
                className={`absolute bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${selectedCard === card.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  left: `${card.x}px`,
                  top: `${card.y}px`,
                  width: `${card.width}px`,
                  height: `${card.height}px`,
                  zIndex: card.zIndex,
                  minWidth: '600px',
                  minHeight: '800px'
                }}
              onClick={() => handleCardSelect(card.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
            >
              {/* 卡片头部 */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{card.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{t('email')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowCreateVersionModal(card.id);
                    }}
                    className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    title="创建新版本"
                  >
                    创建新版本
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowVersionHistory(card.id);
                    }}
                    className="p-1 rounded hover:bg-purple-100 text-purple-600 relative"
                    title="版本记录"
                  >
                    📋
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSettings(card.id);
                    }}
                    className="p-1 rounded hover:bg-gray-300"
                    title="设置"
                  >
                    ⚙️
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (card.content) {
                        const previewWindow = window.open('about:blank', '_blank');
                        if (previewWindow) {
                          previewWindow.document.write(card.content);
                          previewWindow.document.close();
                        }
                      }
                    }}
                    className="p-1 rounded hover:bg-green-100 text-green-600"
                    title="预览HTML"
                  >
                    👁️
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // 确保至少保留一个版本
                      if (emailCards.length > 1) {
                        setEmailCards(prevCards => prevCards.filter(c => c.id !== card.id));
                        if (selectedCard === card.id) {
                          setSelectedCard(null);
                        }
                      } else {
                        alert('You must keep at least one version');
                      }
                    }}
                    className="p-1 rounded hover:bg-red-100 text-red-500"
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {/* 卡片内容 */}
              <div className="p-4 min-h-[calc(100%-60px)]">
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">{t('subject')}</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={card.subject}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setEmailCards(prevCards => 
                          prevCards.map(c => {
                            if (c.id === card.id && c.subject !== newValue) {
                              // 创建新版本历史记录
                              const newVersion = c.currentVersion + 1;
                              const newVersionHistory = [...c.versionHistory, {
                                version: newVersion,
                                timestamp: new Date().toISOString(),
                                content: c.content
                              }];
                              
                              return {
                                ...c,
                                subject: newValue,
                                currentVersion: newVersion,
                                versionHistory: newVersionHistory
                              };
                            }
                            return c;
                          })
                        );
                      }}
                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter subject line"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowAISubjectModal(card.id);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:bg-blue-50 rounded"
                      title="AI生成主题"
                    >
                      🤖
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('preview')}</label>
                  <div className="w-full overflow-visible">
                    <iframe
                      srcDoc={card.content}
                      className="w-full border-none"
                      style={{ height: 'auto', minHeight: '800px' }}
                      onLoad={(e) => {
                        const iframe = e.target as HTMLIFrameElement;
                        if (iframe?.contentDocument) {
                          const height = iframe.contentDocument.documentElement.scrollHeight;
                          // 动态调整卡片高度，取消最大高度限制
                          const newHeight = height + 20;
                          if (Math.abs(newHeight - card.height) > 10) {
                            setEmailCards(prevCards => 
                              prevCards.map(c => 
                                c.id === card.id ? { ...c, height: newHeight } : c
                              )
                            );
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* 调整大小锚点 */}
              <div
                className="absolute right-0 bottom-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                onMouseDown={(e) => handleResizeStart(e, card.id)}
              >
                <div className="absolute right-0 bottom-0 w-0 h-0 border-r-8 border-b-8 border-r-blue-400 border-b-blue-400 transform translate-x-1 translate-y-1"></div>
              </div>
              

            </div>
          ))}
        </div>
      </main>
      
      {/* 设置弹窗 */}
      {showSettingsModal && settingsForCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t('testSettings')}</h2>
              <button 
                onClick={handleCloseSettings}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {emailCards.find(card => card.id === settingsForCard) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailSubject')}</label>
                  <input
                    type="text"
                    value={emailCards.find(card => card.id === settingsForCard)?.subject || ''}
                    onChange={(e) => handleUpdateCardSettings('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('content')}</label>
                  <textarea
                    value={emailCards.find(card => card.id === settingsForCard)?.content || ''}
                    onChange={(e) => handleUpdateCardSettings('content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">上传HTML文件</label>
                  <div className="mt-1">
                    {/* 简单直接的文件上传按钮 */}
                    <input
                      type="file"
                      accept=".html,.htm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const htmlContent = event.target?.result as string;
                            handleUpdateCardSettings('content', htmlContent);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-600 file:text-white
                        hover:file:bg-blue-700"
                    />
                    
                    {/* 拖放上传区域 */}
                    <div 
                      className="mt-4 p-8 border-2 border-gray-300 border-dashed rounded-md text-center"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-blue-500');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-500');
                        
                        const file = e.dataTransfer.files?.[0];
                        if (file && (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm'))) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const htmlContent = event.target?.result as string;
                            handleUpdateCardSettings('content', htmlContent);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H28m-8 0H8m12 0h8m-8-8h12a4 4 0 004-4v-4m0 0V8a4 4 0 00-4-4H12a4 4 0 00-4 4v4m16 4v4m-8-4h8z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">将HTML文件拖放到此处上传</p>
                      <p className="mt-1 text-xs text-gray-500">.html, .htm 文件</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('cardTitle')}</label>
                  <input
                    type="text"
                    value={emailCards.find(card => card.id === settingsForCard)?.title || ''}
                    onChange={(e) => handleUpdateCardSettings('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleCloseSettings}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 版本创建弹窗 */}
      {showCreateVersionModal && createVersionForCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">创建新版本</h2>
              <button 
                onClick={() => {
                  setShowCreateVersionModal(false);
                  setCreateVersionForCard(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {/* 选择邮件模板 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择邮件模板（可选）</label>
              <select
                value={selectedNewTemplate || ''}
                onChange={(e) => setSelectedNewTemplate(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">使用当前模板</option>
                {emailTemplates?.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title || `Template ${template.id}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 包含热点话题开关 */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm">包含热点话题</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={includeHotTopics}
                  onChange={(e) => setIncludeHotTopics(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            
            {/* 按钮组 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateVersionModal(false);
                  setCreateVersionForCard(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateNewVersion}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                创建版本
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestCreationPage;