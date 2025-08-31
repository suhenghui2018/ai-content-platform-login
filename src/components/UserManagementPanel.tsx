import React, { useState, useEffect } from 'react';
import { userService, User } from '../services/userService';
import { clearDemoData } from '../utils/demoData';

interface UserManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({ isOpen, onClose }) => {
  // const { t } = useTranslation(); // 暂时未使用，注释掉
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, defaultUsers: 0, registeredUsers: 0 });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = () => {
    const allUsers = userService.getUsers();
    setUsers(allUsers);
    setStats(userService.getUserStats());
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('確定要刪除此用戶嗎？')) {
      const allUsers = userService.getUsers();
      const filteredUsers = allUsers.filter(user => user.id !== userId);
      localStorage.setItem('ai_platform_users', JSON.stringify(filteredUsers));
      loadUsers();
    }
  };

  const resetToDefault = () => {
    if (window.confirm('確定要重置到默認狀態嗎？這將清除所有註冊的用戶。')) {
      userService.resetToDefault();
      loadUsers();
    }
  };

  const clearAllData = () => {
    if (window.confirm('確定要清除所有演示數據嗎？這將完全重置系統。')) {
      clearDemoData();
      loadUsers();
    }
  };

  const exportUsers = () => {
    const dataStr = userService.exportUsers();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">用戶管理面板</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 统计信息 */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">總用戶數</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.defaultUsers}</div>
              <div className="text-sm text-gray-600">默認用戶</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{stats.registeredUsers}</div>
              <div className="text-sm text-gray-600">註冊用戶</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              刷新數據
            </button>
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              重置到默認
            </button>
            <button
              onClick={exportUsers}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              導出用戶數據
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              清除所有數據
            </button>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="p-6 overflow-auto max-h-96">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    郵箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    密碼
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    創建時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最後登錄
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">
                          {showPassword[user.id] ? user.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          {showPassword[user.id] ? '隱藏' : '顯示'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '從未登錄'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {!user.email.includes('radicasys.com') && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          刪除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 默认账号提示 */}
        <div className="p-6 bg-blue-50 border-t border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">默認測試帳號</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>郵箱: <code className="bg-blue-100 px-1 rounded">mema@radicasys.com</code></p>
                <p>密碼: <code className="bg-blue-100 px-1 rounded">radica123</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPanel;
