const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getMyAgents = async () => {
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "description" } },
      { field: { Name: "category" } },
      { field: { Name: "icon" } }
    ],
    where: [
      { FieldName: "status", Operator: "EqualTo", Values: ["active"] }
    ],
    pagingInfo: { limit: 4, offset: 0 }
  };

  const response = await apperClient.fetchRecords('agent', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  return response.data.map(agent => ({
    Id: agent.Id,
    name: agent.Name || '',
    description: agent.description || '',
    category: agent.category || '',
    icon: agent.icon || 'Bot'
  }));
};

export const getChatHistory = async (agentId) => {
  const params = {
    fields: [
      { field: { Name: "content" } },
      { field: { Name: "sender" } },
      { field: { Name: "timestamp" } },
      { 
        field: { Name: "agent_id" },
        referenceField: { field: { Name: "Name" } }
      }
    ],
    where: [
      { FieldName: "agent_id", Operator: "EqualTo", Values: [parseInt(agentId)] }
    ],
    orderBy: [
      { fieldName: "timestamp", sorttype: "ASC" }
    ]
  };

  const response = await apperClient.fetchRecords('chat_message', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  return response.data.map(message => ({
    Id: message.Id,
    agentId: message.agent_id?.Id || parseInt(agentId),
    content: message.content || '',
    sender: message.sender || 'user',
    timestamp: message.timestamp || new Date().toISOString()
  }));
};

export const sendMessage = async (agentId, content) => {
  // First create user message
  const userMessageParams = {
    records: [{
      Name: `Message ${Date.now()}`,
      content: content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      agent_id: parseInt(agentId)
    }]
  };

  const userResponse = await apperClient.createRecord('chat_message', userMessageParams);
  
  if (!userResponse.success) {
    console.error(userResponse.message);
    throw new Error(userResponse.message);
  }

  // Simulate agent response
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const responses = [
    "I'd be happy to help you with that! Let me create something tailored to your needs.",
    "Great idea! Here's how I would approach this challenge...",
    "That's an excellent question. Based on my expertise, I recommend...",
    "Let me craft something perfect for your audience and goals.",
    "I understand exactly what you're looking for. Here's my suggestion..."
  ];

  const agentMessageParams = {
    records: [{
      Name: `Agent Response ${Date.now()}`,
      content: responses[Math.floor(Math.random() * responses.length)],
      sender: 'agent',
      timestamp: new Date().toISOString(),
      agent_id: parseInt(agentId)
    }]
  };

  const agentResponse = await apperClient.createRecord('chat_message', agentMessageParams);
  
  if (!agentResponse.success) {
    console.error(agentResponse.message);
    throw new Error(agentResponse.message);
  }

  if (agentResponse.results && agentResponse.results.length > 0) {
    const result = agentResponse.results[0];
    if (result.success) {
      return {
        Id: result.data.Id,
        agentId: parseInt(agentId),
        content: result.data.content,
        sender: 'agent',
        timestamp: result.data.timestamp
      };
    }
  }

  throw new Error('Failed to create agent response');
};

export const exportChatHistory = async (agentId) => {
  const messages = await getChatHistory(agentId);
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