import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AgentCard from '@/components/molecules/AgentCard';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getMarketplaceAgents, subscribeToAgent, getMyAgents } from '@/services/api/agentService';

const AgentMarketplace = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [myAgents, setMyAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribing, setSubscribing] = useState(null);

  const categories = [
    'all',
    'Content Writing',
    'Social Media',
    'Email Marketing',
    'SEO',
    'Copywriting',
    'Video Scripts'
  ];

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  useEffect(() => {
    filterAgents();
  }, [agents, selectedCategory, searchQuery]);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      setError('');
      const [marketplaceData, myAgentsData] = await Promise.all([
        getMarketplaceAgents(),
        getMyAgents()
      ]);
      setAgents(marketplaceData);
      setMyAgents(myAgentsData);
    } catch (err) {
      setError('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const filterAgents = () => {
    let filtered = agents;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => agent.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAgents(filtered);
  };

  const handleSubscribe = async (agent) => {
    try {
      setSubscribing(agent.Id);
      await subscribeToAgent(agent.Id);
      setMyAgents(prev => [...prev, agent]);
      toast.success(`Subscribed to ${agent.name}!`);
    } catch (err) {
      toast.error('Failed to subscribe to agent');
    } finally {
      setSubscribing(null);
    }
  };

  const isSubscribed = (agentId) => {
    return myAgents.some(agent => agent.Id === agentId);
  };

  if (loading) return <Loading type="marketplace" />;
  if (error) return <Error message={error} onRetry={loadMarketplaceData} />;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Agent Marketplace
        </h1>
        <p className="text-gray-600">
          Discover and subscribe to AI agents that will help you create amazing content.
        </p>
      </motion.div>

      {/* Featured Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-card p-6 border-2 border-transparent hover:border-primary-200 transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900">A La Carte</h3>
              <p className="text-sm text-gray-600">Individual agents</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">$5<span className="text-sm text-gray-600">/month per agent</span></p>
          <p className="text-gray-600 text-sm">Perfect for specific needs</p>
        </div>

        <div className="bg-gradient-primary rounded-xl p-6 text-white relative overflow-hidden">
          <Badge variant="accent" className="absolute top-4 right-4">Popular</Badge>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Bundle Plans</h3>
              <p className="text-sm text-white/80">Curated collections</p>
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">$25<span className="text-sm text-white/80">/month</span></p>
          <p className="text-white/90 text-sm">Save 50% on popular combinations</p>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 border-2 border-transparent hover:border-accent-200 transition-all duration-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900">All-Inclusive</h3>
              <p className="text-sm text-gray-600">Unlimited access</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">$50<span className="text-sm text-gray-600">/month</span></p>
          <p className="text-gray-600 text-sm">Access to all agents</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-card p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-primary text-white shadow-primary'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
          
          <div className="w-full lg:w-80">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search agents..."
            />
          </div>
        </div>
      </motion.div>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <Empty
          type="marketplace"
          onAction={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AgentCard
                agent={agent}
                isSubscribed={isSubscribed(agent.Id)}
                onSubscribe={handleSubscribe}
                className={subscribing === agent.Id ? 'opacity-50' : ''}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentMarketplace;