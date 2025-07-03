import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey } from '@/services/api/apiKeyService';

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newKey, setNewKey] = useState({
    name: '',
    provider: 'openai',
    key: '',
    description: ''
  });

const providers = [
    { id: 'openai', name: 'OpenAI', icon: 'Brain' },
    { id: 'anthropic', name: 'Anthropic', icon: 'MessageSquare' },
    { id: 'google', name: 'Google Open Router', icon: 'Search' },
    { id: 'cohere', name: 'Cohere', icon: 'Zap' }
  ];

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getApiKeys();
      setApiKeys(data);
    } catch (err) {
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      setSaving(true);
      const createdKey = await createApiKey(newKey);
      setApiKeys(prev => [...prev, createdKey]);
      setNewKey({ name: '', provider: 'openai', key: '', description: '' });
      setShowAddForm(false);
      toast.success('API key added successfully');
    } catch (err) {
      toast.error('Failed to add API key');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleKey = async (keyId, isActive) => {
    try {
      await updateApiKey(keyId, { active: !isActive });
      setApiKeys(prev => prev.map(key => 
        key.Id === keyId ? { ...key, active: !isActive } : key
      ));
      toast.success(`API key ${!isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update API key');
    }
  };

  const handleDeleteKey = async (keyId, keyName) => {
    if (!confirm(`Are you sure you want to delete the API key "${keyName}"?`)) {
      return;
    }

    try {
      await deleteApiKey(keyId);
      setApiKeys(prev => prev.filter(key => key.Id !== keyId));
      toast.success('API key deleted successfully');
    } catch (err) {
      toast.error('Failed to delete API key');
    }
  };

  const getProviderInfo = (providerId) => {
    return providers.find(p => p.id === providerId) || providers[0];
  };

  const maskApiKey = (key) => {
    if (!key) return '';
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadApiKeys} />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          API Key Management
        </h1>
        <p className="text-gray-600">
          Manage AI provider API keys for your platform.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Key" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{apiKeys.length}</p>
              <p className="text-gray-600 text-sm">Total Keys</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {apiKeys.filter(k => k.active).length}
              </p>
              <p className="text-gray-600 text-sm">Active Keys</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Building" className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(apiKeys.map(k => k.provider)).size}
              </p>
              <p className="text-gray-600 text-sm">Providers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Activity" className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">98.9%</p>
              <p className="text-gray-600 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add New Key Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          icon="Plus"
        >
          Add API Key
        </Button>
      </motion.div>

      {/* Add Key Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Add New API Key
            </h2>
            <Button
              variant="ghost"
              onClick={() => setShowAddForm(false)}
              icon="X"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Key Name"
              value={newKey.name}
              onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Production OpenAI Key"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <select
                value={newKey.provider}
                onChange={(e) => setNewKey(prev => ({ ...prev, provider: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <Input
              label="API Key"
              type="password"
              value={newKey.key}
              onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
              placeholder="sk-..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Description
            </label>
            <textarea
              value={newKey.description}
              onChange={(e) => setNewKey(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Description of this API key usage..."
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleCreateKey}
              loading={saving}
              icon="Save"
            >
              Add Key
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <Empty
          type="default"
          onAction={() => setShowAddForm(true)}
          actionText="Add Your First API Key"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {apiKeys.map((apiKey) => {
            const provider = getProviderInfo(apiKey.provider);
            return (
              <div
                key={apiKey.Id}
                className="bg-white rounded-xl shadow-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <ApperIcon name={provider.icon} className="w-6 h-6 text-primary-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-display font-semibold text-gray-900">
                          {apiKey.name}
                        </h3>
                        <Badge variant={apiKey.active ? 'success' : 'default'}>
                          {apiKey.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {provider.name} • {maskApiKey(apiKey.key)}
                      </p>
                      
                      {apiKey.description && (
                        <p className="text-sm text-gray-600">
                          {apiKey.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleKey(apiKey.Id, apiKey.active)}
                      icon={apiKey.active ? 'Pause' : 'Play'}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="RotateCcw"
                      title="Rotate Key"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteKey(apiKey.Id, apiKey.name)}
                    />
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Requests Today</p>
                      <p className="font-medium text-gray-900">{apiKey.requestsToday || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Requests</p>
                      <p className="font-medium text-gray-900">{apiKey.totalRequests || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Used</p>
                      <p className="font-medium text-gray-900">{apiKey.lastUsed || 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost This Month</p>
                      <p className="font-medium text-gray-900">${apiKey.monthlyCost || '0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default ApiKeyManagement;