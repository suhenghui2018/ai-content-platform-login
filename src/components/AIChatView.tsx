import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { saveChatHistory, getChatHistoryById, createChatHistory, ChatHistory } from '../utils/chatHistory';
import { getBoundChannelsForSync } from '../utils/channelConfig';
import EmailEditorModal from './EmailEditorModal';
import ContentPreviewModal from './ContentPreviewModal';
import LanguageConvertModal, { TargetLanguage, ConvertOption } from './LanguageConvertModal';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  files?: File[];
  fileData?: Array<{ name: string; size: number; type: string; data: string }>;
  timestamp: Date;
  isThinking?: boolean;
  thinkingSteps?: string[];
  generatedContent?: {
    title: string;
    content: string;
    channels: string[];
  }[];
  actionButtons?: Array<{
    label: string;
    action: string;
    onClick: () => void;
  }>;
}

interface AIChatViewProps {
  initialData?: {
    textContent?: string;
    files?: Array<{ name: string; size: number; type: string; data: string }>;
    selectedChannels?: string[];
    historyId?: string;
  } | null;
  onBack?: () => void;
}

const AIChatView: React.FC<AIChatViewProps> = ({ initialData, onBack }) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [chatHistoryId, setChatHistoryId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    channels: string[];
    isHTML?: boolean;
  }[]>([]);
  const [contentVersions, setContentVersions] = useState<{
    [key: string]: {
      title: string;
      content: string;
      channels: string[];
      isHTML?: boolean;
    }[][];
  }>({});
  const [selectedVersion, setSelectedVersion] = useState<{ [key: string]: number }>({});
  const [isLoadingHTML, setIsLoadingHTML] = useState<{ [key: string]: boolean }>({});
  const [loadedHTMLContent, setLoadedHTMLContent] = useState<{ [key: string]: string }>({});
  const [loadedHTMLVersions, setLoadedHTMLVersions] = useState<Set<string>>(new Set()); // 跟踪已加载完成的HTML版本
  const [selectedChannelIndex, setSelectedChannelIndex] = useState<number>(0); // 当前选中的渠道索引
  // 版本历史：{ [channelId]: { [versionIndex]: Array<{ timestamp: Date, version: string, content: any }> } }
  const [versionHistory, setVersionHistory] = useState<{ 
    [channelId: string]: { 
      [versionIndex: number]: Array<{ 
        timestamp: Date; 
        version: string; 
        content: {
          title: string;
          content: string;
          channels: string[];
          isHTML?: boolean;
        };
      }> 
    } 
  }>({});
  // 当前选中的历史版本索引：{ [channelId]: { [versionIndex]: historyIndex } }
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<{ 
    [channelId: string]: { 
      [versionIndex: number]: number 
    } 
  }>({});
  const [showSyncModal, setShowSyncModal] = useState(false); // 同步弹窗显示状态
  const [selectedSyncChannels, setSelectedSyncChannels] = useState<string[]>([]); // 选中的同步渠道
  const [isSyncing, setIsSyncing] = useState(false); // 是否正在同步
  const [syncSuccess, setSyncSuccess] = useState(false); // 同步是否成功
  const [showEditorModal, setShowEditorModal] = useState(false); // 编辑弹窗显示状态
  const [editorContent, setEditorContent] = useState<string>(''); // 编辑器内容
  const [showPreviewModal, setShowPreviewModal] = useState(false); // 预览弹窗显示状态
  const [previewContent, setPreviewContent] = useState<string>(''); // 预览内容
  const [previewIsHTML, setPreviewIsHTML] = useState<boolean>(false); // 预览内容是否为HTML
  const [showLanguageConvertModal, setShowLanguageConvertModal] = useState(false); // 语言转换弹窗显示状态
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasTriggeredInitialThinking = useRef(false);
  const htmlCodeScrollRef = useRef<HTMLDivElement>(null); // HTML代码滚动容器引用
  
  // 从系统配置中获取已绑定的渠道列表
  const boundChannels = useMemo(() => getBoundChannelsForSync(t), [t]);
  
  // 处理编辑保存
  const handleSaveEdit = (newContent: string) => {
    if (generatedContent.length === 0) return;
    
    const currentChannelId = selectedChannels[selectedChannelIndex];
    const contentIndex = generatedContent.findIndex(c => 
      c.channels.includes(currentChannelId)
    );
    
    if (contentIndex === -1) return;
    
    const baseContent = generatedContent[contentIndex];
    const channelId = baseContent.channels[0] || 'default';
    const versions = contentVersions[channelId] || [];
    const currentVersionIndex = selectedVersion[channelId] ?? 0;
    const currentVersionHistory = versionHistory[channelId]?.[currentVersionIndex] || [];
    const currentHistoryIndex = selectedHistoryIndex[channelId]?.[currentVersionIndex] ?? 
      (currentVersionHistory.length > 0 ? currentVersionHistory.length - 1 : -1);
    
    // 更新内容
    if (currentHistoryIndex >= 0 && currentVersionHistory[currentHistoryIndex]) {
      // 如果是历史版本，更新历史版本内容
      setVersionHistory(prev => {
        const newHistory = { ...prev };
        if (!newHistory[channelId]) {
          newHistory[channelId] = {};
        }
        if (!newHistory[channelId][currentVersionIndex]) {
          newHistory[channelId][currentVersionIndex] = [];
        }
        const updatedHistory = [...newHistory[channelId][currentVersionIndex]];
        updatedHistory[currentHistoryIndex] = {
          ...updatedHistory[currentHistoryIndex],
          content: {
            ...updatedHistory[currentHistoryIndex].content,
            content: newContent
          }
        };
        newHistory[channelId][currentVersionIndex] = updatedHistory;
        return newHistory;
      });
    } else {
      // 如果是当前版本，更新版本内容
      if (versions.length > 0 && versions[currentVersionIndex]) {
        setContentVersions(prev => {
          const newVersions = { ...prev };
          if (!newVersions[channelId]) {
            newVersions[channelId] = [];
          }
          const updatedVersions = [...newVersions[channelId]];
          updatedVersions[currentVersionIndex] = [{
            ...updatedVersions[currentVersionIndex][0],
            content: newContent
          }];
          newVersions[channelId] = updatedVersions;
          return newVersions;
        });
      } else {
        // 更新基础内容
        setGeneratedContent(prev => {
          const updatedContent = [...prev];
          updatedContent[contentIndex] = {
            ...updatedContent[contentIndex],
            content: newContent
          };
          return updatedContent;
        });
      }
    }
  };
  
  // 处理编辑按钮点击
  const handleEditClick = () => {
    if (generatedContent.length === 0) return;
    
    const currentChannelId = selectedChannels[selectedChannelIndex];
    const contentIndex = generatedContent.findIndex(c => 
      c.channels.includes(currentChannelId)
    );
    
    if (contentIndex === -1) return;
    
    const baseContent = generatedContent[contentIndex];
    const channelId = baseContent.channels[0] || 'default';
    const versions = contentVersions[channelId] || [];
    const currentVersionIndex = selectedVersion[channelId] ?? 0;
    const currentVersionContent = versions.length > 0 && versions[currentVersionIndex] 
      ? versions[currentVersionIndex][0] 
      : baseContent;
    
    // 获取当前版本的版本历史
    const currentVersionHistory = versionHistory[channelId]?.[currentVersionIndex] || [];
    const currentHistoryIndex = selectedHistoryIndex[channelId]?.[currentVersionIndex] ?? 
      (currentVersionHistory.length > 0 ? currentVersionHistory.length - 1 : -1);
    
    // 根据选中的历史版本获取内容，如果没有选中历史版本，使用当前版本内容
    const displayContent = currentHistoryIndex >= 0 && currentVersionHistory[currentHistoryIndex]
      ? currentVersionHistory[currentHistoryIndex].content
      : currentVersionContent;
    
    // 获取邮件HTML内容，确保是完整的HTML字符串
    const emailContent = displayContent.content || '';
    console.log('Loading email content to editor:', emailContent.substring(0, 200)); // 调试日志
    
    setEditorContent(emailContent);
    setShowEditorModal(true);
  };
  
  // 处理预览按钮点击
  const handlePreviewClick = () => {
    if (generatedContent.length === 0) return;
    
    const currentChannelId = selectedChannels[selectedChannelIndex];
    const contentIndex = generatedContent.findIndex(c => 
      c.channels.includes(currentChannelId)
    );
    
    if (contentIndex === -1) return;
    
    const baseContent = generatedContent[contentIndex];
    const channelId = baseContent.channels[0] || 'default';
    const versions = contentVersions[channelId] || [];
    const currentVersionIndex = selectedVersion[channelId] ?? 0;
    const currentVersionContent = versions.length > 0 && versions[currentVersionIndex] 
      ? versions[currentVersionIndex][0] 
      : baseContent;
    
    // 获取当前版本的版本历史
    const currentVersionHistory = versionHistory[channelId]?.[currentVersionIndex] || [];
    const currentHistoryIndex = selectedHistoryIndex[channelId]?.[currentVersionIndex] ?? 
      (currentVersionHistory.length > 0 ? currentVersionHistory.length - 1 : -1);
    
    // 根据选中的历史版本获取内容，如果没有选中历史版本，使用当前版本内容
    const displayContent = currentHistoryIndex >= 0 && currentVersionHistory[currentHistoryIndex]
      ? currentVersionHistory[currentHistoryIndex].content
      : currentVersionContent;
    
    setPreviewContent(displayContent.content || '');
    setPreviewIsHTML(displayContent.isHTML || false);
    setShowPreviewModal(true);
  };

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
    if (initialData?.historyId) {
      const history = getChatHistoryById(initialData.historyId);
      if (history && history.data.messages) {
        setChatHistoryId(initialData.historyId);
        const restoredMessages = history.data.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(restoredMessages);
        setSelectedChannels(history.data.selectedChannels || []);
        return;
      }
    }
  }, [initialData?.historyId]);

  // 初始化：加载初始数据
  useEffect(() => {
    if (initialData && !initialData.historyId && !hasTriggeredInitialThinking.current) {
      const fileObjects: File[] = [];
      
      if (initialData.files && initialData.files.length > 0) {
        initialData.files.forEach((fileData) => {
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
      
      const userInputText = initialData.textContent || '';
      const channels = initialData.selectedChannels || [];
      
      if (userInputText || fileObjects.length > 0) {
        const initialMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: userInputText,
          files: fileObjects.length > 0 ? fileObjects : undefined,
          fileData: initialData.files,
          timestamp: new Date()
        };
        setMessages([initialMessage]);
        
        // 设置选中的渠道
        if (channels.length > 0) {
          setSelectedChannels(channels);
        }

        // 标记已触发，防止重复触发
        hasTriggeredInitialThinking.current = true;

        // 延迟一下，确保状态更新完成后再触发AI思考
        setTimeout(() => {
          triggerAIThinking(userInputText, channels, fileObjects.length > 0 ? fileObjects : undefined);
        }, 500);
      }
      
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
          files: undefined,
        }))
      };

      let history: ChatHistory;
      if (chatHistoryId) {
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
        history = createChatHistory(historyData);
        setChatHistoryId(history.id);
      }

      saveChatHistory(history);
    }
  }, [messages, selectedChannels, chatHistoryId]);

  // 触发AI思考过程
  const triggerAIThinking = (userInputText: string, channels: string[], userFiles?: File[], isModification: boolean = false) => {
    // 检查是否已经在生成中，避免重复触发
    if (isGenerating) {
      return;
    }
    
    setIsGenerating(true);

    // 显示AI正在思考的消息
    const thinkingMessageId = `thinking-${Date.now()}`;

    setTimeout(() => {
      // 检查是否已经存在思考消息，避免重复添加
      setMessages(prev => {
        const hasThinkingMessage = prev.some(msg => msg.isThinking);
        if (hasThinkingMessage) {
          return prev;
        }
        
        const thinkingMessage: Message = {
          id: thinkingMessageId,
          type: 'ai',
          content: isModification ? '正在分析中...' : '正在深度思考中...',
          timestamp: new Date(),
          isThinking: true,
          thinkingSteps: [] // 初始为空，后续逐步添加
        };
        return [...prev, thinkingMessage];
      });

      // AI思考时间：10-15秒（随机）
      const thinkingDuration = 10000 + Math.random() * 5000; // 10-15秒

      // 根据是否是修改请求，决定显示详细的思考过程还是简化的思考过程
      if (isModification) {
        // 修改请求：显示简化的思考过程
        const simpleThinkingSteps = [
          '正在分析修改需求...',
          '正在调整内容...',
          '正在优化内容...'
        ];

        // 逐步显示简化的思考步骤
        let currentStep = 0;
        const stepInterval = setInterval(() => {
          if (currentStep < simpleThinkingSteps.length) {
            setMessages(prev => prev.map(msg => 
              msg.id === thinkingMessageId 
                ? { 
                    ...msg, 
                    thinkingSteps: simpleThinkingSteps.slice(0, currentStep + 1)
                  }
                : msg
            ));
            currentStep++;
          } else {
            clearInterval(stepInterval);
          }
        }, thinkingDuration / simpleThinkingSteps.length);
      } else {
        // 首次生成：显示详细的思考过程（类似阅读Word文档并生成内容）
        const thinkingSteps = [
          '📄 正在读取Word文档内容...',
          '📖 解析文档格式和文本结构...',
          '🔍 提取关键信息和核心要点...',
          '💡 分析用户意图和内容需求...',
          '🎯 识别最适合的内容渠道...',
          '📝 构建内容框架和大纲...',
          '✨ 生成初版内容并进行优化...',
          '🎨 应用品牌调性和视觉元素...',
          '✅ 完成内容生成和最终检查'
        ];

        // 逐步显示详细的思考步骤（在思考时间内均匀分布）
        let currentStep = 0;
        const stepInterval = setInterval(() => {
          if (currentStep < thinkingSteps.length) {
            setMessages(prev => prev.map(msg => 
              msg.id === thinkingMessageId 
                ? { 
                    ...msg, 
                    thinkingSteps: thinkingSteps.slice(0, currentStep + 1)
                  }
                : msg
            ));
            currentStep++;
          } else {
            clearInterval(stepInterval);
          }
        }, thinkingDuration / thinkingSteps.length);
      }
      
      // 右侧生成动画延迟：2-3秒（在AI思考气泡出现后）
      const rightPanelDelay = 2000 + Math.random() * 1000; // 2-3秒
      
      // 右侧生成动画先开始（在AI思考气泡出现后延迟2-3秒）
      setTimeout(() => {
        // 先显示右侧内容区域的加载状态
        setIsGenerating(true);
      }, rightPanelDelay);
      
      // 思考完成后，生成最终回复（生成多个版本）
      setTimeout(() => {
        // 为每个渠道生成多个版本（V1, V2）
        const versions: { [key: string]: {
          title: string;
          content: string;
          channels: string[];
          isHTML?: boolean;
        }[][] } = {};
        
        // 检查是否是修改请求（即有已有内容或不是首次消息）
        const isModificationRequest = Object.keys(contentVersions).length > 0 || 
          messages.filter(msg => msg.type === 'user').length > 1;
        
        channels.forEach(channelId => {
          const v1 = generateContentForChannels([channelId], userInputText, 1);
          const v2 = generateContentForChannels([channelId], userInputText, 2); // V2版本使用不同的HTML内容
          versions[channelId] = [v1, v2];
          
          // 如果是修改请求，记录版本历史
          if (isModificationRequest) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: false 
            });
            
            setVersionHistory(prev => {
              const newHistory = { ...prev };
              if (!newHistory[channelId]) {
                newHistory[channelId] = {};
              }
              if (!newHistory[channelId][0]) {
                newHistory[channelId][0] = [];
              }
              if (!newHistory[channelId][1]) {
                newHistory[channelId][1] = [];
              }
              
              // 为V1和V2都添加版本历史，保存内容快照
              const v1Content = v1[0];
              const v2Content = v2[0];
              
              newHistory[channelId][0] = [
                ...(newHistory[channelId][0] || []),
                { 
                  timestamp: now, 
                  version: `V1-${timeStr}`,
                  content: v1Content
                }
              ];
              newHistory[channelId][1] = [
                ...(newHistory[channelId][1] || []),
                { 
                  timestamp: now, 
                  version: `V2-${timeStr}`,
                  content: v2Content
                }
              ];
              
              return newHistory;
            });
            
            // 设置当前选中的历史版本为最新（最后一个）
            // 注意：这里需要在setVersionHistory的回调中获取最新的历史长度
            setTimeout(() => {
              setVersionHistory(prev => {
                const historyLength0 = (prev[channelId]?.[0]?.length || 0);
                const historyLength1 = (prev[channelId]?.[1]?.length || 0);
                setSelectedHistoryIndex(prevIndex => {
                  const newIndex = { ...prevIndex };
                  if (!newIndex[channelId]) {
                    newIndex[channelId] = {};
                  }
                  newIndex[channelId][0] = historyLength0 > 0 ? historyLength0 - 1 : 0;
                  newIndex[channelId][1] = historyLength1 > 0 ? historyLength1 - 1 : 0;
                  return newIndex;
                });
                return prev;
              });
            }, 0);
          }
        });

        // 如果没有选择渠道，生成通用版本
        if (channels.length === 0) {
          const v1 = generateContentForChannels([], userInputText, 1);
          const v2 = generateContentForChannels([], userInputText, 2);
          versions['default'] = [v1, v2];
          
          // 如果是修改请求，记录版本历史
          if (isModificationRequest) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: false 
            });
            
            setVersionHistory(prev => {
              const newHistory = { ...prev };
              if (!newHistory['default']) {
                newHistory['default'] = {};
              }
              if (!newHistory['default'][0]) {
                newHistory['default'][0] = [];
              }
              if (!newHistory['default'][1]) {
                newHistory['default'][1] = [];
              }
              
              newHistory['default'][0] = [
                ...(newHistory['default'][0] || []),
                { timestamp: now, version: `V1-${timeStr}` }
              ];
              newHistory['default'][1] = [
                ...(newHistory['default'][1] || []),
                { timestamp: now, version: `V2-${timeStr}` }
              ];
              
              return newHistory;
            });
          }
        }

        setContentVersions(versions);
        
        // 设置默认选中V1
        const defaultSelected: { [key: string]: number } = {};
        Object.keys(versions).forEach(key => {
          defaultSelected[key] = 0;
        });
        setSelectedVersion(defaultSelected);

        // 显示默认版本（V1），但先不显示HTML内容，而是显示加载动画
        const defaultContent: {
          title: string;
          content: string;
          channels: string[];
          isHTML?: boolean;
        }[] = [];
        const loadingStates: { [key: string]: boolean } = {};
        const loadedContent: { [key: string]: string } = {};
        
        Object.keys(versions).forEach(key => {
          const content = versions[key][0][0];
          defaultContent.push(content);
          
          // 如果是HTML内容，设置加载状态
          if (content.isHTML) {
            loadingStates[`${key}-0`] = false; // 先不开始加载，等待思考完成
            loadedContent[`${key}-0`] = ''; // 初始为空
          }
        });
        
        setGeneratedContent(defaultContent);
        setIsLoadingHTML(loadingStates);
        setLoadedHTMLContent(loadedContent);
        // 重置选中的渠道索引为第一个
        setSelectedChannelIndex(0);

        // 思考完成后立即开始HTML代码逐行加载
        Object.keys(versions).forEach(key => {
          const content = versions[key][0][0];
          if (content.isHTML) {
            const contentKey = `${key}-0`;
            // 确保初始状态正确
            setIsLoadingHTML(prev => ({
              ...prev,
              [contentKey]: true
            }));
            setLoadedHTMLContent(prev => ({
              ...prev,
              [contentKey]: ''
            }));
            // 延迟一小段时间后开始加载，确保状态已更新
            setTimeout(() => {
              animateHTMLLoading(contentKey, content.content);
            }, 100);
            // 注意：初始加载完成后会在animateHTMLLoading中标记为已加载
          }
        });

        const finalMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: '我已经为您生成了内容，请查看右侧内容展示区域。',
          timestamp: new Date(),
          isThinking: false,
          generatedContent: defaultContent
        };

        setMessages(prev => prev.map(msg => 
          msg.id === thinkingMessageId 
            ? { ...msg, isThinking: false, content: '思考完成！' }
            : msg
        ));

        setTimeout(() => {
          setMessages(prev => [...prev, finalMessage]);
          setIsGenerating(false);
        }, 500);
      }, thinkingDuration); // AI思考时间：10-15秒
    }, 1000);
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!inputText.trim() && uploadedFiles.length === 0) return;

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

      const userInputText = inputText; // 保存用户输入
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setUploadedFiles([]);

      // 检查是否是修改请求（已有内容生成）
      const isModificationRequest = Object.keys(contentVersions).length > 0 || generatedContent.length > 0;
      
      if (isModificationRequest) {
        // 如果是修改请求，先调用AI获取反馈，然后询问是否确认修改
        handleModificationRequest(userInputText, selectedChannels, uploadedFiles.length > 0 ? uploadedFiles : undefined);
      } else {
        // 首次生成，触发AI思考过程
        triggerAIThinking(userInputText, selectedChannels, uploadedFiles.length > 0 ? uploadedFiles : undefined);
      }
    });
  };

  // 处理修改请求：调用AI获取反馈，然后询问是否确认修改
  const handleModificationRequest = async (userInput: string, channels: string[], userFiles?: File[]) => {
    // 显示AI正在思考
    const thinkingMessageId = `thinking-${Date.now()}`;
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      type: 'ai',
      content: '正在分析您的修改需求...',
      timestamp: new Date(),
      isThinking: true
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // 调用AI API获取反馈（这里先使用模拟，后续可以对接真实的AI模型）
      const aiResponse = await callAIForFeedback(userInput, channels);
      
      // 移除思考消息，添加AI回复
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessageId));
      
      // AI回复消息
      const responseMessage: Message = {
        id: `ai-response-${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);

      // 延迟后发送确认修改的消息
      setTimeout(() => {
        const confirmMessageId = `confirm-${Date.now()}`;
        const confirmMessage: Message = {
          id: confirmMessageId,
          type: 'ai',
          content: '您是否确认根据以上要求修改内容？',
          timestamp: new Date(),
          actionButtons: [
            {
              label: '确认修改',
              action: 'confirm',
              onClick: () => {
                handleConfirmModification(userInput, channels, userFiles);
                // 移除确认消息
                setMessages(prev => prev.filter(msg => msg.id !== confirmMessageId));
              }
            },
            {
              label: '继续沟通',
              action: 'continue',
              onClick: () => {
                // 继续沟通，移除确认消息
                setMessages(prev => prev.filter(msg => msg.id !== confirmMessageId));
              }
            }
          ]
        };
        setMessages(prev => [...prev, confirmMessage]);
      }, 1000);
    } catch (error) {
      console.error('AI反馈获取失败:', error);
      setMessages(prev => {
        const updated = prev.filter(msg => msg.id !== thinkingMessageId);
        return [...updated, {
          id: `error-${Date.now()}`,
          type: 'ai',
          content: '抱歉，AI服务暂时不可用，请稍后再试。',
          timestamp: new Date()
        }];
      });
    }
  };

  // 调用AI获取反馈（可以对接真实的AI模型API）
  const callAIForFeedback = async (userInput: string, channels: string[]): Promise<string> => {
    // TODO: 这里可以对接真实的AI模型API，比如：
    // - OpenAI API
    // - Anthropic Claude API
    // - 免费的AI服务如 Hugging Face Inference API
    // - 或其他免费的AI模型服务
    
    // 目前使用模拟的AI回复
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟AI回复
        const responses = [
          `我理解您的需求：${userInput}。我会根据这些要求调整内容，使其更符合您的期望。`,
          `根据您的要求"${userInput}"，我会优化内容的表达方式和结构，让内容更加精准和吸引人。`,
          `明白了，我会根据"${userInput}"这个要求，对内容进行相应的调整和优化。`,
          `好的，我会按照您的要求"${userInput}"来修改内容，确保符合您的需求。`
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500 + Math.random() * 1000); // 模拟网络延迟
    });
    
    // 示例：对接真实的AI API（需要配置API密钥）
    /*
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的内容编辑助手，帮助用户优化内容。'
            },
            {
              role: 'user',
              content: `用户要求：${userInput}。请给出修改建议和反馈。`
            }
          ],
          max_tokens: 500
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API调用失败:', error);
      throw error;
    }
    */
  };

  // 确认修改：生成新版本
  const handleConfirmModification = (userInput: string, channels: string[], userFiles?: File[]) => {
    // 触发AI思考过程，生成新版本（会记录版本历史）
    // 传递 isModification=true 来使用简化的思考过程
    triggerAIThinking(userInput, channels, userFiles, true);
  };

  // 处理回车键发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 逐行加载HTML内容动画
  const animateHTMLLoading = (contentKey: string, fullHTML: string) => {
    // 确保初始状态为空
    setLoadedHTMLContent(prev => {
      const newState = { ...prev };
      newState[contentKey] = '';
      return newState;
    });
    
    const lines = fullHTML.split('\n');
    let currentLine = 0;
    
    // 使用递归的setTimeout来确保每次更新都能被渲染
    const loadNextLine = () => {
      if (currentLine < lines.length) {
        const loadedLines = lines.slice(0, currentLine + 1).join('\n');
        // 强制更新状态
        setLoadedHTMLContent(prev => {
          // 创建新对象，确保React检测到变化
          const newState = { ...prev };
          newState[contentKey] = loadedLines;
          return newState;
        });
        currentLine++;
        
        // 自动滚动到最新加载的行
        setTimeout(() => {
          if (htmlCodeScrollRef.current) {
            htmlCodeScrollRef.current.scrollTop = htmlCodeScrollRef.current.scrollHeight;
          }
        }, 10);
        
        // 使用setTimeout替代setInterval，确保每次更新都能被处理
        // 每行延迟100ms，让加载过程更明显
        setTimeout(() => {
          requestAnimationFrame(loadNextLine);
        }, 100);
      } else {
        // 加载完成，延迟500ms后显示完整内容
        setTimeout(() => {
          setIsLoadingHTML(prev => {
            const newState = { ...prev };
            newState[contentKey] = false;
            return newState;
          });
          // 标记该版本已加载完成
          setLoadedHTMLVersions(prev => new Set(prev).add(contentKey));
        }, 500);
      }
    };
    
    // 开始加载第一行
    setTimeout(() => {
      requestAnimationFrame(loadNextLine);
    }, 100);
  };

  // 生成内容（模拟）
  const generateContentForChannels = (channels: string[], userInput: string, version: number = 1) => {
    const channelNames: { [key: string]: string } = {
      'email': 'Email',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'xiaohongshu': '小红书',
      'sms': 'SMS',
      'rcs': 'RCS',
      'all-channels': '全渠道'
    };

    // Email渠道的HTML示例内容 - V1版本
    const emailHTMLContentV1 = `<!DOCTYPE html>
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
            <div class="header">
                <img src="https://s1.imagehub.cc/images/2025/08/23/7e1afb810ac8c39809aaf682bd5040f8.png" alt="Godiva Chocolatier" class="logo">
            </div>
            <div class="hero">
                <img src="https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg" alt="Godiva 2025 方形朱古力" class="hero-image">
                <div class="hero-overlay">
                    <h1 class="hero-title">2025方形朱古力系列</h1>
                    <p class="hero-subtitle">高級會員尊享預購即將開啟</p>
                </div>
            </div>
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
            <div class="cta-section">
                <h2 class="cta-title">立即預購</h2>
                <p class="cta-text">作為Godiva高級會員，您可於2025年6月5日至6月12日期間享受專屬預購權益</p>
                <a href="https://e.tb.cn/h.6BUaa8HJRtnKoZe?tk=thVbVLgDHfa" class="cta-button">尊享預購優惠</a>
            </div>
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
        updateCountdown();
        setInterval(updateCountdown, 1000);
    </script>
</body>
</html>`;

    // Facebook渠道的HTML示例内容
    const facebookHTMLContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GODIVA Facebook 帖子</title>
    <style>
        /* 帖子相关样式 */
        .post {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
            color: #1c1e21;
            line-height: 1.34;
        }

        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }

        .page-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #8a3ab9, #e95950);
            margin-right: 10px;
        }

        .page-info {
            flex-grow: 1;
        }

        .page-name {
            font-weight: 600;
            font-size: 15px;
        }

        .post-time {
            font-size: 12px;
            color: #65676b;
        }

        .post-content {
            margin-bottom: 12px;
            font-size: 15px;
            line-height: 1.4;
        }

        .post-image {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 12px;
            height: 380px;
            background-size: cover;
            background-position: center;
        }

        .post-image-1 {
            background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url('https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg');
            background-size: cover;
            background-position: center;
        }

        .hashtags {
            color: #1877f2;
            font-size: 14px;
            margin-top: 8px;
            margin-bottom: 12px;
        }

        .engagement {
            display: flex;
            border-top: 1px solid #e4e6eb;
            border-bottom: 1px solid #e4e6eb;
            padding: 8px 0;
            margin-bottom: 12px;
        }

        .engagement-item {
            flex: 1;
            text-align: center;
            padding: 6px;
            border-radius: 4px;
            font-size: 14px;
            color: #65676b;
            font-weight: 600;
            cursor: pointer;
        }

        .engagement-item:hover {
            background-color: #f0f2f5;
        }

        .reactions {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }

        .reaction-icons {
            display: flex;
            margin-right: 8px;
        }

        .reaction-icon {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #1877f2;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            margin-right: -4px;
            border: 1px solid white;
        }

        .reaction-count {
            font-size: 14px;
            color: #65676b;
        }

        .comments-section {
            margin-top: 12px;
        }

        .comment {
            display: flex;
            margin-bottom: 12px;
        }

        .comment-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #ddd;
            margin-right: 8px;
            flex-shrink: 0;
        }

        .comment-content {
            background: #f0f2f5;
            border-radius: 18px;
            padding: 8px 12px;
            flex-grow: 1;
        }

        .comment-author {
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 2px;
        }

        .comment-text {
            font-size: 14px;
        }

        .comment-actions {
            display: flex;
            margin-top: 4px;
            font-size: 12px;
            color: #65676b;
            font-weight: 600;
        }

        .comment-action {
            margin-right: 12px;
            cursor: pointer;
        }

        .comment-input {
            display: flex;
            margin-top: 12px;
        }

        .comment-input-field {
            flex-grow: 1;
            background: #f0f2f5;
            border-radius: 18px;
            border: none;
            padding: 8px 12px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="post">
        <div class="post-header">
            <div class="page-avatar"></div>
            <div class="page-info">
                <div class="page-name">GODIVA</div>
                <div class="post-time">Sponsored · 2小时</div>
            </div>
        </div>
        
        <div class="post-content">
            🌟 【新品預告 | GODIVA 2025立方巧克力系列】🌟<br><br>
            巧克力愛好者請注意！GODIVA即將為大家帶來驚喜——全新的立方巧克力系列即將登場！🍫<br><br>
            這次我們精心推出了5款全新口味，每一顆都融合了經典工藝與現代創新，致力於為您的味蕾帶來難忘的體驗。產品更貼心準備了三款精緻禮盒，無論是犒賞自己還是為特別的人準備禮物，都是傳遞心意的絕佳選擇。<br><br>
            ✨ <b>預售獨家優惠</b> ✨<br>
            ✅ 預售期：2025年8月18日 - 8月20日<br>
            ✅ 早鳥優惠：享受九五折優惠！<br>
            ✅ 立即預訂：https://www.godiva.cn/index.html#/CommodityDetail?id=10193<br><br>
            小小節日，大大甜蜜。讓GODIVA為您的日常生活增添一份奢華的醇意。
        </div>
        
        <div class="post-image post-image-1"></div>
        
        <div class="hashtags">
            #GODIVA #巧克力 #新品上市 #美食推薦 #限定優惠
        </div>
        
        <div class="engagement">
            <div class="engagement-item">👍 赞</div>
            <div class="engagement-item">💬 评论</div>
            <div class="engagement-item">↪️ 分享</div>
        </div>
        
        <div class="reactions">
            <div class="reaction-icons">
                <div class="reaction-icon">👍</div>
            </div>
            <div class="reaction-count">842</div>
        </div>
        
        <div class="comments-section">
            <div class="comment">
                <div class="comment-avatar"></div>
                <div class="comment-content">
                    <div class="comment-author">李明</div>
                    <div class="comment-text">看起来太美味了！已经等不及要尝试新口味了！</div>
                    <div class="comment-actions">
                        <div class="comment-action">赞</div>
                        <div class="comment-action">回复</div>
                        <div class="comment-action">2小时</div>
                    </div>
                </div>
            </div>
            
            <div class="comment">
                <div class="comment-avatar"></div>
                <div class="comment-content">
                    <div class="comment-author">王小红</div>
                    <div class="comment-text">正好需要送礼物的灵感，这个礼盒看起来太完美了！</div>
                    <div class="comment-actions">
                        <div class="comment-action">赞</div>
                        <div class="comment-action">回复</div>
                        <div class="comment-action">1小时</div>
                    </div>
                </div>
            </div>
            
            <div class="comment-input">
                <div class="comment-avatar"></div>
                <input type="text" placeholder="写下您的评论..." class="comment-input-field">
            </div>
        </div>
    </div>
</body>
</html>`;

    // Email渠道的HTML示例内容 - V2版本
    const emailHTMLContentV2 = `<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body { background-color: #F8F5F0; font-family: 'Arial', sans-serif; line-height: 1.6; }

  .container { max-width: 600px; margin: 0 auto; background: #fff; }

  .header { background: #3A1D0B; padding: 20px; text-align: center; }

  .banner { width: 100%; display: block; }

  .content { padding: 30px; color: #3A1D0B; }

  h2 { color: #3A1D0B; font-size: 24px; margin-bottom: 20px; text-align: center; }

  .price { color: #D4AF37; font-size: 32px; font-weight: bold; text-align: center; margin: 15px 0; }

  .original-price { text-decoration: line-through; color: #999; font-size: 18px; margin-left: 10px; }

  .presale-box { 

    background: #3A1D0B; 

    color: #D4AF37; 

    text-align: center; 

    padding: 15px; 

    margin: 20px 0; 

    border-radius: 4px;

    border: 1px solid #D4AF37;

  }

  .presale-box strong { font-size: 18px; display: block; margin-bottom: 5px; }

  .countdown { 

    background: #3A1D0B; 

    color: #fff; 

    text-align: center; 

    padding: 15px; 

    margin: 25px 0; 

    font-weight: bold; 

    border-radius: 4px;

    border: 1px solid #D4AF37;

  }

  ul { margin: 20px 0; padding-left: 20px; }

  li { margin-bottom: 12px; }

  .cta-button { display: block; width: 80%; max-width: 300px; background: #D4AF37; color: #3A1D0B; 

                text-align: center; padding: 15px; margin: 30px auto; font-weight: bold; 

                text-decoration: none; border-radius: 4px; font-size: 18px; transition: all 0.3s; }

  .cta-button:hover { background: #c19d2c; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }

  .social-links { text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 20px; }

  .social-links a { display: inline-block; margin: 0 10px; color: #3A1D0B; text-decoration: none; }

  .social-links a:hover { color: #D4AF37; text-decoration: underline; }

  .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; background: #f9f9f9; }

  @media (max-width: 480px) {

    .content { padding: 20px; }

    h2 { font-size: 20px; }

    .price { font-size: 28px; }

    .cta-button { width: 90%; }

    .social-links a { display: block; margin: 10px 0; }

  }

</style>

</head>

<body>

  <div class="container">

    <!-- Header -->

    <div class="header">

      <img src="https://s1.imagehub.cc/images/2025/06/16/85f068f28eaaba889981edefa3d97959.png" alt="GODIVA" width="180">

    </div>

    

    <!-- Banner -->

    <img src="https://s1.imagehub.cc/images/2025/06/16/938a13909e7373e86176fff0d9e0a043.jpg" alt="GODIVA立方巧克力" class="banner">

    

    <!-- Content -->

    <div class="content">

      <h2>一口惊喜，五种新意</h2>

      <p>亲爱的会员朋友：</p>

      <p>2025全新升级的GODIVA立方巧克力系列开启预售！内含<strong>五款创新口味</strong>，带来舌尖上的惊喜体验。</p>

      

      <div class="price">

        <span>168元</span>

        <span class="original-price">199元</span>

      </div>

      

      <!-- 预售时间组件 -->

      <div class="presale-box">

        <strong>🎁 预售专属时间</strong>

        <div>2025年6月18日 - 6月20日</div>

      </div>

      

      <ul>

        <li>🍫 <strong>全新口味</strong>：五款创新巧克力，唤醒味蕾新感受</li>

        <li>🎁 <strong>礼盒佳选</strong>：三种精美礼盒，承载您的心意</li>

        <li>💖 <strong>情感联结</strong>：让每个节日和日常都充满甜蜜</li>

      </ul>

      

      <!-- 倒计时组件 -->

      <div class="countdown">🔥 预售倒计时 [X] 天！抢先锁定甜蜜礼遇</div>

      

      <p>#用GODIVA说爱她 —— 无论是节日心意，还是日常小确幸，让巧克力的浓醇替您表达关怀。</p>

      

      <a href="https://www.godiva.com/signature-milk-chocolate-minibars-set12/14023.html" class="cta-button">

        成为首批品鉴官 →

      </a>

      

      <!-- 社交链接 -->

      <div class="social-links">

        <p>关注GODIVA官方社交账号：</p>

        <a href="https://www.instagram.com/godiva/">Instagram</a>

        <a href="https://www.linkedin.com/company/godiva-chocolatier/">LinkedIn</a>

        <a href="https://www.facebook.com/Godiva">Facebook</a>

      </div>

    </div>

    

    <!-- Footer -->

    <div class="footer">

      <p>© 2025 GODIVA歌帝梵 保留所有权利</p>

    </div>

  </div>

</body>

</html>`;

    if (channels.length === 0) {
      return [{
        title: '通用内容',
        content: `基于您的输入"${userInput}"，我为您生成了以下内容：\n\n这是一个示例内容，可以根据您的具体需求进行调整和优化。`,
        channels: [],
        isHTML: false
      }];
    }

    return channels.map(channelId => {
      const channelName = channelNames[channelId] || channelId;
      
      // 如果是Email渠道，根据版本返回不同的HTML内容
      if (channelId === 'email') {
        const emailContent = version === 2 ? emailHTMLContentV2 : emailHTMLContentV1;
        return {
          title: `${channelName}内容`,
          content: emailContent,
          channels: [channelId],
          isHTML: true
        };
      }
      
      // 如果是Facebook渠道，返回Facebook HTML内容
      if (channelId === 'facebook') {
        return {
          title: `${channelName}内容`,
          content: facebookHTMLContent,
          channels: [channelId],
          isHTML: true
        };
      }
      
      // 其他渠道返回普通文本
      return {
        title: `${channelName}内容`,
        content: `基于您的输入"${userInput}"，我为您生成了适用于${channelName}的内容：\n\n这是针对${channelName}平台优化的内容，符合该平台的特点和用户习惯。您可以根据需要进行进一步的调整。`,
        channels: [channelId],
        isHTML: false
      };
    });
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

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* 左侧：聊天窗口 */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white min-w-0 h-full">
        {/* 返回按钮 - 固定在顶部 */}
        {onBack && (
          <div className="flex-shrink-0 border-b border-gray-200 px-4 py-3 bg-gray-50">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{t('back') || '返回'}</span>
            </button>
          </div>
        )}
        
        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* 头像 */}
              <div className="flex-shrink-0">
                {message.type === 'user' ? (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* 消息气泡 */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content && (
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                )}
                
                {/* 深度思考过程 */}
                {message.isThinking && message.thinkingSteps && message.thinkingSteps.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    <div className="text-xs text-gray-500 mb-2 font-medium">深度思考过程</div>
                    {message.thinkingSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sm border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md"
                        style={{
                          animation: `fadeIn 0.3s ease-in ${index * 0.1}s both`
                        }}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-gray-700 leading-relaxed flex-1">{step}</span>
                        {index === message.thinkingSteps!.length - 1 && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    ))}
                    {message.thinkingSteps.length < 9 && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg text-sm border border-gray-200">
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse flex-shrink-0"></div>
                        <span className="text-gray-500 italic">继续分析中...</span>
                      </div>
                    )}
                  </div>
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
                
                {/* 操作按钮 */}
                {message.actionButtons && message.actionButtons.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actionButtons.map((button, index) => (
                      <button
                        key={index}
                        onClick={button.onClick}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          button.action === 'confirm'
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
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
        {/* 内容渠道标签 - 参考菜单样式 */}
        {selectedChannels.length > 0 && (
          <div className="border-b border-gray-200 px-4 py-2 bg-white">
            <nav className="px-4 py-0">
              <ul className="flex space-x-1">
                {selectedChannels.map((channelId, index) => {
                  const channel = channelOptions.find(c => c.id === channelId);
                  if (!channel) return null;
                  const isSelected = selectedChannelIndex === index;
                  return (
                    <li key={channelId}>
                      <button
                        onClick={() => setSelectedChannelIndex(index)}
                        className={`px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-sm font-medium">{channel.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}

        {/* 内容展示区域主体 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isGenerating ? (
            // 生成中的动态效果
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-gray-700 animate-pulse">
                  {t('generatingContent') || '正在生成内容...'}
                </p>
                <p className="text-sm text-gray-500">
                  {t('pleaseWait') || '请稍候，AI正在为您创作精彩内容'}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : generatedContent.length > 0 ? (
            // 生成的内容展示 - 只显示当前选中的渠道
            (() => {
              // 根据选中的渠道索引，找到对应的内容
              const currentChannelId = selectedChannels[selectedChannelIndex];
              const contentIndex = generatedContent.findIndex(c => 
                c.channels.includes(currentChannelId)
              );
              
              if (contentIndex === -1) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>该渠道暂无内容</p>
                  </div>
                );
              }
              
              const baseContent = generatedContent[contentIndex];
              const channelId = baseContent.channels[0] || 'default';
              const versions = contentVersions[channelId] || [];
              const currentVersionIndex = selectedVersion[channelId] ?? 0;
              const hasMultipleVersions = versions.length > 1;
              
              // 根据当前选中的版本索引获取内容
              const currentVersionContent = versions.length > 0 && versions[currentVersionIndex] 
                ? versions[currentVersionIndex][0] 
                : baseContent;
              
              // 获取当前版本的contentKey，用于检查是否已加载完成
              const currentContentKey = `${channelId}-${currentVersionIndex}`;
              const isCurrentVersionLoaded = loadedHTMLVersions.has(currentContentKey);
              
              // 获取当前版本的版本历史
              const currentVersionHistory = versionHistory[channelId]?.[currentVersionIndex] || [];
              // 获取当前选中的历史版本索引（默认显示最新版本，即最后一个）
              const currentHistoryIndex = selectedHistoryIndex[channelId]?.[currentVersionIndex] ?? 
                (currentVersionHistory.length > 0 ? currentVersionHistory.length - 1 : -1);
              
              // 根据选中的历史版本获取内容，如果没有选中历史版本，使用当前版本内容
              const displayContent = currentHistoryIndex >= 0 && currentVersionHistory[currentHistoryIndex]
                ? currentVersionHistory[currentHistoryIndex].content
                : currentVersionContent;

              return (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      {/* 版本历史 */}
                      {currentVersionHistory.length > 0 && (
                        <div className="flex flex-col space-y-2">
                          <div className="text-xs font-medium text-gray-500">版本历史</div>
                          <div className="flex flex-wrap gap-2">
                            {currentVersionHistory.map((history, historyIdx) => {
                              const isSelected = historyIdx === currentHistoryIndex;
                              return (
                                <button
                                  key={historyIdx}
                                  onClick={() => {
                                    setSelectedHistoryIndex(prev => {
                                      const newIndex = { ...prev };
                                      if (!newIndex[channelId]) {
                                        newIndex[channelId] = {};
                                      }
                                      newIndex[channelId][currentVersionIndex] = historyIdx;
                                      return newIndex;
                                    });
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    isSelected
                                      ? 'bg-blue-500 text-white border border-blue-600'
                                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {history.version}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        {/* 版本切换 */}
                        {hasMultipleVersions && (
                          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                            {versions.map((_, versionIndex) => (
                              <button
                                key={versionIndex}
                                onClick={() => {
                                  setSelectedVersion(prev => ({
                                    ...prev,
                                    [channelId]: versionIndex
                                  }));
                                  
                                  // 切换到新版本时，重置历史版本选择为最新
                                  const historyForVersion = versionHistory[channelId]?.[versionIndex] || [];
                                  if (historyForVersion.length > 0) {
                                    setSelectedHistoryIndex(prev => {
                                      const newIndex = { ...prev };
                                      if (!newIndex[channelId]) {
                                        newIndex[channelId] = {};
                                      }
                                      newIndex[channelId][versionIndex] = historyForVersion.length - 1;
                                      return newIndex;
                                    });
                                  }
                                  
                                  // 如果切换到HTML内容，检查是否已经加载完成
                                  const versionContent = versions[versionIndex][0];
                                  if (versionContent.isHTML) {
                                    const contentKey = `${channelId}-${versionIndex}`;
                                    
                                    // 使用函数式更新来检查状态
                                    setLoadedHTMLVersions(prev => {
                                      // 如果该版本还没有加载完成，触发加载动画
                                      if (!prev.has(contentKey)) {
                                        setIsLoadingHTML(prev => ({
                                          ...prev,
                                          [contentKey]: true
                                        }));
                                        setLoadedHTMLContent(prev => ({
                                          ...prev,
                                          [contentKey]: ''
                                        }));
                                        animateHTMLLoading(contentKey, versionContent.content);
                                      }
                                      return prev;
                                    });
                                  }
                                }}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  currentVersionIndex === versionIndex
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                V{versionIndex + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  <div className="prose max-w-none">
                    {displayContent.isHTML ? (
                      (() => {
                        // 如果是历史版本，直接显示历史内容
                        if (currentHistoryIndex >= 0 && currentVersionHistory[currentHistoryIndex]) {
                          return (
                            <div 
                              className="border border-gray-200 rounded-lg overflow-hidden"
                              style={{ maxHeight: '800px', overflowY: 'auto' }}
                            >
                              <iframe
                                srcDoc={displayContent.content}
                                className="w-full"
                                style={{ minHeight: '700px', border: 'none' }}
                                title={displayContent.title}
                              />
                            </div>
                          );
                        }
                        
                        // 当前版本的内容显示逻辑
                        const contentKey = currentContentKey;
                        const isLoading = isLoadingHTML[contentKey] === true;
                        const loadedContent = loadedHTMLContent[contentKey] || '';
                        
                        // 如果已经加载完成，直接显示完整内容
                        if (isCurrentVersionLoaded && !isLoading) {
                          return (
                            <div 
                              className="border border-gray-200 rounded-lg overflow-hidden"
                              style={{ maxHeight: '800px', overflowY: 'auto' }}
                            >
                              <iframe
                                srcDoc={displayContent.content}
                                className="w-full"
                                style={{ minHeight: '700px', border: 'none' }}
                                title={displayContent.title}
                              />
                            </div>
                          );
                        }
                        
                        // 如果正在加载，显示代码加载动画
                        if (isLoading) {
                          // 显示代码加载动画
                          return (
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-900">
                              <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                <span className="ml-2 text-gray-400 text-xs">正在生成HTML代码...</span>
                              </div>
                              <div 
                                ref={htmlCodeScrollRef}
                                className="p-4 font-mono text-xs text-green-400 overflow-auto" 
                                style={{ maxHeight: '500px' }}
                              >
                                <pre className="whitespace-pre-wrap m-0">
                                  {loadedContent}
                                  <span className="animate-pulse text-green-300">▊</span>
                                </pre>
                              </div>
                            </div>
                          );
                        } else {
                          // 加载完成，显示完整邮件预览
                          return (
                            <div 
                              className="border border-gray-200 rounded-lg overflow-hidden"
                              style={{ maxHeight: '800px', overflowY: 'auto' }}
                            >
                              <iframe
                                srcDoc={currentVersionContent.content}
                                className="w-full"
                                style={{ minHeight: '700px', border: 'none' }}
                                title={currentVersionContent.title}
                              />
                            </div>
                          );
                        }
                      })()
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{displayContent.content}</p>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            // 默认空状态
            <div className="text-center text-gray-500 py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">{t('contentPreview') || '内容预览'}</p>
              <p className="text-sm mt-2">{t('contentWillAppearHere') || '生成的内容将显示在这里'}</p>
            </div>
          )}
        </div>
        
        {/* 操作按钮区域 - 固定在底部 */}
        {generatedContent.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-end space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              {t('copy') || '复制'}
            </button>
            <button 
              onClick={handlePreviewClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('preview') || '预览'}
            </button>
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('edit') || '编辑'}
            </button>
            <button 
              onClick={() => setShowLanguageConvertModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
            >
              <span>🌐</span>
              <span>{t('convertLanguage.button') || '转换语言'}</span>
            </button>
            <button 
              onClick={() => setShowSyncModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              同步至平台
            </button>
          </div>
        )}
      </div>
      
      {/* 内容预览弹窗 */}
      {showPreviewModal && (
        <ContentPreviewModal
          isOpen={showPreviewModal}
          content={previewContent}
          isHTML={previewIsHTML}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
      
      {/* 邮件编辑弹窗 */}
      {showEditorModal && (
        <EmailEditorModal
          isOpen={showEditorModal}
          initialContent={editorContent}
          onClose={() => setShowEditorModal(false)}
          onSave={handleSaveEdit}
        />
      )}
      
      {/* 语言转换弹窗 */}
      {showLanguageConvertModal && (
        <LanguageConvertModal
          isOpen={showLanguageConvertModal}
          onClose={() => setShowLanguageConvertModal(false)}
          onConfirm={(targetLanguages: TargetLanguage[], convertOption: ConvertOption) => {
            // 处理语言转换逻辑
            console.log('转换语言:', targetLanguages, '转换选项:', convertOption);
            // TODO: 实现实际的转换逻辑
            const languageNames = targetLanguages.map(lang => 
              lang === 'zh-CN' ? '简体中文' : 
              lang === 'zh-TW' ? '繁體中文' : 
              lang === 'en' ? 'English' : '日本語'
            ).join('、');
            alert(`正在将内容转换为：${languageNames}，转换选项：${convertOption === 'text-only' ? '仅转换文本' : '转换文本+图片'}`);
          }}
        />
      )}
      
      {/* 同步至平台弹窗 */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">同步至平台</h3>
              <button
                onClick={() => {
                  setShowSyncModal(false);
                  setSelectedSyncChannels([]);
                  setIsSyncing(false);
                  setSyncSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {syncSuccess ? (
                // 同步成功状态
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">同步成功！</p>
                  <p className="text-sm text-gray-500">内容已成功同步到选中的平台</p>
                </div>
              ) : isSyncing ? (
                // 同步中状态
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">正在同步...</p>
                  <p className="text-sm text-gray-500">请稍候，内容正在同步到平台</p>
                </div>
              ) : (
                // 渠道选择状态
                <>
                  <p className="text-sm text-gray-600 mb-4">请选择要同步的平台渠道：</p>
                  <div className="grid grid-cols-2 gap-3">
                    {boundChannels.map((channel) => {
                      const isSelected = selectedSyncChannels.includes(channel.id);
                      return (
                        <button
                          key={channel.id}
                          onClick={() => {
                            setSelectedSyncChannels(prev => {
                              if (prev.includes(channel.id)) {
                                return prev.filter(id => id !== channel.id);
                              } else {
                                return [...prev, channel.id];
                              }
                            });
                          }}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {channel.iconImage ? (
                              <img 
                                src={channel.iconImage} 
                                alt={channel.name} 
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <span className="text-xl">{channel.icon}</span>
                            )}
                            <span className={`text-sm font-medium ${
                              isSelected ? 'text-green-700' : 'text-gray-700'
                            }`}>
                              {channel.name}
                            </span>
                            {isSelected && (
                              <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            
            {/* 弹窗底部按钮 */}
            {!syncSuccess && !isSyncing && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSyncModal(false);
                    setSelectedSyncChannels([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (selectedSyncChannels.length === 0) {
                      alert('请至少选择一个平台渠道');
                      return;
                    }
                    // 开始同步
                    setIsSyncing(true);
                    
                    // 模拟同步过程（3-5秒）
                    const syncDuration = 3000 + Math.random() * 2000;
                    setTimeout(() => {
                      setIsSyncing(false);
                      setSyncSuccess(true);
                      
                      // 同步成功后，延迟1秒打开新标签页
                      setTimeout(() => {
                        window.open('https://uat.rimanggis.com/?division=495', '_blank');
                        // 延迟关闭弹窗
                        setTimeout(() => {
                          setShowSyncModal(false);
                          setSelectedSyncChannels([]);
                          setIsSyncing(false);
                          setSyncSuccess(false);
                        }, 2000);
                      }, 1000);
                    }, syncDuration);
                  }}
                  disabled={selectedSyncChannels.length === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedSyncChannels.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  同步
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatView;

