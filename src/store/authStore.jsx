import { create } from 'zustand';

// Zustand store for authentication state
const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null, // Initial value from localStorage
  refreshToken: localStorage.getItem('refreshToken') || null, 
  userId: localStorage.getItem('userId') || null, 
  // Set access token and persist it in localStorage
  setInfo: (access, refresh, userId) => {
    localStorage.setItem('accessToken', access);  // Persist token in localStorage
    localStorage.setItem('refreshToken', refresh);  // Persist token in localStorage
    localStorage.setItem('userId', userId);  // Persist token in localStorage
    set({ accessToken: access });  // Update Zustand store state
    set({ refreshToken: refresh });  // Update Zustand store state
    set({ userId: userId });  // Update Zustand store state
  },


  // Clear access token and remove it from localStorage
  clearInfo: () => {
    localStorage.removeItem('accessToken');  // Remove token from localStorage
    localStorage.removeItem('refreshToken');  // Remove token from localStorage
    localStorage.removeItem('userId');  // Remove token from localStorage
    set({ accessToken: null });  // Clear token in Zustand store state
    set({ refreshToken: null });  // Clear token in Zustand store state
    set({ userId: null });  // Clear token in Zustand store state
  },
}));

export default useAuthStore;
