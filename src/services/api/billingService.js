import invoicesData from '@/services/mockData/invoices.json';

let invoices = [...invoicesData];

export const getBillingInfo = async () => {
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
  await new Promise(resolve => setTimeout(resolve, 250));
  return [...invoices];
};

export const updateSubscription = async (planType) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const prices = {
    alacarte: 5,
    bundle: 25,
    allinclusive: 50
  };
  
  return {
    type: planType,
    price: prices[planType],
    status: 'active'
  };
};