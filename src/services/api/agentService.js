import agentsData from '@/services/mockData/agents.json';
import myAgentsData from '@/services/mockData/myAgents.json';

let agents = [...agentsData];
let myAgents = [...myAgentsData];

export const getMarketplaceAgents = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...agents];
};

export const getMyAgents = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...myAgents];
};

export const subscribeToAgent = async (agentId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const agent = agents.find(a => a.Id === agentId);
  if (agent && !myAgents.find(ma => ma.Id === agentId)) {
    myAgents.push({ ...agent });
  }
  
  return { success: true };
};

export const unsubscribeFromAgent = async (agentId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  myAgents = myAgents.filter(agent => agent.Id !== agentId);
  return { success: true };
};

export const createAgent = async (agentData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newAgent = {
    Id: Math.max(...agents.map(a => a.Id)) + 1,
    ...agentData,
    status: 'active',
    creator: 'current-admin',
    createdAt: new Date().toISOString()
  };
  
  agents.push(newAgent);
  return newAgent;
};

export const testAgent = async (agentData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const issues = [];
  
  if (!agentData.prompts.system) {
    issues.push('System prompt is required');
  }
  
  if (!agentData.name || agentData.name.length < 3) {
    issues.push('Agent name must be at least 3 characters');
  }
  
  return {
    passed: issues.length === 0,
    issues,
    sampleResponse: `Hello! I'm ${agentData.name || 'your AI agent'}. ${agentData.prompts.welcome || 'How can I help you today?'}`
  };
};