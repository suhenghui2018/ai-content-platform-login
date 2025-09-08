import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateBrandPackModal from './CreateBrandPackModal';

const BrandPackCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleCreate = (data: any) => {
    console.log('品牌包创建数据:', data);
    // 这里可以添加保存品牌包的逻辑
    alert('品牌包创建成功！');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      {/* 弹窗内容 - 直接显示完整的弹窗组件 */}
      <div className="relative z-10 w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <CreateBrandPackModal
          isOpen={true}
          onClose={handleClose}
          onCreate={handleCreate}
          fullscreen={true}
        />
      </div>
    </div>
  );
};

export default BrandPackCreatePage;
