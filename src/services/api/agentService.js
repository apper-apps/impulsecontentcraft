const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getMarketplaceAgents = async () => {
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "description" } },
      { field: { Name: "category" } },
      { field: { Name: "price" } },
      { field: { Name: "icon" } },
      { field: { Name: "status" } }
    ],
    where: [
      { FieldName: "status", Operator: "EqualTo", Values: ["active"] }
    ],
    orderBy: [
      { fieldName: "Name", sorttype: "ASC" }
    ]
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
    price: agent.price || 0,
    icon: agent.icon || 'Bot',
    status: agent.status || 'active'
  }));
};

export const getMyAgents = async () => {
  // For now, return first 4 agents as user's subscribed agents
  // In production, this would filter based on user subscriptions
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "description" } },
      { field: { Name: "category" } },
      { field: { Name: "price" } },
      { field: { Name: "icon" } },
      { field: { Name: "status" } }
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
    price: agent.price || 0,
    icon: agent.icon || 'Bot',
    status: agent.status || 'active'
  }));
};

export const subscribeToAgent = async (agentId) => {
  // In production, this would create a subscription record
  // For now, simulate success
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

export const unsubscribeFromAgent = async (agentId) => {
  // In production, this would remove subscription record
  // For now, simulate success
  await new Promise(resolve => setTimeout(resolve, 400));
  return { success: true };
};

export const createAgent = async (agentData) => {
  const params = {
    records: [{
      Name: agentData.name,
      description: agentData.description,
      category: agentData.category,
      price: agentData.price,
      icon: agentData.icon,
      status: 'active'
    }]
  };

  const response = await apperClient.createRecord('agent', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  if (response.results) {
    const failedRecords = response.results.filter(result => !result.success);
    if (failedRecords.length > 0) {
      console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Creation failed');
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length > 0) {
      return successfulRecords[0].data;
    }
  }

  throw new Error('No data returned from creation');
};

export const testAgent = async (agentData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const issues = [];
  
  if (!agentData.prompts?.system) {
    issues.push('System prompt is required');
  }
  
  if (!agentData.name || agentData.name.length < 3) {
    issues.push('Agent name must be at least 3 characters');
  }
  
  return {
    passed: issues.length === 0,
    issues,
    sampleResponse: `Hello! I'm ${agentData.name || 'your AI agent'}. ${agentData.prompts?.welcome || 'How can I help you today?'}`
  };
};