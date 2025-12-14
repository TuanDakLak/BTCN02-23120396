import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

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

        <div className="flex items-center gap-2">
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />

          {darkMode ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </div>
      </div>
    </header>
  );
}
