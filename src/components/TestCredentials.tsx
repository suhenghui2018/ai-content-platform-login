import React, { useState } from 'react';

const TestCredentials: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 text-left font-medium hover:bg-blue-700 transition-colors"
        >
          🧪 測試帳號 {isExpanded ? '▼' : '▶'}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-3 bg-blue-700">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">郵箱:</span>
                <code className="ml-2 bg-blue-800 px-2 py-1 rounded text-xs">
                  mema@radicasys.com
                </code>
              </div>
              <div>
                <span className="font-medium">密碼:</span>
                <code className="ml-2 bg-blue-800 px-2 py-1 rounded text-xs">
                  radica123
                </code>
              </div>
              <div>
                <span className="font-medium">驗證碼:</span>
                <code className="ml-2 bg-blue-800 px-2 py-1 rounded text-xs">
                  1234
                </code>
              </div>
              <div className="text-xs text-blue-200 mt-2">
                請確保輸入正確的驗證碼 "1234"
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCredentials;
