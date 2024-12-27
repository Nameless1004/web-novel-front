import { create } from 'zustand';

// Zustand store for authentication state
const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null, // Initial value from localStorage

  // Set access token and persist it in localStorage
  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token);  // Persist token in localStorage
    set({ accessToken: token });  // Update Zustand store state
  },

  // Clear access token and remove it from localStorage
  clearAccessToken: () => {
    localStorage.removeItem('accessToken');  // Remove token from localStorage
    set({ accessToken: null });  // Clear token in Zustand store state
  },
}));

export default useAuthStore;
