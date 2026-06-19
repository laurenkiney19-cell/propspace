import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';
import { getMe as getMeApi } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('propspace_auth');
    if (!stored) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.user) {
        setToken(parsed.token);
        setAuthToken(parsed.token);
        setUser(parsed.user);
        getMeApi(controller.signal)
          .then((res) => {
            setUser(res.data.user);
            localStorage.setItem('propspace_auth', JSON.stringify({ token: parsed.token, user: res.data.user }));
          })
          .catch((err) => {
            if (err.name === 'CanceledError') return;
            setUser(null);
            setToken('');
            setAuthToken(null);
            localStorage.removeItem('propspace_auth');
          })
          .finally(() => setLoading(false));
        return () => controller.abort();
      }
    } catch (error) {
      console.error('Unable to parse auth state:', error);
    }

    setLoading(false);
    return () => controller.abort();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setAuthToken(accessToken);
    localStorage.setItem('propspace_auth', JSON.stringify({ user: userData, token: accessToken }));
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setAuthToken(null);
    localStorage.removeItem('propspace_auth');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('propspace_auth', JSON.stringify({ user: updated, token }));
  };

  const value = useMemo(
    () => ({ user, token, isLoggedIn: Boolean(user && token), login, logout, updateUser, loading }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
