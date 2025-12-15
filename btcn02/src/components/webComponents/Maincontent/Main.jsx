import MostRevenue from "./MostRevenue";
import TopMovies from "./TopMovies";
import { useContext, useState } from "react";
import { SearchContext } from "../SearchContext";
import SearchResults from "../SearchResult";
import MovieDetail from "./MovieDetail";

export default function Main() {
  const { isActive, results, loading, error } = useContext(SearchContext);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

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
          <SearchResults movies={results} onSelect={(id) => setSelectedMovieId(id)} />
        )}
      </div>
    );
  }

  if (selectedMovieId) {
    return (
      <div className="mt-4">
        <MovieDetail id={selectedMovieId} onBack={() => setSelectedMovieId(null)} />
      </div>
    );
  }

  return (
    <div>
      <MostRevenue onSelect={(id) => setSelectedMovieId(id)} />
      <TopMovies content="Most Popular" types="most-popular" onSelect={(id) => setSelectedMovieId(id)} />
      <TopMovies content="Top Rating" types="top-rated" onSelect={(id) => setSelectedMovieId(id)} />
    </div>
  );
}