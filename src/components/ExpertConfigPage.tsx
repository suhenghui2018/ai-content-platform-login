import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ExpertTheory {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

interface Economist {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  theories: ExpertTheory[];
}

interface Expert {
  id: string;
  name: string;
  icon: string;
  configured: boolean;
  modelType: string;
  guidanceText: string;
  models: ExpertTheory[];
  economists?: Economist[];
  selectedEconomistId?: string | null;
}

const ExpertConfigPage: React.FC = () => {
  const { expertIds } = useParams<{ expertIds: string }>();
  const { t } = useTranslation();
  
  // 解析URL参数中的专家ID
  const selectedExpertIds = expertIds ? expertIds.split(',') : [];
  
  // 初始化专家数据
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  
  // 初始化专家数据
  useEffect(() => {
    const initialExperts: Expert[] = [
      {
        id: 'economist',
        name: t('economist'),
        icon: '📊',
        configured: false,
        modelType: t('economists'),
        guidanceText: t('economistGuidance'),
        models: [],
        economists: [
          {
            id: 'adamSmith',
            name: '亚当·斯密 (Adam Smith)',
            description: '古典经济学之父，提出了"看不见的手"理论和劳动分工原理',
            selected: false,
            theories: [
              {
                id: 'invisibleHand',
                name: '看不见的手理论',
                description: '个人追求自身利益的同时，通过市场机制促进社会整体利益',
                selected: false
              },
              {
                id: 'divisionOfLabor',
                name: '劳动分工',
                description: '专业化分工提高生产效率，促进经济增长',
                selected: false
              },
              {
                id: 'laissezFaire',
                name: '自由放任政策',
                description: '主张政府减少对经济的干预，让市场自由运作',
                selected: false
              }
            ]
          },
          {
            id: 'johnMaynardKeynes',
            name: '约翰·梅纳德·凯恩斯 (John Maynard Keynes)',
            description: '宏观经济学创始人，主张政府干预经济以应对经济危机',
            selected: false,
            theories: [
              {
                id: 'keynesianEconomics',
                name: '凯恩斯经济学',
                description: '主张政府通过财政政策和货币政策干预经济，促进就业和经济增长',
                selected: false
              },
              {
                id: 'aggregateDemand',
                name: '总需求理论',
                description: '经济衰退的原因是总需求不足，政府应通过刺激需求来促进经济复苏',
                selected: false
              },
              {
                id: 'liquidityPreference',
                name: '流动性偏好理论',
                description: '解释人们持有货币的动机和利率的决定因素',
                selected: false
              }
            ]
          },
          {
            id: 'friedrichHayek',
            name: '弗里德里希·哈耶克 (Friedrich Hayek)',
            description: '奥地利学派代表人物，自由市场和个人主义的坚定支持者',
            selected: false,
            theories: [
              {
                id: 'austrianEconomics',
                name: '奥地利经济学派',
                description: '强调主观价值论、边际效用和市场作为信息处理机制的作用',
                selected: false
              },
              {
                id: 'spontaneousOrder',
                name: '自发秩序理论',
                description: '社会秩序是个体互动的自发结果，而非中央计划的产物',
                selected: false
              },
              {
                id: 'knowledgeProblem',
                name: '知识问题',
                description: '中央计划者无法获取和处理分散在社会中的所有知识',
                selected: false
              }
            ]
          },
          {
            id: 'miltonFriedman',
            name: '米尔顿·弗里德曼 (Milton Friedman)',
            description: '货币主义代表人物，主张自由市场和有限政府',
            selected: false,
            theories: [
              {
                id: 'monetarism',
                name: '货币主义',
                description: '控制货币供应量是稳定经济的关键，通货膨胀在任何时候都是一种货币现象',
                selected: false
              },
              {
                id: 'permanentIncomeHypothesis',
                name: '永久收入假说',
                description: '消费决策基于长期预期收入，而非短期收入波动',
                selected: false
              },
              {
                id: 'friedmanRule',
                name: '弗里德曼规则',
                description: '最优货币政策应该使名义利率为零，以消除持有货币的机会成本',
                selected: false
              }
            ]
          }
        ],
        selectedEconomistId: null
      },
      {
          id: 'psychologist',
          name: t('consumerPsychologist'),
          icon: '🧠',
          configured: false,
          modelType: t('psychologyExperts'),
          guidanceText: t('psychologistGuidance'),
          economists: [
            {
              id: 'robertCialdini',
              name: '罗伯特·西奥迪尼 (Robert Cialdini)',
              description: '影响力心理学权威，著有《影响力》，提出六大影响力原则',
              selected: false,
              theories: [
                {
                  id: 'anchoringEffect',
                  name: t('anchoringEffect'),
                  description: t('anchoringDescription'),
                  selected: false
                },
                {
                  id: 'scarcityPrinciple',
                  name: t('scarcityPrinciple'),
                  description: t('scarcityDescription'),
                  selected: false
                },
                {
                  id: 'socialProof',
                  name: t('socialProof'),
                  description: t('socialProofDescription'),
                  selected: false
                },
                {
                  id: 'lossAversion',
                  name: t('lossAversion'),
                  description: t('lossAversionDescription'),
                  selected: false
                }
              ]
            },
            {
              id: 'danAriely',
              name: '丹·艾瑞里 (Dan Ariely)',
              description: '行为经济学教授，著有《怪诞行为学》，研究非理性决策和消费心理学',
              selected: false,
              theories: [
                {
                  id: 'anchoringEffect',
                  name: t('anchoringEffect'),
                  description: t('anchoringDescription'),
                  selected: false
                },
                {
                  id: 'scarcityPrinciple',
                  name: t('scarcityPrinciple'),
                  description: t('scarcityDescription'),
                  selected: false
                },
                {
                  id: 'socialProof',
                  name: t('socialProof'),
                  description: t('socialProofDescription'),
                  selected: false
                },
                {
                  id: 'lossAversion',
                  name: t('lossAversion'),
                  description: t('lossAversionDescription'),
                  selected: false
                }
              ]
            }
          ],
          selectedEconomistId: null,
          models: []
        },
      {
          id: 'copywriter',
          name: t('copywritingExpert'),
          icon: '✍️',
          configured: false,
          modelType: t('copywritingExperts'),
          guidanceText: t('copywriterGuidance'),
          economists: [
            {
              id: 'robertCollier',
              name: '罗伯特·科利尔 (Robert Collier)',
              description: '20世纪最伟大的文案撰稿人之一，著有《文案圣经》，擅长情感诉求和直接响应式营销',
              selected: false,
              theories: [
                {
                  id: 'aidaModel',
                  name: t('aidaModel'),
                  description: t('aidaDescription'),
                  selected: false
                },
                {
                  id: 'pasModel',
                  name: t('pasModel'),
                  description: t('pasDescription'),
                  selected: false
                },
                {
                  id: 'scqaModel',
                  name: t('scqaModel'),
                  description: t('scqaDescription'),
                  selected: false
                },
                {
                  id: 'beforeAfterBridge',
                  name: t('beforeAfterBridge'),
                  description: t('babDescription'),
                  selected: false
                }
              ]
            },
            {
              id: 'davidOgilvy',
              name: '大卫·奥格威 (David Ogilvy)',
              description: '现代广告之父，奥美广告创始人，以严谨的市场研究和事实导向的广告风格著称',
              selected: false,
              theories: [
                {
                  id: 'aidaModel',
                  name: t('aidaModel'),
                  description: t('aidaDescription'),
                  selected: false
                },
                {
                  id: 'pasModel',
                  name: t('pasModel'),
                  description: t('pasDescription'),
                  selected: false
                },
                {
                  id: 'scqaModel',
                  name: t('scqaModel'),
                  description: t('scqaDescription'),
                  selected: false
                },
                {
                  id: 'beforeAfterBridge',
                  name: t('beforeAfterBridge'),
                  description: t('babDescription'),
                  selected: false
                }
              ]
            }
          ],
          selectedEconomistId: null,
          models: []
        },
      {
        id: 'designer',
        name: t('designExpert'),
        icon: '🎨',
        configured: false,
        modelType: t('designPrinciples'),
        guidanceText: t('designerGuidance'),
        models: [
          {
            id: 'minimalistDesign',
            name: t('minimalistDesign'),
            description: t('minimalistDesignDescription'),
            selected: false
          },
          {
            id: 'visualHierarchy',
            name: t('visualHierarchy'),
            description: t('visualHierarchyDescription'),
            selected: false
          },
          {
            id: 'colorTheory',
            name: t('colorTheory'),
            description: t('colorTheoryDescription'),
            selected: false
          },
          {
            id: 'accessibilityDesign',
            name: t('accessibilityDesign'),
            description: t('accessibilityDesignDescription'),
            selected: false
          }
        ]
      },
      {
          id: 'marketer',
          name: t('marketingExpert'),
          icon: '📈',
          configured: false,
          modelType: t('marketingExperts'),
          guidanceText: t('marketerGuidance'),
          economists: [
            {
              id: 'philipKotler',
              name: '菲利普·科特勒 (Philip Kotler)',
              description: '现代营销学之父，著有《营销管理》，提出STP战略和4P营销组合',
              selected: false,
              theories: [
                {
                  id: 'contentMarketing',
                  name: t('contentMarketing'),
                  description: t('contentMarketingDescription'),
                  selected: false
                },
                {
                  id: 'inboundMarketing',
                  name: t('inboundMarketing'),
                  description: t('inboundMarketingDescription'),
                  selected: false
                },
                {
                  id: 'growthHacking',
                  name: t('growthHacking'),
                  description: t('growthHackingDescription'),
                  selected: false
                },
                {
                  id: 'omnichannelStrategy',
                  name: t('omnichannelStrategy'),
                  description: t('omnichannelStrategyDescription'),
                  selected: false
                }
              ]
            },
            {
              id: 'sethGodin',
              name: '赛斯·高汀 (Seth Godin)',
              description: '现代营销大师，著有《紫牛》，倡导差异化营销和 permission marketing',
              selected: false,
              theories: [
                {
                  id: 'contentMarketing',
                  name: t('contentMarketing'),
                  description: t('contentMarketingDescription'),
                  selected: false
                },
                {
                  id: 'inboundMarketing',
                  name: t('inboundMarketing'),
                  description: t('inboundMarketingDescription'),
                  selected: false
                },
                {
                  id: 'growthHacking',
                  name: t('growthHacking'),
                  description: t('growthHackingDescription'),
                  selected: false
                },
                {
                  id: 'omnichannelStrategy',
                  name: t('omnichannelStrategy'),
                  description: t('omnichannelStrategyDescription'),
                  selected: false
                }
              ]
            }
          ],
          selectedEconomistId: null,
          models: []
        },
      {
          id: 'salesperson',
          name: t('salesExpert'),
          icon: '💰',
          configured: false,
          modelType: t('salesExperts'),
          guidanceText: t('salesGuidance'),
          economists: [
            {
              id: 'zigZiglar',
              name: '齐格·齐格勒 (Zig Ziglar)',
              description: '世界著名销售培训师，著有《把信送给加西亚》，强调积极心态和人际关系',
              selected: false,
              theories: [
                {
                  id: 'negotiationSkills',
                  name: t('negotiationSkills'),
                  description: t('negotiationSkillsDescription'),
                  selected: false
                },
                {
                  id: 'objectionHandling',
                  name: t('objectionHandling'),
                  description: t('objectionHandlingDescription'),
                  selected: false
                },
                {
                  id: 'consultativeSelling',
                  name: t('consultativeSelling'),
                  description: t('consultativeSellingDescription'),
                  selected: false
                },
                {
                  id: 'closingTechniques',
                  name: t('closingTechniques'),
                  description: t('closingTechniquesDescription'),
                  selected: false
                }
              ]
            },
            {
              id: 'brianTracy',
              name: '布莱恩·崔西 (Brian Tracy)',
              description: '顶级销售教练和管理顾问，著有《销售心理学》，专注于高效能销售策略',
              selected: false,
              theories: [
                {
                  id: 'negotiationSkills',
                  name: t('negotiationSkills'),
                  description: t('negotiationSkillsDescription'),
                  selected: false
                },
                {
                  id: 'objectionHandling',
                  name: t('objectionHandling'),
                  description: t('objectionHandlingDescription'),
                  selected: false
                },
                {
                  id: 'consultativeSelling',
                  name: t('consultativeSelling'),
                  description: t('consultativeSellingDescription'),
                  selected: false
                },
                {
                  id: 'closingTechniques',
                  name: t('closingTechniques'),
                  description: t('closingTechniquesDescription'),
                  selected: false
                }
              ]
            }
          ],
          selectedEconomistId: null,
          models: []
        }
    ];
    
    // 设置所有专家，不再过滤
    setExperts(initialExperts);
    
    // 如果有专家ID参数，默认选中第一个
    if (selectedExpertIds.length > 0 && initialExperts.some(e => e.id === selectedExpertIds[0])) {
      setSelectedExpertId(selectedExpertIds[0]);
      const firstExpert = initialExperts.find(e => e.id === selectedExpertIds[0])!;
      setSelectedExpert(firstExpert);
    }
  }, [expertIds, t]);
  
  // 处理专家选择
  const handleExpertSelect = (expertId: string) => {
    setSelectedExpertId(expertId);
    const expert = experts.find(e => e.id === expertId);
    if (expert) {
      setSelectedExpert(expert);
    }
  };
  
  // 处理专家人物选择
  const handleExpertPersonSelect = (expertPersonId: string) => {
    if (!selectedExpertId) return;
    
    const updatedExperts = experts.map(expert => {
      if (expert.id === selectedExpertId && expert.economists) {
        const updatedEconomists = expert.economists.map(economist => ({
          ...economist,
          selected: economist.id === expertPersonId
        }));
        
        return {
          ...expert,
          economists: updatedEconomists,
          selectedEconomistId: expertPersonId
        };
      }
      return expert;
    });
    
    setExperts(updatedExperts);
    const updatedExpert = updatedExperts.find(e => e.id === selectedExpertId);
    if (updatedExpert) {
      setSelectedExpert(updatedExpert);
    }
  };
  
  // 处理专家理论选择
  const handleTheorySelect = (theoryId: string) => {
    if (!selectedExpertId) return;
    
    const updatedExperts = experts.map(expert => {
      if (expert.id === selectedExpertId) {
        if (expert.economists && expert.selectedEconomistId) {
          // 处理专家理论选择
          const updatedEconomists = expert.economists.map(economist => {
            if (economist.id === expert.selectedEconomistId) {
              const updatedTheories = economist.theories.map(theory => ({
                ...theory,
                selected: theory.id === theoryId ? !theory.selected : theory.selected
              }));
              
              return {
                ...economist,
                theories: updatedTheories
              };
            }
            return economist;
          });
          
          // 检查是否至少选择了一个理论
          const selectedEconomist = updatedEconomists.find(e => e.id === expert.selectedEconomistId);
          const hasSelectedTheories = selectedEconomist?.theories.some(t => t.selected) || false;
          
          return {
            ...expert,
            economists: updatedEconomists,
            configured: hasSelectedTheories
          };
        } else {
          // 处理直接理论选择
          const isSingleSelect = expert.id === 'copywriter';
          
          const updatedModels = expert.models.map(model => {
            if (isSingleSelect) {
              return { ...model, selected: model.id === theoryId };
            } else {
              return { ...model, selected: model.id === theoryId ? !model.selected : model.selected };
            }
          });
          
          return {
            ...expert,
            models: updatedModels,
            configured: updatedModels.some(m => m.selected)
          };
        }
      }
      return expert;
    });
    
    setExperts(updatedExperts);
    const updatedExpert = updatedExperts.find(e => e.id === selectedExpertId);
    if (updatedExpert) {
      setSelectedExpert(updatedExpert);
    }
  };
  
  // 处理保存配置
  const handleSaveConfiguration = () => {
    if (selectedExpertId) {
      console.log(`Saving configuration for expert: ${selectedExpertId}`, selectedExpert);
      alert(t('configurationSaved'));
    }
  };
  
  // 检查当前专家是否已配置
  const isCurrentExpertConfigured = selectedExpert?.configured || false;
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面头部 - 简约风格 */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('expertThinkingConfig')}</h1>
        <p className="text-sm text-gray-600">{t('expertConfigSubtitle')}</p>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧专家列表 - 现代化卡片设计 */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('expertThinkTank')}</h2>
            <div className="space-y-2">
              {experts.map(expert => (
                <div
                  key={expert.id}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedExpertId === expert.id
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                      : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleExpertSelect(expert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedExpertId === expert.id
                          ? 'bg-blue-500'
                          : 'bg-gray-100 group-hover:bg-blue-50'
                      }`}>
                        <span className="text-xl">{expert.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          selectedExpertId === expert.id ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {expert.name}
                        </div>
                      </div>
                    </div>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      expert.configured
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {expert.configured ? t('configured') : t('pendingConfiguration')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 右侧配置区域 - 现代化设计 */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedExpert ? (
            <div className="max-w-4xl mx-auto p-8">
              {/* 配置头部 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('configureExpertThinkingModel', { expertName: selectedExpert.name })}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedExpert.guidanceText}</p>
              </div>
              
              {selectedExpert.economists ? (
                <div className="space-y-8">
                  {/* 专家选择区域 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('selectExpertType')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedExpert.economists.map(economist => (
                        <div
                          key={economist.id}
                          className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            economist.selected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                          }`}
                          onClick={() => handleExpertPersonSelect(economist.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              economist.selected
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'border-2 border-gray-300 group-hover:border-blue-400'
                            }`}>
                              {economist.selected ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">{economist.name}</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{economist.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 专家理论选择区域 */}
                  {selectedExpert.selectedEconomistId && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{t('theoriesAndModels')}</h3>
                      {selectedExpert.economists.map(economist => {
                        if (economist.id === selectedExpert.selectedEconomistId) {
                          return (
                            <div key={economist.id} className="space-y-3">
                              <p className="text-sm text-gray-600 mb-4">{t('selectTheoriesFrom', { economist: economist.name })}</p>
                              {economist.theories.map(theory => (
                                <div
                                  key={theory.id}
                                  className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    theory.selected
                                      ? 'border-blue-500 bg-blue-50 shadow-md'
                                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                  }`}
                                  onClick={() => handleTheorySelect(theory.id)}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                      theory.selected
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'border-2 border-gray-300 group-hover:border-blue-400'
                                    }`}>
                                      {theory.selected ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 mb-1">{theory.name}</h4>
                                      <p className="text-sm text-gray-600 leading-relaxed">{theory.description}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">{selectedExpert.modelType}</h3>
                  <div className="space-y-3">
                    {selectedExpert.models.map(model => (
                      <div
                        key={model.id}
                        className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          model.selected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                        }`}
                        onClick={() => handleTheorySelect(model.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            model.selected
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'border-2 border-gray-300 group-hover:border-blue-400'
                          }`}>
                            {model.selected ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : selectedExpert.id === 'copywriter' ? (
                              <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">{model.name}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{model.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 保存配置按钮 - 现代化设计 */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveConfiguration}
                    disabled={!isCurrentExpertConfigured}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isCurrentExpertConfigured
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {t('saveConfiguration')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noExpertSelected')}</h3>
                <p className="text-sm text-gray-600">{t('selectExpertToConfigure')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertConfigPage;