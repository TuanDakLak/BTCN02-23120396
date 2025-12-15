import { useEffect, useState } from "react";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { Switch } from "../ui/switch";
import { useAuth } from "./Logging/AuthContext";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="bg-headerbg border-2 border-borderHeader rounded-sm p-4 my-1.5">
      <div className="mx-auto flex items-center justify-between text-textHeader">
        <p>23120396</p>

        <h1 className="text-3xl font-semibold">Movies Info</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
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