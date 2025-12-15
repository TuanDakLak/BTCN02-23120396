import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch("https://34.124.214.214:2423/api/users/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-app-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Đăng nhập thất bại");

      const data = await res.json();
      const userData = {
        username,
        token: data.token || `token-${Date.now()}`,
        ...data,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch {
      return { success: false, error: "Sai tên đăng nhập hoặc mật khẩu" };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    return { success: true };
  };

  const signup = async (userData) => {
    try {
      const res = await fetch(
        "https://34.124.214.214:2423/api/users/register",
        {
          method: "POST",
          headers: { accept: "*/*", "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (!res.ok) throw new Error("Đăng ký thất bại");
      return {
        success: true,
        message: "Đăng ký thành công! Vui lòng đăng nhập.",
      };
    } catch {
      return { success: false, error: "Username hoặc email đã tồn tại" };
    }
  };

  const getFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Trả về mảng các favorite movies
      if (Array.isArray(data)) {
        return data;
      } else if (Array.isArray(data.favorites)) {
        return data.favorites;
      } else if (Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('Unexpected favorites response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error in getFavorites:', error);
      throw error;
    }
  };

  const addFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to add favorite: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in addFavorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to remove favorite: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in removeFavorite:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signup, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
