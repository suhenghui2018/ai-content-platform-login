import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { saveChatHistory, getChatHistoryById, createChatHistory, ChatHistory } from '../utils/chatHistory';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  files?: File[];
  fileData?: Array<{ name: string; size: number; type: string; data: string }>;
  timestamp: Date;
}

interface AIChatPageProps {
  onBack?: () => void;
}

const AIChatPage: React.FC<AIChatPageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 从路由状态获取初始数据
  const initialData = location.state as {
    textContent?: string;
    files?: Array<{ name: string; size: number; type: string; data: string }>;
    selectedChannels?: string[];
  } | null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chatHistoryId, setChatHistoryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 内容渠道选项
  const channelOptions = [
    { id: 'all-channels', name: t('allChannels'), icon: '🌐' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'facebook', name: t('facebook'), icon: '👍' },
    { id: 'instagram', name: t('instagram'), icon: '📷' },
    { id: 'xiaohongshu', name: t('xiaohongshu'), icon: '📕' },
    { id: 'sms', name: 'SMS', icon: '💬' },
    { id: 'rcs', name: 'RCS', icon: '📱' }
  ];

  // 检查是否从历史记录加载
  useEffect(() => {
    const historyId = location.state?.historyId;
    if (historyId) {
      const history = getChatHistoryById(historyId);
      if (history && history.data.messages) {
        setChatHistoryId(historyId);
        // 将存储的消息恢复（包括时间戳转换）
        const restoredMessages = history.data.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(restoredMessages);
        setSelectedChannels(history.data.selectedChannels || []);
        return;
      }
    }
  }, [location.state]);

  // 初始化：加载上一页的数据
  useEffect(() => {
    if (initialData && !chatHistoryId) {
      // 将文件数据转换为File对象（用于显示）
      const fileObjects: File[] = [];
      
      if (initialData.files && initialData.files.length > 0) {
        initialData.files.forEach((fileData) => {
          // 从base64创建Blob，然后创建File对象
          const byteString = atob(fileData.data.split(',')[1]);
          const mimeString = fileData.data.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const file = new File([blob], fileData.name, { type: fileData.type });
          fileObjects.push(file);
        });
      }
      
      // 如果有文本内容或文件，创建初始消息
      if (initialData.textContent || fileObjects.length > 0) {
        const initialMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: initialData.textContent || '',
          files: fileObjects.length > 0 ? fileObjects : undefined,
          fileData: initialData.files,
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      }
      
      // 设置选中的渠道
      if (initialData.selectedChannels) {
        setSelectedChannels(initialData.selectedChannels);
      }

      // 设置文件
      if (fileObjects.length > 0) {
        setUploadedFiles(fileObjects);
      }
    }
  }, [initialData]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 保存聊天历史
  useEffect(() => {
    if (messages.length > 0) {
      const historyData = {
        textContent: messages[0]?.content || '',
        files: messages[0]?.fileData || [],
        selectedChannels: selectedChannels,
        messages: messages.map(msg => ({
          ...msg,
          // 序列化File对象为可存储格式
          files: undefined, // File对象不能序列化，使用fileData代替
        }))
      };

      let history: ChatHistory;
      if (chatHistoryId) {
        // 更新现有历史
        const existing = getChatHistoryById(chatHistoryId);
        if (existing) {
          history = {
            ...existing,
            messageCount: messages.length,
            data: historyData
          };
        } else {
          history = createChatHistory(historyData);
          setChatHistoryId(history.id);
        }
      } else {
        // 创建新历史
        history = createChatHistory(historyData);
        setChatHistoryId(history.id);
      }

      saveChatHistory(history);
    }
  }, [messages, selectedChannels, chatHistoryId]);

  // 发送消息
  const handleSendMessage = () => {
    if (!inputText.trim() && uploadedFiles.length === 0) return;

    // 转换文件为可传输格式
    const fileDataPromises = uploadedFiles.map(async (file) => {
      return new Promise<{ name: string; size: number; type: string; data: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileDataPromises).then((fileData) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputText,
        files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
        fileData: uploadedFiles.length > 0 ? fileData : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setUploadedFiles([]);

      // 模拟AI回复
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: t('aiThinking') || '正在思考中...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    });
  };

  // 处理回车键发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext || '')) {
      return '🖼️';
    } else if (['pdf'].includes(ext || '')) {
      return '📄';
    } else if (['doc', 'docx'].includes(ext || '')) {
      return '📝';
    } else if (['xls', 'xlsx'].includes(ext || '')) {
      return '📊';
    } else if (['ppt', 'pptx'].includes(ext || '')) {
      return '📽️';
    }
    return '📎';
  };

  // 菜单项
  const menuItems = useMemo(() => [
    { key: 'home', iconType: 'home', label: t('home'), path: '/dashboard?menu=home' },
    { key: 'content-pack', iconType: 'content-pack', label: t('contentPack'), path: '/dashboard?menu=content-pack' },
    { key: 'app', iconType: 'app', label: t('app'), path: '/dashboard?menu=app' },
    { key: 'brand-pack', iconType: 'brand-pack', label: t('brandPack'), path: '/dashboard?menu=brand-pack' },
    { key: 'content-review', iconType: 'content-review', label: t('contentCompliance'), path: '/dashboard?menu=content-review' },
    { key: 'content-experts', iconType: 'content-experts', label: t('contentExperts'), path: '/dashboard?menu=content-experts' },
    { key: 'data-analysis', iconType: 'data-analysis', label: t('dataAnalysis'), path: '/dashboard?menu=data-analysis' },
    { key: 'channel-configuration', iconType: 'channel-configuration', label: t('channels'), path: '/dashboard?menu=channel-configuration' },
    { key: 'platform-settings', iconType: 'platform-settings', label: t('platformSettings'), path: '/dashboard?menu=platform-settings' },
  ], [t]);

  // 菜单图标组件
  const MenuIcon = ({ iconType, className }: { iconType: string; className?: string }) => {
    const iconClasses = `w-5 h-5 ${className || ''}`;
    switch (iconType) {
      case 'home':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'content-pack':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'app':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'brand-pack':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'content-review':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'content-experts':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'data-analysis':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'channel-configuration':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'platform-settings':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'account-settings':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* 顶部导航栏 - 固定 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t('back') || '返回'}</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{t('aiChat') || 'AI 对话'}</h1>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 折叠式侧边栏菜单 - 固定在左侧 */}
        <div className={`relative bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 h-full ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* 左侧渐变边框 */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200"></div>
          
          {/* Logo区域 */}
          {!isSidebarCollapsed && (
            <div className="px-6 py-0 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-center py-2">
                <img 
                  src="/Memacreate.ai/memalogo.png" 
                  alt="Mema Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          )}
          
          {/* 菜单项 */}
          <nav className="flex-1 overflow-y-auto px-4 py-0">
            <ul className="space-y-0.5">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      // 在AI对话页面，菜单项点击不执行导航，只用于显示
                      // 如需导航，用户需要先返回首页
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-left rounded-lg transition-all duration-200 text-gray-400 cursor-default`}
                    title={isSidebarCollapsed ? item.label : undefined}
                    disabled
                  >
                    <MenuIcon iconType={item.iconType} className="text-gray-400" />
                    {!isSidebarCollapsed && (
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* 账号设置 */}
          {!isSidebarCollapsed && (
            <div className="px-4 py-2 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => {
                  // 在AI对话页面，账号设置点击不执行导航
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 text-gray-400 cursor-default"
                disabled
              >
                <MenuIcon iconType="account-settings" className="text-gray-400" />
                <span className="text-sm font-medium">{t('accountSettings')}</span>
              </button>
            </div>
          )}
          
          {/* 底部工具区 */}
          <div className={`px-4 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0 ${isSidebarCollapsed ? 'px-2' : ''}`}>
            <div className="flex items-center justify-between space-x-2">
              {isSidebarCollapsed ? (
                // 折叠时只显示图标按钮
                <>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors" title="Theme">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors" title="Help">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors" title="Back">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </>
              ) : (
                // 展开时显示完整控件
                <>
                  {/* Light/Dark模式切换 */}
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 flex-1">
                    <button className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-white rounded text-gray-700 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Light</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded text-gray-400 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>Dark</span>
                    </button>
                  </div>
                  
                  {/* 帮助图标 */}
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  {/* 返回箭头 */}
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右侧内容区域 - 包含聊天窗口和内容展示区域 */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {/* 左侧：聊天窗口 */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white min-w-0">
          {/* 聊天消息区域 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content && (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                  
                  {/* 文件附件 */}
                  {((message.fileData && message.fileData.length > 0) || (message.files && message.files.length > 0)) && (
                    <div className="mt-2 space-y-2">
                      {message.fileData && message.fileData.length > 0
                        ? message.fileData.map((fileData, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-2 rounded-lg ${
                                message.type === 'user'
                                  ? 'bg-blue-400/30'
                                  : 'bg-gray-200'
                              }`}
                            >
                              <span className="text-lg">{getFileIcon(fileData.name)}</span>
                              <span className="text-sm truncate max-w-[200px]">{fileData.name}</span>
                              <span className="text-xs opacity-70">
                                {(fileData.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          ))
                        : message.files?.map((file, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-2 rounded-lg ${
                                message.type === 'user'
                                  ? 'bg-blue-400/30'
                                  : 'bg-gray-200'
                              }`}
                            >
                              <span className="text-lg">{getFileIcon(file.name)}</span>
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              <span className="text-xs opacity-70">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          ))}
                    </div>
                  )}
                  
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                  >
                    <span className="text-lg">{getFileIcon(file.name)}</span>
                    <span className="text-gray-700 max-w-xs truncate">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('inputMessage') || '输入消息...'}
                className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleAttachmentClick}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.csv"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          </div>

        {/* 右侧：内容展示区域 */}
        <div className="w-1/2 flex flex-col bg-white min-w-0">
            {/* 内容渠道标签 */}
            {selectedChannels.length > 0 && (
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {t('selectedChannels') || '已选内容渠道'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedChannels.map((channelId) => {
                    const channel = channelOptions.find(c => c.id === channelId);
                    if (!channel) return null;
                    return (
                      <div
                        key={channelId}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm"
                      >
                        <span className="text-lg">{channel.icon}</span>
                        <span className="text-blue-700 font-medium">{channel.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 内容展示区域主体 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center text-gray-500 py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">{t('contentPreview') || '内容预览'}</p>
                <p className="text-sm mt-2">{t('contentWillAppearHere') || '生成的内容将显示在这里'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;

