import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService, User } from '../services/userService';
import { clearDemoData } from '../utils/demoData';

interface UserManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
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
    if (window.confirm(t('confirmDeleteUser'))) {
      const allUsers = userService.getUsers();
      const filteredUsers = allUsers.filter(user => user.id !== userId);
      localStorage.setItem('ai_platform_users', JSON.stringify(filteredUsers));
      loadUsers();
    }
  };

  const resetToDefault = () => {
    if (window.confirm(t('confirmResetToDefault'))) {
      userService.resetToDefault();
      loadUsers();
    }
  };

  const clearAllData = () => {
    if (window.confirm(t('confirmClearAllData'))) {
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
          <h2 className="text-2xl font-bold text-gray-900">{t('userManagementPanel')}</h2>
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
              <div className="text-sm text-gray-600">{t('totalUsers')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.defaultUsers}</div>
              <div className="text-sm text-gray-600">{t('defaultUsers')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{stats.registeredUsers}</div>
              <div className="text-sm text-gray-600">{t('registeredUsers')}</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="p-6 bg-white border-b border-gray-200 flex flex-wrap gap-3">
          <button
            onClick={loadUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
          >
            {t('refreshData')}
          </button>
          <button
            onClick={resetToDefault}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
          >
            {t('resetToDefault')}
          </button>
          <button
            onClick={exportUsers}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
          >
            {t('exportUserData')}
          </button>
          <button
            onClick={clearAllData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
          >
            {t('clearAllData')}
          </button>
        </div>

        {/* 用户列表 */}
        <div className="overflow-y-auto max-h-[50vh]">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">{t('email')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">{t('password')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">{t('createdAt')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">{t('lastLogin')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                    <span className="truncate max-w-[150px]">
                      {showPassword[user.id] ? user.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      {showPassword[user.id] ? t('hide') : t('show')}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : t('neverLoggedIn')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              {t('noUsersFound')}
            </div>
          )}
        </div>

        {/* 默认账号提示 */}
        <div className="p-6 bg-blue-50 border-t border-blue-100">
          <h3 className="text-sm font-medium text-blue-800">{t('defaultTestAccount')}</h3>
          <p>{t('email')}: <code className="bg-blue-100 px-1 rounded">mema@radicasys.com</code></p>
          <p>{t('password')}: <code className="bg-blue-100 px-1 rounded">radica123</code></p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPanel;
