import usersData from '@/services/mockData/users.json';

let users = [...usersData];

export const getUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...users];
};

export const updateUserSubscription = async (userId, subscription) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const userIndex = users.findIndex(u => u.Id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], subscription };
  }
  
  return { success: true };
};

export const deleteUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  users = users.filter(user => user.Id !== userId);
  return { success: true };
};