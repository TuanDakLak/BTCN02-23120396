import { House } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

export default function Nav() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <nav className="bg-blue-300 dark:bg-gray-900 text-white p-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchQuery("");
          }}
          className="text-white hover:bg-blue-800 dark:hover:bg-gray-800"
        >
          <House size={44} color="#000000" strokeWidth={2.75} />
        </Button>
        <div className="flex-1 max-w-md flex gap-2">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <Button onClick={handleSearch} size="sm" className="">
            Search
          </Button>
        </div>
      </div>
    </nav>
  );
}
