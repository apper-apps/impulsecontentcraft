import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getUsers, updateUserSubscription, deleteUser } from '@/services/api/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateSubscription = async (userId, newSubscription) => {
    try {
      setUpdating(userId);
      await updateUserSubscription(userId, newSubscription);
      setUsers(prev => prev.map(user => 
        user.Id === userId 
          ? { ...user, subscription: newSubscription }
          : user
      ));
      toast.success('Subscription updated successfully');
    } catch (err) {
      toast.error('Failed to update subscription');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(user => user.Id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'allinclusive': return 'primary';
      case 'bundle': return 'secondary';
      case 'alacarte': return 'accent';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'danger';
      case 'admin': return 'warning';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage user accounts, subscriptions, and permissions.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="UserCheck" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.subscription !== 'free').length}
              </p>
              <p className="text-gray-600 text-sm">Paid Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Crown" className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.subscription === 'allinclusive').length}
              </p>
              <p className="text-gray-600 text-sm">Premium Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12%</p>
              <p className="text-gray-600 text-sm">Growth Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-card p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="w-full lg:w-80">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search users by name or email..."
            />
          </div>
          
          <div className="flex space-x-3">
            <Button variant="secondary" icon="Download">
              Export Users
            </Button>
            <Button variant="primary" icon="UserPlus">
              Invite User
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Empty
          type="users"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">User</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Subscription</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Agents</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Joined</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="w-5 h-5 text-white" />
                        </div>
                        <div>
<p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <Badge variant={getRoleColor(user.role)} className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSubscriptionColor(user.subscription)} className="capitalize">
                          {user.subscription?.replace('_', ' ')}
                        </Badge>
                        <div className="relative">
                          <select
                            value={user.subscription}
                            onChange={(e) => handleUpdateSubscription(user.Id, e.target.value)}
                            disabled={updating === user.Id}
                            className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="free">Free</option>
                            <option value="alacarte">A La Carte</option>
                            <option value="bundle">Bundle</option>
                            <option value="allinclusive">All-Inclusive</option>
                          </select>
                          {updating === user.Id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
<span className="font-medium text-gray-900">{user.agentCount}</span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{user.joinDate}</span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          className="px-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Mail"
                          className="px-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          className="px-2 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.Id, user.name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserManagement;