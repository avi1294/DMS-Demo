import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authStorage } from '../services/storageService';
import { seedUsers } from '../data/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setLoading(true);
    const savedUser = authStorage.getUser();
    if (savedUser && authStorage.isAuthenticated()) {
      setUser(savedUser);
    }
    setLoading(false);
  };

  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find user in seed data (in real app, this would be an API call)
      const foundUser = seedUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
        department: foundUser.department,
        avatar: foundUser.avatar,
      };

      // Generate mock token
      const token = btoa(JSON.stringify({ userId: foundUser.id, timestamp: Date.now() }));

      // Save to storage
      authStorage.setUser(userWithoutPassword);
      authStorage.setToken(token);

      setUser(userWithoutPassword);
      setLoading(false);

      return { success: true, user: userWithoutPassword };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if email already exists
      const existingUser = seedUsers.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user (in real app, this would be an API call)
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        department: userData.department || 'General',
        avatar: null,
      };

      // Generate mock token
      const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));

      // Save to storage
      authStorage.setUser(newUser);
      authStorage.setToken(token);

      setUser(newUser);
      setLoading(false);

      return { success: true, user: newUser };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
    setError(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    authStorage.setUser(updatedUser);
    setUser(updatedUser);

    return updatedUser;
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
