const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getBillingInfo = async () => {
  // In production, this would fetch user-specific billing info
  // For now, return mock data structure
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    subscription: {
      type: 'bundle',
      price: 25,
      status: 'active',
      agents: [1, 2, 3, 4],
      nextPayment: '2024-12-15'
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025
    }
  };
};

export const getInvoices = async () => {
  const params = {
    fields: [
      { field: { Name: "amount" } },
      { field: { Name: "date" } },
      { field: { Name: "status" } },
      { field: { Name: "description" } }
    ],
    orderBy: [
      { fieldName: "date", sorttype: "DESC" }
    ]
  };

  const response = await apperClient.fetchRecords('app_invoice', params);
  
  if (!response.success) {
    console.error(response.message);
    throw new Error(response.message);
  }

  return response.data.map(invoice => ({
    Id: invoice.Id,
    amount: invoice.amount || 0,
    date: invoice.date || new Date().toLocaleDateString(),
    status: invoice.status || 'pending',
    description: invoice.description || ''
  }));
};

export const updateSubscription = async (planType) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const prices = {
    alacarte: 5,
    bundle: 25,
    allinclusive: 50
  };
  
  // In production, this would update user subscription in database
  return {
    type: planType,
    price: prices[planType],
    status: 'active'
  };
};