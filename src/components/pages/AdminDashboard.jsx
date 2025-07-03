import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { getAdminStats, getRecentUsers, getAgentStats } from '@/services/api/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [agentStats, setAgentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [adminStatsData, usersData, agentsData] = await Promise.all([
        getAdminStats(),
        getRecentUsers(),
        getAgentStats()
      ]);
      
      setStats(adminStatsData);
      setRecentUsers(usersData);
      setAgentStats(agentsData);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadAdminData} />;

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
            Admin Dashboard 🛠️
          </h1>
          <p className="text-white/90 mb-6 max-w-2xl">
            Manage your AI agents, monitor platform performance, and oversee user activities. 
            Create new agents and track their success across the platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/create-agent')}
              icon="Plus"
            >
              Create New Agent
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/users')}
              icon="Users"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Manage Users
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
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Recent Users
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/users')}
                icon="ExternalLink"
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.Id}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email} • Joined {user.joinDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.agentCount} agents
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.subscription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                onClick={() => navigate('/admin/create-agent')}
              >
                Create New Agent
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon="Users"
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon="Key"
                onClick={() => navigate('/admin/api-keys')}
              >
                API Keys
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon="BarChart3"
                onClick={() => navigate('/admin/analytics')}
              >
                View Analytics
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Agent Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Top Performing Agents
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/agents')}
              icon="ExternalLink"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentStats.map((agent) => (
              <div
                key={agent.Id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name={agent.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.category}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subscribers</span>
                    <span className="font-medium">{agent.subscribers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Messages</span>
                    <span className="font-medium">{agent.messages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">{agent.rating}/5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;