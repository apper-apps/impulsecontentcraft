import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { getUserProfiles, updateUserProfiles, analyzeWebsite } from '@/services/api/profileService';

const PersonalizationHub = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  const [businessProfile, setBusinessProfile] = useState({
    name: '',
    services: [],
    mission: '',
    brandVoice: '',
    category: '',
    competitors: [],
    contentGoals: [],
    callToActions: [],
    website: ''
  });

  const [personalProfile, setPersonalProfile] = useState({
    name: '',
    hobbies: [],
    values: [],
    stories: '',
    preferredTone: '',
    affiliations: [],
    goals: []
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      const profiles = await getUserProfiles();
      if (profiles.business) setBusinessProfile(profiles.business);
      if (profiles.personal) setPersonalProfile(profiles.personal);
    } catch (err) {
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfiles = async () => {
    try {
      setSaving(true);
      await updateUserProfiles({
        business: businessProfile,
        personal: personalProfile
      });
      toast.success('Profiles updated successfully!');
    } catch (err) {
      toast.error('Failed to save profiles');
    } finally {
      setSaving(false);
    }
  };

  const handleWebsiteAnalysis = async () => {
    if (!businessProfile.website) {
      toast.error('Please enter your website URL');
      return;
    }

    try {
      setAnalyzing(true);
      const analysis = await analyzeWebsite(businessProfile.website);
      setBusinessProfile(prev => ({
        ...prev,
        name: analysis.name || prev.name,
        mission: analysis.mission || prev.mission,
        services: analysis.services || prev.services,
        category: analysis.category || prev.category,
        brandVoice: analysis.brandVoice || prev.brandVoice
      }));
      toast.success('Website analysis completed! Profile fields have been updated.');
    } catch (err) {
      toast.error('Failed to analyze website. Please check the URL and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleArrayInput = (value, setter, currentArray) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setter(items);
  };

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: 'Building2' },
    { id: 'personal', label: 'Personal Profile', icon: 'User' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfiles} />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Personalization Hub
        </h1>
        <p className="text-gray-600">
          Set up your business and personal profiles to get more personalized content from your AI agents.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-card">
        {/* Business Profile Tab */}
        {activeTab === 'business' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
          >
            {/* AI Website Analyzer */}
            <div className="bg-gradient-primary rounded-xl p-6 text-white mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-display font-semibold mb-2">
                    AI Website Analyzer
                  </h3>
                  <p className="text-white/90 mb-4">
                    Enter your website URL and let our AI automatically fill in your business profile.
                  </p>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <Input
                        value={businessProfile.website}
                        onChange={(e) => setBusinessProfile(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                        className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleWebsiteAnalysis}
                      loading={analyzing}
                      icon="Sparkles"
                    >
                      Analyze
                    </Button>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center ml-6">
                  <ApperIcon name="Globe" className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Business Name"
                value={businessProfile.name}
                onChange={(e) => setBusinessProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your business name"
              />

              <Input
                label="Category"
                value={businessProfile.category}
                onChange={(e) => setBusinessProfile(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Technology, Healthcare, Education"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Mission Statement
              </label>
              <textarea
                value={businessProfile.mission}
                onChange={(e) => setBusinessProfile(prev => ({ ...prev, mission: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your company's mission and values..."
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Brand Voice
              </label>
              <textarea
                value={businessProfile.brandVoice}
                onChange={(e) => setBusinessProfile(prev => ({ ...prev, brandVoice: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your brand's tone and personality..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Services (comma-separated)
                </label>
                <textarea
                  value={businessProfile.services.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setBusinessProfile(prev => ({ ...prev, services: items })), businessProfile.services)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Web design, Marketing, Consulting"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Competitors (comma-separated)
                </label>
                <textarea
                  value={businessProfile.competitors.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setBusinessProfile(prev => ({ ...prev, competitors: items })), businessProfile.competitors)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Competitor 1, Competitor 2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content Goals (comma-separated)
                </label>
                <textarea
                  value={businessProfile.contentGoals.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setBusinessProfile(prev => ({ ...prev, contentGoals: items })), businessProfile.contentGoals)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brand awareness, Lead generation, Education"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Call-to-Actions (comma-separated)
                </label>
                <textarea
                  value={businessProfile.callToActions.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setBusinessProfile(prev => ({ ...prev, callToActions: items })), businessProfile.callToActions)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Contact us, Learn more, Get started"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Personal Profile Tab */}
        {activeTab === 'personal' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={personalProfile.name}
                onChange={(e) => setPersonalProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />

              <Input
                label="Preferred Tone"
                value={personalProfile.preferredTone}
                onChange={(e) => setPersonalProfile(prev => ({ ...prev, preferredTone: e.target.value }))}
                placeholder="e.g., Professional, Casual, Friendly"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Personal Stories & Background
              </label>
              <textarea
                value={personalProfile.stories}
                onChange={(e) => setPersonalProfile(prev => ({ ...prev, stories: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Share your personal story, experiences, and background that might influence your content..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hobbies & Interests (comma-separated)
                </label>
                <textarea
                  value={personalProfile.hobbies.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setPersonalProfile(prev => ({ ...prev, hobbies: items })), personalProfile.hobbies)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Photography, Travel, Cooking, Reading"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Core Values (comma-separated)
                </label>
                <textarea
                  value={personalProfile.values.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setPersonalProfile(prev => ({ ...prev, values: items })), personalProfile.values)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Integrity, Innovation, Collaboration"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Affiliations & Organizations (comma-separated)
                </label>
                <textarea
                  value={personalProfile.affiliations.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setPersonalProfile(prev => ({ ...prev, affiliations: items })), personalProfile.affiliations)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Professional organizations, communities, clubs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Personal Goals (comma-separated)
                </label>
                <textarea
                  value={personalProfile.goals.join(', ')}
                  onChange={(e) => handleArrayInput(e.target.value, (items) => 
                    setPersonalProfile(prev => ({ ...prev, goals: items })), personalProfile.goals)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Career growth, Work-life balance, Learning new skills"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSaveProfiles}
              loading={saving}
              icon="Save"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationHub;