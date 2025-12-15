import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";
import SearchResults from "./SearchResult";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { performSearch, results, loading, error } = useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (q && q.trim().length > 0) {
      performSearch(q);
    }
  }, [q, performSearch]);

  const handleSelect = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="mt-6">
      <div className="max-w-6xl mx-auto p-4">
        {loading && <div className="text-sm text-gray-500">Đang tìm...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {!loading && !error && results.length === 0 && (
          <div className="text-sm text-gray-500">Không tìm thấy kết quả.</div>
        )}
      </div>

      {!loading && !error && results.length > 0 && (
        <SearchResults movies={results} onSelect={handleSelect} />
      )}
    </div>
  );
}