import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, Trash2, Play, Star, Calendar, Clock } from "lucide-react";
import { useAuth } from "./Logging/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const { user, getFavorites, removeFavorite } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError("");
      
      console.log("Loading favorites...");
      const data = await getFavorites();
      

      if (Array.isArray(data)) {
        setFavorites(data);
      } 
      else if (data.data && Array.isArray(data.data)) {
        setFavorites(data.data);
      }
      else if (data.favorites && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }
      else {
        console.log("Unknown API response format:", data);
        setFavorites([]);
      }
      
      console.log("Favorites loaded:", favorites.length);
      
    } catch (error) {
      console.error("Error loading favorites:", error);
      setError("Không thể tải danh sách phim yêu thích. Vui lòng thử lại sau.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (movieId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phim này khỏi danh sách yêu thích?")) {
      return;
    }

    try {
      await removeFavorite(movieId);
      setFavorites(favorites.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Không thể xóa phim. Vui lòng thử lại!");
    }
  };

  const handleWatchMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Heart className="h-7 w-7" fill="white" />
              Phim yêu thích của bạn
            </CardTitle>
            {favorites.length > 0 && (
              <div className="text-lg font-semibold bg-white/20 px-4 py-2 rounded-full">
                {favorites.length} phim
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto"></div>
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg">
                Đang tải danh sách phim yêu thích...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {error}
              </h3>
              <Button
                onClick={loadFavorites}
                className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Thử lại
              </Button>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-red-400 dark:text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                Danh sách yêu thích trống
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Bạn chưa thêm phim nào vào danh sách yêu thích. Hãy khám phá và thêm những bộ phim bạn yêu thích!
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
              >
                <Heart className="h-5 w-5 mr-2" />
                Khám phá phim ngay
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-red-500 dark:text-red-400" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tổng số phim</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{favorites.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Điểm trung bình</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {favorites.length > 0 
                          ? (favorites.reduce((sum, movie) => sum + (movie.rate || 0), 0) / favorites.length).toFixed(1)
                          : "0.0"
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-green-500 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Năm mới nhất</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {favorites.length > 0 
                          ? Math.max(...favorites.map(movie => movie.year || 0))
                          : "-"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((movie) => (
                  <Card key={movie.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <img
                        src={movie.image || `https://via.placeholder.com/300x450/1e293b/ffffff?text=${encodeURIComponent(movie.title || 'No Image')}`}
                        alt={movie.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        {movie.rate?.toFixed(1) || "N/A"}
                      </div>
                      
                      {movie.year && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-sm font-semibold">
                          {movie.year}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                          {movie.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {movie.genres?.slice(0, 2).map((genre, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          {movie.runtime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatRuntime(movie.runtime)}</span>
                            </div>
                          )}
                          
                          {movie.short_description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2">
                              {movie.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-5">
                        <Button
                          onClick={() => handleWatchMovie(movie.id)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        <Button
                          onClick={() => handleRemoveFavorite(movie.id)}
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Xóa khỏi yêu thích"
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