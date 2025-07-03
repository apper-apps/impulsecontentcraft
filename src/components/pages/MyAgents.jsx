import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AgentCard from '@/components/molecules/AgentCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getMyAgents, unsubscribeFromAgent } from '@/services/api/agentService';

const MyAgents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unsubscribing, setUnsubscribing] = useState(null);

  useEffect(() => {
    loadMyAgents();
  }, []);

  const loadMyAgents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyAgents();
      setAgents(data);
    } catch (err) {
      setError('Failed to load your agents');
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithAgent = (agent) => {
    navigate(`/chat/${agent.Id}`);
  };

  const handleUnsubscribe = async (agent) => {
    if (!confirm(`Are you sure you want to unsubscribe from ${agent.name}?`)) {
      return;
    }

    try {
      setUnsubscribing(agent.Id);
      await unsubscribeFromAgent(agent.Id);
      setAgents(prev => prev.filter(a => a.Id !== agent.Id));
      toast.success(`Unsubscribed from ${agent.name}`);
    } catch (err) {
      toast.error('Failed to unsubscribe');
    } finally {
      setUnsubscribing(null);
    }
  };

  if (loading) return <Loading type="marketplace" />;
  if (error) return <Error message={error} onRetry={loadMyAgents} />;

  if (agents.length === 0) {
    return (
      <div className="p-6">
        <Empty
          type="agents"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My AI Agents
            </h1>
            <p className="text-gray-600">
              Manage your subscribed agents and start creating content.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/marketplace')}
            icon="Plus"
          >
            Add More Agents
          </Button>
        </div>
      </motion.div>

      {/* Usage Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-card p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Bot" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
              <p className="text-gray-600 text-sm">Active Agents</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
              <ApperIcon name="MessageCircle" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-gray-600 text-sm">Messages This Month</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12.5</p>
              <p className="text-gray-600 text-sm">Hours Saved</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">93%</p>
              <p className="text-gray-600 text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AgentCard
              agent={agent}
              isSubscribed={true}
              onChat={handleChatWithAgent}
              onUnsubscribe={handleUnsubscribe}
              showSubscribeButton={false}
              className={unsubscribing === agent.Id ? 'opacity-50' : ''}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyAgents;