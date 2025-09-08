import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { images } from '../assets/images';

interface ProfileSetupFormProps {
  onComplete: () => void;
}

type PlanType = 'personalBasic' | 'personalPro' | 'team' | 'enterprise';

interface PlanDetails {
  name: string;
  price: string;
  suitableFor: string;
  benefits: string[];
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('personalBasic');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    department: '',
    teamName: '',
    teamSize: '',
    companyName: '',
    creditCode: '',
    industry: '',
    companySize: '',
    companyAddress: '',
    contactName: '',
    contactTitle: '',
    contactPhone: '',
    contactEmail: '',
    customRequirements: '',
    keyScenarios: '',
    expectedSeats: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const plans: Record<PlanType, PlanDetails> = {
    personalBasic: {
      name: t('personalBasic'),
      price: `${t('monthly')} 100,000 元`,
      suitableFor: t('personalExperience'),
      benefits: [
        `${t('contentGeneration')}: 20 ${t('monthly')}`,
        `1 ${t('socialChannels')}`,
        `${t('aiTemplates')} ${t('basicAccess')}`
      ]
    },
    personalPro: {
      name: t('personalPro'),
      price: `${t('monthly')} 100,000 美元`,
      suitableFor: t('personalCreator'),
      benefits: [
        `${t('contentGeneration')}: 100 ${t('monthly')}`,
        `3 ${t('socialChannels')}`,
        `${t('professionalAnalytics')}`,
        `${t('aiTemplates')} ${t('professionalAccess')}`
      ]
    },
    team: {
      name: t('team'),
      price: `${t('monthly')} ${t('perSeat')} 100,000 美元`,
      suitableFor: t('smallTeam'),
      benefits: [
        `${t('contentGeneration')}: 500 ${t('monthly')}`,
        `10 ${t('socialChannels')}`,
        `${t('aiTemplates')} ${t('advancedAccess')}`,
        t('teamCollaboration')
      ]
    },
    enterprise: {
      name: t('enterprise'),
      price: t('custom'),
      suitableFor: t('largeEnterprise'),
      benefits: [
        t('unlimitedGeneration'),
        t('allChannels'),
        t('exclusiveTraining'),
        t('advancedAnalytics'),
        t('dedicatedManager')
      ]
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedPlan === 'personalBasic' || selectedPlan === 'personalPro') {
      if (!formData.firstName) newErrors.firstName = t('firstNameRequired');
      if (!formData.lastName) newErrors.lastName = t('lastNameRequired');
      if (!formData.jobTitle) newErrors.jobTitle = t('jobTitleRequired');
      if (!formData.department) newErrors.department = t('departmentRequired');
    }

    if (selectedPlan === 'team') {
      if (!formData.firstName) newErrors.firstName = t('firstNameRequired');
      if (!formData.lastName) newErrors.lastName = t('lastNameRequired');
      if (!formData.teamName) newErrors.teamName = t('teamNameRequired');
      if (!formData.jobTitle) newErrors.jobTitle = t('jobTitleRequired');
      if (!formData.department) newErrors.department = t('departmentRequired');
      if (!formData.teamSize) newErrors.teamSize = t('teamSizeRequired');
    }

    if (selectedPlan === 'enterprise') {
      if (!formData.companyName) newErrors.companyName = t('companyNameRequired');
      if (!formData.creditCode) newErrors.creditCode = t('creditCodeRequired');
      if (!formData.industry) newErrors.industry = t('industryRequired');
      if (!formData.companySize) newErrors.companySize = t('companySizeRequired');
      if (!formData.companyAddress) newErrors.companyAddress = t('companyAddressRequired');
      if (!formData.contactName) newErrors.contactName = t('contactNameRequired');
      if (!formData.contactTitle) newErrors.contactTitle = t('contactTitleRequired');
      if (!formData.contactPhone) newErrors.contactPhone = t('contactPhoneRequired');
      if (!formData.contactEmail) {
        newErrors.contactEmail = t('contactEmailRequired');
      } else if (!formData.contactEmail.includes('@') || !formData.contactEmail.includes('.')) {
        newErrors.contactEmail = t('invalidContactEmail');
      }
      if (!formData.keyScenarios) newErrors.keyScenarios = t('keyScenariosRequired');
      if (!formData.expectedSeats) newErrors.expectedSeats = t('expectedSeatsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // 这里可以保存数据到后端
      console.log('Profile setup completed:', { plan: selectedPlan, formData });
      onComplete();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderPersonalForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('firstName')} *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder={t('pleaseEnter') + t('firstName')}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('lastName')} *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder={t('pleaseEnter') + t('lastName')}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('jobTitle')} *
        </label>
        <input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
          className={`input-field ${errors.jobTitle ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('jobTitle')}
        />
        {errors.jobTitle && <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('department')} *
        </label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          className={`input-field ${errors.department ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('department')}
        />
        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
      </div>
    </div>
  );

