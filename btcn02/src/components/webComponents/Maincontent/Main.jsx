import MostRevenue from "./MostRevenue";
import TopMovies from "./TopMovies";
import { useContext } from "react";
import { SearchContext } from "../SearchContext";
import SearchResults from "../SearchResult";

export default function Main() {
  const { isActive, results, loading, error } = useContext(SearchContext);

  if (isActive) {
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
          <SearchResults movies={results} />
        )}
      </div>
    );
  }
  return (
    <div>
      <MostRevenue />
      <TopMovies content="Most Popular" types="most-popular" />
      <TopMovies content="Top Rating" types="top-rated" />
    </div>
  );
}