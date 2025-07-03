import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import AgentCard from '@/components/molecules/AgentCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getUserStats, getRecentActivity, getMyAgents } from '@/services/api/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myAgents, setMyAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsData, activityData, agentsData] = await Promise.all([
        getUserStats(),
        getRecentActivity(),
        getMyAgents()
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
      setMyAgents(agentsData.slice(0, 4)); // Show only first 4 agents
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithAgent = (agent) => {
    navigate(`/chat/${agent.Id}`);
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-primary rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-white/90 mb-6 max-w-2xl">
            Ready to create amazing content? Your AI agents are waiting to help you craft compelling stories, 
            engaging social media posts, and powerful marketing copy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/marketplace')}
              icon="Store"
            >
              Browse Marketplace
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/chat')}
              icon="MessageCircle"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Start Creating
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              gradient={index % 2 === 0}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Recent Activity
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/chat')}
                icon="ExternalLink"
              >
                View All
              </Button>
            </div>
            
            {recentActivity.length === 0 ? (
              <Empty
                type="chat"
                onAction={() => navigate('/chat')}
              />
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.Id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/chat/${activity.agentId}`)}
                  >
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        with {activity.agentName} • {activity.timestamp}
                      </p>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                icon="Plus"
                onClick={() => navigate('/marketplace')}
              >
                Subscribe to New Agent
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon="User"
                onClick={() => navigate('/personalization')}
              >
                Update Profile
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon="CreditCard"
                onClick={() => navigate('/billing')}
              >
                Manage Billing
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon="Settings"
                onClick={() => navigate('/settings')}
              >
                Settings
              </Button>
            </div>

            {/* Usage Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Messages sent</span>
                  <span className="font-medium">247 / 500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '49.4%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* My Agents Quick Access */}
      {myAgents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                My Agents
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-agents')}
                icon="ExternalLink"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {myAgents.map((agent) => (
                <AgentCard
                  key={agent.Id}
                  agent={agent}
                  isSubscribed={true}
                  onChat={handleChatWithAgent}
                  showSubscribeButton={false}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;