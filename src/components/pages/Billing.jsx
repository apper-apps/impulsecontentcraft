import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { getBillingInfo, getInvoices, updateSubscription } from '@/services/api/billingService';

const Billing = () => {
  const [billingInfo, setBillingInfo] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError('');
      const [billing, invoiceData] = await Promise.all([
        getBillingInfo(),
        getInvoices()
      ]);
      setBillingInfo(billing);
      setInvoices(invoiceData);
    } catch (err) {
      setError('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType) => {
    try {
      setUpdating(true);
      await updateSubscription(planType);
      setBillingInfo(prev => ({ ...prev, subscription: { ...prev.subscription, type: planType } }));
      toast.success('Subscription updated successfully!');
    } catch (err) {
      toast.error('Failed to update subscription');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'past_due': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'past_due': return 'AlertTriangle';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBillingData} />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Billing & Subscriptions
        </h1>
        <p className="text-gray-600">
          Manage your subscription plans and billing information.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Current Subscription
              </h2>
              <Badge 
                variant={getStatusColor(billingInfo?.subscription?.status)}
                className="flex items-center space-x-1"
              >
                <ApperIcon name={getStatusIcon(billingInfo?.subscription?.status)} className="w-3 h-3" />
                <span className="capitalize">{billingInfo?.subscription?.status}</span>
              </Badge>
            </div>

            <div className="bg-gradient-primary rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-display font-bold capitalize mb-2">
                    {billingInfo?.subscription?.type?.replace('_', ' ')} Plan
                  </h3>
                  <p className="text-white/90">
                    {billingInfo?.subscription?.agents?.length || 0} agents subscribed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">${billingInfo?.subscription?.price}</p>
                  <p className="text-white/80">per month</p>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MessageCircle" className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                    <p className="text-gray-600 text-sm">Messages Used</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Bot" className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{billingInfo?.subscription?.agents?.length || 0}</p>
                    <p className="text-gray-600 text-sm">Active Agents</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-gray-600 text-sm">Days Remaining</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Options */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-gray-900">Available Plans</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">A La Carte</h4>
                  <p className="text-gray-600 text-sm mb-3">Individual agents</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">$5<span className="text-sm text-gray-600">/month</span></p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUpgrade('alacarte')}
                    disabled={billingInfo?.subscription?.type === 'alacarte' || updating}
                    className="w-full"
                  >
                    {billingInfo?.subscription?.type === 'alacarte' ? 'Current Plan' : 'Switch Plan'}
                  </Button>
                </div>

                <div className="border-2 border-primary-200 rounded-lg p-4 relative">
                  <Badge variant="primary" className="absolute -top-2 left-4">Popular</Badge>
                  <h4 className="font-semibold text-gray-900 mb-2">Bundle</h4>
                  <p className="text-gray-600 text-sm mb-3">Curated collections</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">$25<span className="text-sm text-gray-600">/month</span></p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpgrade('bundle')}
                    disabled={billingInfo?.subscription?.type === 'bundle' || updating}
                    loading={updating}
                    className="w-full"
                  >
                    {billingInfo?.subscription?.type === 'bundle' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">All-Inclusive</h4>
                  <p className="text-gray-600 text-sm mb-3">Unlimited access</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">$50<span className="text-sm text-gray-600">/month</span></p>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleUpgrade('allinclusive')}
                    disabled={billingInfo?.subscription?.type === 'allinclusive' || updating}
                    loading={updating}
                    className="w-full"
                  >
                    {billingInfo?.subscription?.type === 'allinclusive' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Info & Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Payment Method</h3>
              <Button variant="ghost" size="sm" icon="Edit">
                Edit
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CreditCard" className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
          </div>

          {/* Next Payment */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Next Payment</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">${billingInfo?.subscription?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">Dec 15, 2024</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-gray-900">${billingInfo?.subscription?.price}</span>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Recent Invoices</h3>
              <Button variant="ghost" size="sm" icon="ExternalLink">
                View All
              </Button>
            </div>
            
            {invoices.length === 0 ? (
              <Empty type="billing" />
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.Id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">${invoice.amount}</p>
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm" icon="Download" className="px-2">
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Billing;