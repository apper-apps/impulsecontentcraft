import apiKeysData from '@/services/mockData/apiKeys.json';

let apiKeys = [...apiKeysData];

export const getApiKeys = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...apiKeys];
};

export const createApiKey = async (keyData) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newKey = {
    Id: Math.max(...apiKeys.map(k => k.Id)) + 1,
    ...keyData,
    active: true,
    createdAt: new Date().toISOString(),
    requestsToday: 0,
    totalRequests: 0,
    lastUsed: null,
    monthlyCost: '0.00'
  };
  
  apiKeys.push(newKey);
  return newKey;
};

export const updateApiKey = async (keyId, updates) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const keyIndex = apiKeys.findIndex(k => k.Id === keyId);
  if (keyIndex !== -1) {
    apiKeys[keyIndex] = { ...apiKeys[keyIndex], ...updates };
  }
  
  return { success: true };
};

export const deleteApiKey = async (keyId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  apiKeys = apiKeys.filter(key => key.Id !== keyId);
  return { success: true };
};