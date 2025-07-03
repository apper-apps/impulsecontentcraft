const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getUsers = async () => {
  const params = {
    fields: [
      { field: { Name: "Name" } },
      { field: { Name: "email" } },
      { field: { Name: "role" } },
      { field: { Name: "subscription" } },
      { field: { Name: "agent_count" } },
      { field: { Name: "join_date" } }
    ],
    orderBy: [
      { fieldName: "CreatedOn", sorttype: "DESC" }
    ]
  };

  const response = await apperClient.fetchRecords('app_User', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  // Transform data to match UI expectations
  return response.data.map(user => ({
    Id: user.Id,
    name: user.Name || '',
    email: user.email || '',
    role: user.role || 'user',
    subscription: user.subscription || 'free',
    agentCount: user.agent_count || 0,
    joinDate: user.join_date || new Date().toLocaleDateString()
  }));
};

export const updateUserSubscription = async (userId, subscription) => {
  const params = {
    records: [{
      Id: parseInt(userId),
      subscription: subscription
    }]
  };

  const response = await apperClient.updateRecord('app_User', params);
  
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
export const updateUserRole = async (userId, role) => {
  const params = {
    records: [{
      Id: parseInt(userId),
      role: role
    }]
  };

  const response = await apperClient.updateRecord('app_User', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  if (response.results) {
    const failedRecords = response.results.filter(result => !result.success);
    if (failedRecords.length > 0) {
      console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      throw new Error(failedRecords[0].message || 'Role update failed');
    }
  }

  return { success: true };
};

export const deleteUser = async (userId) => {
  const params = {
    RecordIds: [parseInt(userId)]
  };

  const response = await apperClient.deleteRecord('app_User', params);
  
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