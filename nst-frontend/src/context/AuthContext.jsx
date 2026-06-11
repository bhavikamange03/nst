import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export function useAuth(){
  return useContext(AuthContext);
}

export function AuthProvider({ children }){
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // fetch current user
      setLoading(true);
      axios.get('/auth/me').then(res => {
        setUser(res.data);
      }).catch(() => {
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  async function login(email, password){
    // OAuth2 password form
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const res = await axios.post('/auth/login', params);
    const t = res.data.access_token;
    localStorage.setItem('token', t);
    setToken(t);
    return res.data;
  }

  function logout(){
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
