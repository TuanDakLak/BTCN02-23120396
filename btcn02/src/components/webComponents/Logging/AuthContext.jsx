import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('https://34.124.214.214:2423/api/users/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }

      const data = await response.json();
      
      // Lưu token và user info
      localStorage.setItem('authToken', data.token || 'dummy-token');
      localStorage.setItem('user', JSON.stringify(data.user || { username }));
      
      setUser(data.user || { username });
      return data.user || { username };
      
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('https://34.124.214.214:2423/api/users/register', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};