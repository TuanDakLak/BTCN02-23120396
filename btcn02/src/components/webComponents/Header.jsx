import { useEffect, useState, useRef } from "react";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { Switch } from "../ui/switch";
import { useAuth } from "./Logging/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleFavorites = () => {
    navigate("/favorites");
    setShowDropdown(false);
  };

  return (
    <header className="bg-headerbg border-2 border-borderHeader rounded-sm p-4 my-1.5">
      <div className="mx-auto flex items-center justify-between text-textHeader">
        <p>23120396</p>

        <h1 className="text-3xl font-semibold">Movies Info</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-8 h-8 bg-yellow-500  text-white rounded-full flex items-center justify-center">
                    {user.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </div>
                  <div className="text-left hidden md:block">
                    <span className="text-sm font-medium block">{user.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tài khoản</span>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          {user.username}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleProfile}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>Hồ sơ & Cài đặt</span>
                      </button>
                      
                      <button
                        onClick={handleFavorites}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>Phim yêu thích</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                >
                  Đăng nhập
                </a>
                <a
                  href="/signup"
                  className="px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm rounded transition-colors"
                >
                  Đăng ký
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            {darkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
