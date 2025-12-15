import { House } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useContext } from "react";
import { SearchContext } from "./SearchContext";

export default function Nav() {
  const [searchQuery, setSearchQuery] = useState("");
  const { performSearch, clearSearch } = useContext(SearchContext);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    performSearch(q);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="bg-navbg text-white p-3 rounded-sm">
      <div className="mx-auto flex items-center gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            clearSearch();
          }}
          className="bg-navbg border-none hover:bg-transparent"
        >
          <House size={44} color="#000000" strokeWidth={2.75} />
        </Button>
        <div className="flex-1 max-w-sm flex gap-2 ml-auto">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-background text-foreground"
          />
          <Button
            onClick={handleSearch}
            size="sm"
            className="bg-transparent text-green-800 border-2 border-green-800"
          >
            Search
          </Button>
        </div>
      </div>
    </nav>
  );
}