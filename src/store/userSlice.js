import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
}

// Selector to get user role
export const getUserRole = (state) => {
  // Get user data from Redux state
  const user = state.user?.user;
  if (!user) return 'user';
  
  // Extract role from user object - handles various possible structures from Apper auth
  // Check multiple possible role field names and nested structures
  let role = 'user';
  
  if (user.role) {
    role = user.role;
  } else if (user.userRole) {
    role = user.userRole;
  } else if (user.profile && user.profile.role) {
    role = user.profile.role;
  } else if (user.userData && user.userData.role) {
    role = user.userData.role;
  }
  
  return role.toLowerCase();
}

// Selector to check if user is admin
export const isAdmin = (state) => {
  const role = getUserRole(state);
  return role === 'admin' || role === 'superadmin';
}

// Selector to check if user is superadmin
export const isSuperAdmin = (state) => {
  const role = getUserRole(state);
  return role === 'superadmin';
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      // This prevents potential issues with object mutations
      state.user = JSON.parse(JSON.stringify(action.payload))
      state.isAuthenticated = !!action.payload
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer