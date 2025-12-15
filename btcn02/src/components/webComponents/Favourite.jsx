import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, Trash2, Play } from "lucide-react";
import { useAuth } from "./Logging/AuthContext";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập dữ liệu phim yêu thích
  useEffect(() => {
    setLoading(true);
    // TODO: Gọi API để lấy danh sách phim yêu thích của user
    const mockFavorites = [
      { id: 1, title: "The Shawshank Redemption", year: 1994, rating: 9.3, poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg" },
      { id: 2, title: "The Godfather", year: 1972, rating: 9.2, poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg" },
      { id: 3, title: "The Dark Knight", year: 2008, rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg" },
    ];
    
    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 500);
  }, []);

  const removeFavorite = (movieId) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
  };

  const watchMovie = (movieId) => {
    window.location.href = `/movie/${movieId}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Heart className="h-6 w-6" fill="white" />
            Phim yêu thích của bạn
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải danh sách phim yêu thích...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Chưa có phim yêu thích
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Hãy thêm phim bạn yêu thích vào danh sách!
              </p>
              <a href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Khám phá phim
              </a>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Bạn có <span className="font-bold text-red-500">{favorites.length}</span> phim trong danh sách yêu thích
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((movie) => (
                  <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        ⭐ {movie.rating}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                        <p className="text-gray-300 text-sm">{movie.year}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between gap-2">
                        <Button
                          onClick={() => watchMovie(movie.id)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Xem phim
                        </Button>
                        <Button
                          onClick={() => removeFavorite(movie.id)}
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}