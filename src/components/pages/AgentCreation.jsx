import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { createAgent, testAgent } from '@/services/api/agentService';

const AgentCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);

const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    category: '',
    icon: 'Bot',
    profileImage: '',
    price: 5,
    prompts: {
      system: '',
      welcome: '',
      examples: []
    },
    training: {
      documents: [],
      keywords: []
    },
    settings: {
      temperature: 0.7,
      maxTokens: 1000,
      model: 'gpt-3.5-turbo'
    }
  });

  const categories = [
    'Content Writing',
    'Social Media',
    'Email Marketing',
    'SEO',
    'Copywriting',
    'Video Scripts',
    'Blog Posts',
    'Product Descriptions'
  ];

  const icons = [
    'Bot', 'Pen', 'MessageSquare', 'Mail', 'Search', 'Video', 
    'FileText', 'Package', 'Megaphone', 'Camera', 'Globe', 'Zap'
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: 'Info' },
    { id: 2, title: 'Configuration', icon: 'Settings' },
    { id: 3, title: 'Training', icon: 'BookOpen' },
    { id: 4, title: 'Testing', icon: 'TestTube' }
  ];

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setAgentData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setAgentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
};

  const handleArrayInput = (field, value, nested = null) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(field, items, nested);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAgentData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
        toast.success('Image uploaded successfully');
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAgentData(prev => ({
      ...prev,
      profileImage: ''
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const mockEvent = { target: { files: [file] } };
      handleFileUpload(mockEvent);
    }
  };

  const handleTestAgent = async () => {
    try {
      setTesting(true);
      const results = await testAgent(agentData);
      setTestResults(results);
      toast.success('Agent test completed!');
    } catch (err) {
      toast.error('Agent test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAgent = async () => {
    try {
      setSaving(true);
      const agent = await createAgent(agentData);
      toast.success('Agent created successfully!');
      navigate('/admin');
    } catch (err) {
      toast.error('Failed to create agent');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            icon="ArrowLeft"
            size="sm"
          >
            Back to Admin
          </Button>
        </div>
        
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Create New AI Agent
        </h1>
        <p className="text-gray-600">
          Build a custom AI agent with specialized knowledge and capabilities.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className={`flex items-center space-x-3 ${
                currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id 
                    ? 'border-primary-600 bg-primary-600 text-white' 
                    : 'border-gray-300'
                }`}>
                  <ApperIcon name={step.icon} className="w-5 h-5" />
                </div>
                <span className="font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
          >
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Agent Name"
                value={agentData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Content Writer Pro"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={agentData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={agentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe what this agent specializes in and how it can help users..."
              />
            </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                
                {agentData.profileImage ? (
                  <div className="space-y-3">
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={agentData.profileImage}
                        alt="Agent profile"
                        className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => document.getElementById('profile-image-input').click()}
                      className="w-full px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('profile-image-input').click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all"
                  >
                    <ApperIcon name="Upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
                
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {!agentData.profileImage && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Or choose an icon
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {icons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => handleInputChange('icon', icon)}
                          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                            agentData.icon === icon
                              ? 'border-primary-600 bg-primary-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <ApperIcon name={icon} className={`w-5 h-5 ${
                            agentData.icon === icon ? 'text-primary-600' : 'text-gray-600'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Monthly Price ($)"
                type="number"
                value={agentData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="5"
                min="1"
                max="100"
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Configuration */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
          >
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Agent Configuration
            </h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                System Prompt
              </label>
              <textarea
                value={agentData.prompts.system}
                onChange={(e) => handleInputChange('system', e.target.value, 'prompts')}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="You are an expert content writer specializing in..."
              />
              <p className="text-sm text-gray-600">
                Define the agent's role, expertise, and how it should behave.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Welcome Message
              </label>
              <textarea
                value={agentData.prompts.welcome}
                onChange={(e) => handleInputChange('welcome', e.target.value, 'prompts')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Hi! I'm your content writing assistant. How can I help you create amazing content today?"
              />
            </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <select
                  value={agentData.settings.model}
                  onChange={(e) => handleInputChange('model', e.target.value, 'settings')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <optgroup label="OpenAI">
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </optgroup>
                  <optgroup label="Anthropic">
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                  </optgroup>
                  <optgroup label="Google">
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-pro-vision">Gemini Pro Vision</option>
                  </optgroup>
                </select>
              </div>

              <Input
                label="Temperature"
                type="number"
                value={agentData.settings.temperature}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value), 'settings')}
                min="0"
                max="1"
                step="0.1"
              />

              <Input
                label="Max Tokens"
                type="number"
                value={agentData.settings.maxTokens}
                onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value), 'settings')}
                min="100"
                max="4000"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Training */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
          >
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Training Data
            </h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Keywords (comma-separated)
              </label>
              <textarea
                value={agentData.training.keywords.join(', ')}
                onChange={(e) => handleArrayInput('keywords', e.target.value, 'training')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="content writing, copywriting, blog posts, marketing copy"
              />
              <p className="text-sm text-gray-600">
                Keywords that define the agent's expertise and specialization.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Example Conversations
              </label>
              <textarea
                value={agentData.prompts.examples.join('\n\n---\n\n')}
                onChange={(e) => handleInputChange('examples', e.target.value.split('\n\n---\n\n'), 'prompts')}
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={`User: Can you help me write a blog post about AI?
Agent: I'd be happy to help! What specific aspect of AI would you like to focus on?

---

User: I need a compelling product description.
Agent: Great! Tell me about your product and target audience.`}
              />
              <p className="text-sm text-gray-600">
                Separate examples with "---" to help train the agent's conversation style.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Lightbulb" className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Training Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use specific keywords related to the agent's specialty</li>
                    <li>• Provide diverse example conversations</li>
                    <li>• Include common user questions and professional responses</li>
                    <li>• Keep examples concise but informative</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Testing */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
          >
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Test Your Agent
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-display font-semibold text-gray-900 mb-4">
                Agent Preview
              </h3>
              
<div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center overflow-hidden">
                  {agentData.profileImage ? (
                    <img
                      src={agentData.profileImage}
                      alt={agentData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ApperIcon name={agentData.icon} className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{agentData.name}</h4>
                  <p className="text-sm text-gray-600">{agentData.category}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{agentData.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">${agentData.price}/month</span>
                <Button
                  variant="primary"
                  onClick={handleTestAgent}
                  loading={testing}
                  icon="Play"
                >
                  Test Agent
                </Button>
              </div>
            </div>

            {testResults && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-display font-semibold text-gray-900 mb-4">
                  Test Results
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      testResults.passed ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`font-medium ${
                      testResults.passed ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {testResults.passed ? 'Tests Passed' : 'Tests Failed'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sample Response:</h4>
                    <p className="text-gray-700">{testResults.sampleResponse}</p>
                  </div>
                  
                  {testResults.issues && testResults.issues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-2">Issues Found:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        {testResults.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
              icon="ChevronLeft"
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {currentStep === 4 ? (
                <Button
                  variant="primary"
                  onClick={handleSaveAgent}
                  loading={saving}
                  icon="Save"
                >
                  Create Agent
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  icon="ChevronRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCreation;