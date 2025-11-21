// 聊天历史管理工具

export interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
  data: {
    textContent?: string;
    files?: Array<{ name: string; size: number; type: string; data: string }>;
    selectedChannels?: string[];
    messages?: Array<{
      id: string;
      type: 'user' | 'ai';
      content: string;
      files?: File[];
      fileData?: Array<{ name: string; size: number; type: string; data: string }>;
      timestamp: Date;
    }>;
  };
}

const CHAT_HISTORY_KEY = 'ai_chat_history';
const MAX_HISTORY_COUNT = 50;

// 获取所有聊天历史
export const getChatHistory = (): ChatHistory[] => {
  try {
    const historyStr = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!historyStr) return [];
    const history = JSON.parse(historyStr);
    // 将时间戳转换为Date对象
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

// 保存聊天历史
export const saveChatHistory = (history: ChatHistory): void => {
  try {
    const histories = getChatHistory();
    // 检查是否已存在（相同ID）
    const existingIndex = histories.findIndex(h => h.id === history.id);
    if (existingIndex >= 0) {
      // 更新现有记录
      histories[existingIndex] = history;
    } else {
      // 添加新记录
      histories.unshift(history);
      // 限制历史记录数量
      if (histories.length > MAX_HISTORY_COUNT) {
        histories.pop();
      }
    }
    // 按时间排序（最新的在前）
    histories.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(histories));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

// 根据ID获取聊天历史
export const getChatHistoryById = (id: string): ChatHistory | null => {
  const histories = getChatHistory();
  return histories.find(h => h.id === id) || null;
};

// 删除聊天历史
export const deleteChatHistory = (id: string): void => {
  try {
    const histories = getChatHistory();
    const filtered = histories.filter(h => h.id !== id);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete chat history:', error);
  }
};

// 清空所有聊天历史
export const clearAllChatHistory = (): void => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};

// 创建新聊天历史
export const createChatHistory = (
  data: ChatHistory['data'],
  title?: string
): ChatHistory => {
  const preview = data.textContent || data.messages?.[0]?.content || '新对话';
  const firstLine = preview.split('\n')[0].substring(0, 50);
  
  return {
    id: Date.now().toString(),
    title: title || firstLine || '新对话',
    preview: firstLine || '新对话',
    timestamp: new Date(),
    messageCount: data.messages?.length || 1,
    data
  };
};

