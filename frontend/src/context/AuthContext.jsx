import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
  loginOrganizer as apiLoginOrganizer,
  registerOrganizer as apiRegisterOrganizer,
  getMe,
  logout as apiLogout
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user') || localStorage.getItem('organizer_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || localStorage.getItem('organizer_token') || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem('refresh_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const initSession = async () => {
      const activeToken = localStorage.getItem('token') || localStorage.getItem('organizer_token');
      if (activeToken) {
        try {
          const res = await getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('auth_user', JSON.stringify(res.data));
            if (res.data.role === 'organizer') {
              localStorage.setItem('organizer_user', JSON.stringify(res.data));
            }
          }
        } catch (error) {
          console.warn('Session expired or token invalid:', error.message);
          logoutInternal();
        }
      }
      setLoading(false);
    };

    initSession();
  }, []);

  const saveAuthSession = (authToken, authRefreshToken, authUser) => {
    setToken(authToken);
    setRefreshToken(authRefreshToken);
    setUser(authUser);

    localStorage.setItem('token', authToken);
    if (authRefreshToken) {
      localStorage.setItem('refresh_token', authRefreshToken);
    }
    localStorage.setItem('auth_user', JSON.stringify(authUser));

    // Support legacy organizer keys for complete compatibility
    if (authUser.role === 'organizer') {
      localStorage.setItem('organizer_token', authToken);
      localStorage.setItem('organizer_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('organizer_token');
      localStorage.removeItem('organizer_user');
    }
  };

  const logoutInternal = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('organizer_token');
    localStorage.removeItem('organizer_user');
  };

  // User Actions
  const loginUser = async (credentials) => {
    const res = await apiLoginUser(credentials);
    if (res.success && res.data) {
      const { accessToken, refreshToken: refTok, user: loggedUser } = res.data;
      saveAuthSession(accessToken, refTok, loggedUser);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      return res;
    }
  };

  const registerUser = async (formData) => {
    const res = await apiRegisterUser(formData);
    if (res.success && res.data) {
      const { accessToken, refreshToken: refTok, user: newUser } = res.data;
      saveAuthSession(accessToken, refTok, newUser);
      toast.success(`Welcome to EventHub, ${newUser.name}!`);
      return res;
    }
  };

  // Organizer Actions
  const loginOrganizer = async (credentials) => {
    const res = await apiLoginOrganizer(credentials);
    if (res.success && res.data) {
      const { accessToken, refreshToken: refTok, user: loggedOrg } = res.data;
      saveAuthSession(accessToken, refTok, loggedOrg);
      toast.success(`Welcome back, ${loggedOrg.name}!`);
      return res;
    }
  };

  const registerOrganizer = async (formData) => {
    const res = await apiRegisterOrganizer(formData);
    if (res.success && res.data) {
      const { accessToken, refreshToken: refTok, user: newOrg } = res.data;
      saveAuthSession(accessToken, refTok, newOrg);
      toast.success(`Organizer registered: ${newOrg.name}!`);
      return res;
    }
  };

  // Universal Login/Register helpers
  const login = async (credentials, role = 'user') => {
    return role === 'organizer' ? loginOrganizer(credentials) : loginUser(credentials);
  };

  const register = async (formData, role = 'user') => {
    return role === 'organizer' ? registerOrganizer(formData) : registerUser(formData);
  };

  // Logout
  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    } finally {
      logoutInternal();
      toast.success('Signed out successfully');
    }
  };

  // Update User Profile state
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('auth_user', JSON.stringify(updated));
    if (updated.role === 'organizer') {
      localStorage.setItem('organizer_user', JSON.stringify(updated));
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    isOrganizer: user?.role === 'organizer',
    isUser: user?.role === 'user',
    loading,
    loginUser,
    registerUser,
    loginOrganizer,
    registerOrganizer,
    login,
    register,
    logout,
    updateUser,
    // Backward compatibility aliases
    organizer: user?.role === 'organizer' ? user : null,
    updateProfileState: updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Backward compatibility hook for existing Organizer components
export const useOrganizer = () => {
  const auth = useAuth();
  return {
    organizer: auth.organizer,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated && auth.isOrganizer,
    loading: auth.loading,
    login: auth.loginOrganizer,
    register: auth.registerOrganizer,
    logout: auth.logout,
    updateProfileState: auth.updateUser
  };
};

export default AuthContext;
