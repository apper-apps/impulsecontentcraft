export const getUserStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      title: 'Active Agents',
      value: '4',
      change: '+2 this month',
      changeType: 'positive',
      icon: 'Bot'
    },
    {
      title: 'Messages Sent',
      value: '247',
      change: '+28%',
      changeType: 'positive',
      icon: 'MessageCircle'
    },
    {
      title: 'Content Created',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: 'FileText'
    },
    {
      title: 'Hours Saved',
      value: '12.5',
      change: '+5.2h',
      changeType: 'positive',
      icon: 'Clock'
    }
  ];
};

export const getRecentActivity = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      Id: 1,
      title: 'Created blog post outline',
      agentName: 'Content Writer Pro',
      agentId: 1,
      timestamp: '2 hours ago'
    },
    {
      Id: 2,
      title: 'Generated social media captions',
      agentName: 'Social Media Expert',
      agentId: 2,
      timestamp: '4 hours ago'
    },
    {
      Id: 3,
      title: 'Wrote product description',
      agentName: 'Copywriting Specialist',
      agentId: 3,
      timestamp: '6 hours ago'
    },
    {
      Id: 4,
      title: 'Created email newsletter',
      agentName: 'Email Marketing Pro',
      agentId: 4,
      timestamp: '8 hours ago'
    },
    {
      Id: 5,
      title: 'Optimized SEO content',
      agentName: 'SEO Optimizer',
      agentId: 5,
      timestamp: '1 day ago'
    }
  ];
};

export const getMyAgents = async () => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  return [
    {
      Id: 1,
      name: 'Content Writer Pro',
      description: 'Expert at creating high-quality blog posts, articles, and web content.',
      category: 'Content Writing',
      price: 15,
      icon: 'Pen'
    },
    {
      Id: 2,
      name: 'Social Media Expert',
      description: 'Specialized in creating engaging social media content and strategies.',
      category: 'Social Media',
      price: 10,
      icon: 'MessageSquare'
    },
    {
      Id: 3,
      name: 'Copywriting Specialist',
      description: 'Crafts persuasive copy for sales pages, ads, and marketing materials.',
      category: 'Copywriting',
      price: 20,
      icon: 'Megaphone'
    },
    {
      Id: 4,
      name: 'Email Marketing Pro',
      description: 'Creates compelling email campaigns and newsletter content.',
      category: 'Email Marketing',
      price: 12,
      icon: 'Mail'
    }
  ];
};