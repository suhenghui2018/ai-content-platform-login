import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Expert {
  id: string;
  name: string;
  tags: string[];
  description: string;
  icon: string;
}

const ExpertSelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const experts: Expert[] = [
    {
      id: 'economist',
      name: t('economist'),
      tags: [t('marketRules'), t('costBenefit'), t('macroPerspective')],
      description: t('economistDescription'),
      icon: '📊'
    },
    {
      id: 'psychologist',
      name: t('consumerPsychologist'),
      tags: [t('userMotivation'), t('cognitiveBias'), t('purchaseDecision')],
      description: t('psychologistDescription'),
      icon: '🧠'
    },
    {
      id: 'copywriter',
      name: t('copywritingExpert'),
      tags: [t('conversionRate'), t('storyStructure'), t('persuasionTechniques')],
      description: t('copywriterDescription'),
      icon: '✍️'
    },
    {
      id: 'designer',
      name: t('designExpert'),
      tags: [t('visualHierarchy'), t('userExperience'), t('brandConsistency')],
      description: t('designerDescription'),
      icon: '🎨'
    },
    {
      id: 'marketer',
      name: t('marketingExpert'),
      tags: [t('audienceSegmentation'), t('channelStrategy'), t('campaignOptimization')],
      description: t('marketerDescription'),
      icon: '🚀'
    },
    {
      id: 'sales',
      name: t('salesExpert'),
      tags: [t('negotiationSkills'), t('closingTechniques'), t('valueProposition')],
      description: t('salesDescription'),
      icon: '💰'
    }
  ];

  const handleExpertClick = (expertId: string) => {
    // 导航到专家配置页面，传递专家ID并设置状态以确保菜单项被激活
    navigate(`/expert-config?id=${expertId}`, { state: { activeMenu: 'expert-config' } });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面头部 */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('selectYourExpertTeam')}
        </h2>
      </div>

      {/* 专家展示区 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map(expert => (
            <div 
              key={expert.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleExpertClick(expert.id)}
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">{expert.icon}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{expert.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {expert.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {expert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertSelectionPage;