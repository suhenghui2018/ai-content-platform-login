import React, { useState } from 'react';
import { BrandPack, BrandPackPreview } from '../types/brandPack';
import { useTranslation } from 'react-i18next';

interface BrandPackDetailProps {
  brandPack: BrandPack;
  onBack: () => void;
}

const BrandPackDetail: React.FC<BrandPackDetailProps> = ({ brandPack, onBack }) => {
  const { t } = useTranslation();

  // 8个标签数据
  const tabs = [
    {
      id: 1,
      title: '品牌核心身份',
      key: 'brandCoreIdentity' as keyof BrandPackPreview,
      borderColor: 'border-blue-500'
    },
    {
      id: 2,
      title: '品牌声音与语调',
      key: 'brandVoiceTone' as keyof BrandPackPreview,
      borderColor: 'border-green-500'
    },
    {
      id: 3,
      title: '目标受众画像',
      key: 'targetAudience' as keyof BrandPackPreview,
      borderColor: 'border-purple-500'
    },
    {
      id: 4,
      title: '品牌视觉系统',
      key: 'visualAssets' as keyof BrandPackPreview,
      borderColor: 'border-orange-500'
    },
    {
      id: 5,
      title: '内容与产品信息',
      key: 'contentProducts' as keyof BrandPackPreview,
      borderColor: 'border-red-500'
    },
    {
      id: 6,
      title: 'SEO优化策略',
      key: 'seoOptimization' as keyof BrandPackPreview,
      borderColor: 'border-indigo-500'
    },
    {
      id: 7,
      title: '社交媒体策略',
      key: 'socialMedia' as keyof BrandPackPreview,
      borderColor: 'border-pink-500'
    },
    {
      id: 8,
      title: '品牌禁忌',
      key: 'brandTaboos' as keyof BrandPackPreview,
      borderColor: 'border-yellow-500'
    }
  ];

  // 默认选中第一个标签
  const [activeTabId, setActiveTabId] = useState<number>(1);
  
  // 编辑状态管理
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreview, setEditedPreview] = useState<BrandPackPreview>(
    brandPack.preview || {}
  );

  const handleTabClick = (tabId: number) => {
    setActiveTabId(tabId);
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log('保存预览数据:', editedPreview);
    setIsEditing(false);
    // 可以调用 onSave 回调函数保存数据
  };

  const handleCancel = () => {
    setEditedPreview(brandPack.preview || {});
    setIsEditing(false);
  };

  // 渲染品牌核心身份内容
  const renderBrandCoreIdentity = () => {
    const data = editedPreview.brandCoreIdentity;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandNameRequired')}</label>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {data.brandName.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...data.brandName];
                    newNames[index] = e.target.value;
                    setEditedPreview({
                      ...editedPreview,
                      brandCoreIdentity: { ...data, brandName: newNames }
                    });
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.brandName.map((name, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg border border-blue-200"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandSloganRequired')}</label>
          {isEditing ? (
            <textarea
              value={data.brandSlogan}
              onChange={(e) => {
                setEditedPreview({
                  ...editedPreview,
                  brandCoreIdentity: { ...data, brandSlogan: e.target.value }
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all resize-none"
              rows={3}
            />
          ) : (
            <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
              {data.brandSlogan}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandStoryMissionRequired')}</label>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('story')}</span>
              {isEditing ? (
                <textarea
                  value={data.brandStory}
                  onChange={(e) => {
                    setEditedPreview({
                      ...editedPreview,
                      brandCoreIdentity: { ...data, brandStory: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all resize-none"
                  rows={5}
                />
              ) : (
                <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                  {data.brandStory}
                </div>
              )}
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('mission')}</span>
              {isEditing ? (
                <textarea
                  value={data.brandMission}
                  onChange={(e) => {
                    setEditedPreview({
                      ...editedPreview,
                      brandCoreIdentity: { ...data, brandMission: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all resize-none"
                  rows={4}
                />
              ) : (
                <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                  {data.brandMission}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandCoreValuesKeywordsRequired')}</label>
          <div className="space-y-4">
            {isEditing ? (
              <textarea
                value={data.brandValues}
                onChange={(e) => {
                  setEditedPreview({
                    ...editedPreview,
                    brandCoreIdentity: { ...data, brandValues: e.target.value }
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all resize-none"
                rows={3}
              />
            ) : (
              <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                {data.brandValues}
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">关键词</span>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  data.keywords.map((keyword, index) => (
                    <input
                      key={index}
                      type="text"
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...data.keywords];
                        newKeywords[index] = e.target.value;
                        setEditedPreview({
                          ...editedPreview,
                          brandCoreIdentity: { ...data, keywords: newKeywords }
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                    />
                  ))
                ) : (
                  data.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800 rounded-lg border border-purple-200"
                    >
                      {keyword}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染品牌声音与语调内容
  const renderBrandVoiceTone = () => {
    const data = editedPreview.brandVoiceTone;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandPersonalityRequired')}</label>
          {isEditing ? (
            <textarea
              value={data.personality}
              onChange={(e) => {
                setEditedPreview({
                  ...editedPreview,
                  brandVoiceTone: { ...data, personality: e.target.value }
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all resize-none"
              rows={5}
            />
          ) : (
            <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
              {data.personality}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('toneGuideRequired')}</label>
          {isEditing ? (
            <textarea
              value={data.toneGuide}
              onChange={(e) => {
                setEditedPreview({
                  ...editedPreview,
                  brandVoiceTone: { ...data, toneGuide: e.target.value }
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all resize-none"
              rows={5}
            />
          ) : (
            <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
              {data.toneGuide}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('styleVocabularyPreferences')}</label>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('preferredWords')}</span>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  data.preferredWords.map((word, index) => (
                    <input
                      key={index}
                      type="text"
                      value={word}
                      onChange={(e) => {
                        const newWords = [...data.preferredWords];
                        newWords[index] = e.target.value;
                        setEditedPreview({
                          ...editedPreview,
                          brandVoiceTone: { ...data, preferredWords: newWords }
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                    />
                  ))
                ) : (
                  data.preferredWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-lg border border-green-200"
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('avoidedWords')}</span>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  data.avoidedWords.map((word, index) => (
                    <input
                      key={index}
                      type="text"
                      value={word}
                      onChange={(e) => {
                        const newWords = [...data.avoidedWords];
                        newWords[index] = e.target.value;
                        setEditedPreview({
                          ...editedPreview,
                          brandVoiceTone: { ...data, avoidedWords: newWords }
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                    />
                  ))
                ) : (
                  data.avoidedWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-red-100 text-red-800 rounded-lg border border-red-200"
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染目标受众画像内容
  const renderTargetAudience = () => {
    const data = editedPreview.targetAudience;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    const fields = [
      { key: 'demographics', label: t('demographics'), color: 'bg-blue-100 text-blue-800' },
      { key: 'gender', label: t('gender'), color: 'bg-pink-100 text-pink-800' },
      { key: 'income', label: t('income'), color: 'bg-green-100 text-green-800' },
      { key: 'lifestyle', label: t('lifestyle'), color: 'bg-yellow-100 text-yellow-800' },
      { key: 'education', label: t('education'), color: 'bg-purple-100 text-purple-800' },
      { key: 'psychological', label: t('psychological'), color: 'bg-indigo-100 text-indigo-800' },
      { key: 'painPoints', label: t('painPoints'), color: 'bg-red-100 text-red-800' },
      { key: 'useCases', label: t('useCases'), color: 'bg-orange-100 text-orange-800' },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="text-sm font-semibold text-gray-900 mb-4 block">{t('targetUserProfileRequired')}</label>
            <div className="space-y-4">
              {fields.map((field) => {
                const value = data[field.key as keyof typeof data] as string[];
                return (
                  <div key={field.key} className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{field.label}</span>
                    <div className="flex flex-wrap gap-2">
                      {isEditing ? (
                        value.map((item, index) => (
                          <input
                            key={index}
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newData = { ...data };
                              const newArray = [...value];
                              newArray[index] = e.target.value;
                              (newData as any)[field.key] = newArray;
                              setEditedPreview({
                                ...editedPreview,
                                targetAudience: newData
                              });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                          />
                        ))
                      ) : (
                        value.map((item, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border ${field.color}`}
                          >
                            {item}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  // 渲染品牌视觉系统内容
  const renderVisualAssets = () => {
    const data = editedPreview.visualAssets;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandLogoRequired')}</label>
          {isEditing ? (
            <textarea
              value={data.logoDescription}
              onChange={(e) => {
                setEditedPreview({
                  ...editedPreview,
                  visualAssets: { ...data, logoDescription: e.target.value }
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all resize-none"
              rows={5}
            />
          ) : (
            <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
              {data.logoDescription}
            </div>
          )}
          {data.selectedLogos.length > 0 && (
            <div className="mt-4">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('selectedLogos')}</span>
              <div className="flex flex-wrap gap-3">
                {data.selectedLogos.map((logo, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="w-12 h-12 object-contain rounded"
                    />
                    <div className="text-sm font-medium text-gray-900">{logo.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('brandColorSystemRequired')}</label>
          <div className="space-y-4">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">{t('selectedColorSystems')}</span>
            <div className="space-y-4">
              {data.selectedColorSystems.map((system, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  {isEditing ? (
                    <input
                      type="text"
                      value={system.name}
                      onChange={(e) => {
                        const newSystems = [...data.selectedColorSystems];
                        newSystems[index] = { ...system, name: e.target.value };
                        setEditedPreview({
                          ...editedPreview,
                          visualAssets: { ...data, selectedColorSystems: newSystems }
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all"
                    />
                  ) : (
                    <div className="text-sm font-bold text-gray-900 mb-3">{system.name}</div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('mainColors')}</span>
                      <div className="flex flex-wrap gap-3">
                        {system.mainColors.map((color, colorIndex) => (
                          <div key={colorIndex} className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                              style={{ backgroundColor: color }}
                            ></div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => {
                                  const newSystems = [...data.selectedColorSystems];
                                  const newColors = [...system.mainColors];
                                  newColors[colorIndex] = e.target.value;
                                  newSystems[index] = { ...system, mainColors: newColors };
                                  setEditedPreview({
                                    ...editedPreview,
                                    visualAssets: { ...data, selectedColorSystems: newSystems }
                                  });
                                }}
                                className="text-sm w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-700">{color}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('neutralColors')}</span>
                      <div className="flex flex-wrap gap-3">
                        {system.neutralColors.map((color, colorIndex) => (
                          <div key={colorIndex} className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                              style={{ backgroundColor: color }}
                            ></div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => {
                                  const newSystems = [...data.selectedColorSystems];
                                  const newColors = [...system.neutralColors];
                                  newColors[colorIndex] = e.target.value;
                                  newSystems[index] = { ...system, neutralColors: newColors };
                                  setEditedPreview({
                                    ...editedPreview,
                                    visualAssets: { ...data, selectedColorSystems: newSystems }
                                  });
                                }}
                                className="text-sm w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-700">{color}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('accentColors')}</span>
                      <div className="flex flex-wrap gap-3">
                        {system.accentColors.map((color, colorIndex) => (
                          <div key={colorIndex} className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                              style={{ backgroundColor: color }}
                            ></div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => {
                                  const newSystems = [...data.selectedColorSystems];
                                  const newColors = [...system.accentColors];
                                  newColors[colorIndex] = e.target.value;
                                  newSystems[index] = { ...system, accentColors: newColors };
                                  setEditedPreview({
                                    ...editedPreview,
                                    visualAssets: { ...data, selectedColorSystems: newSystems }
                                  });
                                }}
                                className="text-sm w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-700">{color}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染内容与产品信息
  const renderContentProducts = () => {
    const data = editedPreview.contentProducts;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('productServiceListRequired')}</label>
          {isEditing ? (
            <div className="space-y-2">
              {data.productList.map((product, index) => (
                <input
                  key={index}
                  type="text"
                  value={product}
                  onChange={(e) => {
                    const newList = [...data.productList];
                    newList[index] = e.target.value;
                    setEditedPreview({
                      ...editedPreview,
                      contentProducts: { ...data, productList: newList }
                    });
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {data.productList.map((product, index) => (
                <div key={index} className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="flex-1 leading-relaxed">{product}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('uniqueSellingPoints')}</label>
          {isEditing ? (
            <div className="space-y-2">
              {data.uniqueSellingPoints.map((point, index) => (
                <input
                  key={index}
                  type="text"
                  value={point}
                  onChange={(e) => {
                    const newList = [...data.uniqueSellingPoints];
                    newList[index] = e.target.value;
                    setEditedPreview({
                      ...editedPreview,
                      contentProducts: { ...data, uniqueSellingPoints: newList }
                    });
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {data.uniqueSellingPoints.map((point, index) => (
                <div key={index} className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="flex-1 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-3 block">{t('faqRecommended')}</label>
          {isEditing ? (
            <div className="space-y-4">
              {data.faqList.map((faq, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <input
                    type="text"
                    value={faq.title}
                    onChange={(e) => {
                      const newList = [...data.faqList];
                      newList[index] = { ...faq, title: e.target.value };
                      setEditedPreview({
                        ...editedPreview,
                        contentProducts: { ...data, faqList: newList }
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                    placeholder="问题"
                  />
                  <textarea
                    value={faq.content}
                    onChange={(e) => {
                      const newList = [...data.faqList];
                      newList[index] = { ...faq, content: e.target.value };
                      setEditedPreview({
                        ...editedPreview,
                        contentProducts: { ...data, faqList: newList }
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all resize-none"
                    rows={4}
                    placeholder="答案"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.faqList.map((faq, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-sm font-bold text-gray-900 mb-2">Q: {faq.title}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">A: {faq.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染SEO优化策略
  const renderSeoOptimization = () => {
    const data = editedPreview.seoOptimization;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-4 block">{t('coreKeywordsRecommended')}</label>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('brandKeywords')}</span>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  data.brandKeywords.map((keyword, index) => (
                    <input
                      key={index}
                      type="text"
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...data.brandKeywords];
                        newKeywords[index] = e.target.value;
                        setEditedPreview({
                          ...editedPreview,
                          seoOptimization: { ...data, brandKeywords: newKeywords }
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    />
                  ))
                ) : (
                  data.brandKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg border border-blue-200"
                    >
                      {keyword}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('productKeywords')}</span>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  data.productKeywords.map((keyword, index) => (
                    <input
                      key={index}
                      type="text"
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...data.productKeywords];
                        newKeywords[index] = e.target.value;
                        setEditedPreview({
                          ...editedPreview,
                          seoOptimization: { ...data, productKeywords: newKeywords }
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                    />
                  ))
                ) : (
                  data.productKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-lg border border-green-200"
                    >
                      {keyword}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">{t('industryKeywords')}</span>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  data.industryKeywords.map((keyword, index) => (
                    <input
                      key={index}
                      type="text"
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...data.industryKeywords];
                        newKeywords[index] = e.target.value;
                        setEditedPreview({
                          ...editedPreview,
                          seoOptimization: { ...data, industryKeywords: newKeywords }
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                    />
                  ))
                ) : (
                  data.industryKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800 rounded-lg border border-purple-200"
                    >
                      {keyword}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染品牌禁忌
  const renderBrandTaboos = () => {
    const data = editedPreview.brandTaboos;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    const fields = [
      { 
        key: 'forbiddenWords', 
        label: '禁止使用的词语', 
        color: 'bg-red-100 text-red-800 border-red-200',
        focusColor: 'focus:ring-red-500 focus:border-red-500'
      },
      { 
        key: 'forbiddenTopics', 
        label: '禁止的话题', 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        focusColor: 'focus:ring-orange-500 focus:border-orange-500'
      },
      { 
        key: 'forbiddenVisuals', 
        label: '禁止的视觉元素', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        focusColor: 'focus:ring-yellow-500 focus:border-yellow-500'
      },
      { 
        key: 'forbiddenBehaviors', 
        label: '禁止的行为', 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        focusColor: 'focus:ring-amber-500 focus:border-amber-500'
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-4 block">品牌禁忌内容（必填）</label>
          <div className="space-y-4">
            {fields.map((field) => {
              const value = data[field.key as keyof typeof data] as string[];
              return (
                <div key={field.key} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">{field.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      value.map((item, index) => (
                        <input
                          key={index}
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newData = { ...data };
                            const newArray = [...value];
                            newArray[index] = e.target.value;
                            (newData as any)[field.key] = newArray;
                            setEditedPreview({
                              ...editedPreview,
                              brandTaboos: newData
                            });
                          }}
                          className={`px-4 py-2 border border-gray-300 rounded-lg text-sm ${field.focusColor} bg-white transition-all`}
                        />
                      ))
                    ) : (
                      value.map((item, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border ${field.color}`}
                        >
                          {item}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 渲染社交媒体策略
  const renderSocialMedia = () => {
    const data = editedPreview.socialMedia;
    if (!data) {
      return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-900 mb-4 block">{t('socialMediaPlatforms')}</label>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">{t('facebook')}</span>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={data.facebook.name}
                      onChange={(e) => {
                        setEditedPreview({
                          ...editedPreview,
                          socialMedia: {
                            ...data,
                            facebook: { ...data.facebook, name: e.target.value }
                          }
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-all"
                      placeholder="名称"
                    />
                    <input
                      type="text"
                      value={data.facebook.url}
                      onChange={(e) => {
                        setEditedPreview({
                          ...editedPreview,
                          socialMedia: {
                            ...data,
                            facebook: { ...data.facebook, url: e.target.value }
                          }
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-all"
                      placeholder="URL"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-900 space-y-1">
                    <div className="font-medium">{t('name')}: <span className="font-normal text-gray-700">{data.facebook.name}</span></div>
                    <div className="font-medium">{t('url')}: <span className="font-normal text-gray-700 break-all">{data.facebook.url}</span></div>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">{t('instagram')}</span>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={data.instagram.name}
                      onChange={(e) => {
                        setEditedPreview({
                          ...editedPreview,
                          socialMedia: {
                            ...data,
                            instagram: { ...data.instagram, name: e.target.value }
                          }
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-all"
                      placeholder="名称"
                    />
                    <input
                      type="text"
                      value={data.instagram.url}
                      onChange={(e) => {
                        setEditedPreview({
                          ...editedPreview,
                          socialMedia: {
                            ...data,
                            instagram: { ...data.instagram, url: e.target.value }
                          }
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-all"
                      placeholder="URL"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-900 space-y-1">
                    <div className="font-medium">{t('name')}: <span className="font-normal text-gray-700">{data.instagram.name}</span></div>
                    <div className="font-medium">{t('url')}: <span className="font-normal text-gray-700 break-all">{data.instagram.url}</span></div>
                  </div>
                )}
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">{t('rednoteXiaohongshu')}</span>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={data.rednote.name}
                    onChange={(e) => {
                      setEditedPreview({
                        ...editedPreview,
                        socialMedia: {
                          ...data,
                          rednote: { ...data.rednote, name: e.target.value }
                        }
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-all"
                    placeholder="名称"
                  />
                  <input
                    type="text"
                    value={data.rednote.url}
                    onChange={(e) => {
                      setEditedPreview({
                        ...editedPreview,
                        socialMedia: {
                          ...data,
                          rednote: { ...data.rednote, url: e.target.value }
                        }
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white transition-all"
                    placeholder="URL"
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-900 space-y-1">
                  <div className="font-medium">{t('name')}: <span className="font-normal text-gray-700">{data.rednote.name}</span></div>
                  <div className="font-medium">{t('url')}: <span className="font-normal text-gray-700 break-all">{data.rednote.url}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 根据当前标签渲染对应内容
  const renderTabContent = () => {
    switch (activeTabId) {
      case 1:
        return renderBrandCoreIdentity();
      case 2:
        return renderBrandVoiceTone();
      case 3:
        return renderTargetAudience();
      case 4:
        return renderVisualAssets();
      case 5:
        return renderContentProducts();
      case 6:
        return renderSeoOptimization();
      case 7:
        return renderSocialMedia();
      case 8:
        return renderBrandTaboos();
      default:
        return <div className="text-gray-500 text-center py-8">暂无数据</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* 简化的顶部导航栏 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="py-4 pl-0 pr-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 ml-0"
              aria-label="返回"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">{brandPack.name}</h1>
          </div>
          
          {/* 标签栏 */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pl-6">
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 操作按钮 */}
        <div className="flex items-center justify-end px-0 py-6 border-b border-gray-100 mb-6">
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:border-gray-400 transition-all font-medium text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm shadow-sm"
              >
                保存
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 font-medium text-sm shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>编辑</span>
            </button>
          )}
        </div>

        {/* 内容区域 */}
        <div className="py-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default BrandPackDetail;
