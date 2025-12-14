import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Card, CardContent } from "../../ui/card";
import { useState, useEffect } from "react";
import { Star, TrendingUp } from "lucide-react";
import { apiGet } from "@/api/movieAPI";

export default function MostRevenue() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await apiGet("/api/movies/most-popular", {
          page: 1,
          limit: 5,
        });
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Đang tải phim...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                Lỗi khi tải dữ liệu
              </p>
              <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Carousel className="w-full">
        <CarouselContent>
          {movies.map((movie, index) => (
            <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-2">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
                        #{index + 1}
                      </div>

                      {movie.image ? (
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop";
                          }}
                        />
                      ) : (
                        <div className="w-full h-80 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <span className="text-6xl text-gray-500 dark:text-gray-600">
                            🎬
                          </span>
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Rating badge */}
                      {movie.rate && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                          {movie.rate}
                        </div>
                      )}
                    </div>

                    {/* Movie Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-2 min-h-[3.5rem]">
                        {movie.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">{movie.year}</span>
                        {movie.genres && movie.genres.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="line-clamp-1">
                              {movie.genres.join(", ")}
                            </span>
                          </>
                        )}
                      </div>

                      {movie.short_description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
                          {movie.short_description}
                        </p>
                      )}

                      {movie.box_office_revenue && (
                        <div className="pt-2 border-t dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Doanh thu:
                          </p>
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">
                            {movie.box_office_revenue}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/* Movie count indicator */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hiển thị {movies.length} phim
        </p>
      </div>
    </div>
  );
}
