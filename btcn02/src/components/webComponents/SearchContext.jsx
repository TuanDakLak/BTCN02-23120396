import React, { createContext, useState, useCallback } from "react";
import { apiGet } from "../../api/movieAPI";

export const SearchContext = createContext({
  isActive: false,
  query: "",
  results: [],
  loading: false,
  error: null,
  performSearch: async () => {},
  clearSearch: () => {},
});

export function SearchProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = useCallback(async (q) => {
    if (!q || q.trim().length === 0) return;
    setLoading(true);
    setError(null);
    setIsActive(true);
    setQuery(q);
    try {
      const data = await apiGet("/api/movies/search", { q: q.trim(), limit: 48 });
      setResults(Array.isArray(data) ? data : data?.results ?? []);
    } catch (err) {
      setError(err?.message || "Lỗi khi tìm kiếm");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setIsActive(false);
    setQuery("");
    setResults([]);
    setLoading(false);
    setError(null);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isActive,
        query,
        results,
        loading,
        error,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}