export const getAdminStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'Users'
    },
    {
      title: 'Active Agents',
      value: '28',
      change: '+3 this week',
      changeType: 'positive',
      icon: 'Bot'
    },
    {
      title: 'Monthly Revenue',
      value: '$12,450',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'DollarSign'
    },
    {
      title: 'Support Tickets',
      value: '23',
      change: '-12%',
      changeType: 'positive',
      icon: 'MessageSquare'
    }
  ];
};

export const getRecentUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return [
    {
      Id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      joinDate: 'Dec 8, 2024',
      agentCount: 3,
      subscription: 'bundle'
    },
    {
      Id: 2,
      name: 'Mike Chen',
      email: 'mike@startup.io',
      joinDate: 'Dec 7, 2024',
      agentCount: 1,
      subscription: 'alacarte'
    },
    {
      Id: 3,
      name: 'Emma Wilson',
      email: 'emma@agency.com',
      joinDate: 'Dec 6, 2024',
      agentCount: 8,
      subscription: 'allinclusive'
    },
    {
      Id: 4,
      name: 'David Brown',
      email: 'david@business.net',
      joinDate: 'Dec 5, 2024',
      agentCount: 2,
      subscription: 'bundle'
    },
    {
      Id: 5,
      name: 'Lisa Garcia',
      email: 'lisa@creative.studio',
      joinDate: 'Dec 4, 2024',
      agentCount: 5,
      subscription: 'allinclusive'
    }
  ];
};

export const getAgentStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      Id: 1,
      name: 'Content Writer Pro',
      category: 'Content Writing',
      icon: 'Pen',
      subscribers: 342,
      messages: 1247,
      rating: 4.8
    },
    {
      Id: 2,
      name: 'Social Media Expert',
      category: 'Social Media',
      icon: 'MessageSquare',
      subscribers: 298,
      messages: 956,
      rating: 4.7
    },
    {
      Id: 3,
      name: 'SEO Optimizer',
      category: 'SEO',
      icon: 'Search',
      subscribers: 186,
      messages: 634,
      rating: 4.6
    },
    {
      Id: 4,
      name: 'Email Marketing Pro',
      category: 'Email Marketing',
      icon: 'Mail',
      subscribers: 203,
      messages: 789,
      rating: 4.9
    }
  ];
};