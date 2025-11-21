import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface EmailEditorModalProps {
  isOpen: boolean;
  initialContent: string;
  onClose: () => void;
  onSave: (content: string) => void;
}

const EmailEditorModal: React.FC<EmailEditorModalProps> = ({
  isOpen,
  initialContent,
  onClose,
  onSave
}) => {
  const { t } = useTranslation();
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const [content, setContent] = useState(initialContent);
  const [editorLoaded, setEditorLoaded] = useState(false);

  // 辅助函数：转义HTML
  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  useEffect(() => {
    if (isOpen && !editorLoaded) {
      // 动态加载 Quill 编辑器
      const loadQuill = async () => {
        // 检查是否已加载 Quill
        if ((window as any).Quill) {
          initEditor();
          return;
        }

        // 检查是否已经加载了 CSS
        if (!document.querySelector('link[href*="quill.snow.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
          document.head.appendChild(link);
        }

        // 检查是否已经加载了 JS
        if (!document.querySelector('script[src*="quill.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
          script.onload = () => {
            initEditor();
          };
          document.body.appendChild(script);
        } else {
          // 如果脚本已存在，等待加载完成
          setTimeout(() => {
            if ((window as any).Quill) {
              initEditor();
            }
          }, 100);
        }
      };

      loadQuill();
    }
    
    // 清理函数：关闭弹窗时重置状态
    return () => {
      if (!isOpen && quillInstanceRef.current) {
        // 清理编辑器实例
        quillInstanceRef.current = null;
        setEditorLoaded(false);
      }
    };
  }, [isOpen, editorLoaded]);

  const initEditor = () => {
    if (!editorRef.current || editorLoaded || quillInstanceRef.current) return;

    try {
      const Quill = (window as any).Quill;
      if (!Quill) return;

      // 清理容器，确保没有残留内容
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }

      // 创建编辑器实例 - 使用单行工具栏配置
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'header': [1, 2, 3, false] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ],
            handlers: {}
          }
        },
        placeholder: '请输入邮件内容...'
      });

      // 如果有初始内容，设置编辑器内容
      if (initialContent) {
        // 对于邮件HTML内容，需要特殊处理
        // 延迟设置以确保编辑器完全初始化
        setTimeout(() => {
          try {
            // 先尝试使用 Quill 的 clipboard API 转换
            const delta = quill.clipboard.convert({ html: initialContent });
            quill.setContents(delta);
            
            // 如果转换后内容为空，说明HTML太复杂，尝试直接设置HTML
            if (quill.root.innerHTML === '<p><br></p>' || quill.root.innerHTML.trim() === '') {
              // 创建一个临时div来解析HTML
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = initialContent;
              
              // 提取文本和基本格式，或者尝试在编辑器中显示HTML源码
              const textContent = tempDiv.textContent || tempDiv.innerText || '';
              if (textContent) {
                // 如果提取到文本，设置文本
                quill.setText(textContent);
              } else {
                // 否则，在编辑器中显示HTML源码（用于编辑）
                quill.root.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${escapeHtml(initialContent)}</pre>`;
              }
            }
          } catch (error) {
            console.error('Failed to convert HTML:', error);
            // 如果转换失败，尝试直接设置HTML的文本内容
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = initialContent;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            quill.setText(textContent || initialContent);
          }
        }, 200);
      }

      // 监听内容变化
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        setContent(html);
      });

      // 保存编辑器实例到 ref
      quillInstanceRef.current = quill;
      (editorRef.current as any).quillInstance = quill;
      setEditorLoaded(true);
    } catch (error) {
      console.error('Failed to initialize Quill editor:', error);
    }
  };

  useEffect(() => {
    if (isOpen && editorLoaded && quillInstanceRef.current && initialContent) {
      setContent(initialContent);
      // 如果编辑器已加载，更新内容
      const quill = quillInstanceRef.current;
      console.log('Loading content to editor:', initialContent.substring(0, 200)); // 调试日志
      
      // 使用 Quill 的 clipboard API 来正确加载 HTML 内容
      try {
        const delta = quill.clipboard.convert({ html: initialContent });
        quill.setContents(delta);
        
        // 如果转换后内容为空，说明HTML太复杂，尝试其他方法
        setTimeout(() => {
          if (quill.root.innerHTML === '<p><br></p>' || quill.root.innerHTML.trim() === '') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = initialContent;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            if (textContent) {
              quill.setText(textContent);
            } else {
              // 显示HTML源码
              quill.root.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${escapeHtml(initialContent)}</pre>`;
            }
          }
        }, 100);
      } catch (error) {
        console.error('Failed to load HTML content:', error);
        // 如果转换失败，尝试直接设置
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = initialContent;
        // 提取文本内容作为备选方案
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        quill.setText(textContent || initialContent);
      }
    }
  }, [isOpen, initialContent, editorLoaded]);

  const handleSave = () => {
    if (quillInstanceRef.current) {
      const quill = quillInstanceRef.current;
      const html = quill.root.innerHTML;
      onSave(html);
    } else {
      onSave(content);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 弹窗头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('editEmail') || '编辑邮件'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 编辑器区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div 
            ref={editorRef}
            className="bg-white min-h-[400px] email-editor-container"
            style={{ height: '500px' }}
          />
          <style>{`
            .email-editor-container .ql-toolbar {
              white-space: nowrap !important;
              overflow-x: auto !important;
              display: flex !important;
              flex-wrap: nowrap !important;
            }
            .email-editor-container .ql-toolbar .ql-formats {
              display: inline-flex !important;
              vertical-align: middle !important;
              margin-right: 8px !important;
            }
            .email-editor-container .ql-toolbar .ql-formats:last-child {
              margin-right: 0 !important;
            }
            /* 确保只有一个工具栏 */
            .email-editor-container .ql-container {
              border-top: 1px solid #ccc !important;
            }
            .email-editor-container .ql-toolbar ~ .ql-toolbar {
              display: none !important;
            }
          `}</style>
        </div>

        {/* 底部操作按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('cancel') || '取消'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('save') || '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailEditorModal;