  const renderTeamForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('firstName')} *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder={t('pleaseEnter') + t('firstName')}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('lastName')} *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder={t('pleaseEnter') + t('lastName')}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('teamName')} *
        </label>
        <input
          type="text"
          value={formData.teamName}
          onChange={(e) => handleInputChange('teamName', e.target.value)}
          className={`input-field ${errors.teamName ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('teamName')}
        />
        {errors.teamName && <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('jobTitle')} *
        </label>
        <input
          type="text"
          value={formData.jobTitle}
          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
          className={`input-field ${errors.jobTitle ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('jobTitle')}
        />
        {errors.jobTitle && <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('department')} *
        </label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          className={`input-field ${errors.department ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('department')}
        />
        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('teamSize')} *
        </label>
        <input
          type="number"
          value={formData.teamSize}
          onChange={(e) => handleInputChange('teamSize', e.target.value)}
          className={`input-field ${errors.teamSize ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('teamSize')}
        />
        {errors.teamSize && <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>}
      </div>
    </div>
  );

  const renderEnterpriseForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('companyName')} *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('companyName')}
        />
        {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('creditCode')} *
        </label>
        <input
          type="text"
          value={formData.creditCode}
          onChange={(e) => handleInputChange('creditCode', e.target.value)}
          className={`input-field ${errors.creditCode ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('creditCode')}
        />
        {errors.creditCode && <p className="mt-1 text-sm text-red-600">{errors.creditCode}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('industry')} *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className={`input-field ${errors.industry ? 'border-red-500' : ''}`}
          >
            <option value="">{t('pleaseSelect') + t('industry')}</option>
            <option value="technology">科技</option>
            <option value="finance">金融</option>
            <option value="healthcare">医疗健康</option>
            <option value="education">教育</option>
            <option value="retail">零售</option>
            <option value="manufacturing">制造业</option>
            <option value="other">其他</option>
          </select>
          {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('companySize')} *
          </label>
          <select
            value={formData.companySize}
            onChange={(e) => handleInputChange('companySize', e.target.value)}
            className={`input-field ${errors.companySize ? 'border-red-500' : ''}`}
          >
            <option value="">{t('pleaseSelect') + t('companySize')}</option>
            <option value="1-50">1-50人</option>
            <option value="51-200">51-200人</option>
            <option value="201-1000">201-1000人</option>
            <option value="1000+">1000人以上</option>
          </select>
          {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('companyAddress')} *
        </label>
        <input
          type="text"
          value={formData.companyAddress}
          onChange={(e) => handleInputChange('companyAddress', e.target.value)}
          className={`input-field ${errors.companyAddress ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('companyAddress')}
        />
        {errors.companyAddress && <p className="mt-1 text-sm text-red-600">{errors.companyAddress}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('contactName')} *
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            className={`input-field ${errors.contactName ? 'border-red-500' : ''}`}
            placeholder={t('pleaseEnter') + t('contactName')}
          />
          {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('contactTitle')} *
          </label>
          <input
            type="text"
            value={formData.contactTitle}
            onChange={(e) => handleInputChange('contactTitle', e.target.value)}
            className={`input-field ${errors.contactTitle ? 'border-red-500' : ''}`}
            placeholder={t('pleaseEnter') + t('contactTitle')}
          />
          {errors.contactTitle && <p className="mt-1 text-sm text-red-600">{errors.contactTitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('contactPhone')} *
          </label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            className={`input-field ${errors.contactPhone ? 'border-red-500' : ''}`}
            placeholder="+86 138 0000 0000"
          />
          {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('contactEmail')} *
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            className={`input-field ${errors.contactEmail ? 'border-red-500' : ''}`}
            placeholder="contact@company.com"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('customRequirements')} {t('optional')}
        </label>
        <textarea
          value={formData.customRequirements}
          onChange={(e) => handleInputChange('customRequirements', e.target.value)}
          className="input-field h-20 resize-none"
          placeholder={t('usedForSales')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('keyScenarios')} *
        </label>
        <textarea
          value={formData.keyScenarios}
          onChange={(e) => handleInputChange('keyScenarios', e.target.value)}
          className={`input-field h-20 resize-none ${errors.keyScenarios ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('keyScenarios')}
        />
        {errors.keyScenarios && <p className="mt-1 text-sm text-red-600">{errors.keyScenarios}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('expectedSeats')} *
        </label>
        <input
          type="number"
          value={formData.expectedSeats}
          onChange={(e) => handleInputChange('expectedSeats', e.target.value)}
          className={`input-field ${errors.expectedSeats ? 'border-red-500' : ''}`}
          placeholder={t('pleaseEnter') + t('expectedSeats')}
        />
        {errors.expectedSeats && <p className="mt-1 text-sm text-red-600">{errors.expectedSeats}</p>}
      </div>
    </div>
  );

  const selectedPlanDetails = plans[selectedPlan];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧固定区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-50 to-primary-100 items-center justify-center p-8 fixed left-0 top-0 h-full">
        <div className="text-center">
          <img
            src={images.loginIllustration}
            alt="AI全渠道内容生成平台"
            className="max-w-md mx-auto mb-6 rounded-lg shadow-2xl"
          />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-700 mb-4">
              {t('welcome')}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {t('platformName')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('platformDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* 右侧可滚动区域 */}
      <div className="flex-1 lg:ml-[50%] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profileSetup')}</h1>
              <p className="text-gray-600">{t('selectPlan')}</p>
            </div>

            {/* 版本选择器 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectPlan')} *
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value as PlanType)}
                className="input-field"
              >
                <option value="personalBasic">{t('personalBasic')}</option>
                <option value="personalPro">{t('personalPro')}</option>
                <option value="team">{t('team')}</option>
                <option value="enterprise">{t('enterprise')}</option>
              </select>
            </div>

            {/* 版本详情展示 */}
            {selectedPlan && (
              <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">{selectedPlanDetails.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-2xl font-bold text-primary-600 mb-2">{selectedPlanDetails.price}</p>
                    <p className="text-sm text-gray-600 mb-4">{selectedPlanDetails.suitableFor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t('benefits')}</h4>
                    <ul className="space-y-1">
                      {selectedPlanDetails.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-primary-500 mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{t('planDetails')}</h3>
              
              {selectedPlan === 'personalBasic' || selectedPlan === 'personalPro' ? renderPersonalForm() : null}
              {selectedPlan === 'team' ? renderTeamForm() : null}
              {selectedPlan === 'enterprise' ? renderEnterpriseForm() : null}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  {t('enterPlatform')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupForm;
