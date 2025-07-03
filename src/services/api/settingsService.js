export const getUserSettings = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    notifications: {
      email: true,
      push: false,
      marketing: false
    },
    privacy: {
      dataRetention: '12_months',
      analytics: true,
      gdprCompliance: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC'
    }
  };
};

export const updateUserSettings = async (settings) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};