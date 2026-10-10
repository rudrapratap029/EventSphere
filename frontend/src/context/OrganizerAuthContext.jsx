import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loginOrganizer, registerOrganizer, getOrganizerProfile } from '../services/organizerService';

const OrganizerAuthContext = createContext(null);

export const OrganizerAuthProvider = ({ children }) => {
  const [organizer, setOrganizer] = useState(() => {
    try {
      const saved = localStorage.getItem('organizer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('organizer_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on initial load
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('organizer_token');
      if (savedToken) {
        try {
          const res = await getOrganizerProfile();
          if (res.success && res.data) {
            setOrganizer(res.data);
            localStorage.setItem('organizer_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.warn('Session expired or invalid, logging out:', error.message);
          localStorage.removeItem('organizer_token');
          localStorage.removeItem('organizer_user');
          setOrganizer(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    const res = await loginOrganizer(credentials);
    if (res.success && res.data) {
      const { token: newToken, organizer: newOrganizer } = res.data;
      setToken(newToken);
      setOrganizer(newOrganizer);
      localStorage.setItem('organizer_token', newToken);
      localStorage.setItem('organizer_user', JSON.stringify(newOrganizer));
      toast.success(`Welcome back, ${newOrganizer.name}!`);
      return res;
    }
  };

  const register = async (formData) => {
    const res = await registerOrganizer(formData);
    if (res.success && res.data) {
      const { token: newToken, organizer: newOrganizer } = res.data;
      setToken(newToken);
      setOrganizer(newOrganizer);
      localStorage.setItem('organizer_token', newToken);
      localStorage.setItem('organizer_user', JSON.stringify(newOrganizer));
      toast.success(`Welcome aboard, ${newOrganizer.name}!`);
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('organizer_token');
    localStorage.removeItem('organizer_user');
    setOrganizer(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  const updateProfileState = (updated) => {
    setOrganizer(updated);
    localStorage.setItem('organizer_user', JSON.stringify(updated));
  };

  const value = {
    organizer,
    token,
    isAuthenticated: Boolean(token && organizer),
    loading,
    login,
    register,
    logout,
    updateProfileState
  };

  return (
    <OrganizerAuthContext.Provider value={value}>
      {children}
    </OrganizerAuthContext.Provider>
  );
};

export const useOrganizer = () => {
  const context = useContext(OrganizerAuthContext);
  if (!context) {
    throw new Error('useOrganizer must be used within an OrganizerAuthProvider');
  }
  return context;
};

export default OrganizerAuthContext;
