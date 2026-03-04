import { defineStore } from 'pinia';

export interface UserProfile {
  id: string | number;
  username: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  profile?: UserProfile;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
  }),
  actions: {
    saveSession(userData: User, token: string) {
      this.user = userData;
      this.token = token;
      this.isAuthenticated = true;
      
      // Guardamos en el navegador (asegurando que estamos en el cliente)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }
    },
    initAuth() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('auth_user');
        if (token && user) {
          this.token = token;
          this.user = JSON.parse(user);
          this.isAuthenticated = true;
        }
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      navigateTo('/login');
    }
  }
});