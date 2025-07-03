const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getApiKeys = async () => {
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "provider" } },
      { field: { Name: "key" } },
      { field: { Name: "description" } },
      { field: { Name: "active" } },
      { field: { Name: "created_at" } },
      { field: { Name: "requests_today" } },
      { field: { Name: "total_requests" } },
      { field: { Name: "last_used" } },
      { field: { Name: "monthly_cost" } }
    ],
    orderBy: [
      { fieldName: "created_at", sorttype: "DESC" }
    ]
  };

  const response = await apperClient.fetchRecords('api_key', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  return response.data.map(key => ({
    Id: key.Id,
    name: key.Name || '',
    provider: key.provider || '',
    key: key.key || '',
    description: key.description || '',
    active: key.active || false,
    createdAt: key.created_at || new Date().toISOString(),
    requestsToday: key.requests_today || 0,
    totalRequests: key.total_requests || 0,
    lastUsed: key.last_used || null,
    monthlyCost: key.monthly_cost || '0.00'
  }));
};

export const createApiKey = async (keyData) => {
  const params = {
    records: [{
      Name: keyData.name,
      provider: keyData.provider,
      key: keyData.key,
      description: keyData.description,
      active: true,
      created_at: new Date().toISOString(),
      requests_today: 0,
      total_requests: 0,
      last_used: null,
      monthly_cost: 0.00
    }]
  };

  const response = await apperClient.createRecord('api_key', params);
  
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
      const data = successfulRecords[0].data;
      return {
        Id: data.Id,
        name: data.Name,
        provider: data.provider,
        key: data.key,
        description: data.description,
        active: data.active,
        createdAt: data.created_at,
        requestsToday: data.requests_today,
        totalRequests: data.total_requests,
        lastUsed: data.last_used,
        monthlyCost: data.monthly_cost
      };
    }
  }

  throw new Error('No data returned from creation');
};

export const updateApiKey = async (keyId, updates) => {
  const params = {
    records: [{
      Id: parseInt(keyId),
      ...updates
    }]
  };

  const response = await apperClient.updateRecord('api_key', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  if (response.results) {
    const failedRecords = response.results.filter(result => !result.success);
    if (failedRecords.length > 0) {
      console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Update failed');
    }
  }

  return { success: true };
};

export const deleteApiKey = async (keyId) => {
  const params = {
    RecordIds: [parseInt(keyId)]
  };

  const response = await apperClient.deleteRecord('api_key', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  if (response.results) {
    const failedRecords = response.results.filter(result => !result.success);
    if (failedRecords.length > 0) {
      console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Delete failed');
    }
  }

  return { success: true };
};