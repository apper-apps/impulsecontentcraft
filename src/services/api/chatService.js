import chatHistoryData from '@/services/mockData/chatHistory.json';

let chatHistory = [...chatHistoryData];

export const getMyAgents = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      Id: 1,
      name: 'Content Writer Pro',
      description: 'Expert at creating high-quality blog posts, articles, and web content.',
      category: 'Content Writing',
      icon: 'Pen'
    },
    {
      Id: 2,
      name: 'Social Media Expert',
      description: 'Specialized in creating engaging social media content and strategies.',
      category: 'Social Media',
      icon: 'MessageSquare'
    },
    {
      Id: 3,
      name: 'Copywriting Specialist',
      description: 'Crafts persuasive copy for sales pages, ads, and marketing materials.',
      category: 'Copywriting',
      icon: 'Megaphone'
    },
    {
      Id: 4,
      name: 'Email Marketing Pro',
      description: 'Creates compelling email campaigns and newsletter content.',
      category: 'Email Marketing',
      icon: 'Mail'
    }
  ];
};

export const getChatHistory = async (agentId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return chatHistory.filter(message => message.agentId === agentId);
};

export const sendMessage = async (agentId, content) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const responses = [
    "I'd be happy to help you with that! Let me create something tailored to your needs.",
    "Great idea! Here's how I would approach this challenge...",
    "That's an excellent question. Based on my expertise, I recommend...",
    "Let me craft something perfect for your audience and goals.",
    "I understand exactly what you're looking for. Here's my suggestion..."
  ];
  
  const response = {
    Id: Date.now() + 1,
    agentId: agentId,
    content: responses[Math.floor(Math.random() * responses.length)],
    sender: 'agent',
    timestamp: new Date().toISOString()
  };
  
  chatHistory.push(response);
  return response;
};

export const exportChatHistory = async (agentId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const messages = chatHistory.filter(m => m.agentId === agentId);
  const content = messages.map(m => 
    `[${new Date(m.timestamp).toLocaleString()}] ${m.sender}: ${m.content}`
  ).join('\n\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-history-agent-${agentId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  
  return { success: true };
};