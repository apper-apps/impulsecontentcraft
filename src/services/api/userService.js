const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Create user record when they authenticate for the first time
export const createUserFromAuth = async (authUser) => {
  try {
    const params = {
      records: [{
        Name: authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : authUser.emailAddress,
        email: authUser.emailAddress,
        role: 'user', // Default role for new users
        subscription: 'free', // Default subscription for new users
        agent_count: 0,
        join_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
      }]
    };

    const response = await apperClient.createRecord('app_User', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'User creation failed');
      }
      
      const createdUser = response.results.find(result => result.success);
      if (createdUser && createdUser.data) {
        // Assign default permissions for new user
        await assignPermissions(createdUser.data.Id, 'user');
        return createdUser.data;
      }
    }
  } catch (error) {
    console.error('Error creating user from auth:', error);
    throw error;
  }
};

// Assign permissions based on user role
export const assignPermissions = async (userId, role) => {
  try {
    // Define role-based permissions
    const rolePermissions = {
      'user': [
        { resource: 'agents', action: 'read' },
        { resource: 'agents', action: 'create' },
        { resource: 'chat', action: 'read' },
        { resource: 'chat', action: 'create' },
        { resource: 'profile', action: 'update' }
      ],
      'admin': [
        { resource: 'agents', action: 'read' },
        { resource: 'agents', action: 'create' },
        { resource: 'agents', action: 'update' },
        { resource: 'agents', action: 'delete' },
        { resource: 'chat', action: 'read' },
        { resource: 'chat', action: 'create' },
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'update' },
        { resource: 'analytics', action: 'read' }
      ],
      'superadmin': [
        { resource: 'agents', action: 'read' },
        { resource: 'agents', action: 'create' },
        { resource: 'agents', action: 'update' },
        { resource: 'agents', action: 'delete' },
        { resource: 'chat', action: 'read' },
        { resource: 'chat', action: 'create' },
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'create' },
        { resource: 'users', action: 'update' },
        { resource: 'users', action: 'delete' },
        { resource: 'analytics', action: 'read' },
        { resource: 'system', action: 'manage' }
      ]
    };

    const permissions = rolePermissions[role] || rolePermissions['user'];
    
    // First, remove existing permissions for this user
    await removeUserPermissions(userId);
    
    // Create new permission records
    const permissionRecords = permissions.map(permission => ({
      Name: `${permission.resource}:${permission.action}`,
      description: `Allow ${permission.action} access to ${permission.resource}`,
      resource: permission.resource,
      action: permission.action,
      user: parseInt(userId)
    }));

    if (permissionRecords.length > 0) {
      const params = {
        records: permissionRecords
      };

      const response = await apperClient.createRecord('app_Permission', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} permission records:${JSON.stringify(failedRecords)}`);
        }
      }
    }
  } catch (error) {
    console.error('Error assigning permissions:', error);
    throw error;
  }
};

// Remove all permissions for a user
export const removeUserPermissions = async (userId) => {
  try {
    // First fetch existing permissions for this user
    const params = {
      fields: [
        { field: { Name: "Id" } }
      ],
      where: [
        {
          FieldName: "user",
          Operator: "EqualTo",
          Values: [parseInt(userId)]
        }
      ]
    };

    const response = await apperClient.fetchRecords('app_Permission', params);
    
    if (response.success && response.data && response.data.length > 0) {
      const permissionIds = response.data.map(permission => permission.Id);
      
      const deleteParams = {
        RecordIds: permissionIds
      };

      await apperClient.deleteRecord('app_Permission', deleteParams);
    }
  } catch (error) {
    console.error('Error removing user permissions:', error);
    // Don't throw error here as this is cleanup operation
  }
};

// Get user permissions
export const getUserPermissions = async (userId) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "resource" } },
        { field: { Name: "action" } },
        { field: { Name: "description" } }
      ],
      where: [
        {
          FieldName: "user",
          Operator: "EqualTo", 
          Values: [parseInt(userId)]
        }
      ]
    };

    const response = await apperClient.fetchRecords('app_Permission', params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
};

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

  // Handle empty data case
  if (!response.data || response.data.length === 0) {
    return [];
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

  // Update permissions based on new role
  try {
    await assignPermissions(userId, role);
  } catch (permissionError) {
    console.error('Error updating permissions after role change:', permissionError);
    // Don't fail the whole operation if permissions update fails
  }

  return { success: true };
};

export const deleteUser = async (userId) => {
  try {
    // First remove all permissions for this user
    await removeUserPermissions(userId);
    
    // Then delete the user record
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
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};